<?php
/**
 * ETAF — API-Router
 * Aufruf: backend/api.php?action=<name>  (POST, JSON-Body)
 * Antwort: JSON. Auth via Header X-Auth-Token (außer 'login').
 */
require_once __DIR__.'/lib.php';
require_once __DIR__.'/mailer.php';
require_once __DIR__.'/ai.php';
require_once __DIR__.'/automation.php';

header('Access-Control-Allow-Origin: '.($_SERVER['HTTP_ORIGIN'] ?? '*'));
header('Access-Control-Allow-Headers: Content-Type, X-Auth-Token');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
if(($_SERVER['REQUEST_METHOD']??'')==='OPTIONS') { http_response_code(204); exit; }

try { ensure_schema(); }
catch(Throwable $e){ fail('DB-Fehler: '.$e->getMessage(),500); }

$action = $_GET['action'] ?? '';
$in = body();

try {
switch($action){

  case 'login':
    out(do_login((string)($in['pin']??'')));

  case 'logout':
    if($t=auth_token()) q("DELETE FROM sessions WHERE token=?",[$t]);
    out(['ok'=>true]);

  case 'state':
    require_auth();
    out(get_state());

  /* ---- Trainer anlegen/ändern ---- */
  case 'trainer.save':
    require_auth();
    $id=$in['id']??null;
    $fields=[$in['name']??'', $in['email']??'', $in['phone']??'',
      json_encode($in['spec']??[],JSON_UNESCAPED_UNICODE), $in['region']??'',
      json_encode($in['langs']??[]), !empty($in['uae'])?1:0, (int)($in['load']??0),
      $in['color']??'#3E4852', (string)($in['rating']??'4.5'), (string)($in['notes']??'')];
    if($id){
      q("UPDATE trainers SET name=?,email=?,phone=?,spec=?,region=?,langs=?,uae=?,load_lvl=?,color=?,rating=?,notes=? WHERE id=?",
        array_merge($fields,[$id]));
    } else {
      q("INSERT INTO trainers(name,email,phone,spec,region,langs,uae,load_lvl,color,rating,notes,created_at)
         VALUES(?,?,?,?,?,?,?,?,?,?,?,?)", array_merge($fields,[now()]));
      $id=db()->lastInsertId();
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
    out(['ok'=>true]);

  /* ---- Kunde anlegen/ändern (Upsert per id) ---- */
  case 'client.save':
    require_auth();
    $cid=$in['id']??''; if($cid==='') fail('Keine Kunden-ID.');
    $f=[$in['name']??'', $in['short']??'', $in['color']??'#3E4852', $in['cal']??'slategray', $in['country']??'',
        $in['contactName']??'', $in['contactEmail']??''];
    $ex=q("SELECT id FROM clients WHERE id=?",[$cid])->fetch();
    if($ex) q("UPDATE clients SET name=?,short=?,color=?,cal=?,country=?,contact_name=?,contact_email=? WHERE id=?", array_merge($f,[$cid]));
    else    q("INSERT INTO clients(id,name,short,color,cal,country,contact_name,contact_email,sort_order) VALUES(?,?,?,?,?,?,?,?, (SELECT COALESCE(MAX(sort_order),0)+1 FROM clients c))",
              array_merge([$cid],$f));
    out(['ok'=>true,'id'=>$cid]);

  case 'client.delete':
    require_auth();
    $cid=$in['id']??'';
    $cnt=(int)q("SELECT COUNT(*) c FROM clients")->fetch()['c'];
    if($cnt<=1) fail('Der letzte Kunde kann nicht entfernt werden.');
    $fb=q("SELECT id FROM clients WHERE id<>? ORDER BY sort_order,id LIMIT 1",[$cid])->fetch();
    if($fb) q("UPDATE trainings SET client_id=? WHERE client_id=?",[$fb['id'],$cid]);
    q("DELETE FROM clients WHERE id=?",[$cid]);
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
      q("UPDATE trainings SET client_id=?,topic=?,city=?,country=?,kw=?,month=?,start_date=?,end_date=?,code=?,spec=?,need_cnt=?,participants=? WHERE id=?",
        array_merge($f,[$id]));
    } else {
      q("INSERT INTO trainings(client_id,topic,city,country,kw,month,start_date,end_date,code,spec,need_cnt,participants,created_at)
         VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)", array_merge($f,[now()]));
      $id=db()->lastInsertId();
      if($spec!==''){
        foreach(q("SELECT material_id,qty FROM material_presets WHERE spec=?",[$spec])->fetchAll() as $p){
          q("INSERT INTO training_materials(training_id,material_id,qty) VALUES(?,?,?)",[$id,$p['material_id'],$p['qty']]);
          $prefilled++;
        }
      }
    }
    out(['ok'=>true,'id'=>(string)$id,'prefilled'=>$prefilled]);

  case 'training.delete':
    require_auth();
    $tid=$in['id']??0;
    q("DELETE FROM trainings WHERE id=?",[$tid]);
    q("DELETE FROM requests WHERE training_id=?",[$tid]);
    q("DELETE FROM travel WHERE training_id=?",[$tid]);
    q("DELETE FROM training_materials WHERE training_id=?",[$tid]);
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
      $subj = $lang==='de' ? 'Terminänderung — '.$tg['topic'].' ('.$tg['city'].')' : 'Schedule change — '.$tg['topic'].' ('.$tg['city'].')';
      $intro = $lang==='de'
        ? "Hallo $first,\n\nkurze Info: Der Termin für „{$tg['topic']}“ in {$tg['city']} hat sich geändert.\nNeuer Zeitraum: $newWhen.\n\n"
          .($mode==='reask' ? "Bitte bestätige über die Buttons unten, ob du zum neuen Termin verfügbar bist." : "Deine Zusage bleibt bestehen — falls der neue Termin nicht passt, melde dich bitte kurz.")
        : "Hi $first,\n\nquick note: the schedule for \"{$tg['topic']}\" in {$tg['city']} has changed.\nNew period: $newWhen.\n\n"
          .($mode==='reask' ? "Please confirm your availability for the new date via the buttons below." : "Your commitment stands — if the new date doesn't work, please let us know.");
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
      .($tgRow?' — '.$tgRow['topic'].' ('.$tgRow['city'].')':''));
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
      $subject=fill_tpl($subjTpl ?? 'Anfrage — {{topic}}', $tg, $tr);
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
      ? "Hallo $first,\n\nhier ist deine persönliche Einsatzübersicht. Bitte prüfe kurz, ob alles stimmt, und bestätige den Plan über den Button unten — oder melde uns, falls etwas nicht passt."
      : "Hi $first,\n\nhere is your personal assignment overview. Please check that everything is correct and confirm the plan via the button below — or let us know if something doesn't fit.";
    $cta=$lang==='de' ? 'Einsatzplan ansehen & bestätigen' : 'View & confirm your plan';
    $url=base_url().'/plan.php?token='.$tok;
    $subject=$lang==='de' ? 'Deine Einsatzübersicht — bitte bestätigen' : 'Your assignment overview — please confirm';
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
        $subj=$lang==='de' ? 'Antwort auf deine Rückmeldung — Einsatzübersicht'
                           : 'Reply to your feedback — assignment overview';
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
        if(!preg_match('#^data:image/#',$img)) fail('Ungültiges Bildformat.');
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
      'ai_enabled'=>trim(cfg()['anthropic_key']??'')!=='',
    ]]);

  case 'settings.save':
    require_auth();
    if(isset($in['reminder_hours'])) config_set('reminder_hours',(string)max(1,(int)$in['reminder_hours']));
    if(isset($in['escalate_hours'])) config_set('escalate_hours',(string)max(1,(int)$in['escalate_hours']));
    if(isset($in['auto_advance']))   config_set('auto_advance', !empty($in['auto_advance'])?'1':'0');
    if(isset($in['passport_lead_days'])) config_set('passport_lead_days',(string)max(14,(int)$in['passport_lead_days']));
    out(['ok'=>true]);

  /* ---- Login-PIN ändern (im Dashboard) ---- */
  case 'pin.change':
    require_auth();
    $cur = (string)($in['current'] ?? '');
    $new = trim((string)($in['new'] ?? ''));
    $hash = config_get('pin_hash');
    if($hash && !password_verify($cur, $hash)) fail('Aktueller PIN ist nicht korrekt.',401);
    if(!preg_match('/^\d{4,8}$/', $new)) fail('Neuer PIN muss 4–8 Ziffern haben.');
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
    $tgId=$in['training']??0; $trId=$in['trainer']??0;
    $tg=q("SELECT * FROM trainings WHERE id=?",[$tgId])->fetch();
    $tr=q("SELECT * FROM trainers WHERE id=?",[$trId])->fetch();
    if(!$tg||!$tr) fail('Training oder Trainer nicht gefunden.',404);
    $rq=q("SELECT * FROM requests WHERE training_id=? AND trainer_id=?",[$tgId,$trId])->fetch();
    $lang=($rq['lang']??'en')==='de'?'de':'en';
    $tok=$rq['tok']??'';
    if(!$tok){ $tok=token(40);
      q("INSERT INTO requests(training_id,trainer_id,status,lang,tok,created_at) VALUES(?,?, 'yes',?,?,?)",[$tgId,$trId,$lang,$tok,now()]); }
    $link=base_url().'/agenda.php?token='.$tok;
    $subj=fill_tpl($lang==='de'?'Deine Reise-Agenda — {{topic}} in {{city}}':'Your travel agenda — {{topic}} in {{city}}',$tg,$tr);
    $intro=fill_tpl($lang==='de'
      ? "Hallo {{firstName}},\n\nanbei deine persönliche Reise-Agenda für „{{topic}}“ in {{city}} ({{kw}}). Über den Button kannst du sie öffnen und ausdrucken."
      : "Hi {{firstName}},\n\nhere is your personal travel agenda for \"{{topic}}\" in {{city}} ({{kw}}). Open and print it via the button below.",
      $tg,$tr);
    $btnLabel=$lang==='de'?'📄 Agenda öffnen & drucken':'📄 Open & print agenda';
    $btns='<div style="margin:22px 0"><a href="'.$link.'" style="display:inline-block;padding:12px 20px;'
      .'border-radius:8px;background:#3e4852;color:#fff;font:600 14px system-ui,Arial,sans-serif;text-decoration:none">'
      .$btnLabel.'</a></div>';
    $ok=send_email($tr['email'],$tr['name'],$subj,email_html($intro,$btns));
    q("INSERT INTO email_log(training_id,trainer_id,to_email,subject,body,lang,status,created_at)
       VALUES(?,?,?,?,?,?,?,?)",[$tgId,$trId,$tr['email'],$subj,$intro."\n".$link,$lang,$ok?'sent':'failed',now()]);
    out(['ok'=>true,'link'=>$link,'sent'=>$ok?1:0]);

  default:
    fail('Unbekannte Aktion: '.$action, 404);
}
} catch(Throwable $e){
  fail('Serverfehler: '.$e->getMessage(),500);
}
