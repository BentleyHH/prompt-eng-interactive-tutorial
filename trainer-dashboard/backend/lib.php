<?php
/** ETAF — gemeinsame Helfer: JSON-IO, Auth, State-Shaping */

require_once __DIR__.'/db.php';

function out($data, int $code=200): void {
  http_response_code($code);
  header('Content-Type: application/json; charset=utf-8');
  echo json_encode($data, JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES);
  exit;
}
function fail(string $msg, int $code=400): void { out(['ok'=>false,'error'=>$msg], $code); }

function body(): array {
  $raw=file_get_contents('php://input');
  if($raw==='') return $_POST ?: [];
  $j=json_decode($raw,true);
  return is_array($j)?$j:[];
}

function client_ip(): string { return $_SERVER['REMOTE_ADDR'] ?? 'cli'; }

/** Login mit PIN, gibt Session-Token zurück (mit einfachem Rate-Limit).
 *  Sperre: nach LOGIN_MAX Fehlversuchen ist der Login LOGIN_WINDOW Sekunden gesperrt. */
const LOGIN_MAX = 5;      // erlaubte Fehlversuche
const LOGIN_WINDOW = 300; // Sperr-/Zählfenster in Sekunden (5 Minuten)
function do_login(string $pin): array {
  $ip=client_ip();
  $row=q("SELECT cnt,window_start FROM login_attempts WHERE ip=?",[$ip])->fetch();
  $win=$row['window_start']??null; $cnt=(int)($row['cnt']??0);
  if($win && (strtotime($win) > time()-LOGIN_WINDOW) && $cnt>=LOGIN_MAX){
    $wait = (int)ceil((strtotime($win)+LOGIN_WINDOW - time())/60);
    fail('Zu viele Fehlversuche. Bitte in etwa '.max(1,$wait).' Minute(n) erneut probieren.',429);
  }
  $hash=config_get('pin_hash');
  if(!$hash || !password_verify($pin, $hash)){
    if(!$win || strtotime($win) <= time()-LOGIN_WINDOW){
      // neues Fenster
      if(is_sqlite()){
        q("INSERT INTO login_attempts(ip,cnt,window_start) VALUES(?,?,?)
           ON CONFLICT(ip) DO UPDATE SET cnt=1,window_start=excluded.window_start",[$ip,1,now()]);
      } else {
        q("INSERT INTO login_attempts(ip,cnt,window_start) VALUES(?,1,?)
           ON DUPLICATE KEY UPDATE cnt=1,window_start=VALUES(window_start)",[$ip,now()]);
      }
    } else {
      q("UPDATE login_attempts SET cnt=cnt+1 WHERE ip=?",[$ip]);
    }
    fail('Falscher PIN.',401);
  }
  // Erfolg: Zähler zurücksetzen, Token ausstellen
  q("DELETE FROM login_attempts WHERE ip=?",[$ip]);
  $tok=token(40);
  q("INSERT INTO sessions(token,created_at,last_seen) VALUES(?,?,?)",[$tok,now(),now()]);
  return ['ok'=>true,'token'=>$tok];
}

function auth_token(): ?string {
  $h=$_SERVER['HTTP_X_AUTH_TOKEN'] ?? ($_GET['token'] ?? '');
  return $h!=='' ? $h : null;
}
function require_auth(): void {
  $tok=auth_token();
  if(!$tok) fail('Nicht angemeldet.',401);
  $row=q("SELECT token,created_at FROM sessions WHERE token=?",[$tok])->fetch();
  if(!$row) fail('Sitzung ungültig.',401);
  $maxDays=(int)(cfg()['session_days']??14);
  if(strtotime($row['created_at']) < time()-$maxDays*86400){
    q("DELETE FROM sessions WHERE token=?",[$tok]);
    fail('Sitzung abgelaufen.',401);
  }
  q("UPDATE sessions SET last_seen=? WHERE token=?",[now(),$tok]);
}

/** Vollständiger State im Frontend-Format */
function get_state(): array {
  // Plan-Bestätigungen je Trainer (Einsatzübersicht)
  $planBy=[];
  foreach(q("SELECT * FROM plan_tokens")->fetchAll() as $p){
    $planBy[(string)$p['trainer_id']]=[
      'sentAt'=>$p['sent_at'], 'confirmedAt'=>$p['confirmed_at'],
      'status'=>$p['confirm_status'], 'note'=>$p['note'] ];
  }
  $trainers=array_map(function($r) use ($planBy){
    // Reisepass-Metadaten (ohne das Foto selbst — das lädt passport.image bei Bedarf)
    $pp=null;
    if( ($r['passport_expiry']??'')!=='' || ($r['passport_number']??'')!=='' || !empty($r['passport_file']) ){
      $pp=[
        'number'=>$r['passport_number']??'', 'name'=>$r['passport_name']??'',
        'nationality'=>$r['passport_nationality']??'', 'birthdate'=>$r['passport_birthdate']??'',
        'expiry'=>$r['passport_expiry']??'', 'notes'=>$r['passport_notes']??'',
        'updatedAt'=>$r['passport_updated_at']??'', 'remindedAt'=>$r['passport_reminded_at']??'',
        'hasFile'=>!empty($r['passport_file']),
      ];
    }
    return [
      'id'=>(string)$r['id'], 'name'=>$r['name'], 'email'=>$r['email'], 'phone'=>$r['phone'],
      'spec'=>json_decode($r['spec']?:'[]',true), 'region'=>$r['region'],
      'langs'=>json_decode($r['langs']?:'[]',true),
      'uae'=>(bool)$r['uae'], 'load'=>(int)$r['load_lvl'],
      'color'=>$r['color'], 'rating'=>$r['rating'],
      'plan'=>$planBy[(string)$r['id']] ?? null,
      'passport'=>$pp,
    ];
  }, q("SELECT * FROM trainers ORDER BY id")->fetchAll());

  // roster je training
  $reqs=q("SELECT training_id,trainer_id,status,reminder_count FROM requests")->fetchAll();
  $byT=[];
  foreach($reqs as $r){ $byT[(string)$r['training_id']][]=[
    'trainerId'=>(string)$r['trainer_id'],'status'=>$r['status'],
    'reminded'=>((int)($r['reminder_count']??0)>0), 'flight'=>null
  ]; }
  // Flug-/Zimmerdaten je Trainer an den Roster-Eintrag hängen
  foreach(q("SELECT * FROM travel")->fetchAll() as $tv){
    $tid=(string)$tv['training_id']; $trid=(string)$tv['trainer_id'];
    if(!isset($byT[$tid])) continue;
    foreach($byT[$tid] as &$e){
      if($e['trainerId']===$trid){ $e['flight']=[
        'arrival'=>$tv['arrival'],'departure'=>$tv['departure'],
        'flightOut'=>$tv['flight_out'],'flightReturn'=>$tv['flight_return'],
        'room'=>$tv['room'],'notes'=>$tv['notes'],
        'visaStatus'=>$tv['visa_status']??'none','passportExpiry'=>$tv['passport_expiry']??'',
        'visaNotes'=>$tv['visa_notes']??'']; }
    }
    unset($e);
  }

  $transByC=[];
  foreach(q("SELECT * FROM transfer_tokens")->fetchAll() as $tt){
    $transByC[(string)$tt['client_id']]=['sentAt'=>$tt['sent_at'],'confirmedAt'=>$tt['confirmed_at'],'note'=>$tt['note']];
  }
  $clients=array_map(function($r) use ($transByC){
    return ['id'=>$r['id'],'name'=>$r['name'],'short'=>$r['short'],
      'color'=>$r['color'],'cal'=>$r['cal'],'country'=>$r['country'],
      'contactName'=>$r['contact_name']??'','contactEmail'=>$r['contact_email']??'',
      'transfer'=>$transByC[(string)$r['id']] ?? null];
  }, q("SELECT * FROM clients ORDER BY sort_order,id")->fetchAll());

  // Material-Katalog
  $materials=array_map(function($r){
    return ['id'=>$r['id'],'name'=>$r['name'],'unit'=>$r['unit'],'cat'=>$r['cat']];
  }, q("SELECT * FROM materials ORDER BY sort_order,name")->fetchAll());
  // Material-Positionen je Training
  $matByT=[];
  foreach(q("SELECT * FROM training_materials")->fetchAll() as $m){
    $matByT[(string)$m['training_id']][]=['matId'=>$m['material_id'],'qty'=>(int)$m['qty']];
  }
  // Typ-Vorlagen (Schwerpunkt → Materialliste)
  $matPresets=[];
  foreach(q("SELECT * FROM material_presets")->fetchAll() as $p){
    $matPresets[$p['spec']][]=['matId'=>$p['material_id'],'qty'=>(int)$p['qty']];
  }

  $trainings=array_map(function($r) use ($byT,$matByT){
    return [
      'id'=>(string)$r['id'], 'clientId'=>$r['client_id']??null, 'code'=>$r['code']??null,
      'topic'=>$r['topic'], 'city'=>$r['city'], 'country'=>$r['country'],
      'kw'=>$r['kw'], 'month'=>$r['month'], 'spec'=>$r['spec'],
      'date'=>$r['start_date']??null, 'dateEnd'=>$r['end_date']??null,
      'need'=>(int)$r['need_cnt'], 'participants'=>(int)$r['participants'],
      'travel'=>[
        'venue'=>$r['venue']??'', 'hotel'=>$r['hotel']??'', 'hotelAddr'=>$r['hotel_addr']??'',
        'meetingPoint'=>$r['meeting_point']??'', 'contactName'=>$r['contact_name']??'',
        'contactPhone'=>$r['contact_phone']??'', 'dresscode'=>$r['dresscode']??'',
        'perDiem'=>$r['per_diem']??'', 'notes'=>$r['travel_notes']??'',
        'agenda'=>json_decode($r['agenda']?:'[]',true) ?: [],
      ],
      'materials'=>$matByT[(string)$r['id']] ?? [],
      'roster'=>$byT[(string)$r['id']] ?? [],
    ];
  }, q("SELECT * FROM trainings ORDER BY id")->fetchAll());

  $templates=array_map(function($r){
    return ['id'=>$r['id'],
      'de'=>['name'=>$r['de_name'],'subject'=>$r['de_subject'],'body'=>$r['de_body']],
      'en'=>['name'=>$r['en_name'],'subject'=>$r['en_subject'],'body'=>$r['en_body']]];
  }, q("SELECT * FROM templates ORDER BY id")->fetchAll());

  return ['ok'=>true,'lang'=>'de','emailLang'=>'en',
    'clients'=>$clients,'materials'=>$materials,'matPresets'=>$matPresets,
    'trainers'=>$trainers,'trainings'=>$trainings,'templates'=>$templates];
}

/** Platzhalter füllen */
function fill_tpl(string $s, array $tg, ?array $tr): string {
  $first = $tr ? explode(' ', preg_replace('/^Dr\.\s*/','',$tr['name']))[0] : '[Name]';
  return strtr($s, [
    '{{firstName}}'=>$first, '{{topic}}'=>$tg['topic'], '{{city}}'=>$tg['city'],
    '{{country}}'=>$tg['country'], '{{kw}}'=>$tg['kw'], '{{month}}'=>$tg['month'],
    '{{teamSize}}'=>(string)$tg['need_cnt'],
  ]);
}

/** KI-Vorauswahl-Score (serverseitige Portierung der Frontend-Heuristik). */
function php_score(array $tr, array $tg): int {
  $s=40;
  $spec=json_decode($tr['spec']?:'[]',true) ?: [];
  $langs=json_decode($tr['langs']?:'[]',true) ?: [];
  if(in_array($tg['spec'],$spec,true)) $s+=34;
  if(($tg['country']??'')==='UAE' && (int)($tr['uae']??0)===1) $s+=14;
  if(($tg['country']??'')==='UAE' && in_array('AR',$langs,true)) $s+=6;
  if(($tg['country']??'')!=='UAE' && strpos($tr['region']??'','DE')===0) $s+=8;
  $s += (3-(int)($tr['load_lvl']??0))*4;
  $s += ((float)($tr['rating']??4)-4)*10;
  return max(35,min(99,(int)round($s)));
}
/** Bester noch nicht angefragter Trainer für ein Training. */
function next_candidate(int $tgId): ?array {
  $tg=q("SELECT * FROM trainings WHERE id=?",[$tgId])->fetch();
  if(!$tg) return null;
  $taken=q("SELECT trainer_id FROM requests WHERE training_id=?",[$tgId])->fetchAll(PDO::FETCH_COLUMN);
  $best=null; $bestScore=-1;
  foreach(q("SELECT * FROM trainers")->fetchAll() as $tr){
    if(in_array($tr['id'],$taken)) continue;
    $sc=php_score($tr,$tg);
    if($sc>$bestScore){ $bestScore=$sc; $best=$tr; }
  }
  return $best;
}

/** Alle Einsätze eines Trainers (zugesagt/vielleicht/angefragt), inkl. Reisedaten, nach Datum. */
function trainer_schedule(int $trId): array {
  return q("SELECT t.*, r.status AS rstatus,
      tv.arrival, tv.departure, tv.flight_out, tv.flight_return, tv.room,
      tv.visa_status, tv.passport_expiry
    FROM requests r JOIN trainings t ON t.id=r.training_id
    LEFT JOIN travel tv ON tv.training_id=t.id AND tv.trainer_id=r.trainer_id
    WHERE r.trainer_id=? AND r.status IN ('yes','confirmed','maybe','asked')
    ORDER BY (t.start_date IS NULL), t.start_date, t.id", [$trId])->fetchAll();
}
/** Datum "YYYY-MM-DD" in Teile zerlegen. */
function fmt_parse(?string $s){ if($s && preg_match('/^(\d{4})-(\d{2})-(\d{2})/',$s,$m)) return ['y'=>(int)$m[1],'mo'=>(int)$m[2],'d'=>(int)$m[3]]; return null; }
/** Zeitraum als echtes Datum: "13.–20. März 2026" (de) / "13–20 March 2026" (en). */
function fmt_date_range(?string $s, ?string $e, string $lang): string {
  $mon = $lang==='de'
    ? ['','Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember']
    : ['','January','February','March','April','May','June','July','August','September','October','November','December'];
  $P=fmt_parse($s); if(!$P) return '';
  $Q=fmt_parse($e);
  $dm=function($x) use($mon,$lang){ return $lang==='de' ? $x['d'].'. '.$mon[$x['mo']] : $x['d'].' '.$mon[$x['mo']]; };
  if(!$Q || ($P['y']==$Q['y']&&$P['mo']==$Q['mo']&&$P['d']==$Q['d'])) return $dm($P).' '.$P['y'];
  if($P['y']==$Q['y']&&$P['mo']==$Q['mo']) return $lang==='de' ? $P['d'].'.–'.$Q['d'].'. '.$mon[$P['mo']].' '.$P['y'] : $P['d'].'–'.$Q['d'].' '.$mon[$P['mo']].' '.$P['y'];
  return $dm($P).' – '.$dm($Q).' '.$Q['y'];
}
/** Reisefenster (ein Tag vor Beginn bis ein Tag nach Ende) als Datumsbereich. */
function travel_window(?string $s, ?string $e, string $lang): string {
  if(!$s) return '';
  try{ $a=new DateTime($s); $a->modify('-1 day'); $b=new DateTime($e?:$s); $b->modify('+1 day'); }
  catch(Throwable $x){ return ''; }
  return fmt_date_range($a->format('Y-m-d'), $b->format('Y-m-d'), $lang);
}

/** Kurze Reise-Zeile aus einem Schedule-Datensatz (nur vorhandene Felder). */
function travel_line(array $r, string $lang): string {
  $L = $lang==='de'
    ? ['arr'=>'Anreise','dep'=>'Abreise','out'=>'Hinflug','ret'=>'Rückflug','hotel'=>'Hotel','room'=>'Zimmer','visa'=>'Visum','pass'=>'Pass gültig bis']
    : ['arr'=>'Arrival','dep'=>'Departure','out'=>'Outbound','ret'=>'Return','hotel'=>'Hotel','room'=>'Room','visa'=>'Visa','pass'=>'Passport until'];
  $vL = $lang==='de'
    ? ['needed'=>'nötig','applied'=>'beantragt','approved'=>'genehmigt','rejected'=>'abgelehnt']
    : ['needed'=>'needed','applied'=>'applied','approved'=>'approved','rejected'=>'rejected'];
  $p=[];
  if(!empty($r['arrival']))        $p[]=$L['arr'].' '.$r['arrival'];
  if(!empty($r['departure']))      $p[]=$L['dep'].' '.$r['departure'];
  if(!empty($r['flight_out']))     $p[]=$L['out'].' '.$r['flight_out'];
  if(!empty($r['flight_return']))  $p[]=$L['ret'].' '.$r['flight_return'];
  if(!empty($r['hotel']))          $p[]=$L['hotel'].' '.$r['hotel'];
  if(!empty($r['room']))           $p[]=$L['room'].' '.$r['room'];
  $vs=$r['visa_status']??'none';   if($vs && $vs!=='none') $p[]=$L['visa'].': '.($vL[$vs]??$vs);
  if(!empty($r['passport_expiry']))$p[]=$L['pass'].' '.$r['passport_expiry'];
  return implode(' · ', array_map(fn($x)=>htmlspecialchars($x, ENT_QUOTES, 'UTF-8'), $p));
}
/** Transfer-/Abholliste eines Kunden: bestätigte Trainer mit Reisedaten. */
function client_transfer_list(string $clientId): array {
  return q("SELECT t.topic, t.city, t.country, t.kw, t.start_date, t.end_date, t.hotel,
      tr.name AS trainer, tr.phone,
      tv.arrival, tv.departure, tv.flight_out, tv.flight_return, tv.room
    FROM requests r
    JOIN trainings t ON t.id=r.training_id
    JOIN trainers tr ON tr.id=r.trainer_id
    LEFT JOIN travel tv ON tv.training_id=t.id AND tv.trainer_id=r.trainer_id
    WHERE t.client_id=? AND r.status IN ('yes','confirmed')
    ORDER BY (t.start_date IS NULL), t.start_date, tr.name", [$clientId])->fetchAll();
}

/** Kalenderwoche sprachabhängig: "KW 20" (de) → "Week 20" (en). */
function kw_label(?string $kw, string $lang): string {
  $kw=(string)$kw;
  return $lang==='en' ? preg_replace('/^\s*KW\s*/u','Week ',$kw) : $kw;
}

/** Klartext-Label für einen Status (de/en). */
function status_word(string $st, string $lang): string {
  $de=['yes'=>'Zugesagt','confirmed'=>'Bestätigt','maybe'=>'Vielleicht','asked'=>'Angefragt'];
  $en=['yes'=>'Confirmed','confirmed'=>'Confirmed','maybe'=>'Maybe','asked'=>'Requested'];
  $m=$lang==='de'?$de:$en; return $m[$st] ?? $st;
}

function base_url(): string {
  $c=cfg();
  if(!empty($c['base_url'])) return rtrim($c['base_url'],'/');
  $https=(!empty($_SERVER['HTTPS'])&&$_SERVER['HTTPS']!=='off')||($_SERVER['SERVER_PORT']??'')==='443';
  $host=$_SERVER['HTTP_HOST']??'localhost';
  $dir=rtrim(dirname($_SERVER['SCRIPT_NAME']??'/'),'/'); // .../backend
  return ($https?'https':'http').'://'.$host.$dir;
}
