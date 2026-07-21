<?php
/**
 * ETAF — API-Router
 * Aufruf: backend/api.php?action=<name>  (POST, JSON-Body)
 * Antwort: JSON. Auth via Header X-Auth-Token (außer 'login').
 */
require_once __DIR__.'/lib.php';
require_once __DIR__.'/mailer.php';

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

  default:
    fail('Unbekannte Aktion: '.$action, 404);
}
} catch(Throwable $e){
  fail('Serverfehler: '.$e->getMessage(),500);
}
