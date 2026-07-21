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
      $in['color']??'#3E4852', (string)($in['rating']??'4.5')];
    if($id){
      q("UPDATE trainers SET name=?,email=?,phone=?,spec=?,region=?,langs=?,uae=?,load_lvl=?,color=?,rating=? WHERE id=?",
        array_merge($fields,[$id]));
    } else {
      q("INSERT INTO trainers(name,email,phone,spec,region,langs,uae,load_lvl,color,rating,created_at)
         VALUES(?,?,?,?,?,?,?,?,?,?,?)", array_merge($fields,[now()]));
      $id=db()->lastInsertId();
    }
    out(['ok'=>true,'id'=>(string)$id]);

  case 'trainer.delete':
    require_auth();
    q("DELETE FROM trainers WHERE id=?",[$in['id']??0]);
    out(['ok'=>true]);

  /* ---- Training anlegen/ändern ---- */
  case 'training.save':
    require_auth();
    $id=$in['id']??null;
    $f=[$in['topic']??'', $in['city']??'', $in['country']??'', $in['kw']??'', $in['month']??'',
        $in['spec']??'', (int)($in['need']??5), (int)($in['participants']??0)];
    if($id){
      q("UPDATE trainings SET topic=?,city=?,country=?,kw=?,month=?,spec=?,need_cnt=?,participants=? WHERE id=?",
        array_merge($f,[$id]));
    } else {
      q("INSERT INTO trainings(topic,city,country,kw,month,spec,need_cnt,participants,created_at)
         VALUES(?,?,?,?,?,?,?,?,?)", array_merge($f,[now()]));
      $id=db()->lastInsertId();
    }
    out(['ok'=>true,'id'=>(string)$id]);

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

  /* ---- Anfrage(n) versenden: Kern des Rückkanals ---- */
  case 'request.create':
    require_auth();
    $tgId=$in['training']; $recips=$in['recipients']??[]; $lang=($in['lang']??'en')==='de'?'de':'en';
    $subjTpl=$in['subject']??null; $bodyTpl=$in['body']??null;
    $tg=q("SELECT * FROM trainings WHERE id=?",[$tgId])->fetch();
    if(!$tg) fail('Training nicht gefunden.',404);
    $c=cfg(); $sent=0;
    foreach($recips as $trId){
      $tr=q("SELECT * FROM trainers WHERE id=?",[$trId])->fetch();
      if(!$tr) continue;
      $tok=token(40);
      // Request-Zeile anlegen/aktualisieren
      $ex=q("SELECT id FROM requests WHERE training_id=? AND trainer_id=?",[$tgId,$trId])->fetch();
      if($ex) q("UPDATE requests SET status='asked', lang=?, tok=?, created_at=?, responded_at=NULL WHERE id=?",
        [$lang,$tok,now(),$ex['id']]);
      else q("INSERT INTO requests(training_id,trainer_id,status,lang,tok,created_at) VALUES(?,?, 'asked',?,?,?)",
        [$tgId,$trId,$lang,$tok,now()]);
      // Text füllen
      $subject=fill_tpl($subjTpl ?? 'Anfrage — {{topic}}', $tg, $tr);
      $bodyText=fill_tpl($bodyTpl ?? '', $tg, $tr);
      $html=email_html($bodyText, response_buttons($tok,$lang));
      $ok=send_email($tr['email'],$tr['name'],$subject,$html);
      q("INSERT INTO email_log(training_id,trainer_id,to_email,subject,body,lang,status,created_at)
         VALUES(?,?,?,?,?,?,?,?)",[$tgId,$trId,$tr['email'],$subject,$bodyText,$lang,$ok?($c['mail_mode']==='log'?'logged':'sent'):'failed',now()]);
      if($ok) $sent++;
    }
    out(['ok'=>true,'sent'=>$sent,'total'=>count($recips)]);

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

  /* ---- Automatik-Einstellungen ---- */
  case 'settings.get':
    require_auth();
    out(['ok'=>true,'settings'=>[
      'reminder_hours'=>(int)(config_get('reminder_hours')??48),
      'escalate_hours'=>(int)(config_get('escalate_hours')??72),
      'auto_advance'=>(config_get('auto_advance')==='1'),
      'ai_enabled'=>trim(cfg()['anthropic_key']??'')!=='',
    ]]);

  case 'settings.save':
    require_auth();
    if(isset($in['reminder_hours'])) config_set('reminder_hours',(string)max(1,(int)$in['reminder_hours']));
    if(isset($in['escalate_hours'])) config_set('escalate_hours',(string)max(1,(int)$in['escalate_hours']));
    if(isset($in['auto_advance']))   config_set('auto_advance', !empty($in['auto_advance'])?'1':'0');
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
    $f=[$in['arrival']??'', $in['departure']??'', $in['flightOut']??'', $in['flightReturn']??'', $in['room']??'', $in['notes']??''];
    if($ex) q("UPDATE travel SET arrival=?,departure=?,flight_out=?,flight_return=?,room=?,notes=?,updated_at=? WHERE id=?",
      array_merge($f,[now(),$ex['id']]));
    else q("INSERT INTO travel(training_id,trainer_id,arrival,departure,flight_out,flight_return,room,notes,updated_at)
            VALUES(?,?,?,?,?,?,?,?,?)", array_merge([$tgId,$trId],$f,[now()]));
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
