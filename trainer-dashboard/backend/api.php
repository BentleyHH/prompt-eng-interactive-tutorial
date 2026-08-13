<?php
/**
 * ETAF - API-Router
 * Aufruf: backend/api.php?action=<name>  (POST, JSON-Body)
 * Antwort: JSON. Auth via Header X-Auth-Token (außer 'login').
 */
require_once __DIR__.'/lib.php';
require_once __DIR__.'/mailer.php';
require_once __DIR__.'/ai.php';
require_once __DIR__.'/automation.php';

/* CORS: nur die eigene Domain. Same-Origin-Aufrufe (Normalfall) brauchen gar
   keine CORS-Header; fremde Seiten dürfen die API nicht aus dem Browser ansprechen. */
$origin=(string)($_SERVER['HTTP_ORIGIN'] ?? '');
if($origin!==''){
  $o=parse_url($origin);
  $oHost=($o['host']??'').(isset($o['port'])?':'.$o['port']:'');
  if($oHost!=='' && strcasecmp($oHost, $_SERVER['HTTP_HOST']??'')===0){
    header('Access-Control-Allow-Origin: '.$origin);
    header('Access-Control-Allow-Headers: Content-Type, X-Auth-Token');
    header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
  }
}
if(($_SERVER['REQUEST_METHOD']??'')==='OPTIONS') { http_response_code(204); exit; }

try { ensure_schema(); }
catch(Throwable $e){ fail('DB-Fehler: '.$e->getMessage(),500); }

$action = $_GET['action'] ?? '';
$in = body();
// Vor jeder ändernden Aktion den betroffenen Datenstand sichern (für „Rückgängig“)
try{ undo_prepare($action,$in); }catch(Throwable $e){}

