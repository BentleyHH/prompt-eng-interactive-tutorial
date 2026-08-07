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
/** Zählt Fehlversuche pro IP und sperrt nach LOGIN_MAX für LOGIN_WINDOW Sekunden. */
function login_guard_check(): void {
  $ip=client_ip();
  $row=q("SELECT cnt,window_start FROM login_attempts WHERE ip=?",[$ip])->fetch();
  $win=$row['window_start']??null; $cnt=(int)($row['cnt']??0);
  if($win && (ts($win) > time()-LOGIN_WINDOW) && $cnt>=LOGIN_MAX){
    $wait=(int)ceil((ts($win)+LOGIN_WINDOW-time())/60);
    fail('Zu viele Fehlversuche. Bitte in etwa '.max(1,$wait).' Minute(n) erneut probieren.',429);
  }
}
function login_guard_fail(): void {
  $ip=client_ip();
  $row=q("SELECT cnt,window_start FROM login_attempts WHERE ip=?",[$ip])->fetch();
  $win=$row['window_start']??null;
  if(!$win || ts($win) <= time()-LOGIN_WINDOW){
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
}
function login_guard_reset(): void { q("DELETE FROM login_attempts WHERE ip=?",[client_ip()]); }

/** Sitzung ausstellen (optional an einen Benutzer gebunden). */
function issue_session(?int $userId): string {
  $tok=token(40);
  q("INSERT INTO sessions(token,user_id,created_at,last_seen) VALUES(?,?,?,?)",[$tok,$userId,now(),now()]);
  return $tok;
}

function user_count(): int { return (int)q("SELECT COUNT(*) c FROM users WHERE active=1")->fetch()['c']; }
function admin_count(): int { return (int)q("SELECT COUNT(*) c FROM users WHERE active=1 AND role='admin'")->fetch()['c']; }

/** Gültigkeit der Einladungs-/Zurücksetz-Links in Minuten. */
const RESET_TTL_MIN = 60;

/** Login mit E-Mail + Passwort. */
function do_login_email(string $email, string $pass): array {
  login_guard_check();
  $email=strtolower(trim($email));
  $u=$email!=='' ? q("SELECT * FROM users WHERE email=?",[$email])->fetch() : null;
  // Immer dieselbe Meldung — verrät nicht, ob die Adresse existiert.
  if(!$u || !$u['pass_hash'] || !password_verify($pass, $u['pass_hash']) || (int)$u['active']!==1){
    login_guard_fail();
    fail('E-Mail oder Passwort ist nicht korrekt.',401);
  }
  login_guard_reset();
  q("UPDATE users SET last_login=? WHERE id=?",[now(),$u['id']]);
  $tok=issue_session((int)$u['id']);
  audit_as($u,'login','user',(string)$u['id'],'angemeldet');
  return ['ok'=>true,'token'=>$tok,'user'=>user_public($u)];
}

/** Login mit PIN — nur zur Ersteinrichtung, solange noch kein Konto existiert. */
function do_login(string $pin): array {
  if(user_count()>0){
    fail('Der PIN-Zugang ist deaktiviert, seit Benutzerkonten eingerichtet sind. Bitte mit E-Mail und Passwort anmelden.',403);
  }
  login_guard_check();
  $hash=config_get('pin_hash');
  if(!$hash || !password_verify($pin, $hash)){ login_guard_fail(); fail('Falscher PIN.',401); }
  login_guard_reset();
  return ['ok'=>true,'token'=>issue_session(null),'setup'=>true];
}

function user_public(array $u): array {
  return ['id'=>(string)$u['id'],'email'=>$u['email'],'name'=>$u['name'],
          'role'=>$u['role']??'editor','active'=>((int)($u['active']??1))===1,
          'lastLogin'=>$u['last_login']??'',
          'digestFreq'=>$u['digest_freq']??'off','digestDay'=>(int)($u['digest_day']??1),
          'digestParts'=>json_decode(($u['digest_parts']??'')?:'[]',true)?:[]];
}

function auth_token(): ?string {
  $h=$_SERVER['HTTP_X_AUTH_TOKEN'] ?? ($_GET['token'] ?? '');
  return $h!=='' ? $h : null;
}

/** Angemeldeter Benutzer der aktuellen Sitzung (null im Einrichtungsmodus). */
function current_user(): ?array {
  static $cached=false, $u=null;
  if($cached!==false) return $u;
  $cached=true;
  $tok=auth_token(); if(!$tok) return $u=null;
  $s=q("SELECT user_id FROM sessions WHERE token=?",[$tok])->fetch();
  if(!$s || !$s['user_id']) return $u=null;
  $row=q("SELECT * FROM users WHERE id=? AND active=1",[$s['user_id']])->fetch();
  return $u = $row ?: null;
}

function require_auth(): void {
  $tok=auth_token();
  if(!$tok) fail('Nicht angemeldet.',401);
  $row=q("SELECT token,created_at,user_id FROM sessions WHERE token=?",[$tok])->fetch();
  if(!$row) fail('Sitzung ungültig.',401);
  $maxDays=(int)(cfg()['session_days']??14);
  if(ts($row['created_at']) < time()-$maxDays*86400){
    q("DELETE FROM sessions WHERE token=?",[$tok]);
    fail('Sitzung abgelaufen.',401);
  }
  // Sitzung ohne Benutzer ist nur gültig, solange noch kein Konto existiert (Ersteinrichtung).
  if(!$row['user_id'] && user_count()>0){
    q("DELETE FROM sessions WHERE token=?",[$tok]);
    fail('Bitte neu anmelden — es gibt jetzt Benutzerkonten.',401);
  }
  if($row['user_id'] && !current_user()){
    q("DELETE FROM sessions WHERE token=?",[$tok]);
    fail('Dieses Konto ist deaktiviert.',403);
  }
  q("UPDATE sessions SET last_seen=? WHERE token=?",[now(),$tok]);
}

/** Nur für Admins (im Einrichtungsmodus ohne Konten erlaubt). */
function require_admin(): void {
  require_auth();
  $u=current_user();
  if(!$u){ if(user_count()===0) return; fail('Nur für Administratoren.',403); }
  if(($u['role']??'editor')!=='admin') fail('Dafür fehlen dir die Rechte (nur Administratoren).',403);
}

function is_admin(): bool {
  $u=current_user();
  return $u ? (($u['role']??'editor')==='admin') : (user_count()===0);
}

/** Änderungsprotokoll schreiben. */
function audit_as(?array $u, string $action, string $entity='', string $entityId='', string $summary=''): void {
  try{
    q("INSERT INTO activity(user_id,user_name,action,entity,entity_id,summary,created_at)
       VALUES(?,?,?,?,?,?,?)",
      [$u['id']??null, $u['name']??($u['email']??'Einrichtung'), $action, $entity, $entityId,
       mb_substr($summary,0,240), now()]);
  }catch(Throwable $e){ /* Protokoll darf nie den Vorgang blockieren */ }
}
function audit(string $action, string $entity='', string $entityId='', string $summary=''): void {
  audit_as(current_user(), $action, $entity, $entityId, $summary);
}
/** Anzeigename des aktuellen Benutzers (für „zuletzt geändert von“). */
function actor_name(): string {
  $u=current_user();
  return $u ? ($u['name'] ?: $u['email']) : 'Einrichtung';
}

/**
 * Optimistisches Sperren: prüft, ob der Datensatz seit dem Laden verändert wurde.
 * $expected = Version, die der Browser geladen hatte (null/0 = Prüfung überspringen).
 * Bricht mit 409 ab und meldet, wer wann geändert hat.
 */
function check_version(string $table, $id, $expected, bool $force=false): void {
  if($force || $expected===null || $expected==='' ) return;
  $row=q("SELECT version,updated_at,updated_by FROM $table WHERE id=?",[$id])->fetch();
  if(!$row) return;                                  // neu oder gelöscht → nichts zu prüfen
  $cur=(int)($row['version']??1);
  if($cur === (int)$expected) return;
  out(['ok'=>false,'conflict'=>true,
       'error'=>'Dieser Eintrag wurde inzwischen geändert.',
       'by'=>$row['updated_by']??'', 'at'=>$row['updated_at']??'', 'version'=>$cur], 409);
}
/** Version hochzählen + „zuletzt geändert von/am“ setzen. */
function bump_version(string $table, $id): void {
  try{ q("UPDATE $table SET version=COALESCE(version,1)+1, updated_at=?, updated_by=? WHERE id=?",
        [now(), actor_name(), $id]); }catch(Throwable $e){}
}

/** Vollständiger State im Frontend-Format */
function get_state(): array {
  // Plan-Bestätigungen je Trainer (Einsatzübersicht)
  $planBy=[];
  foreach(q("SELECT * FROM plan_tokens")->fetchAll() as $p){
    $planBy[(string)$p['trainer_id']]=[
      'sentAt'=>$p['sent_at'], 'confirmedAt'=>$p['confirmed_at'],
      'status'=>$p['confirm_status'], 'note'=>$p['note'],
      'resolvedAt'=>$p['resolved_at']??null ];
  }
  // Interne Bewertungen je Trainer (Historie: Training → Sterne + Notiz)
  $revBy=[];
  foreach(q("SELECT * FROM trainer_reviews")->fetchAll() as $rv){
    $revBy[(string)$rv['trainer_id']][]=[
      'trainingId'=>(string)$rv['training_id'], 'label'=>$rv['label']??'',
      'stars'=>(int)$rv['stars'], 'note'=>$rv['note']??'', 'at'=>$rv['updated_at']??'' ];
  }
  $trainers=array_map(function($r) use ($planBy,$revBy){
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
      'notes'=>$r['notes']??'',
      'prefLang'=>$r['pref_lang']??'',
      'reviews'=>$revBy[(string)$r['id']] ?? [],
      'version'=>(int)($r['version']??1), 'updatedAt'=>$r['updated_at']??'', 'updatedBy'=>$r['updated_by']??'',
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

  // Wochenplan-Kurzstand je Training (PPT-Zähler ohne Orga-/Deliverable-Kacheln)
  $wkAgg=[];
  try{
    foreach(q("SELECT training_id, COUNT(*) n,
        SUM(CASE WHEN ppt='vorhanden' THEN 1 ELSE 0 END) done,
        SUM(CASE WHEN stype NOT IN('orga','deliverable') THEN 1 ELSE 0 END) rel
      FROM training_sessions GROUP BY training_id")->fetchAll() as $a){
      $wkAgg[(string)$a['training_id']]=['sessions'=>(int)$a['n'],'pptAll'=>(int)$a['rel'],'pptDone'=>(int)$a['done']];
    }
  }catch(Throwable $e){}

  $trainings=array_map(function($r) use ($byT,$matByT,$wkAgg){
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
      'stage'=>$r['stage']??'', 'star'=>(int)($r['star']??0),
      'deliverable'=>$r['deliverable']??'', 'deliverableEn'=>$r['deliverable_en']??'',
      'week'=>$wkAgg[(string)$r['id']] ?? null,
      // für den Überschreib-Schutz
      'version'=>(int)($r['version']??1), 'updatedAt'=>$r['updated_at']??'', 'updatedBy'=>$r['updated_by']??'',
    ];
  }, q("SELECT * FROM trainings ORDER BY id")->fetchAll());

  $templates=array_map(function($r){
    return ['id'=>$r['id'],
      'de'=>['name'=>$r['de_name'],'subject'=>$r['de_subject'],'body'=>$r['de_body']],
      'en'=>['name'=>$r['en_name'],'subject'=>$r['en_subject'],'body'=>$r['en_body']]];
  }, q("SELECT * FROM templates ORDER BY id")->fetchAll());

  $me=current_user();
  // Anzahl ungeprüfter Flugpost-Mails (für den Badge in der Navigation)
  $flightNew=0;
  try{ $flightNew=(int)q("SELECT COUNT(*) c FROM travel_mail WHERE status='new'")->fetch()['c']; }catch(Throwable $e){}
  return ['ok'=>true,'lang'=>'de','emailLang'=>'en','flightMailNew'=>$flightNew,
    'clients'=>$clients,'materials'=>$materials,'matPresets'=>$matPresets,
    'trainers'=>$trainers,'trainings'=>$trainings,'templates'=>$templates,
    'me'=>$me?user_public($me):null,
    'setupMode'=>(user_count()===0)];
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

/** Sessions eines Trainers in einer Trainingswoche (aus dem Wochenplan),
 *  in Wochenreihenfolge — für Agenda-Seite und Agenda-E-Mail. */
function trainer_week_sessions(int $tgId, int $trId): array {
  $tg=q("SELECT start_date,plan_slots FROM trainings WHERE id=?",[$tgId])->fetch();
  if(!$tg) return [];
  $plan=json_decode($tg['plan_slots']?:'{}',true)?:[];
  $pos=[]; $ord=0;
  foreach(['mon_am','mon_pm','tue_am','tue_pm','wed_am','wed_pm','thu_am','thu_pm','fri_am','fri_pm'] as $k){
    foreach((array)($plan[$k]??[]) as $sid){ $pos[(string)$sid]=['slot'=>$k,'ord'=>$ord++]; }
  }
  $rows=[];
  foreach(q("SELECT * FROM training_sessions WHERE training_id=? ORDER BY sort,id",[$tgId])->fetchAll() as $s){
    // Co-Teaching: Trainer-Liste (Alt-Daten: Einzelspalte)
    $ids=json_decode(($s['trainer_ids']??'')?:'',true);
    if(!is_array($ids)) $ids=$s['trainer_id']?[(string)$s['trainer_id']]:[];
    if(!in_array((string)$trId, array_map('strval',$ids), true)) continue;
    $p=$pos[(string)$s['id']]??null;
    $day=null; $half=null;
    if($p){ [$day,$half]=explode('_',$p['slot']); }
    $dayIdx=$day!==null ? array_search($day,['mon','tue','wed','thu','fri'],true) : null;
    $date='';
    if($dayIdx!==false && $dayIdx!==null && !empty($tg['start_date'])){
      try{ $d=new DateTime($tg['start_date']); $d->modify('+'.$dayIdx.' day'); $date=$d->format('Y-m-d'); }catch(Throwable $e){}
    }
    $rows[]=['title'=>$s['title'],'title_en'=>$s['title_en']??'','type'=>$s['stype'],'dur'=>$s['dur'],
             'dayIdx'=>($dayIdx===false?null:$dayIdx),'half'=>$half,'date'=>$date,'ord'=>$p['ord']??999,
             'pptMine'=>((string)($s['ppt_by']??''))===(string)$trId && (string)$trId!=='',
             'ppt'=>$s['ppt']??'','mat'=>$s['mat']??''];
  }
  usort($rows, fn($a,$b)=>$a['ord']<=>$b['ord']);
  return $rows;
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