try {
switch($action){

  case 'login':                       // PIN - nur zur Ersteinrichtung
    out(do_login((string)($in['pin']??'')));

  case 'auth.login':                  // E-Mail + Passwort
    out(do_login_email((string)($in['email']??''), (string)($in['password']??'')));

  case 'auth.mode':                   // Login-Maske: gibt es schon Konten?
    out(['ok'=>true,'setup'=>(user_count()===0)]);

  case 'logout':
    if($t=auth_token()) q("DELETE FROM sessions WHERE token=?",[$t]);
    out(['ok'=>true]);

  /* ---- Passwort vergessen: Link anfordern (verrät nie, ob die Adresse existiert) ---- */
  case 'auth.requestReset':
    login_guard_check();
    $em=strtolower(trim((string)($in['email']??'')));
    if($em!==''){
      $u=q("SELECT * FROM users WHERE email=? AND active=1",[$em])->fetch();
      if($u){
        // Höchstens alle 2 Minuten ein Link pro Konto (verhindert Mail-Bombing).
        $last=q("SELECT created_at FROM reset_tokens WHERE user_id=? ORDER BY created_at DESC LIMIT 1",[$u['id']])->fetch();
        if(!$last || time()-ts($last['created_at'])>=120) send_reset_mail($u,'reset');
      }
    }
    out(['ok'=>true]);

  /* ---- Eigenes Passwort ändern ---- */
  case 'auth.changePassword':
    require_auth();
    $me=current_user();
    if(!$me) fail('Nur für angemeldete Benutzer.',403);
    $cur=(string)($in['current']??''); $new=(string)($in['new']??'');
    if(!password_verify($cur, $me['pass_hash']??'')) fail('Aktuelles Passwort ist nicht korrekt.',401);
    if(strlen($new)<8) fail('Das neue Passwort muss mindestens 8 Zeichen haben.');
    q("UPDATE users SET pass_hash=? WHERE id=?",[password_hash($new,PASSWORD_DEFAULT),$me['id']]);
    audit('password.change','user',(string)$me['id'],'Passwort geändert');
    out(['ok'=>true]);

  /* ---- Benutzerverwaltung (nur Admin) ---- */
  case 'users.list':
    require_admin();
    out(['ok'=>true,'users'=>array_map('user_public',
      q("SELECT * FROM users ORDER BY (role='admin') DESC, name, id")->fetchAll())]);

  case 'user.save':
    require_admin();
    $uid=$in['id']??null;
    $em=strtolower(trim((string)($in['email']??'')));
    $nm=trim((string)($in['name']??''));
    $role=in_array($in['role']??'editor',['admin','editor'],true)?$in['role']:'editor';
    if(!filter_var($em,FILTER_VALIDATE_EMAIL)) fail('Bitte eine gültige E-Mail-Adresse angeben.');
    if($nm==='') fail('Bitte einen Namen angeben.');
    $dupe=q("SELECT id FROM users WHERE email=?",[$em])->fetch();
    if($dupe && (string)$dupe['id']!==(string)$uid) fail('Diese E-Mail-Adresse wird bereits verwendet.');
    if($uid){
      // Letzten Admin nicht zum Bearbeiter herabstufen
      $old=q("SELECT * FROM users WHERE id=?",[$uid])->fetch();
      if(!$old) fail('Benutzer nicht gefunden.',404);
      if($old['role']==='admin' && $role!=='admin' && admin_count()<=1)
        fail('Das ist der letzte Administrator - bitte zuerst einen anderen Admin ernennen.');
      q("UPDATE users SET email=?,name=?,role=? WHERE id=?",[$em,$nm,$role,$uid]);
      audit('user.update','user',(string)$uid,"$nm ($em, $role)");
      out(['ok'=>true,'id'=>(string)$uid]);
    }
    q("INSERT INTO users(email,name,role,active,created_at) VALUES(?,?,?,1,?)",[$em,$nm,$role,now()]);
    $uid=db()->lastInsertId();
    $u=q("SELECT * FROM users WHERE id=?",[$uid])->fetch();
    $sent=send_reset_mail($u,'invite');     // Einladung mit Link zum Passwort setzen
    audit('user.create','user',(string)$uid,"$nm ($em, $role)");
    out(['ok'=>true,'id'=>(string)$uid,'invited'=>$sent?1:0]);

  case 'user.setActive':
    require_admin();
    $uid=$in['id']??0; $act=!empty($in['active'])?1:0;
    $u=q("SELECT * FROM users WHERE id=?",[$uid])->fetch();
    if(!$u) fail('Benutzer nicht gefunden.',404);
    $me=current_user();
    if($me && (string)$me['id']===(string)$uid && !$act) fail('Du kannst dich nicht selbst deaktivieren.');
    if(!$act && $u['role']==='admin' && admin_count()<=1) fail('Das ist der letzte Administrator.');
    q("UPDATE users SET active=? WHERE id=?",[$act,$uid]);
    if(!$act) q("DELETE FROM sessions WHERE user_id=?",[$uid]);   // sofort abmelden
    audit($act?'user.activate':'user.deactivate','user',(string)$uid,$u['name']??'');
    out(['ok'=>true]);

  /* ---- Info-Mail (Digest) je Benutzer: Rhythmus + Inhalte ---- */
  case 'user.digestSave':
    require_admin();
    $uid=(int)($in['id']??0);
    if(!q("SELECT id FROM users WHERE id=?",[$uid])->fetch()) fail('Benutzer nicht gefunden.',404);
    $freq=in_array($in['freq']??'',['off','daily','every2','weekly'],true)?$in['freq']:'off';
    $day=max(1,min(7,(int)($in['day']??1)));
    $validParts=['staffing','ppt','travel','inbox','week','passport','reports'];
    $dparts=array_values(array_intersect($validParts,(array)($in['parts']??[])));
    q("UPDATE users SET digest_freq=?,digest_day=?,digest_parts=? WHERE id=?",[$freq,$day,json_encode($dparts),$uid]);
    audit('user.digest','user',(string)$uid,'Info-Mail: '.$freq);
    out(['ok'=>true]);

  case 'digest.test':                 // Probe-Mail sofort verschicken
    require_admin();
    $u=q("SELECT * FROM users WHERE id=?",[$in['id']??0])->fetch();
    if(!$u||empty($u['email'])) fail('Benutzer oder E-Mail-Adresse nicht gefunden.',404);
    out(['ok'=>true,'sent'=>digest_send($u)?1:0]);

  case 'user.sendInvite':             // Einladung/Zurücksetzen erneut schicken
    require_admin();
    $u=q("SELECT * FROM users WHERE id=?",[$in['id']??0])->fetch();
    if(!$u) fail('Benutzer nicht gefunden.',404);
    $sent=send_reset_mail($u, empty($u['pass_hash'])?'invite':'reset');
    audit('user.invite','user',(string)$u['id'],$u['email']);
    out(['ok'=>true,'sent'=>$sent?1:0]);

  /* ---- Flugpost: erkannte Flugbuchungen prüfen & übernehmen ---- */
  case 'mail.poll':
    require_auth();
    require_once __DIR__.'/mailfetch.php';
    out(poll_mailbox());

  case 'mail.list':
    require_auth();
    $rows=q("SELECT id,from_addr,subject,received_at,status,extracted,match_trainer_id,match_training_id,confidence,created_at
             FROM travel_mail WHERE status IN('new','applied','ignored')
             ORDER BY (status='new') DESC, id DESC LIMIT 60")->fetchAll();
    $ids=array_column($rows,'id');
    $attBy=[];
    if($ids){
      $ph=implode(',',array_fill(0,count($ids),'?'));
      foreach(q("SELECT mail_id,name,mime,LENGTH(data) sz FROM travel_mail_att WHERE mail_id IN($ph)",$ids)->fetchAll() as $a)
        $attBy[(string)$a['mail_id']][]=['name'=>$a['name'],'mime'=>$a['mime']];
    }
    out(['ok'=>true,'mails'=>array_map(function($r) use($attBy){
      return ['id'=>(string)$r['id'],'from'=>$r['from_addr'],'subject'=>$r['subject'],
        'status'=>$r['status'],'extracted'=>json_decode($r['extracted']?:'{}',true),
        'trainerId'=>$r['match_trainer_id']?(string)$r['match_trainer_id']:null,
        'trainingId'=>$r['match_training_id']?(string)$r['match_training_id']:null,
        'confidence'=>$r['confidence'],'at'=>$r['created_at'],
        'atts'=>$attBy[(string)$r['id']]??[]];
    },$rows)]);

  case 'mail.apply':
    require_auth();
    require_once __DIR__.'/mailfetch.php';
    $trId=(int)($in['trainer']??0); $tgId=(int)($in['training']??0);
    if(!$trId||!$tgId) fail('Bitte Trainer und Training auswählen.');
    out(mail_apply((int)($in['id']??0), $trId, $tgId));

  case 'mail.ignore':
    require_auth();
    q("UPDATE travel_mail SET status='ignored' WHERE id=?",[$in['id']??0]);
    out(['ok'=>true]);

  /* ---- Rückgängig / Wiederholen ---- */
  case 'undo.do':
    require_auth();
    out(undo_apply(-1));

  case 'redo.do':
    require_auth();
    out(undo_apply(+1));

  /* ---- Änderungsprotokoll ---- */
  case 'activity.list':
    require_auth();
    $lim=max(1,min(300,(int)($in['limit']??150)));
    out(['ok'=>true,'activity'=>q("SELECT * FROM activity ORDER BY id DESC LIMIT $lim")->fetchAll()]);

  case 'state':
    require_auth();
    out(get_state());

  /* ---- Trainer anlegen/ändern ---- */
  case 'trainer.save':
    require_auth();
    $id=$in['id']??null;
    $pl=in_array($in['prefLang']??'',['de','en'],true) ? $in['prefLang'] : '';
    $fields=[$in['name']??'', $in['email']??'', $in['phone']??'',
      json_encode($in['spec']??[],JSON_UNESCAPED_UNICODE), $in['region']??'',
      json_encode($in['langs']??[]), !empty($in['uae'])?1:0, (int)($in['load']??0),
      $in['color']??'#3E4852', (string)($in['rating']??'4.5'), (string)($in['notes']??''), $pl];
    if($id){
      check_version('trainers',$id,$in['version']??null,!empty($in['force']));
      q("UPDATE trainers SET name=?,email=?,phone=?,spec=?,region=?,langs=?,uae=?,load_lvl=?,color=?,rating=?,notes=?,pref_lang=? WHERE id=?",
        array_merge($fields,[$id]));
      bump_version('trainers',$id);
      audit('trainer.update','trainer',(string)$id,(string)($in['name']??''));
    } else {
      q("INSERT INTO trainers(name,email,phone,spec,region,langs,uae,load_lvl,color,rating,notes,pref_lang,created_at)
         VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)", array_merge($fields,[now()]));
      $id=db()->lastInsertId();
      bump_version('trainers',$id);
      audit('trainer.create','trainer',(string)$id,(string)($in['name']??''));
    }
    out(['ok'=>true,'id'=>(string)$id]);

  /* ---- Interne Bewertungen je Trainer & Training (5 Sterne + Notiz) ---- */
  case 'reviews.save':
    require_auth();
    $trId=(int)($in['trainer']??0);
    if(!$trId) fail('Kein Trainer.');
    $saved=0;
    foreach(($in['items']??[]) as $it){
      $tgId=(int)($it['training']??0); if(!$tgId) continue;
      $stars=max(0,min(5,(int)($it['stars']??0)));
      $note=trim((string)($it['note']??''));
      $label=trim((string)($it['label']??''));
      $ex=q("SELECT id FROM trainer_reviews WHERE trainer_id=? AND training_id=?",[$trId,$tgId])->fetch();
      if($stars===0 && $note===''){
        if($ex) q("DELETE FROM trainer_reviews WHERE id=?",[$ex['id']]);
        continue;
      }
      if($ex) q("UPDATE trainer_reviews SET stars=?,note=?,label=?,updated_at=? WHERE id=?",[$stars,$note,$label,now(),$ex['id']]);
      else    q("INSERT INTO trainer_reviews(trainer_id,training_id,label,stars,note,updated_at) VALUES(?,?,?,?,?,?)",[$trId,$tgId,$label,$stars,$note,now()]);
      $saved++;
    }
    out(['ok'=>true,'saved'=>$saved]);

  case 'trainer.delete':
    require_auth();
    q("DELETE FROM trainers WHERE id=?",[$in['id']??0]);
    audit('trainer.delete','trainer',(string)($in['id']??0),'Trainer gelöscht');
    out(['ok'=>true]);

  /* ---- Kunde anlegen/ändern (Upsert per id) ---- */
  case 'client.save':
    require_auth();
    $cid=$in['id']??''; if($cid==='') fail('Keine Kunden-ID.');
    $f=[$in['name']??'', $in['short']??'', $in['color']??'#3E4852', $in['cal']??'slategray', $in['country']??'',
        $in['contactName']??'', $in['contactEmail']??''];
    $ex=q("SELECT id FROM clients WHERE id=?",[$cid])->fetch();
    if($ex){
      check_version('clients',$cid,$in['version']??null,!empty($in['force']));
      q("UPDATE clients SET name=?,short=?,color=?,cal=?,country=?,contact_name=?,contact_email=? WHERE id=?", array_merge($f,[$cid]));
    } else {
      q("INSERT INTO clients(id,name,short,color,cal,country,contact_name,contact_email,sort_order) VALUES(?,?,?,?,?,?,?,?, (SELECT COALESCE(MAX(sort_order),0)+1 FROM clients c))",
        array_merge([$cid],$f));
    }
    bump_version('clients',$cid);
    audit($ex?'client.update':'client.create','client',(string)$cid,(string)($in['name']??''));
    out(['ok'=>true,'id'=>$cid]);

  case 'client.delete':
    require_auth();
    $cid=$in['id']??'';
    $cnt=(int)q("SELECT COUNT(*) c FROM clients")->fetch()['c'];
    if($cnt<=1) fail('Der letzte Kunde kann nicht entfernt werden.');
    $fb=q("SELECT id FROM clients WHERE id<>? ORDER BY sort_order,id LIMIT 1",[$cid])->fetch();
    if($fb) q("UPDATE trainings SET client_id=? WHERE client_id=?",[$fb['id'],$cid]);
    q("DELETE FROM clients WHERE id=?",[$cid]);
    audit('client.delete','client',(string)$cid,'Kunde entfernt');
    out(['ok'=>true]);

  case 'training.setClient':
    require_auth();
    q("UPDATE trainings SET client_id=? WHERE id=?",[$in['client']??null, $in['training']??0]);
    out(['ok'=>true]);

  /* ---- Training anlegen/ändern ---- */
  case 'training.save':
    require_auth();
    $id=$in['id']??null;
    $spec=$in['spec']??'';
    $f=[$in['clientId']??($in['client']??null), $in['topic']??'', $in['city']??'', $in['country']??'',
        $in['kw']??'', $in['month']??'', $in['date']??null, $in['dateEnd']??null, $in['code']??null,
        $spec, (int)($in['need']??5), (int)($in['participants']??0)];
    $prefilled=0;
    if($id){
      check_version('trainings',$id,$in['version']??null,!empty($in['force']));
      q("UPDATE trainings SET client_id=?,topic=?,city=?,country=?,kw=?,month=?,start_date=?,end_date=?,code=?,spec=?,need_cnt=?,participants=? WHERE id=?",
        array_merge($f,[$id]));
      bump_version('trainings',$id);
      audit('training.update','training',(string)$id,(string)($in['topic']??''));
    } else {
      q("INSERT INTO trainings(client_id,topic,city,country,kw,month,start_date,end_date,code,spec,need_cnt,participants,created_at)
         VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)", array_merge($f,[now()]));
      $id=db()->lastInsertId();
      bump_version('trainings',$id);
      audit('training.create','training',(string)$id,(string)($in['topic']??''));
      if($spec!==''){
        foreach(q("SELECT material_id,qty FROM material_presets WHERE spec=?",[$spec])->fetchAll() as $p){
          q("INSERT INTO training_materials(training_id,material_id,qty) VALUES(?,?,?)",[$id,$p['material_id'],$p['qty']]);
          $prefilled++;
        }
      }
    }
    out(['ok'=>true,'id'=>(string)$id,'prefilled'=>$prefilled]);

  /* ---- Wochenplan: Sessions + Platzierung je Training ---- */
  case 'sessions.list':
    require_auth();
    $tid=(int)($in['training']??0);
    $tg=q("SELECT id,plan_slots,deliverable,deliverable_en,stage,star FROM trainings WHERE id=?",[$tid])->fetch();
    if(!$tg) fail('Training nicht gefunden.',404);
    $rows=q("SELECT * FROM training_sessions WHERE training_id=? ORDER BY sort,id",[$tid])->fetchAll();
    out(['ok'=>true,
      'sessions'=>array_map(function($r){
        $ids=json_decode(($r['trainer_ids']??'')?:'',true);
        if(!is_array($ids)) $ids=$r['trainer_id']?[(string)$r['trainer_id']]:[];
        return [
        'id'=>(string)$r['id'],'title'=>$r['title'],'titleEn'=>$r['title_en'],
        'type'=>$r['stype'],'dur'=>$r['dur'],'desc'=>$r['descr'],
        'trainerIds'=>array_values(array_map('strval',$ids)),
        'ppt'=>$r['ppt']??'','pptBy'=>$r['ppt_by']?(string)$r['ppt_by']:null,
        'pptByIds'=>ppt_owner_explicit($r)?array_map('strval',ppt_owner_ids($r)):[],
        'pptDue'=>$r['ppt_due']??'',
        'pptNote'=>$r['ppt_note']??'','pptFile'=>$r['ppt_file']??'','pptFileName'=>$r['ppt_file_name']??'',
        'pptFileSize'=>(int)($r['ppt_file_size']??0),'pptFileAt'=>$r['ppt_file_at']??'',
        'mat'=>$r['mat']??''];},$rows),
      'plan'=>json_decode($tg['plan_slots']?:'{}',true)?:[],
      'deliverable'=>$tg['deliverable']??'','deliverableEn'=>$tg['deliverable_en']??'',
      'stage'=>$tg['stage']??'','star'=>(int)($tg['star']??0)]);

  /* ---- Alle Wochenpläne auf einmal (für den Wandkalender mit Inhalten) ---- */
  case 'sessions.all':
    require_auth();
    $plans=[];
    foreach(q("SELECT id,plan_slots FROM trainings")->fetchAll() as $tg)
      $plans[(string)$tg['id']]=['plan'=>json_decode($tg['plan_slots']?:'{}',true)?:[], 'sessions'=>[]];
    foreach(q("SELECT * FROM training_sessions ORDER BY sort,id")->fetchAll() as $r){
      $tid=(string)$r['training_id'];
      if(!isset($plans[$tid])) continue;
      $ids=json_decode(($r['trainer_ids']??'')?:'',true);
      if(!is_array($ids)) $ids=$r['trainer_id']?[(string)$r['trainer_id']]:[];
      $plans[$tid]['sessions'][]=[
        'id'=>(string)$r['id'],'title'=>$r['title'],'titleEn'=>$r['title_en'],
        'type'=>$r['stype'],'dur'=>$r['dur'],
        'trainerIds'=>array_values(array_map('strval',$ids)),
        'ppt'=>$r['ppt']??'','pptBy'=>$r['ppt_by']?(string)$r['ppt_by']:null,
        'pptByIds'=>ppt_owner_explicit($r)?array_map('strval',ppt_owner_ids($r)):[],
        'pptDue'=>$r['ppt_due']??'',
        'pptNote'=>$r['ppt_note']??'','pptFile'=>$r['ppt_file']??'','pptFileName'=>$r['ppt_file_name']??'',
        'pptFileSize'=>(int)($r['ppt_file_size']??0),'pptFileAt'=>$r['ppt_file_at']??'',
        'mat'=>$r['mat']??''];
    }
    foreach(q("SELECT id,ppt_template,ppt_template_name FROM trainings")->fetchAll() as $tp){
      if(isset($plans[(string)$tp['id']])){
        $plans[(string)$tp['id']]['template']=$tp['ppt_template']?($tp['ppt_template_name']?:'Vorlage'):'';
      }
    }
    out(['ok'=>true,'weeks'=>$plans,
      'pptLeadDays'=>(int)(config_get('ppt_lead_days')??21),
      'pptMaxMb'=>(int)round(ppt_max_bytes()/1048576)]);

  case 'session.save':
    require_auth();
    $tid=(int)($in['training']??0); $sid=(int)($in['id']??0);
    if(!$tid || !q("SELECT id FROM trainings WHERE id=?",[$tid])->fetch()) fail('Training nicht gefunden.',404);
    $title=trim((string)($in['title']??'')); if($title==='') fail('Bitte einen Titel angeben.');
    $type=in_array($in['type']??'',['orga','theorie','uebung','praxis','simulation','assessment','deliverable'],true)?$in['type']:'theorie';
    $ppt=in_array($in['ppt']??'',['','inArbeit','vorhanden'],true)?$in['ppt']:'';
    $due=trim((string)($in['pptDue']??''));
    if($due!=='' && !preg_match('/^\d{4}-\d{2}-\d{2}$/',$due)) $due='';
    // Co-Teaching: Liste der Trainer (leer = noch offen)
    $tids=array_values(array_unique(array_filter(array_map('intval',(array)($in['trainerIds']??[])))));
    $tidsJson=json_encode(array_map('strval',$tids));
    // Folien-Verantwortung: nur anfassen, wenn das Feld mitgeschickt wurde
    // ("__multi" im Editor heißt: mehrere gesetzt, unverändert lassen).
    $hasBy=array_key_exists('pptBy',$in) && (string)$in['pptBy']!=='__multi';
    $byOne=$hasBy ? (((int)$in['pptBy'])?:null) : null;
    $byIds=$hasBy ? ($byOne?json_encode([(string)$byOne]):'') : '';
    $f=[$title, trim((string)($in['titleEn']??'')), $type, (string)($in['dur']??'1'),
        (string)($in['desc']??''), $tidsJson, $ppt, $due,
        trim((string)($in['mat']??''))];
    if($sid && q("SELECT id FROM training_sessions WHERE id=? AND training_id=?",[$sid,$tid])->fetch()){
      $bySql=$hasBy?'ppt_by=?,ppt_by_ids=?,':'';
      $byPar=$hasBy?[$byOne,$byIds]:[];
      q("UPDATE training_sessions SET title=?,title_en=?,stype=?,dur=?,descr=?,trainer_ids=?,ppt=?,{$bySql}ppt_due=?,mat=?,trainer_id=NULL WHERE id=?",
        array_merge(array_slice($f,0,7),$byPar,array_slice($f,7),[$sid]));
    } else {
      $mx=(int)q("SELECT COALESCE(MAX(sort),0) m FROM training_sessions WHERE training_id=?",[$tid])->fetch()['m'];
      q("INSERT INTO training_sessions(training_id,title,title_en,stype,dur,descr,trainer_ids,ppt,ppt_by,ppt_by_ids,ppt_due,mat,sort)
         VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)",
        array_merge([$tid],array_slice($f,0,7),[$byOne,$byIds],array_slice($f,7),[$mx+1]));
      $sid=(int)db()->lastInsertId();
    }
    audit('session.save','training',(string)$tid,mb_substr($title,0,80));
    out(['ok'=>true,'id'=>(string)$sid]);

  case 'session.delete':
    require_auth();
    $sid=(int)($in['id']??0);
    $s=q("SELECT training_id FROM training_sessions WHERE id=?",[$sid])->fetch();
    q("DELETE FROM training_sessions WHERE id=?",[$sid]);
    if($s){ // Platzierung bereinigen
      $tg=q("SELECT plan_slots FROM trainings WHERE id=?",[$s['training_id']])->fetch();
      $plan=json_decode($tg['plan_slots']?:'{}',true)?:[];
      foreach($plan as $k=>$ids){ $plan[$k]=array_values(array_filter((array)$ids, fn($x)=>(string)$x!==(string)$sid)); }
      q("UPDATE trainings SET plan_slots=? WHERE id=?",[json_encode($plan),$s['training_id']]);
    }
    out(['ok'=>true]);

  /* ---- Nur den Agenda-Link holen (ohne zu senden) - für „mit eigenem
         Mailprogramm verschicken" und zum Kopieren in eine laufende Mail ---- */
  case 'travel.agendaLink':
    require_auth();
    $tgId=(int)($in['training']??0); $trId=(int)($in['trainer']??0);
    if(!q("SELECT id FROM trainings WHERE id=?",[$tgId])->fetch()) fail('Training nicht gefunden.',404);
    if(!q("SELECT id FROM trainers WHERE id=?",[$trId])->fetch()) fail('Trainer nicht gefunden.',404);
    $rq=q("SELECT * FROM requests WHERE training_id=? AND trainer_id=?",[$tgId,$trId])->fetch();
    $lang=in_array($in['lang']??'',['de','en'],true) ? $in['lang'] : (($rq['lang']??'en')==='de'?'de':'en');
    $tok=$rq['tok']??'';
    if(!$tok){ $tok=token(40);
      q("INSERT INTO requests(training_id,trainer_id,status,lang,tok,created_at) VALUES(?,?,'yes',?,?,?)",
        [$tgId,$trId,$lang,$tok,now()]); }
    out(['ok'=>true,'link'=>base_url().'/agenda.php?token='.$tok]);

  /* ---- Kalender-Abo-Link je Trainer (iCal) ---- */
  case 'trainer.icsLink':
    require_auth();
    $trId=(int)($in['id']??0);
    if(!q("SELECT id FROM trainers WHERE id=?",[$trId])->fetch()) fail('Trainer nicht gefunden.',404);
    $ik=(string)(cfg()['ics_key']??'');
    if($ik===''||$ik==='CHANGE_ME_kalender_schluessel') fail('Kein ics_key in config.php gesetzt - bitte einen zufälligen Wert eintragen.');
    out(['ok'=>true,'link'=>base_url().'/ics.php?key='.rawurlencode($ik).'&trainer='.$trId]);

  /* ============================================================
     TRAININGSBERICHT (DEBRIEF)
     ============================================================ */

  /* ---- Bericht eines Trainings holen (leer = noch keiner vorhanden) ---- */
  case 'debrief.get':
    require_auth();
    $tid=(int)($in['training']??0);
    $r=q("SELECT * FROM debriefs WHERE training_id=?",[$tid])->fetch();
    out(['ok'=>true,'debrief'=>$r?debrief_public($r):null]);

  /* ---- Alle Berichte (Liste für die Auswertung/Export) ---- */
  case 'debriefs.list':
    require_auth();
    $rows=q("SELECT d.*, t.code, t.topic, t.city, t.start_date, t.client_id
             FROM debriefs d JOIN trainings t ON t.id=d.training_id
             ORDER BY t.start_date DESC, d.id DESC")->fetchAll();
    out(['ok'=>true,'debriefs'=>array_map(function($r){
      $d=debrief_public($r);
      $d['code']=$r['code']??''; $d['topic']=$r['topic']??''; $d['city']=$r['city']??'';
      $d['date']=$r['start_date']??''; $d['clientId']=$r['client_id']??'';
      return $d; },$rows),
      'missing'=>array_map(fn($m)=>['id'=>(string)$m['id'],'code'=>$m['code']??'','topic'=>$m['topic']??'',
        'city'=>$m['city']??'','date'=>$m['start_date']??''], debriefs_missing(0))]);

  /* ---- Bericht speichern (Entwurf oder abgeschlossen) ---- */
  case 'debrief.save':
    require_auth();
    $tid=(int)($in['training']??0);
    if(!$tid || !q("SELECT id FROM trainings WHERE id=?",[$tid])->fetch()) fail('Training nicht gefunden.',404);
    $status=in_array($in['status']??'',['draft','final'],true)?$in['status']:'draft';
    $rec=in_array($in['recommend']??'',['yes','partly','no'],true)?$in['recommend']:'';
    $ov=(int)($in['overall']??0); if($ov<0||$ov>5) $ov=0;

    // Nur bekannte Kriterien mit Werten 1..5 übernehmen - alles andere fällt weg
    $keys=debrief_keys(); $sc=[];
    foreach((array)($in['scores']??[]) as $k=>$v){
      if(in_array((string)$k,$keys,true) && is_numeric($v) && $v>=1 && $v<=5) $sc[(string)$k]=(int)$v;
    }
    $trs=[];
    foreach((array)($in['trainers']??[]) as $tid2=>$tv){
      if(!is_array($tv) || !ctype_digit((string)$tid2)) continue;
      $e=[];
      foreach(['teaching','behaviour','ppt','punctuality'] as $tk){
        if(isset($tv[$tk]) && is_numeric($tv[$tk]) && $tv[$tk]>=1 && $tv[$tk]<=5) $e[$tk]=(int)$tv[$tk];
      }
      $nt=trim((string)($tv['note']??'')); if($nt!=='') $e['note']=mb_substr($nt,0,1000);
      if($e) $trs[(string)$tid2]=$e;
    }
    $okFlags=array_column(debrief_catalog()['flags'],'key');
    $fl=array_values(array_unique(array_filter(array_map('strval',(array)($in['flags']??[])),
        fn($x)=>in_array($x,$okFlags,true))));
    $okTexts=array_column(debrief_catalog()['texts'],'key');
    $tx=[];
    foreach((array)($in['texts']??[]) as $k=>$v){
      if(in_array((string)$k,$okTexts,true)){ $v=trim((string)$v); if($v!=='') $tx[(string)$k]=mb_substr($v,0,4000); }
    }
    // Gesamtnote leer? Dann aus den Einzelwerten mitteln, damit der Bericht zählt.
    if($ov===0 && $sc){ $ov=(int)round(debrief_avg(array_values($sc)) ?? 0); }

    $me=current_user();
    $who=$me['name']??($me['email']??'');
    $old=q("SELECT * FROM debriefs WHERE training_id=?",[$tid])->fetch();
    if($old){
      if(isset($in['version']) && (int)$in['version'] && (int)$in['version']!==(int)($old['version']??1) && empty($in['force'])){
        fail('Dieser Bericht wurde inzwischen von jemand anderem geändert.',409);
      }
      q("UPDATE debriefs SET status=?,overall=?,recommend=?,scores=?,trainers=?,flags=?,texts=?,
           updated_at=?,version=version+1 WHERE id=?",
        [$status,$ov,$rec,json_encode($sc),json_encode($trs,JSON_UNESCAPED_UNICODE),
         json_encode($fl),json_encode($tx,JSON_UNESCAPED_UNICODE),now(),$old['id']]);
      $did=(int)$old['id'];
    } else {
      q("INSERT INTO debriefs(training_id,status,overall,recommend,scores,trainers,flags,texts,
           author_id,author_name,created_at,updated_at,version)
         VALUES(?,?,?,?,?,?,?,?,?,?,?,?,1)",
        [$tid,$status,$ov,$rec,json_encode($sc),json_encode($trs,JSON_UNESCAPED_UNICODE),
         json_encode($fl),json_encode($tx,JSON_UNESCAPED_UNICODE),
         $me?(int)$me['id']:null,$who,now(),now()]);
      $did=(int)db()->lastInsertId();
    }

    // Maßnahmen komplett neu schreiben (die Liste kommt immer vollständig)
    q("DELETE FROM debrief_actions WHERE debrief_id=?",[$did]);
    $sort=0;
    foreach((array)($in['actions']??[]) as $a){
      $txt=trim((string)($a['text']??'')); if($txt==='') continue;
      $due=trim((string)($a['due']??'')); if(!preg_match('/^\d{4}-\d{2}-\d{2}$/',$due)) $due='';
      q("INSERT INTO debrief_actions(debrief_id,training_id,text,owner,due,done,created_at,sort)
         VALUES(?,?,?,?,?,?,?,?)",
        [$did,$tid,mb_substr($txt,0,500),mb_substr(trim((string)($a['owner']??'')),0,190),
         $due,!empty($a['done'])?1:0,now(),$sort++]);
    }
    audit('debrief.save','training',(string)$tid,$status==='final'?'Bericht abgeschlossen':'Bericht als Entwurf gespeichert');
    $rowNew=q("SELECT * FROM debriefs WHERE id=?",[$did])->fetch();
    out(['ok'=>true,'debrief'=>debrief_public($rowNew)]);

  case 'debrief.delete':
    require_auth();
    $tid=(int)($in['training']??0);
    $d=q("SELECT id FROM debriefs WHERE training_id=?",[$tid])->fetch();
    if($d){
      q("DELETE FROM debrief_actions WHERE debrief_id=?",[$d['id']]);
      q("DELETE FROM debriefs WHERE id=?",[$d['id']]);
      audit('debrief.delete','training',(string)$tid,'Bericht gelöscht');
    }
    out(['ok'=>true]);

  /* ---- Maßnahme abhaken/aufmachen (aus der Berichtsansicht heraus) ---- */
  case 'debrief.actionDone':
    require_auth();
    $aid=(int)($in['id']??0);
    q("UPDATE debrief_actions SET done=? WHERE id=?",[!empty($in['done'])?1:0,$aid]);
    out(['ok'=>true]);

  /* ---- Auswertung über einen Zeitraum ---- */
  case 'report.build':
    require_auth();
    $ymd=function($s){ $s=trim((string)$s); return preg_match('/^\d{4}-\d{2}-\d{2}$/',$s)?$s:''; };
    $bucket=in_array($in['bucket']??'',['week','month','year'],true)?$in['bucket']:'month';
    out(['ok'=>true,'report'=>debrief_report($ymd($in['from']??''),$ymd($in['to']??''),
      trim((string)($in['client']??'')),$bucket, !empty($in['drafts']))]);

  /* ============================================================
     POWERPOINT-VERFOLGUNG
     ============================================================ */

  /* ---- Status/Zuständigkeit/Fälligkeit/Notiz einer Session pflegen ---- */
  case 'ppt.setStatus':
    require_auth();
    $sid=(int)($in['session']??0);
    $row=q("SELECT * FROM training_sessions WHERE id=?",[$sid])->fetch();
    if(!$row) fail('Session nicht gefunden.',404);
    $set=[]; $p=[];
    if(isset($in['ppt']) && in_array($in['ppt'],['','inArbeit','vorhanden'],true)){ $set[]='ppt=?'; $p[]=$in['ppt']; }
    if(array_key_exists('pptByIds',$in)){
      // Mehrere Verantwortliche; leere Liste = zurück auf automatisch (Wochenplan)
      $ids=array_values(array_unique(array_filter(array_map('intval',(array)$in['pptByIds']))));
      $set[]='ppt_by_ids=?'; $p[]=$ids?json_encode(array_map('strval',$ids)):'';
      $set[]='ppt_by=?';     $p[]=$ids[0]??null;
    } elseif(array_key_exists('pptBy',$in)){
      $one=((int)$in['pptBy'])?:null;
      $set[]='ppt_by=?';     $p[]=$one;
      $set[]='ppt_by_ids=?'; $p[]=$one?json_encode([(string)$one]):'';
    }
    if(array_key_exists('pptDue',$in)){
      $d=trim((string)$in['pptDue']);
      if($d!=='' && !preg_match('/^\d{4}-\d{2}-\d{2}$/',$d)) $d='';
      $set[]='ppt_due=?'; $p[]=$d;
    }
    if(array_key_exists('note',$in)){ $set[]='ppt_note=?'; $p[]=mb_substr(trim((string)$in['note']),0,255); }
    if($set){ $p[]=$sid; q("UPDATE training_sessions SET ".implode(',',$set)." WHERE id=?",$p); }
    audit('ppt.setStatus','training',(string)$row['training_id'],mb_substr((string)$row['title'],0,80));
    out(['ok'=>true]);

  /* ---- Fertige Folie hochladen (multipart aus dem Cockpit) ---- */
  case 'ppt.upload':
    require_auth();
    $sid=(int)($in['session']??0);
    $row=q("SELECT * FROM training_sessions WHERE id=?",[$sid])->fetch();
    if(!$row) fail('Session nicht gefunden.',404);
    $res=ppt_store_upload($_FILES['file']??[], 'tg'.$row['training_id'].'-s'.$sid);
    if(is_string($res)) fail($res);
    if(!empty($row['ppt_file'])) @unlink(ppt_dir().'/'.basename($row['ppt_file']));
    q("UPDATE training_sessions SET ppt='vorhanden', ppt_file=?, ppt_file_name=?, ppt_file_size=?, ppt_file_at=? WHERE id=?",
      [$res['name'],$res['orig'],$res['size'],now(),$sid]);
    audit('ppt.upload','training',(string)$row['training_id'],mb_substr((string)$row['title'],0,60).' ('.$res['orig'].')');
    out(['ok'=>true,'file'=>$res['orig'],'size'=>$res['size']]);

  /* ---- Datei herunterladen (streamt; kein JSON) ---- */
  case 'ppt.download':
    require_auth();
    $row=q("SELECT ppt_file,ppt_file_name FROM training_sessions WHERE id=?",[(int)($in['session']??0)])->fetch();
    if(!$row) fail('Session nicht gefunden.',404);
    ppt_stream((string)$row['ppt_file'],(string)$row['ppt_file_name']);

  case 'ppt.fileDelete':
    require_auth();
    $sid=(int)($in['session']??0);
    $row=q("SELECT * FROM training_sessions WHERE id=?",[$sid])->fetch();
    if(!$row) fail('Session nicht gefunden.',404);
    if(!empty($row['ppt_file'])) @unlink(ppt_dir().'/'.basename($row['ppt_file']));
    q("UPDATE training_sessions SET ppt_file='', ppt_file_name='', ppt_file_size=0, ppt_file_at='', ppt='' WHERE id=?",[$sid]);
    audit('ppt.fileDelete','training',(string)$row['training_id'],mb_substr((string)$row['title'],0,80));
    out(['ok'=>true]);

  /* ---- Basis-Vorlage je Training ---- */
  case 'ppt.templateUpload':
    require_auth();
    $tgId=(int)($in['training']??0);
    $tg=q("SELECT * FROM trainings WHERE id=?",[$tgId])->fetch();
    if(!$tg) fail('Training nicht gefunden.',404);
    $res=ppt_store_upload($_FILES['file']??[], 'tpl-tg'.$tgId);
    if(is_string($res)) fail($res);
    if(!empty($tg['ppt_template'])) @unlink(ppt_dir().'/'.basename($tg['ppt_template']));
    q("UPDATE trainings SET ppt_template=?, ppt_template_name=? WHERE id=?",[$res['name'],$res['orig'],$tgId]);
    audit('ppt.templateUpload','training',(string)$tgId,$res['orig']);
    out(['ok'=>true,'file'=>$res['orig']]);

  case 'ppt.templateDownload':
    require_auth();
    $tg=q("SELECT ppt_template,ppt_template_name FROM trainings WHERE id=?",[(int)($in['training']??0)])->fetch();
    if(!$tg) fail('Training nicht gefunden.',404);
    ppt_stream((string)$tg['ppt_template'],(string)$tg['ppt_template_name']);

  case 'ppt.templateDelete':
    require_auth();
    $tgId=(int)($in['training']??0);
    $tg=q("SELECT ppt_template FROM trainings WHERE id=?",[$tgId])->fetch();
    if(!$tg) fail('Training nicht gefunden.',404);
    if(!empty($tg['ppt_template'])) @unlink(ppt_dir().'/'.basename($tg['ppt_template']));
    q("UPDATE trainings SET ppt_template='', ppt_template_name='' WHERE id=?",[$tgId]);
    out(['ok'=>true]);

  /* ---- Erinnerungen für ein Training sofort auslösen ---- */
  case 'ppt.remindNow':
    require_auth();
    require_once __DIR__.'/automation.php';
    $n=ppt_chase(true,(int)($in['training']??0));
    out(['ok'=>true,'sent'=>$n['reminded']]);

  /* ---- Folien-Anfrage an einen Trainer (aus der Besetzungsliste):
         freundliche Erst-Anfrage mit Link zur persönlichen Folien-Seite
         (inkl. Basis-Vorlage). Stempelt die Erinnerung, damit die Automatik
         nicht direkt hinterherschickt - der Zähler bleibt unangetastet. ---- */
  case 'ppt.requestTrainer':
    require_auth();
    $tgId=(int)($in['training']??0); $trId=(int)($in['trainer']??0);
    $tg=q("SELECT * FROM trainings WHERE id=?",[$tgId])->fetch();
    if(!$tg) fail('Training nicht gefunden.',404);
    if(!q("SELECT id FROM trainers WHERE id=?",[$trId])->fetch()) fail('Trainer nicht gefunden.',404);
    $list=[];
    foreach(q("SELECT * FROM training_sessions WHERE training_id=? ORDER BY sort,id",[$tgId])->fetchAll() as $s){
      if(!ppt_relevant($s) || ($s['ppt']??'')==='vorhanden') continue;
      if(in_array($trId, ppt_owner_ids($s), true)) $list[]=$s;
    }
    if(!$list) out(['ok'=>true,'sent'=>0,'open'=>0]);
    $today=gmdate('Y-m-d');
    $od=false; foreach($list as $s){ $d=ppt_due_of($s,$tg); if($d && $d<$today){ $od=true; break; } }
    $ok=ppt_send_reminder($tg,$trId,$list,$od,'request',
      (string)($in['lang']??''),(string)($in['subject']??''),(string)($in['text']??''));
    if($ok) foreach($list as $s)
      q("UPDATE training_sessions SET ppt_reminded_at=? WHERE id=?",[now(),$s['id']]);
    audit('ppt.request','training',(string)$tgId,'Folien-Anfrage an Trainer '.$trId.' ('.count($list).')');
    out(['ok'=>true,'sent'=>$ok?1:0,'open'=>count($list)]);

  /* ---- Wochenplan aus einer anderen Woche übernehmen (Vorlage kopieren) ---- */
  case 'weekplan.copy':
    require_auth();
    $from=(int)($in['from']??0); $to=(int)($in['to']??0);
    if(!$from||!$to||$from===$to) fail('Bitte Quell- und Zielwoche wählen.');
    if(!q("SELECT id FROM trainings WHERE id=?",[$from])->fetch() || !q("SELECT id FROM trainings WHERE id=?",[$to])->fetch())
      fail('Training nicht gefunden.',404);
    $cnt=(int)q("SELECT COUNT(*) c FROM training_sessions WHERE training_id=?",[$to])->fetch()['c'];
    if($cnt>0 && empty($in['force'])) out(['ok'=>true,'needsForce'=>true,'existing'=>$cnt]);
    q("DELETE FROM training_sessions WHERE training_id=?",[$to]);
    // Inhalte kopieren - Trainer-Zuordnung und PPT-Status bewusst NICHT (neue Woche, neues Team)
    $map=[];
    foreach(q("SELECT * FROM training_sessions WHERE training_id=? ORDER BY sort,id",[$from])->fetchAll() as $s){
      q("INSERT INTO training_sessions(training_id,title,title_en,stype,dur,descr,mat,ppt,sort)
         VALUES(?,?,?,?,?,?,?, '', ?)",
        [$to,$s['title'],$s['title_en'],$s['stype'],$s['dur'],$s['descr'],$s['mat']??'',$s['sort']]);
      $map[(string)$s['id']]=(string)db()->lastInsertId();
    }
    $src=q("SELECT plan_slots,deliverable,deliverable_en FROM trainings WHERE id=?",[$from])->fetch();
    $srcPlan=json_decode($src['plan_slots']?:'{}',true)?:[];
    $newPlan=[];
    foreach($srcPlan as $k=>$ids){
      $newPlan[$k]=array_values(array_filter(array_map(fn($x)=>$map[(string)$x]??null,(array)$ids)));
    }
    q("UPDATE trainings SET plan_slots=?, deliverable=COALESCE(NULLIF(deliverable,''),?),
        deliverable_en=COALESCE(NULLIF(deliverable_en,''),?) WHERE id=?",
      [json_encode($newPlan),$src['deliverable']??'',$src['deliverable_en']??'',$to]);
    audit('weekplan.copy','training',(string)$to,'Wochenplan aus Training #'.$from.' übernommen');
    out(['ok'=>true,'sessions'=>count($map)]);

  /* ---- KI-Wochenrhythmus: Sessions didaktisch auf Mo-Fr verteilen lassen ---- */
  case 'weekplan.suggest':
    require_auth();
    // Der KI-Aufruf kann bis zu ~90 s dauern - Standard-Zeitlimit (oft 60 s) reicht nicht.
    @set_time_limit(180); @ini_set('max_execution_time','180');
    $tid=(int)($in['training']??0);
    $tg=q("SELECT * FROM trainings WHERE id=?",[$tid])->fetch();
    if(!$tg) fail('Training nicht gefunden.',404);
    $rows=q("SELECT id,title,stype,dur FROM training_sessions WHERE training_id=? ORDER BY sort,id",[$tid])->fetchAll();
    if(!$rows) fail('Für diese Woche sind noch keine Sessions angelegt.');
    if(trim(cfg()['anthropic_key']??'')==='') fail('KI nicht konfiguriert - trage anthropic_key in config.php ein.');
    $sess=array_map(fn($r)=>['id'=>(string)$r['id'],'title'=>$r['title'],'type'=>$r['stype'],'dur'=>$r['dur']],$rows);
    $slots=ai_suggest_week($sess,(string)$tg['topic']);
    // Antwort absichern: nur echte IDs, keine Dubletten - Übriges landet auf der Bank
    $valid=array_map(fn($r)=>(string)$r['id'],$rows);
    $keys=['mon_am','mon_pm','tue_am','tue_pm','wed_am','wed_pm','thu_am','thu_pm','fri_am','fri_pm'];
    $plan=[]; $seen=[];
    foreach($keys as $k){
      $plan[$k]=[];
      foreach((array)($slots[$k]??[]) as $id){
        $id=(string)(int)$id;
        if(in_array($id,$valid,true)&&!isset($seen[$id])){ $plan[$k][]=$id; $seen[$id]=true; }
      }
    }
    $plan['bench']=array_values(array_diff($valid,array_keys($seen)));
    q("UPDATE trainings SET plan_slots=? WHERE id=?",[json_encode($plan),$tid]);
    audit('weekplan.suggest','training',(string)$tid,'KI-Wochenrhythmus angewendet');
    out(['ok'=>true,'plan'=>$plan,'unplaced'=>count($plan['bench'])]);

  case 'weekplan.save':
    require_auth();
    $tid=(int)($in['training']??0);
    if(!$tid || !q("SELECT id FROM trainings WHERE id=?",[$tid])->fetch()) fail('Training nicht gefunden.',404);
    // Platzierung validieren: nur bekannte Slots, nur Sessions dieses Trainings, keine Dubletten
    $valid=array_map('strval', q("SELECT id FROM training_sessions WHERE training_id=?",[$tid])->fetchAll(PDO::FETCH_COLUMN));
    $keys=['mon_am','mon_pm','tue_am','tue_pm','wed_am','wed_pm','thu_am','thu_pm','fri_am','fri_pm','bench'];
    $plan=[]; $seen=[];
    foreach($keys as $k){
      $plan[$k]=[];
      foreach((array)(($in['plan']??[])[$k]??[]) as $id){
        $id=(string)(int)$id;
        if(in_array($id,$valid,true) && !isset($seen[$id])){ $plan[$k][]=$id; $seen[$id]=true; }
      }
    }
    $sets=['plan_slots=?']; $vals=[json_encode($plan)];
    if(array_key_exists('deliverable',$in)){ $sets[]='deliverable=?'; $vals[]=(string)$in['deliverable']; }
    if(array_key_exists('deliverableEn',$in)){ $sets[]='deliverable_en=?'; $vals[]=(string)$in['deliverableEn']; }
    $vals[]=$tid;
    q("UPDATE trainings SET ".implode(',',$sets)." WHERE id=?",$vals);
    audit('weekplan.update','training',(string)$tid,'Wochenplan aktualisiert');
    out(['ok'=>true]);

  case 'training.delete':
    require_auth();
    $tid=$in['id']??0;
    q("DELETE FROM trainings WHERE id=?",[$tid]);
    audit('training.delete','training',(string)$tid,'Training gelöscht');
    q("DELETE FROM requests WHERE training_id=?",[$tid]);
    q("DELETE FROM travel WHERE training_id=?",[$tid]);
    q("DELETE FROM training_materials WHERE training_id=?",[$tid]);
    q("DELETE FROM training_sessions WHERE training_id=?",[$tid]);
    out(['ok'=>true]);

  /* ---- Termin verschoben: betroffene Trainer informieren / neu anfragen ---- */
  case 'training.notifyShift':
    require_auth();
    $tgId=(int)($in['training']??0);
    $mode=($in['mode']??'info')==='reask'?'reask':'info';
    $lang=($in['lang']??'de')==='en'?'en':'de';
    $tg=q("SELECT * FROM trainings WHERE id=?",[$tgId])->fetch();
    if(!$tg) fail('Training nicht gefunden.',404);
    $newWhen=fmt_date_range($tg['start_date']??null,$tg['end_date']??null,$lang) ?: kw_label($tg['kw']??'',$lang);
    $reqs=q("SELECT r.id AS rid, r.status, tr.email, tr.name, tr.id AS tr_id
             FROM requests r JOIN trainers tr ON tr.id=r.trainer_id
             WHERE r.training_id=? AND r.status IN ('yes','confirmed','maybe','asked')",[$tgId])->fetchAll();
    $c=cfg(); $sent=0; $seen=[];
    foreach($reqs as $r){
      $email=strtolower(trim((string)($r['email']??''))); if($email===''||isset($seen[$email]))continue; $seen[$email]=true;
      $tok=token(40);
      if($mode==='reask') q("UPDATE requests SET status='asked', lang=?, tok=?, created_at=?, responded_at=NULL WHERE id=?",[$lang,$tok,now(),$r['rid']]);
      else                q("UPDATE requests SET tok=? WHERE id=?",[$tok,$r['rid']]);
      $first=explode(' ', preg_replace('/^Dr\.\s*/','',$r['name']))[0];
      $subj = $lang==='de' ? 'Terminänderung - '.$tg['topic'].' ('.$tg['city'].')' : 'Schedule change - '.$tg['topic'].' ('.$tg['city'].')';
      $intro = $lang==='de'
        ? "Hallo $first,\n\nkurze Info: Der Termin für „{$tg['topic']}“ in {$tg['city']} hat sich geändert.\nNeuer Zeitraum: $newWhen.\n\n"
          .($mode==='reask' ? "Bitte bestätige über die Buttons unten, ob du zum neuen Termin verfügbar bist." : "Deine Zusage bleibt bestehen - falls der neue Termin nicht passt, melde dich bitte kurz.")
        : "Hi $first,\n\nquick note: the schedule for \"{$tg['topic']}\" in {$tg['city']} has changed.\nNew period: $newWhen.\n\n"
          .($mode==='reask' ? "Please confirm your availability for the new date via the buttons below." : "Your commitment stands - if the new date doesn't work, please let us know.");
      $html=email_html($intro, $mode==='reask' ? response_buttons($tok,$lang) : '');
      $ok=send_email($r['email'],$r['name'],$subj,$html);
      $st=$ok ? (($c['mail_mode']??'mail')==='log'?'logged':'sent') : 'failed';
      q("INSERT INTO email_log(training_id,trainer_id,to_email,subject,body,lang,status,created_at)
         VALUES(?,?,?,?,?,?,?,?)",[$tgId,$r['tr_id'],$r['email'],$subj,$intro,$lang,$st,now()]);
      if($ok) $sent++;
    }
    out(['ok'=>true,'sent'=>$sent,'mode'=>$mode]);

  /* ---- Material-Katalog + Materiallisten ---- */
  case 'material.save':
    require_auth();
    $mid=$in['id']??''; if($mid==='') fail('Keine Material-ID.');
    $mf=[$in['name']??'', $in['unit']??'', $in['cat']??''];
    $ex=q("SELECT id FROM materials WHERE id=?",[$mid])->fetch();
    if($ex) q("UPDATE materials SET name=?,unit=?,cat=? WHERE id=?", array_merge($mf,[$mid]));
    else    q("INSERT INTO materials(id,name,unit,cat,sort_order) VALUES(?,?,?,?, (SELECT COALESCE(MAX(sort_order),0)+1 FROM materials m))",
              array_merge([$mid],$mf));
    out(['ok'=>true,'id'=>$mid]);

  case 'material.delete':
    require_auth();
    $mid=$in['id']??'';
    q("DELETE FROM materials WHERE id=?",[$mid]);
    q("DELETE FROM training_materials WHERE material_id=?",[$mid]);
    q("DELETE FROM material_presets WHERE material_id=?",[$mid]);
    out(['ok'=>true]);

  case 'training.materials.save':
    require_auth();
    $tid=$in['training']??0; $lines=$in['materials']??[];
    q("DELETE FROM training_materials WHERE training_id=?",[$tid]);
    foreach($lines as $l){
      if(empty($l['matId'])) continue;
      q("INSERT INTO training_materials(training_id,material_id,qty) VALUES(?,?,?)",[$tid,$l['matId'],(int)($l['qty']??0)]);
    }
    out(['ok'=>true]);

  case 'matpreset.save':
    require_auth();
    $spec=$in['spec']??''; if($spec==='') fail('Kein Schwerpunkt.');
    $lines=$in['materials']??[];
    q("DELETE FROM material_presets WHERE spec=?",[$spec]);
    foreach($lines as $l){
      if(empty($l['matId'])) continue;
      q("INSERT INTO material_presets(spec,material_id,qty) VALUES(?,?,?)",[$spec,$l['matId'],(int)($l['qty']??0)]);
    }
    out(['ok'=>true]);

  /* ---- Vorlage speichern (pro Sprache) ---- */
  case 'template.save':
    require_auth();
    $id=$in['id']; $lang=($in['lang']??'de')==='en'?'en':'de';
    q("UPDATE templates SET {$lang}_name=?, {$lang}_subject=?, {$lang}_body=? WHERE id=?",
      [$in['name']??'', $in['subject']??'', $in['body']??'', $id]);
    out(['ok'=>true]);

  /* ---- Status manuell setzen (z.B. Bestätigung) ---- */
  case 'request.setStatus':
    require_auth();
    $tg=$in['training']; $tr=$in['trainer']; $st=$in['status']??'asked';
    $row=q("SELECT id FROM requests WHERE training_id=? AND trainer_id=?",[$tg,$tr])->fetch();
    if($row) q("UPDATE requests SET status=?, responded_at=? WHERE id=?",[$st,now(),$row['id']]);
    else q("INSERT INTO requests(training_id,trainer_id,status,tok,created_at) VALUES(?,?,?,?,?)",
      [$tg,$tr,$st,token(40),now()]);
    audit('request.status','training',(string)$tg,'Status → '.$st);
    out(['ok'=>true]);

  /* ---- Trainer über manuelle Statusänderung informieren (editierbarer Text,
          mit den bekannten Bestätigungs-Buttons) ---- */
  case 'request.notifyStatus':
    require_auth();
    $tgId=(int)($in['training']??0); $trId=(int)($in['trainer']??0);
    $text=trim((string)($in['text']??''));
    if(!$tgId||!$trId) fail('Training/Trainer fehlt.');
    if($text==='') fail('Kein Text.');
    $tr=q("SELECT * FROM trainers WHERE id=?",[$trId])->fetch();
    if(!$tr) fail('Trainer nicht gefunden.',404);
    if(empty($tr['email'])) fail('Für diesen Trainer ist keine E-Mail-Adresse hinterlegt.');
    $req=q("SELECT * FROM requests WHERE training_id=? AND trainer_id=?",[$tgId,$trId])->fetch();
    if(!$req){ $tok=token(40);
      q("INSERT INTO requests(training_id,trainer_id,status,tok,created_at) VALUES(?,?, 'asked',?,?)",[$tgId,$trId,$tok,now()]);
    } elseif(empty($req['tok'])){ $tok=token(40); q("UPDATE requests SET tok=? WHERE id=?",[$tok,$req['id']]); }
    else { $tok=$req['tok']; }
    $lang=($in['lang']??'de')==='en'?'en':'de';
    $tgRow=q("SELECT * FROM trainings WHERE id=?",[$tgId])->fetch();
    $subj=trim((string)($in['subject']??'')) ?: (($lang==='de'?'Änderung deines Einsatzes':'Change to your assignment')
      .($tgRow?' - '.$tgRow['topic'].' ('.$tgRow['city'].')':''));
    $html=email_html($text, response_buttons($tok,$lang));
    $ok=send_email($tr['email'],$tr['name'],$subj,$html);
    $st2=(cfg()['mail_mode']??'mail')==='log' ? 'logged' : ($ok?'sent':'failed');
    q("INSERT INTO email_log(training_id,trainer_id,to_email,subject,body,lang,status,created_at)
       VALUES(?,?,?,?,?,?,?,?)",[$tgId,$trId,$tr['email'],$subj,$text,$lang,$st2,now()]);
    out(['ok'=>true,'sent'=>$ok?1:0]);

  /* ---- Anfrage(n) versenden: Kern des Rückkanals ---- */
  case 'request.create':
    require_auth();
    $tgId=$in['training']; $recips=$in['recipients']??[]; $lang=($in['lang']??'en')==='de'?'de':'en';
    $subjTpl=$in['subject']??null; $bodyTpl=$in['body']??null;
    // Optionaler Zielstatus: 'asked' (Standard, normale Anfrage) oder z.B. 'no' (Absage per Mail)
    $forceStatus=in_array(($in['status']??''),['asked','yes','maybe','no'],true)?$in['status']:'asked';
    $respondedAt=$forceStatus==='asked'?null:now();
    $tg=q("SELECT * FROM trainings WHERE id=?",[$tgId])->fetch();
    if(!$tg) fail('Training nicht gefunden.',404);
    $tg['kw']=kw_label($tg['kw']??'',$lang);
    $c=cfg(); $sent=0; $seenEmail=[];
    foreach($recips as $trId){
      $tr=q("SELECT * FROM trainers WHERE id=?",[$trId])->fetch();
      if(!$tr) continue;
      // Dubletten-Schutz: pro E-Mail-Adresse nur EINE Anfrage senden
      // (verhindert Mehrfach-Mails, wenn ein Trainer doppelt angelegt wurde).
      $emKey=strtolower(trim((string)($tr['email']??'')));
      if($emKey!=='' && isset($seenEmail[$emKey])) continue;
      if($emKey!=='') $seenEmail[$emKey]=true;
      $tok=token(40);
      // Request-Zeile anlegen/aktualisieren
      $ex=q("SELECT id FROM requests WHERE training_id=? AND trainer_id=?",[$tgId,$trId])->fetch();
      if($ex) q("UPDATE requests SET status=?, lang=?, tok=?, created_at=?, responded_at=? WHERE id=?",
        [$forceStatus,$lang,$tok,now(),$respondedAt,$ex['id']]);
      else q("INSERT INTO requests(training_id,trainer_id,status,lang,tok,created_at,responded_at) VALUES(?,?,?,?,?,?,?)",
        [$tgId,$trId,$forceStatus,$lang,$tok,now(),$respondedAt]);
      // Text füllen
      $subject=fill_tpl($subjTpl ?? 'Anfrage - {{topic}}', $tg, $tr);
      $bodyText=fill_tpl($bodyTpl ?? '', $tg, $tr);
      // Bei einer Absage/Planänderung keine Verfügbarkeits-Buttons anhängen.
      $html=email_html($bodyText, $forceStatus==='asked' ? response_buttons($tok,$lang) : '');
      $ok=send_email($tr['email'],$tr['name'],$subject,$html);
      q("INSERT INTO email_log(training_id,trainer_id,to_email,subject,body,lang,status,created_at)
         VALUES(?,?,?,?,?,?,?,?)",[$tgId,$trId,$tr['email'],$subject,$bodyText,$lang,$ok?($c['mail_mode']==='log'?'logged':'sent'):'failed',now()]);
      if($ok) $sent++;
    }
    out(['ok'=>true,'sent'=>$sent,'total'=>count($recips)]);

  /* ---- Einsatzübersicht an den Trainer mailen (mit Gesamtbestätigung) ---- */
  case 'plan.send':
    require_auth();
    $trId=(int)($in['trainer']??0);
    $tr=q("SELECT * FROM trainers WHERE id=?",[$trId])->fetch();
    if(!$tr) fail('Trainer nicht gefunden.',404);
    if(empty($tr['email'])) fail('Für diesen Trainer ist keine E-Mail-Adresse hinterlegt.');
    $lang=($in['lang']??'de')==='en'?'en':'de';
    $sched=trainer_schedule($trId);
    // Token anlegen/erneuern (setzt eine evtl. frühere Bestätigung zurück)
    $tok=token(40);
    $ex=q("SELECT trainer_id FROM plan_tokens WHERE trainer_id=?",[$trId])->fetch();
    if($ex) q("UPDATE plan_tokens SET tok=?, sent_at=?, confirmed_at=NULL, confirm_status=NULL, note=NULL, resolved_at=NULL WHERE trainer_id=?",[$tok,now(),$trId]);
    else    q("INSERT INTO plan_tokens(trainer_id,tok,created_at,sent_at) VALUES(?,?,?,?)",[$trId,$tok,now(),now()]);
    $first=explode(' ', preg_replace('/^Dr\.\s*/','',$tr['name']))[0];
    $intro=$lang==='de'
      ? "Hallo $first,\n\nhier ist deine persönliche Einsatzübersicht. Bitte prüfe kurz, ob alles stimmt, und bestätige den Plan über den Button unten - oder melde uns, falls etwas nicht passt."
      : "Hi $first,\n\nhere is your personal assignment overview. Please check that everything is correct and confirm the plan via the button below - or let us know if something doesn't fit.";
    $cta=$lang==='de' ? 'Einsatzplan ansehen & bestätigen' : 'View & confirm your plan';
    $url=base_url().'/plan.php?token='.$tok;
    $subject=$lang==='de' ? 'Deine Einsatzübersicht - bitte bestätigen' : 'Your assignment overview - please confirm';
    $html=email_html($intro, plan_table_html($sched,$lang).cta_button($url,$cta));
    $ok=send_email($tr['email'],$tr['name'],$subject,$html);
    $st=$ok ? ((cfg()['mail_mode']??'mail')==='log'?'logged':'sent') : 'failed';
    q("INSERT INTO email_log(training_id,trainer_id,to_email,subject,body,lang,status,created_at)
       VALUES(?,?,?,?,?,?,?,?)",[null,$trId,$tr['email'],$subject,$intro,$lang,$st,now()]);
    out(['ok'=>true,'sent'=>$ok?1:0,'count'=>count($sched)]);

  /* ---- Rückmeldungen der Trainer zur Einsatzübersicht (Dashboard-Posteingang) ---- */
  case 'messages.list':
    require_auth();
    $rows=q("SELECT p.trainer_id, p.note, p.confirmed_at, p.resolved_at, t.name, t.email
             FROM plan_tokens p JOIN trainers t ON t.id=p.trainer_id
             WHERE p.confirm_status='issue' AND p.note IS NOT NULL AND p.note<>''
             ORDER BY (p.resolved_at IS NULL) DESC, p.confirmed_at DESC")->fetchAll();
    out(['ok'=>true,'messages'=>array_map(function($r){
      return ['trainerId'=>(string)$r['trainer_id'],'trainerName'=>$r['name'],'email'=>$r['email'],
              'note'=>$r['note'],'at'=>$r['confirmed_at'],'resolvedAt'=>$r['resolved_at']];
    },$rows)]);

  case 'message.resolve':
    require_auth();
    $trId=(int)($in['trainer']??0);
    if(!$trId) fail('Kein Trainer.');
    $resolved = array_key_exists('resolved',$in) ? !empty($in['resolved']) : true;
    // Optional: Antwort an den Trainer mailen (Text kommt aus dem Erledigen-Dialog).
    $sent=0;
    if($resolved && !empty($in['sendMail']) && trim((string)($in['reply']??''))!==''){
      $tr=q("SELECT * FROM trainers WHERE id=?",[$trId])->fetch();
      if($tr && !empty($tr['email'])){
        $lang=($in['lang']??'de')==='en'?'en':'de';
        $reply=trim((string)$in['reply']);
        // Link auf die (inzwischen korrigierte) Einsatzübersicht zum erneuten Bestätigen
        $pt=q("SELECT tok FROM plan_tokens WHERE trainer_id=?",[$trId])->fetch();
        $cta=($pt && $pt['tok'])
          ? cta_button(base_url().'/plan.php?token='.$pt['tok'],
              $lang==='de' ? 'Aktualisierte Einsatzübersicht ansehen & bestätigen' : 'View & confirm updated overview')
          : '';
        $subj=$lang==='de' ? 'Antwort auf deine Rückmeldung - Einsatzübersicht'
                           : 'Reply to your feedback - assignment overview';
        $ok=send_email($tr['email'],$tr['name'],$subj,email_html($reply,$cta));
        $st=(cfg()['mail_mode']??'mail')==='log' ? 'logged' : ($ok?'sent':'failed');
        q("INSERT INTO email_log(training_id,trainer_id,to_email,subject,body,lang,status,created_at)
           VALUES(?,?,?,?,?,?,?,?)",[null,$trId,$tr['email'],$subj,$reply,$lang,$st,now()]);
        $sent=$ok?1:0;
      }
    }
    q("UPDATE plan_tokens SET resolved_at=? WHERE trainer_id=?",[$resolved?now():null,$trId]);
    out(['ok'=>true,'sent'=>$sent]);

  /* ---- Transfer-/Abholliste an den Kunden mailen (mit Empfangsbestätigung) ---- */
  case 'transfer.send':
    require_auth();
    $r=transfer_send($in['client']??'', ($in['lang']??'en'), false);
    if(!$r['ok']) fail($r['error'],400);
    out($r);

  /* ---- Erinnerung an den Kunden (Empfangsbestätigung ausstehend) ---- */
  case 'transfer.remind':
    require_auth();
    $r=transfer_send($in['client']??'', ($in['lang']??'en'), true);
    if(!$r['ok']) fail($r['error'],400);
    out($r);

  /* ---- E-Mail-Protokoll (Nachweis / Debug) ---- */
  case 'emails':
    require_auth();
    out(['ok'=>true,'emails'=>q("SELECT * FROM email_log ORDER BY id DESC LIMIT 100")->fetchAll()]);

  /* ---- KI: Profile aus Text extrahieren (zur Prüfung, noch nicht speichern) ---- */
  case 'ai.extract':
    require_auth();
    $text=trim((string)($in['text']??''));
    if($text==='') fail('Kein Text übergeben.');
    out(['ok'=>true,'profiles'=>ai_extract_profiles($text)]);

  /* ---- KI-Import bestätigen: Profile anlegen ---- */
  case 'trainers.bulkCreate':
    require_auth();
    $profiles=$in['profiles']??[];
    if(!is_array($profiles)||!count($profiles)) fail('Keine Profile übergeben.');
    $colors=["#3E4852","#B23A42","#4E6E8E","#6E5A86","#3F7A5E","#A6642E","#557088","#8A5A52"];
    $created=0;
    foreach($profiles as $i=>$p){
      if(empty($p['name'])) continue;
      q("INSERT INTO trainers(name,email,phone,spec,region,langs,uae,load_lvl,color,rating,created_at)
         VALUES(?,?,?,?,?,?,?,?,?,?,?)",[
        $p['name'], $p['email']??'', $p['phone']??'',
        json_encode($p['spec']??[],JSON_UNESCAPED_UNICODE), $p['region']??'',
        json_encode($p['langs']??[]), !empty($p['uae'])?1:0, 0,
        $colors[$i%count($colors)], (string)($p['rating']??'4.5'), now()
      ]);
      $created++;
    }
    out(['ok'=>true,'created'=>$created]);

  /* ---- Reisepass je Trainer: Foto per KI auslesen (noch nicht speichern) ---- */
  case 'passport.scan':
    require_auth();
    $img=(string)($in['image']??'');
    if($img==='') fail('Kein Bild übergeben.');
    out(['ok'=>true,'data'=>ai_extract_passport($img)]);

  /* ---- Reisepass je Trainer speichern (Felder + optionales Foto) ---- */
  case 'passport.save':
    require_auth();
    $trId=$in['id']??0;
    if(!$trId || !q("SELECT id FROM trainers WHERE id=?",[$trId])->fetch()) fail('Trainer nicht gefunden.');
    $exp=trim((string)($in['expiry']??''));
    if($exp!=='' && !preg_match('/^\d{4}-\d{2}-\d{2}$/',$exp)) fail('Ablaufdatum bitte als YYYY-MM-DD.');
    $sets=['passport_number=?','passport_name=?','passport_nationality=?','passport_birthdate=?',
           'passport_expiry=?','passport_notes=?','passport_updated_at=?','passport_reminded_at=NULL'];
    $vals=[(string)($in['number']??''), (string)($in['name']??''), (string)($in['nationality']??''),
           (string)($in['birthdate']??''), $exp, (string)($in['notes']??''), now()];
    // Foto nur überschreiben, wenn eines mitgeschickt wurde ('' = unverändert, 'null' = löschen)
    if(array_key_exists('image',$in)){
      $img=$in['image'];
      if($img===null || $img==='null'){ $sets[]='passport_file=NULL'; }
      elseif(is_string($img) && $img!==''){
        // Nur Rasterformate - kein SVG (könnte Skripte enthalten). Das Frontend
        // rechnet Fotos ohnehin vor dem Upload in JPEG um.
        if(!preg_match('#^data:image/(jpe?g|png|webp|gif|heic|heif);base64,#i',$img)) fail('Ungültiges Bildformat.');
        $sets[]='passport_file=?'; $vals[]=$img;
      }
    }
    $vals[]=$trId;
    q("UPDATE trainers SET ".implode(',',$sets)." WHERE id=?", $vals);
    out(['ok'=>true]);

  /* ---- Reisepass-Foto abrufen (nicht im State, um Payload klein zu halten) ---- */
  case 'passport.image':
    require_auth();
    $r=q("SELECT passport_file FROM trainers WHERE id=?",[$in['id']??0])->fetch();
    out(['ok'=>true,'image'=>$r['passport_file']??null]);

  /* ---- Reisepass löschen ---- */
  case 'passport.clear':
    require_auth();
    q("UPDATE trainers SET passport_number=NULL,passport_name=NULL,passport_nationality=NULL,
       passport_birthdate=NULL,passport_expiry=NULL,passport_file=NULL,passport_notes=NULL,
       passport_updated_at=NULL,passport_reminded_at=NULL WHERE id=?",[$in['id']??0]);
    out(['ok'=>true]);

  /* ---- Automatik-Einstellungen ---- */
  case 'settings.get':
    require_auth();
    out(['ok'=>true,'settings'=>[
      'reminder_hours'=>(int)(config_get('reminder_hours')??48),
      'escalate_hours'=>(int)(config_get('escalate_hours')??72),
      'auto_advance'=>(config_get('auto_advance')==='1'),
      'passport_lead_days'=>(int)(config_get('passport_lead_days')??180),
      'ppt_lead_days'=>(int)(config_get('ppt_lead_days')??21),
      'ai_enabled'=>trim(cfg()['anthropic_key']??'')!=='',
    ]]);

  case 'settings.save':
    require_auth();
    if(isset($in['reminder_hours'])) config_set('reminder_hours',(string)max(1,(int)$in['reminder_hours']));
    if(isset($in['escalate_hours'])) config_set('escalate_hours',(string)max(1,(int)$in['escalate_hours']));
    if(isset($in['auto_advance']))   config_set('auto_advance', !empty($in['auto_advance'])?'1':'0');
    if(isset($in['passport_lead_days'])) config_set('passport_lead_days',(string)max(14,(int)$in['passport_lead_days']));
    if(isset($in['ppt_lead_days'])) config_set('ppt_lead_days',(string)max(3,(int)$in['ppt_lead_days']));
    out(['ok'=>true]);

  /* ---- Login-PIN ändern (im Dashboard) ---- */
  case 'pin.change':
    require_auth();
    $cur = (string)($in['current'] ?? '');
    $new = trim((string)($in['new'] ?? ''));
    $hash = config_get('pin_hash');
    if($hash && !password_verify($cur, $hash)) fail('Aktueller PIN ist nicht korrekt.',401);
    if(!preg_match('/^\d{4,8}$/', $new)) fail('Neuer PIN muss 4-8 Ziffern haben.');
    config_set('pin_hash', password_hash($new, PASSWORD_DEFAULT));
    out(['ok'=>true]);

  /* ---- Automatik jetzt ausführen (Button) ---- */
  case 'automation.run':
    require_auth();
    out(run_automation());

  /* ---- Reisedaten & Agenda je Training speichern ---- */
  case 'training.travelSave':
    require_auth();
    q("UPDATE trainings SET venue=?,hotel=?,hotel_addr=?,meeting_point=?,contact_name=?,contact_phone=?,dresscode=?,per_diem=?,travel_notes=?,agenda=? WHERE id=?",[
      $in['venue']??'', $in['hotel']??'', $in['hotelAddr']??'', $in['meetingPoint']??'',
      $in['contactName']??'', $in['contactPhone']??'', $in['dresscode']??'', $in['perDiem']??'',
      $in['notes']??'', json_encode($in['agenda']??[],JSON_UNESCAPED_UNICODE), $in['training']??0]);
    out(['ok'=>true]);

  /* ---- Flug-/Zimmerdaten je Trainer speichern ---- */
  case 'trainer.travelSave':
    require_auth();
    $tgId=$in['training']??0; $trId=$in['trainer']??0;
    $ex=q("SELECT id FROM travel WHERE training_id=? AND trainer_id=?",[$tgId,$trId])->fetch();
    $vs=$in['visaStatus']??'none';
    $f=[$in['arrival']??'', $in['departure']??'', $in['flightOut']??'', $in['flightReturn']??'', $in['room']??'', $in['notes']??'',
        $vs, $in['passportExpiry']??'', $in['visaNotes']??''];
    if($ex) q("UPDATE travel SET arrival=?,departure=?,flight_out=?,flight_return=?,room=?,notes=?,visa_status=?,passport_expiry=?,visa_notes=?,updated_at=? WHERE id=?",
      array_merge($f,[now(),$ex['id']]));
    else q("INSERT INTO travel(training_id,trainer_id,arrival,departure,flight_out,flight_return,room,notes,visa_status,passport_expiry,visa_notes,updated_at)
            VALUES(?,?,?,?,?,?,?,?,?,?,?,?)", array_merge([$tgId,$trId],$f,[now()]));
    out(['ok'=>true]);

  /* ---- Persönliche Reise-Agenda per E-Mail senden (mit Druck-Link) ---- */
  case 'travel.sendAgenda':
    require_auth();
    $r=send_agenda_mail((int)($in['training']??0), (int)($in['trainer']??0),
        (string)($in['lang']??''), (string)($in['subject']??''), (string)($in['text']??''));
    if(empty($r['ok'])) fail($r['error']??'Versand fehlgeschlagen.',404);
    out(['ok'=>true,'link'=>$r['link'],'sent'=>$r['sent'],'attached'=>$r['attached']]);

  /* ---- Serienversand: Agenda an alle bestätigten Trainer eines Trainings.
         Betreff und Text kommen aus dem Kontroll-Dialog und dürfen Platzhalter
         wie {{firstName}} enthalten - je Trainer wird individuell gefüllt. ---- */
  case 'travel.sendAgendaAll':
    require_auth();
    $tgId=(int)($in['training']??0);
    if(!q("SELECT id FROM trainings WHERE id=?",[$tgId])->fetch()) fail('Training nicht gefunden.',404);
    $ids=array_values(array_filter(array_map('intval',(array)($in['trainers']??[]))));
    if(!$ids){
      $ids=array_map('intval', q("SELECT trainer_id FROM requests WHERE training_id=? AND status IN('yes','confirmed')",
        [$tgId])->fetchAll(PDO::FETCH_COLUMN));
    }
    if(!$ids) fail('Für dieses Training ist noch niemand bestätigt.');
    $done=[]; $failed=[]; $att=0;
    foreach($ids as $trId){
      $r=send_agenda_mail($tgId,$trId,(string)($in['lang']??''),
          (string)($in['subject']??''),(string)($in['text']??''));
      if(empty($r['ok'])||empty($r['sent'])) $failed[]=$r['name']??('#'.$trId);
      else { $done[]=$r['name']; $att+=(int)$r['attached']; }
    }
    audit('travel.sendAgendaAll','training',(string)$tgId,count($done).' Agenden verschickt');
    out(['ok'=>true,'sent'=>count($done),'failed'=>$failed,'names'=>$done,'attached'=>$att]);

  default:
    fail('Unbekannte Aktion: '.$action, 404);
}
} catch(Throwable $e){
  fail('Serverfehler: '.$e->getMessage(),500);
}
