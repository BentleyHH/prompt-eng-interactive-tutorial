<?php
/** ETAF - gemeinsame Helfer: JSON-IO, Auth, State-Shaping */

require_once __DIR__.'/db.php';

function out($data, int $code=200): void {
  // Bei erfolgreichen Änderungen den Wiederherstellungspunkt festschreiben
  if(!isset($data['ok']) || $data['ok']!==false) { try{ undo_commit(); }catch(Throwable $e){} }
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
  // Immer dieselbe Meldung - verrät nicht, ob die Adresse existiert.
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

/** Login mit PIN - nur zur Ersteinrichtung, solange noch kein Konto existiert. */
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
    fail('Bitte neu anmelden - es gibt jetzt Benutzerkonten.',401);
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

/* ============================================================
   RÜCKGÄNGIG / WIEDERHOLEN
   Vor jeder Änderung wird der betroffene Datenstand gesichert, danach der
   neue. „Rückgängig“ schreibt den alten Stand zurück, „Wiederholen“ den
   neuen. Das funktioniert für alle Vorgänge gleich - ohne dass für jede
   Aktion eine eigene Umkehrfunktion nötig wäre.
   ============================================================ */
const UNDO_TABLES=['trainings','trainers','clients','requests','travel','training_sessions',
  'training_materials','material_presets','materials','templates','trainer_reviews','plan_tokens',
  'debriefs','debrief_actions'];

/** Zeilen zu einer Spezifikation [tabelle, spalte, wert] einsammeln. */
function snap_take(array $specs): array {
  $out=[];
  foreach($specs as $s){
    [$tbl,$col,$val]=$s;
    if(!in_array($tbl,UNDO_TABLES,true) || !preg_match('/^[A-Za-z0-9_]+$/',$col)) continue;
    try{ $rows=q("SELECT * FROM $tbl WHERE $col=?",[$val])->fetchAll(); }catch(Throwable $e){ $rows=[]; }
    $out[]=['t'=>$tbl,'c'=>$col,'v'=>(string)$val,'rows'=>$rows];
  }
  return $out;
}
/** Gesicherten Stand zurückschreiben (deckt Anlegen, Ändern und Löschen ab). */
function snap_restore(array $snap): void {
  foreach($snap as $part){
    $tbl=$part['t']??''; $col=$part['c']??''; $val=$part['v']??'';
    if(!in_array($tbl,UNDO_TABLES,true) || !preg_match('/^[A-Za-z0-9_]+$/',$col)) continue;
    q("DELETE FROM $tbl WHERE $col=?",[$val]);
    foreach(($part['rows']??[]) as $r){
      if(!is_array($r)||!$r) continue;
      $cols=array_keys($r);
      foreach($cols as $c){ if(!preg_match('/^[A-Za-z0-9_]+$/',$c)) continue 2; }
      // Zeile könnte inzwischen woandershin verschoben worden sein (z.B. anderer
      // Kunde) - dann steckt sie nicht mehr im gelöschten Bereich und würde beim
      // Einfügen mit dem Schlüssel kollidieren. Deshalb zusätzlich per id räumen.
      if(array_key_exists('id',$r)) { try{ q("DELETE FROM $tbl WHERE id=?",[$r['id']]); }catch(Throwable $e){} }
      q("INSERT INTO $tbl (".implode(',',$cols).") VALUES (".implode(',',array_fill(0,count($cols),'?')).")",
        array_values($r));
    }
  }
}

/** Welche Daten hängen an einer Aktion? Liefert Spezifikation + Klartext-Titel. */
function undo_targets(string $action, array $in): ?array {
  $tg=fn()=>(string)($in['training']??$in['id']??0);
  $byTraining=function($id){ return [
    ['trainings','id',$id],['requests','training_id',$id],['travel','training_id',$id],
    ['training_sessions','training_id',$id],['training_materials','training_id',$id]]; };
  switch($action){
    case 'training.save': case 'training.delete': case 'training.travelSave':
    case 'training.setClient': case 'training.materials.save':
    case 'weekplan.save': case 'weekplan.suggest': case 'weekplan.copy':
    case 'session.save': case 'session.delete':
      $id=(string)($in['training']??$in['to']??$in['id']??0);
      if($action==='session.delete'){
        $s=q("SELECT training_id FROM training_sessions WHERE id=?",[$in['id']??0])->fetch();
        $id=(string)($s['training_id']??0);
      }
      if(!$id) return null;
      return ['specs'=>$byTraining($id),'label'=>'training','ref'=>$id];
    case 'trainer.save': case 'trainer.delete': case 'passport.save': case 'passport.clear':
    case 'reviews.save':
      $id=(string)($in['id']??$in['trainer']??0); if(!$id) return null;
      return ['specs'=>[['trainers','id',$id],['trainer_reviews','trainer_id',$id]],'label'=>'trainer','ref'=>$id];
    case 'client.save': case 'client.delete':
      $id=(string)($in['id']??''); if($id==='') return null;
      return ['specs'=>[['clients','id',$id],['trainings','client_id',$id]],'label'=>'client','ref'=>$id];
    case 'request.setStatus': case 'request.notifyStatus': case 'trainer.travelSave':
      $id=(string)($in['training']??0); if(!$id) return null;
      return ['specs'=>[['requests','training_id',$id],['travel','training_id',$id]],'label'=>'training','ref'=>$id];
    case 'template.save':
      $id=(string)($in['id']??''); if($id==='') return null;
      return ['specs'=>[['templates','id',$id]],'label'=>'template','ref'=>$id];
    case 'matpreset.save':
      $sp=(string)($in['spec']??''); if($sp==='') return null;
      return ['specs'=>[['material_presets','spec',$sp]],'label'=>'material','ref'=>$sp];
    case 'material.save': case 'material.delete':
      $id=(string)($in['id']??''); if($id==='') return null;
      return ['specs'=>[['materials','id',$id],['training_materials','material_id',$id],
                        ['material_presets','material_id',$id]],'label'=>'material','ref'=>$id];
    case 'ppt.setStatus': case 'ppt.upload': case 'ppt.fileDelete':
      $sid=(int)($in['session']??0); if(!$sid) return null;
      $r=q("SELECT training_id FROM training_sessions WHERE id=?",[$sid])->fetch();
      if(!$r) return null;
      return ['specs'=>[['training_sessions','training_id',(string)$r['training_id']]],
              'label'=>'training','ref'=>(string)$r['training_id']];
    case 'ppt.templateUpload': case 'ppt.templateDelete':
      $id=(string)($in['training']??0); if(!$id) return null;
      return ['specs'=>[['trainings','id',$id]],'label'=>'training','ref'=>$id];
    case 'debrief.save': case 'debrief.delete':
      $id=(string)($in['training']??0); if(!$id) return null;
      $d=q("SELECT id FROM debriefs WHERE training_id=?",[$id])->fetch();
      $sp=[['debriefs','training_id',$id]];
      if($d) $sp[]=['debrief_actions','debrief_id',(string)$d['id']];
      return ['specs'=>$sp,'label'=>'debrief','ref'=>$id];
    case 'debrief.actionDone':
      $a=q("SELECT debrief_id FROM debrief_actions WHERE id=?",[$in['id']??0])->fetch();
      if(!$a) return null;
      return ['specs'=>[['debrief_actions','debrief_id',(string)$a['debrief_id']]],'label'=>'debrief','ref'=>(string)$a['debrief_id']];
    case 'message.resolve':
      $id=(string)($in['trainer']??0); if(!$id) return null;
      return ['specs'=>[['plan_tokens','trainer_id',$id]],'label'=>'trainer','ref'=>$id];
  }
  return null;
}

/** Klartext für Aktionen ohne eigene Protokollzeile. */
function undo_label(string $action): string {
  $m=['training.travelSave'=>'Reisedaten & Agenda geändert','training.setClient'=>'Kunde zugeordnet',
      'training.materials.save'=>'Materialliste geändert','trainer.travelSave'=>'Reisedaten geändert',
      'weekplan.save'=>'Wochenplan geändert','weekplan.suggest'=>'KI-Wochenrhythmus angewendet',
      'weekplan.copy'=>'Wochenplan übernommen','session.save'=>'Session gespeichert',
      'session.delete'=>'Session gelöscht','reviews.save'=>'Bewertungen gespeichert',
      'passport.save'=>'Reisepass gespeichert','passport.clear'=>'Reisepass gelöscht',
      'material.save'=>'Material gespeichert','material.delete'=>'Material gelöscht',
      'matpreset.save'=>'Material-Vorlage gespeichert','template.save'=>'Vorlage gespeichert',
      'message.resolve'=>'Rückmeldung bearbeitet','request.notifyStatus'=>'Trainer informiert',
      'debrief.save'=>'Trainingsbericht gespeichert','debrief.delete'=>'Trainingsbericht gelöscht',
      'ppt.setStatus'=>'Folien-Status geändert','ppt.upload'=>'Folie hochgeladen',
      'ppt.fileDelete'=>'Folien-Datei entfernt','ppt.templateUpload'=>'Basis-Vorlage hochgeladen',
      'ppt.templateDelete'=>'Basis-Vorlage entfernt',
      'debrief.actionDone'=>'Maßnahme abgehakt'];
  return $m[$action] ?? $action;
}

/** Vor der Änderung: Stand sichern (wird in api.php aufgerufen). */
function undo_prepare(string $action, array $in): void {
  $t=undo_targets($action,$in);
  if(!$t) return;
  $maxId=0; try{ $maxId=(int)q("SELECT COALESCE(MAX(id),0) m FROM activity")->fetch()['m']; }catch(Throwable $e){}
  $GLOBALS['__undo']=['specs'=>$t['specs'],'label'=>$t['label'],'ref'=>$t['ref'],
                      'action'=>$action,'maxId'=>$maxId,'before'=>snap_take($t['specs'])];
}
/** Nach der Änderung: neuen Stand sichern und Protokollzeile ergänzen. */
function undo_commit(): void {
  $u=$GLOBALS['__undo']??null;
  if(!$u) return;
  $GLOBALS['__undo']=null;
  $after=snap_take($u['specs']);
  if(json_encode($u['before'])===json_encode($after)) return;   // nichts verändert
  // Ein neuer Schritt beendet die Wiederholen-Kette
  try{ q("UPDATE activity SET undo_before=NULL, undo_after=NULL WHERE undone_at IS NOT NULL AND undo_before IS NOT NULL"); }catch(Throwable $e){}
  // An die Protokollzeile dieses Vorgangs hängen - hat die Aktion selbst keine
  // geschrieben, legen wir eine an (sonst hinge der Stand an einer fremden Zeile).
  $row=q("SELECT id FROM activity ORDER BY id DESC LIMIT 1")->fetch();
  if(!$row || (int)$row['id'] <= (int)($u['maxId']??0)){
    audit($u['action'],$u['label'],$u['ref'],undo_label($u['action']));
    $row=q("SELECT id FROM activity ORDER BY id DESC LIMIT 1")->fetch();
    if(!$row) return;
  }
  q("UPDATE activity SET undo_before=?, undo_after=?, undo_spec=?, undone_at=NULL WHERE id=?",
    [json_encode($u['before'],JSON_UNESCAPED_UNICODE), json_encode($after,JSON_UNESCAPED_UNICODE),
     json_encode($u['specs']), $row['id']]);
}

/** Was lässt sich gerade zurücknehmen / wiederholen? */
function undo_status(): array {
  $fmt=function($r){ return $r ? ['id'=>(int)$r['id'],'summary'=>$r['summary']?:$r['action'],
      'by'=>$r['user_name']??'','at'=>$r['created_at']??''] : null; };
  $un=null; $re=null;
  try{
    $un=q("SELECT * FROM activity WHERE undo_before IS NOT NULL AND undone_at IS NULL ORDER BY id DESC LIMIT 1")->fetch();
    $re=q("SELECT * FROM activity WHERE undo_after IS NOT NULL AND undone_at IS NOT NULL ORDER BY id ASC LIMIT 1")->fetch();
  }catch(Throwable $e){}
  return ['undo'=>$fmt($un?:null),'redo'=>$fmt($re?:null)];
}

/** Rückgängig ($dir=-1) bzw. Wiederholen ($dir=+1). */
function undo_apply(int $dir): array {
  if($dir<0) $row=q("SELECT * FROM activity WHERE undo_before IS NOT NULL AND undone_at IS NULL ORDER BY id DESC LIMIT 1")->fetch();
  else       $row=q("SELECT * FROM activity WHERE undo_after IS NOT NULL AND undone_at IS NOT NULL ORDER BY id ASC LIMIT 1")->fetch();
  if(!$row) fail($dir<0?'Nichts zum Zurücknehmen.':'Nichts zum Wiederholen.');
  $snap=json_decode($dir<0?$row['undo_before']:$row['undo_after'],true);
  if(!is_array($snap)) fail('Der gespeicherte Stand ist nicht lesbar.');
  snap_restore($snap);
  q("UPDATE activity SET undone_at=? WHERE id=?",[$dir<0?now():null,$row['id']]);
  audit($dir<0?'undo':'redo','', (string)$row['id'],
        ($dir<0?'Zurückgenommen: ':'Wiederholt: ').mb_substr((string)($row['summary']?:$row['action']),0,120));
  return ['ok'=>true,'summary'=>$row['summary']?:$row['action'],'status'=>undo_status()];
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
    // Reisepass-Metadaten (ohne das Foto selbst - das lädt passport.image bei Bedarf)
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
      $wkAgg[(string)$a['training_id']]=['sessions'=>(int)$a['n'],'pptAll'=>(int)$a['rel'],
        'pptDone'=>(int)$a['done'],'placed'=>0];
    }
    // Wie viele Sessions liegen schon auf einem Halbtag? (Planungsstand)
    foreach(q("SELECT id,plan_slots FROM trainings WHERE plan_slots IS NOT NULL AND plan_slots<>''")->fetchAll() as $tp){
      $tid=(string)$tp['id']; if(!isset($wkAgg[$tid])) continue;
      $pl=json_decode($tp['plan_slots']?:'{}',true)?:[];
      $seen=[];
      foreach(['mon_am','mon_pm','tue_am','tue_pm','wed_am','wed_pm','thu_am','thu_pm','fri_am','fri_pm'] as $k)
        foreach((array)($pl[$k]??[]) as $sid) $seen[(string)$sid]=true;
      $wkAgg[$tid]['placed']=count($seen);
    }
  }catch(Throwable $e){}

  // Trainingsbericht je Training (nur Kurzstand für Liste und Ampel)
  $dbBy=[];
  try{
    foreach(q("SELECT training_id,status,overall,updated_at,scores,trainers,recommend FROM debriefs")->fetchAll() as $d){
      $dbBy[(string)$d['training_id']]=['status'=>$d['status']??'draft',
        'overall'=>(int)($d['overall']??0),'at'=>$d['updated_at']??'',
        'filled'=>debrief_filled($d)];
    }
  }catch(Throwable $e){}

  $trainings=array_map(function($r) use ($byT,$matByT,$wkAgg,$dbBy){
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
      'debrief'=>$dbBy[(string)$r['id']] ?? null,
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
    'undo'=>undo_status(),
    'debriefCat'=>debrief_catalog(),
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
 *  in Wochenreihenfolge - für Agenda-Seite und Agenda-E-Mail. */
function trainer_week_sessions(int $tgId, int $trId): array {
  $tg=q("SELECT start_date,plan_slots FROM trainings WHERE id=?",[$tgId])->fetch();
  if(!$tg) return [];
  $tn=[]; foreach(q("SELECT id,name FROM trainers")->fetchAll() as $x){ $tn[(string)$x['id']]=$x['name']; }
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
    // Co-Teaching: mit wem zusammen? (alle zugeteilten Trainer außer einem selbst)
    $with=array_values(array_map(fn($x)=>$tn[(string)$x]??'?',
          array_filter(array_map('strval',$ids), fn($x)=>$x!==(string)$trId)));
    $rows[]=['title'=>$s['title'],'title_en'=>$s['title_en']??'','type'=>$s['stype'],'dur'=>$s['dur'],
             'dayIdx'=>($dayIdx===false?null:$dayIdx),'half'=>$half,'date'=>$date,'ord'=>$p['ord']??999,
             'pptMine'=>(string)$trId!=='' && ppt_relevant($s) && in_array((int)$trId, ppt_owner_ids($s), true),
             'pptDue'=>ppt_relevant($s)?ppt_due_of($s,['start_date'=>$tg['start_date']??'']):'',
             'pptDone'=>($s['ppt']??'')==='vorhanden',
             'ppt'=>$s['ppt']??'','mat'=>$s['mat']??'','with'=>$with];
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
/** Zeitraum als echtes Datum: "13.-20. März 2026" (de) / "13-20 March 2026" (en). */
function fmt_date_range(?string $s, ?string $e, string $lang): string {
  $mon = $lang==='de'
    ? ['','Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember']
    : ['','January','February','March','April','May','June','July','August','September','October','November','December'];
  $P=fmt_parse($s); if(!$P) return '';
  $Q=fmt_parse($e);
  $dm=function($x) use($mon,$lang){ return $lang==='de' ? $x['d'].'. '.$mon[$x['mo']] : $x['d'].' '.$mon[$x['mo']]; };
  if(!$Q || ($P['y']==$Q['y']&&$P['mo']==$Q['mo']&&$P['d']==$Q['d'])) return $dm($P).' '.$P['y'];
  if($P['y']==$Q['y']&&$P['mo']==$Q['mo']) return $lang==='de' ? $P['d'].'.-'.$Q['d'].'. '.$mon[$P['mo']].' '.$P['y'] : $P['d'].'-'.$Q['d'].' '.$mon[$P['mo']].' '.$P['y'];
  return $dm($P).' - '.$dm($Q).' '.$Q['y'];
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

/** ETAF-Wortmarke als Vektor - direkt aus ETAF_Logo.png nachgezeichnet
 *  (identisch mit dem Dashboard-Logo). Buchstaben = currentColor, Punkt im Logo-Rot. */
const ETAF_LOGO_PATH='M0 0 349 0 349 110 143 110 143 159 323 159 323 264 143 264 143 320 357 320 357 429 0 429Z'
  .'M362 0 757 0 757 113 632 113 632 429 487 429 487 113 362 113Z'
  .'M834 0 977 0 1164 429 1014 429 985 354 823 354 794 429 647 429Z'
  .'M1181 0 1529 0 1529 110 1326 110 1326 183 1505 183 1505 292 1326 292 1326 429 1181 429Z'
  .'M905 144 863 250 945 250Z';
function etaf_logo_svg(int $h=30): string {
  return '<svg viewBox="0 0 1752 657" height="'.$h.'" role="img" aria-label="ETAF" style="display:block;overflow:visible">'
    .'<path fill="currentColor" fill-rule="evenodd" d="'.ETAF_LOGO_PATH.'"/>'
    .'<circle cx="1648" cy="552" r="104" fill="#CD1719"/></svg>';
}

function base_url(): string {
  $c=cfg();
  if(!empty($c['base_url'])) return rtrim($c['base_url'],'/');
  $https=(!empty($_SERVER['HTTPS'])&&$_SERVER['HTTPS']!=='off')||($_SERVER['SERVER_PORT']??'')==='443';
  $host=$_SERVER['HTTP_HOST']??'localhost';
  $dir=rtrim(dirname($_SERVER['SCRIPT_NAME']??'/'),'/'); // .../backend
  return ($https?'https':'http').'://'.$host.$dir;
}

/* ============================================================
   TRAININGSBERICHT (DEBRIEF)
   Ein Bericht je Training. Der Kriterienkatalog steht bewusst NUR hier -
   Frontend und Auswertung holen ihn über die API, damit ein neues Kriterium
   an genau einer Stelle ergänzt wird.
   Skala: 1 = ungenügend … 5 = ausgezeichnet. Fehlender Schlüssel = nicht
   bewertet (z.B. „kein Flug bei lokalem Training“) und zählt nirgends mit.
   ============================================================ */
function debrief_catalog(): array {
  $G=function($key,$de,$en,$items){ return ['key'=>$key,'de'=>$de,'en'=>$en,'items'=>$items]; };
  $I=function($key,$de,$en){ return ['key'=>$key,'de'=>$de,'en'=>$en]; };
  return [
    'scale'=>[
      1=>['de'=>'ungenügend','en'=>'poor'],
      2=>['de'=>'ausbaufähig','en'=>'weak'],
      3=>['de'=>'in Ordnung','en'=>'okay'],
      4=>['de'=>'gut','en'=>'good'],
      5=>['de'=>'ausgezeichnet','en'=>'excellent'],
    ],
    'groups'=>[
      $G('training','Training & Teilnehmer','Training & participants',[
        $I('students_engagement','Mitarbeit der Teilnehmer','Participant engagement'),
        $I('students_level','Vorkenntnisse passend','Prior knowledge fits'),
        $I('students_attendance','Anwesenheit & Pünktlichkeit','Attendance & punctuality'),
        $I('content_fit','Inhalte passend zum Auftrag','Content fits the brief'),
        $I('timing','Zeitplan eingehalten','Schedule kept'),
        $I('assessment','Qualität der Übungen & Prüfungen','Quality of exercises & assessments'),
      ]),
      $G('team','Trainerteam','Trainer team',[
        $I('team_prep','Vorbereitung des Teams','Team preparation'),
        $I('team_coop','Zusammenarbeit im Team','Cooperation within the team'),
        $I('team_conduct','Auftreten & Verhalten','Conduct & demeanour'),
      ]),
      $G('material','Material & Technik','Material & equipment',[
        $I('material_complete','Material vollständig','Material complete'),
        $I('material_quality','Materialqualität','Material quality'),
        $I('ppt_onsite','PowerPoint-Qualität vor Ort','PowerPoint quality on site'),
        $I('equipment','Technik (Beamer, Ton, Netz)','Equipment (projector, audio, network)'),
        $I('venue','Räumlichkeiten','Venue'),
      ]),
      $G('logistics','Reise & Logistik','Travel & logistics',[
        $I('flight','Flug','Flight'),
        $I('shuttle','Shuttle & Transfer','Shuttle & transfer'),
        $I('hotel','Hotel','Hotel'),
        $I('catering','Verpflegung','Catering'),
      ]),
      $G('client','Kunde vor Ort','Client on site',[
        $I('adp_coord','Koordination durch den Kunden','Coordination by the client'),
        $I('adp_punctual','Pünktlichkeit des Kunden','Client punctuality'),
        $I('adp_support','Unterstützung vor Ort','Support on site'),
        $I('adp_comm','Kommunikation & Absprachen','Communication & agreements'),
      ]),
    ],
    // Bewertung je eingesetztem Trainer
    'trainer'=>[
      $I('teaching','Didaktik & Vermittlung','Teaching & delivery'),
      $I('behaviour','Auftreten & Verhalten','Conduct & demeanour'),
      $I('ppt','Qualität der Unterlagen','Quality of materials'),
      $I('punctuality','Pünktlichkeit & Verlässlichkeit','Punctuality & reliability'),
    ],
    // Vorkommnisse zum Anklicken - kurz, damit der Bericht in zwei Minuten steht
    'flags'=>[
      $I('shuttle_late','Shuttle verspätet','Shuttle late'),
      $I('flight_delay','Flugverspätung/-ausfall','Flight delayed/cancelled'),
      $I('hotel_issue','Hotelproblem','Hotel issue'),
      $I('material_missing','Material fehlte','Material missing'),
      $I('tech_fail','Technik ausgefallen','Equipment failure'),
      $I('room_small','Raum zu klein/ungeeignet','Room too small/unsuitable'),
      $I('plan_changed','Ablauf kurzfristig geändert','Schedule changed at short notice'),
      $I('participants_deviation','Teilnehmerzahl abweichend','Participant count deviated'),
      $I('language_barrier','Sprachbarriere / Dolmetscher nötig','Language barrier / interpreter needed'),
      $I('security_issue','Sicherheits-/Zugangsproblem','Security/access issue'),
      $I('medical_issue','Medizinischer Vorfall','Medical incident'),
      $I('extra_request','Zusatzwunsch des Kunden','Additional client request'),
    ],
    'texts'=>[
      $I('wentWell','Was lief gut?','What went well?'),
      $I('toImprove','Was muss sich ändern?','What needs to change?'),
      $I('adp','Anmerkungen zum Kunden','Notes on the client'),
      $I('incidents','Besondere Vorkommnisse','Notable incidents'),
    ],
    'recommend'=>[
      $I('yes','Ja - unverändert wieder so','Yes - run it again unchanged'),
      $I('partly','Mit Anpassungen','With adjustments'),
      $I('no','Nein - so nicht wieder','No - not like this again'),
    ],
  ];
}

/** Wie viele Felder eines Berichts sind beantwortet? Zählt Kriterien,
 *  Gesamteindruck, Empfehlung und die Werte je Trainer - daraus entsteht
 *  der Fortschrittsring in der Berichtsliste. */
function debrief_filled(array $r): int {
  $keys=debrief_keys();
  $sc=json_decode(($r['scores']??'')?:'{}',true)?:[];
  $n=0;
  foreach($sc as $k=>$v) if(in_array((string)$k,$keys,true) && is_numeric($v) && $v>=1 && $v<=5) $n++;
  if((int)($r['overall']??0)>=1) $n++;
  if(trim((string)($r['recommend']??''))!=='') $n++;
  foreach((array)(json_decode(($r['trainers']??'')?:'{}',true)?:[]) as $tv){
    if(!is_array($tv)) continue;
    foreach(['teaching','behaviour','ppt','punctuality'] as $tk)
      if(isset($tv[$tk]) && is_numeric($tv[$tk]) && $tv[$tk]>=1 && $tv[$tk]<=5) $n++;
  }
  return $n;
}

/** Klartext eines Kriteriums (für Mails und Auswertungen). */
function debrief_label(string $key, string $lang='de'): string {
  $c=debrief_catalog();
  foreach($c['groups'] as $g) foreach($g['items'] as $i) if($i['key']===$key) return $i[$lang]??$i['de'];
  foreach(['trainer','flags','texts','recommend'] as $sec)
    foreach($c[$sec] as $i) if($i['key']===$key) return $i[$lang]??$i['de'];
  return $key;
}

/** Alle gültigen Kriterienschlüssel (Gruppen), flach. */
function debrief_keys(): array {
  $out=[];
  foreach(debrief_catalog()['groups'] as $g) foreach($g['items'] as $i) $out[]=$i['key'];
  return $out;
}
/** Kriterium → Gruppe. */
function debrief_group_of(string $key): string {
  foreach(debrief_catalog()['groups'] as $g) foreach($g['items'] as $i) if($i['key']===$key) return $g['key'];
  return '';
}

/** Eine Bericht-Zeile in die Form bringen, die das Frontend erwartet. */
function debrief_public(array $r): array {
  $acts=[];
  foreach(q("SELECT * FROM debrief_actions WHERE debrief_id=? ORDER BY sort,id",[$r['id']])->fetchAll() as $a){
    $acts[]=['id'=>(string)$a['id'],'text'=>$a['text']??'','owner'=>$a['owner']??'',
             'due'=>$a['due']??'','done'=>((int)($a['done']??0))===1];
  }
  return [
    'id'=>(string)$r['id'],'training'=>(string)$r['training_id'],
    'status'=>$r['status']??'draft','overall'=>(int)($r['overall']??0),
    'recommend'=>$r['recommend']??'',
    'scores'=>json_decode(($r['scores']??'')?:'{}',true)?:[],
    'trainers'=>json_decode(($r['trainers']??'')?:'{}',true)?:[],
    'flags'=>json_decode(($r['flags']??'')?:'[]',true)?:[],
    'texts'=>json_decode(($r['texts']??'')?:'{}',true)?:[],
    'author'=>$r['author_name']??'','createdAt'=>$r['created_at']??'','updatedAt'=>$r['updated_at']??'',
    'version'=>(int)($r['version']??1),'actions'=>$acts,'filled'=>debrief_filled($r),
  ];
}

/** Mittelwert einer Zahlenliste, auf eine Nachkommastelle. */
function debrief_avg(array $vals): ?float {
  $v=array_values(array_filter($vals, fn($x)=>is_numeric($x) && $x>=1 && $x<=5));
  if(!$v) return null;
  return round(array_sum($v)/count($v), 2);
}

/** Periodenschlüssel eines Datums: 'week' → 2026-W45, 'month' → 2026-11, 'year' → 2026. */
function debrief_period(string $date, string $mode): string {
  $t=strtotime($date.' UTC'); if(!$t) return '';
  if($mode==='year')  return gmdate('Y',$t);
  if($mode==='month') return gmdate('Y-m',$t);
  return gmdate('o-\WW',$t);
}

/**
 * Auswertung über alle abgeschlossenen Berichte im Zeitraum.
 * $from/$to: 'YYYY-MM-DD' (leer = offen), $client: Kunden-ID (leer = alle),
 * $bucket: 'week'|'month'|'year' für die Trendachse.
 */
function debrief_report(string $from, string $to, string $client, string $bucket='month', bool $withDrafts=false): array {
  // Zwischenstand: Entwürfe zählen mit. Die Zahlen sind dann vorläufig -
  // das Frontend weist darauf hin und der Bogen trägt den Vermerk.
  $sql="SELECT d.*, t.start_date, t.end_date, t.code, t.topic, t.city, t.client_id
        FROM debriefs d JOIN trainings t ON t.id=d.training_id
        WHERE ".($withDrafts ? "d.status IN('final','draft')" : "d.status='final'");
  $p=[];
  if($from!==''){ $sql.=" AND COALESCE(t.end_date,t.start_date)>=?"; $p[]=$from; }
  if($to!==''){   $sql.=" AND t.start_date<=?";                      $p[]=$to; }
  if($client!==''){ $sql.=" AND t.client_id=?";                      $p[]=$client; }
  $rows=q($sql." ORDER BY t.start_date",$p)->fetchAll();

  $keys=debrief_keys();
  $byKey=[]; foreach($keys as $k) $byKey[$k]=[];
  $byGroup=[]; $overall=[]; $rec=['yes'=>0,'partly'=>0,'no'=>0];
  $flags=[]; $trainers=[]; $trend=[]; $items=[];

  foreach($rows as $r){
    $sc=json_decode(($r['scores']??'')?:'{}',true)?:[];
    $date=(string)($r['start_date']?:'');
    $per=$date!=='' ? debrief_period($date,$bucket) : '';
    $rowVals=[];
    foreach($sc as $k=>$v){
      if(!in_array($k,$keys,true) || !is_numeric($v) || $v<1 || $v>5) continue;
      $byKey[$k][]=(float)$v; $rowVals[]=(float)$v;
      $g=debrief_group_of($k); if($g!==''){ $byGroup[$g][]=(float)$v; if($per!=='') $trend[$per]['g'][$g][]=(float)$v; }
    }
    $ov=(int)($r['overall']??0);
    if($ov>=1&&$ov<=5) $overall[]=(float)$ov;
    if($per!==''){
      $trend[$per]['overall'][] = $ov>=1 ? (float)$ov : (debrief_avg($rowVals) ?? 0);
      $trend[$per]['n']=($trend[$per]['n']??0)+1;
    }
    $rc=(string)($r['recommend']??''); if(isset($rec[$rc])) $rec[$rc]++;
    foreach((array)(json_decode(($r['flags']??'')?:'[]',true)?:[]) as $f){
      $flags[(string)$f]=($flags[(string)$f]??0)+1;
    }
    foreach((array)(json_decode(($r['trainers']??'')?:'{}',true)?:[]) as $tid=>$tv){
      if(!is_array($tv)) continue;
      foreach(['teaching','behaviour','ppt','punctuality'] as $tk){
        $x=$tv[$tk]??null;
        if(is_numeric($x)&&$x>=1&&$x<=5){ $trainers[(string)$tid][$tk][]=(float)$x; $trainers[(string)$tid]['all'][]=(float)$x; }
      }
    }
    $items[]=['id'=>(string)$r['id'],'training'=>(string)$r['training_id'],
      'code'=>$r['code']??'','topic'=>$r['topic']??'','city'=>$r['city']??'',
      'date'=>$date,'overall'=>$ov?:(debrief_avg($rowVals)??0),'recommend'=>$rc,
      'flags'=>count((array)(json_decode(($r['flags']??'')?:'[]',true)?:[])),
      'status'=>$r['status']??'final','filled'=>debrief_filled($r)];
  }

  // Kriterien mit Mittelwert, nach Schwachstellen sortierbar im Frontend
  $crit=[];
  foreach($keys as $k){
    $a=debrief_avg($byKey[$k]);
    if($a===null) continue;
    $crit[]=['key'=>$k,'group'=>debrief_group_of($k),'avg'=>$a,'n'=>count($byKey[$k])];
  }
  $grp=[]; foreach($byGroup as $g=>$v) $grp[]=['key'=>$g,'avg'=>debrief_avg($v),'n'=>count($v)];

  ksort($trend);
  $tr=[];
  foreach($trend as $per=>$v){
    $row=['period'=>$per,'n'=>$v['n']??0,'avg'=>debrief_avg($v['overall']??[]),'groups'=>[]];
    foreach(($v['g']??[]) as $g=>$vals) $row['groups'][$g]=debrief_avg($vals);
    $tr[]=$row;
  }

  $trOut=[];
  foreach($trainers as $tid=>$v){
    $nm=q("SELECT name FROM trainers WHERE id=?",[$tid])->fetch();
    $e=['id'=>(string)$tid,'name'=>$nm['name']??('#'.$tid),'avg'=>debrief_avg($v['all']??[]),'n'=>count($v['all']??[])];
    foreach(['teaching','behaviour','ppt','punctuality'] as $tk) $e[$tk]=debrief_avg($v[$tk]??[]);
    $trOut[]=$e;
  }
  usort($trOut, fn($a,$b)=>($b['avg']??0)<=>($a['avg']??0));

  arsort($flags);
  $flOut=[]; foreach($flags as $k=>$c) $flOut[]=['key'=>$k,'n'=>$c];

  // Abdeckung: wie viele bereits gelaufene Trainings im Zeitraum haben einen Bericht?
  $cWhere=" WHERE COALESCE(t.end_date,t.start_date)<=?";
  $cp=[gmdate('Y-m-d')];
  if($from!==''){ $cWhere.=" AND COALESCE(t.end_date,t.start_date)>=?"; $cp[]=$from; }
  if($to!==''){   $cWhere.=" AND t.start_date<=?";                      $cp[]=$to; }
  if($client!==''){ $cWhere.=" AND t.client_id=?";                      $cp[]=$client; }
  $due=(int)q("SELECT COUNT(*) c FROM trainings t".$cWhere,$cp)->fetch()['c'];
  $dueDone=(int)q("SELECT COUNT(*) c FROM trainings t".$cWhere
    ." AND EXISTS(SELECT 1 FROM debriefs d WHERE d.training_id=t.id AND d.status='final')",$cp)->fetch()['c'];

  // Offene Maßnahmen aus den Berichten des Zeitraums
  $open=[];
  if($rows){
    $ids=array_map(fn($r)=>(int)$r['id'],$rows);
    $in=implode(',',array_fill(0,count($ids),'?'));
    foreach(q("SELECT a.*, t.code FROM debrief_actions a
               LEFT JOIN trainings t ON t.id=a.training_id
               WHERE a.debrief_id IN ($in) AND a.done=0 ORDER BY a.due IS NULL, a.due, a.id",$ids)->fetchAll() as $a){
      $open[]=['id'=>(string)$a['id'],'text'=>$a['text']??'','owner'=>$a['owner']??'',
               'due'=>$a['due']??'','code'=>$a['code']??'','training'=>(string)$a['training_id']];
    }
  }

  $nDraft=0; foreach($rows as $r) if(($r['status']??'')==='draft') $nDraft++;
  return [
    'n'=>count($rows), 'nDraft'=>$nDraft, 'withDrafts'=>$withDrafts,
    'due'=>$due, 'dueDone'=>$dueDone,
    'overall'=>debrief_avg($overall) ?? debrief_avg(array_map(fn($i)=>(float)$i['overall'],$items)),
    'recommend'=>$rec,
    'criteria'=>$crit, 'groups'=>$grp, 'trend'=>$tr,
    'trainers'=>$trOut, 'flags'=>$flOut, 'actions'=>$open, 'items'=>$items,
  ];
}

/** Trainings ohne Bericht, die schon vorbei sind (für Erinnerung und Ampel). */
function debriefs_missing(int $graceDays=0): array {
  $cut=gmdate('Y-m-d', time()-$graceDays*86400);
  return q("SELECT t.id,t.code,t.topic,t.city,t.start_date,t.end_date
            FROM trainings t
            WHERE COALESCE(t.end_date,t.start_date)<=?
              AND NOT EXISTS (SELECT 1 FROM debriefs d WHERE d.training_id=t.id AND d.status='final')
            ORDER BY COALESCE(t.end_date,t.start_date) DESC",[$cut])->fetchAll();
}

/**
 * Reise-Agenda an einen Trainer schicken. Steckt hier, damit Einzel- und
 * Serienversand garantiert dieselbe Mail erzeugen.
 * $lang/$subject/$text überschreiben die Vorgaben aus dem Kontroll-Dialog.
 */
function send_agenda_mail(int $tgId, int $trId, string $lang='', string $subject='', string $text=''): array {
  $tg=q("SELECT * FROM trainings WHERE id=?",[$tgId])->fetch();
  $tr=q("SELECT * FROM trainers WHERE id=?",[$trId])->fetch();
  if(!$tg||!$tr) return ['ok'=>false,'error'=>'Training oder Trainer nicht gefunden.'];
  $rq=q("SELECT * FROM requests WHERE training_id=? AND trainer_id=?",[$tgId,$trId])->fetch();
  $lg=($rq['lang']??'en')==='de'?'de':'en';
  if(in_array($lang,['de','en'],true)) $lg=$lang;
  $tok=$rq['tok']??'';
  if(!$tok){ $tok=token(40);
    q("INSERT INTO requests(training_id,trainer_id,status,lang,tok,created_at) VALUES(?,?,'yes',?,?,?)",
      [$tgId,$trId,$lg,$tok,now()]); }
  $link=base_url().'/agenda.php?token='.$tok;
  $subj=fill_tpl($lg==='de'?'Deine Reise-Agenda - {{topic}} in {{city}}':'Your travel agenda - {{topic}} in {{city}}',$tg,$tr);
  $intro=fill_tpl($lg==='de'
    ? "Hallo {{firstName}},\n\nanbei deine persönliche Reise-Agenda für „{{topic}}“ in {{city}} ({{kw}}). Über den Button kannst du sie öffnen und ausdrucken."
    : "Hi {{firstName}},\n\nhere is your personal travel agenda for \"{{topic}}\" in {{city}} ({{kw}}). Open and print it via the button below.",
    $tg,$tr);
  // Aus dem Kontroll-Dialog angepasste Texte übernehmen (Platzhalter werden gefüllt)
  if(trim($subject)!=='') $subj=preg_replace('/[\r\n]+/',' ',fill_tpl(trim($subject),$tg,$tr));
  if(trim($text)!=='')    $intro=fill_tpl($text,$tg,$tr);

  $btnLabel=$lg==='de'?'📄 Agenda öffnen & drucken':'📄 Open & print agenda';
  $btns='<div style="margin:22px 0"><a href="'.$link.'" style="display:inline-block;padding:12px 20px;'
    .'border-radius:8px;background:#3e4852;color:#fff;font:600 14px system-ui,Arial,sans-serif;text-decoration:none">'
    .$btnLabel.'</a></div>';
  // Persönliche Sessions dieser Woche direkt in die Mail (Spiegelung des Wochenplans)
  $sessHtml='';
  $ws=trainer_week_sessions($tgId,$trId);
  if($ws){
    $dayN=$lg==='de'?['Mo','Di','Mi','Do','Fr']:['Mon','Tue','Wed','Thu','Fri'];
    $halfN=$lg==='de'?['am'=>'Vormittag','pm'=>'Nachmittag']:['am'=>'Morning','pm'=>'Afternoon'];
    $li='';
    foreach($ws as $s2){
      $when=$s2['dayIdx']!==null
        ? $dayN[$s2['dayIdx']].($s2['date']?' '.date('d.m.',strtotime($s2['date'])):'').($s2['half']?' · '.($halfN[$s2['half']]??''):'')
        : ($lg==='de'?'offen':'tbd');
      $li.='<tr><td style="padding:4px 12px 4px 0;color:#5c666e;white-space:nowrap;font-size:13px;vertical-align:top">'.htmlspecialchars($when).'</td>'
         .'<td style="padding:4px 0;font-size:13px"><b>'.htmlspecialchars($lg==='en'&&$s2['title_en']!==''?$s2['title_en']:$s2['title']).'</b> · '.htmlspecialchars((string)$s2['dur']).' h'
         .(!empty($s2['with'])?'<br><span style="color:#3F7A5E;font-weight:600">👥 '.htmlspecialchars(($lg==='de'?'zusammen mit ':'together with ').implode(', ',$s2['with'])).'</span>':'')
         .($s2['pptMine']?'<br><span style="color:#B23A42;font-weight:600">'.($lg==='de'?'PowerPoint: von dir vorzubereiten':'PowerPoint: to be prepared by you')
             .(!empty($s2['pptDue'])&&empty($s2['pptDone'])?' ('.($lg==='de'?'bis ':'by ').date('d.m.Y',strtotime($s2['pptDue'])).')':'').'</span>':'')
         .'</td></tr>';
    }
    $sessHtml='<div style="margin:18px 0 4px;font-family:Arial,Helvetica,sans-serif">'
      .'<b style="font-size:14px">'.($lg==='de'?'Deine Sessions in dieser Woche':'Your sessions this week').'</b>'
      .'<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:6px">'.$li.'</table></div>';
    // PowerPoints: eigener Absatz mit Upload-Link, wenn der Trainer Folien schuldet
    $mineOpen=array_filter($ws, fn($x)=>!empty($x['pptMine']) && empty($x['pptDone']));
    if($mineOpen){
      $pl=base_url().'/ppt.php?token='.$tok;
      $tplTxt=!empty($tg['ppt_template'])
        ? ($lg==='de'?' Die Basis-Vorlage liegt dort zum Herunterladen bereit.':' The base template is available for download there.')
        : '';
      $pptTxt=$lg==='de'
        ? 'Du bist für '.count($mineOpen).' PowerPoint'.(count($mineOpen)===1?'':'s').' eingeplant (oben rot markiert). '
          .'Über deine persönliche Folien-Seite kannst du sie hochladen oder kurz den Stand melden.'.$tplTxt
        : 'You are scheduled to prepare '.count($mineOpen).' PowerPoint'.(count($mineOpen)===1?'':'s').' (marked in red above). '
          .'Use your personal slides page to upload them or report the status.'.$tplTxt;
      $sessHtml.='<div style="margin:14px 0 4px;font-family:Arial,Helvetica,sans-serif;font-size:13px">'
        .'<b style="font-size:14px">'.($lg==='de'?'Deine PowerPoints':'Your PowerPoints').'</b>'
        .'<div style="margin:5px 0 10px;color:#242b31">'.htmlspecialchars($pptTxt).'</div>'
        .'<a href="'.$pl.'" style="display:inline-block;padding:10px 17px;border-radius:8px;background:#fff;'
        .'border:1px solid #3e4852;color:#3e4852;font:600 13px system-ui,Arial,sans-serif;text-decoration:none">'
        .($lg==='de'?'Folien hochladen & Stand melden':'Upload slides & report status').'</a></div>';
    }
  }
  // Ticket/Voucher aus der verknüpften Flugpost-Mail automatisch anhängen
  $atts=[];
  $tv=q("SELECT mail_id FROM travel WHERE training_id=? AND trainer_id=?",[$tgId,$trId])->fetch();
  if($tv && $tv['mail_id']){
    foreach(q("SELECT name,mime,data FROM travel_mail_att WHERE mail_id=?",[$tv['mail_id']])->fetchAll() as $a){
      $atts[]=['name'=>$a['name'],'mime'=>$a['mime'],'data_b64'=>$a['data']];
    }
    if($atts) $intro.=$lg==='de' ? "\n\nDein Ticket/Voucher hängt an dieser E-Mail."
                                 : "\n\nYour ticket/voucher is attached to this email.";
  }
  $ok=send_email($tr['email'],$tr['name'],$subj,email_html($intro,$sessHtml.$btns),$atts);
  q("INSERT INTO email_log(training_id,trainer_id,to_email,subject,body,lang,status,created_at)
     VALUES(?,?,?,?,?,?,?,?)",[$tgId,$trId,$tr['email'],$subj,$intro."\n".$link,$lg,$ok?'sent':'failed',now()]);
  return ['ok'=>true,'link'=>$link,'sent'=>$ok?1:0,'attached'=>count($atts),
          'name'=>$tr['name'],'email'=>$tr['email']];
}

/* ============================================================
   POWERPOINT-VERFOLGUNG
   Dateien liegen auf dem Webspace (backend/uploads/ppt), in der Datenbank
   steht nur der Verweis - Dump und tägliche Sicherung bleiben dadurch klein.
   ============================================================ */
function ppt_dir(): string {
  $d=__DIR__.'/uploads/ppt';
  if(!is_dir($d)) @mkdir($d,0755,true);
  return $d;
}
const PPT_EXT=['ppt','pptx','pot','potx','pdf'];
function ppt_max_bytes(): int {
  $ini=function($k){ $v=trim((string)ini_get($k)); if($v==='') return PHP_INT_MAX;
    $n=(float)$v; switch(strtolower(substr($v,-1))){ case 'g':$n*=1024; case 'm':$n*=1024; case 'k':$n*=1024; }
    return (int)$n; };
  return (int)min(40*1024*1024, $ini('upload_max_filesize'), $ini('post_max_size'));
}
/** Zaehlt eine Session fuer die Folien-Pflicht? (wie der Wochenplan-Zaehler) */
function ppt_relevant(array $s): bool {
  return !in_array((string)($s['stype']??''),['orga','deliverable'],true);
}
/** Wirksame Folien-Verantwortliche: explizite Auswahl (ppt_by_ids, mehrere
 *  möglich; alt: ppt_by einzeln), sonst automatisch die im Wochenplan
 *  zugeteilten Trainer der Session (Co-Teaching: alle). */
function ppt_owner_ids(array $s): array {
  $ex=json_decode((string)($s['ppt_by_ids']??''),true);
  if(is_array($ex) && count($ex))
    return array_values(array_unique(array_filter(array_map('intval',$ex))));
  if(!empty($s['ppt_by'])) return [(int)$s['ppt_by']];
  $ids=json_decode((string)($s['trainer_ids']??''),true);
  if(!is_array($ids)) $ids=!empty($s['trainer_id'])?[(int)$s['trainer_id']]:[];
  return array_values(array_unique(array_filter(array_map('intval',$ids))));
}
/** Wurde die Verantwortung von Hand gesetzt (statt aus dem Wochenplan geerbt)? */
function ppt_owner_explicit(array $s): bool {
  $ex=json_decode((string)($s['ppt_by_ids']??''),true);
  return (is_array($ex)&&count($ex)) || !empty($s['ppt_by']);
}
/** Wirksame Faelligkeit: eigenes Datum oder Trainingsbeginn minus Vorlauf. */
function ppt_due_of(array $s, array $tg): string {
  $d=trim((string)($s['ppt_due']??''));
  if(preg_match('/^\d{4}-\d{2}-\d{2}$/',$d)) return $d;
  $start=trim((string)($tg['start_date']??''));
  if(!preg_match('/^\d{4}-\d{2}-\d{2}$/',$start)) return '';
  $lead=(int)(config_get('ppt_lead_days')??21);
  return gmdate('Y-m-d', strtotime($start.' UTC')-$lead*86400);
}
/** Hochgeladene Datei validieren und ablegen; gibt [name,orig,size] oder Fehlertext. */
function ppt_store_upload(array $f, string $prefix){
  if(($f['error']??UPLOAD_ERR_NO_FILE)!==UPLOAD_ERR_OK) return 'Upload fehlgeschlagen (Code '.($f['error']??'?').').';
  if(($f['size']??0)>ppt_max_bytes()) return 'Datei zu groß (max. '.round(ppt_max_bytes()/1048576).' MB).';
  $ext=strtolower(pathinfo((string)($f['name']??''),PATHINFO_EXTENSION));
  if(!in_array($ext,PPT_EXT,true)) return 'Nur '.implode(', ',PPT_EXT).' sind erlaubt.';
  $name=$prefix.'-'.substr(token(16),0,8).'.'.$ext;
  if(!@move_uploaded_file($f['tmp_name'],ppt_dir().'/'.$name)) return 'Speichern fehlgeschlagen.';
  $orig=preg_replace('/[^\w.\- ()\[\]]/u','_',(string)$f['name']);
  return ['name'=>$name,'orig'=>mb_substr($orig,0,180),'size'=>(int)$f['size']];
}
/** Datei ausliefern (Download) und beenden. */
function ppt_stream(string $file, string $origName): void {
  $path=ppt_dir().'/'.basename($file);
  if($file==='' || !is_file($path)){ http_response_code(404);
    header('Content-Type: text/plain; charset=utf-8'); echo 'Datei nicht mehr vorhanden.'; exit; }
  header('Content-Type: application/octet-stream');
  header('Content-Length: '.filesize($path));
  header('Content-Disposition: attachment; filename="'.str_replace('"','',$origName?:basename($path)).'"');
  readfile($path); exit;
}
/** Token je Trainer+Training holen oder anlegen (gleicher Weg wie die Agenda). */
function ppt_link_token(int $tgId, int $trId): string {
  $rq=q("SELECT tok FROM requests WHERE training_id=? AND trainer_id=?",[$tgId,$trId])->fetch();
  if($rq && $rq['tok']) return $rq['tok'];
  $tr=q("SELECT pref_lang FROM trainers WHERE id=?",[$trId])->fetch();
  $tok=token(40);
  q("INSERT INTO requests(training_id,trainer_id,status,lang,tok,created_at) VALUES(?,?,'yes',?,?,?)",
    [$tgId,$trId, (($tr['pref_lang']??'')==='en'?'en':'de'), $tok, now()]);
  return $tok;
}
/** Mail an einen Trainer zu seinen offenen Folien eines Trainings.
 *  $kind: 'remind' (automatisches Nachhaken) oder 'request' (freundliche
 *  Erst-Anfrage aus der Besetzungsliste, mit Hinweis auf die Basis-Vorlage). */
function ppt_send_reminder(array $tg, int $trId, array $sessions, bool $overdue, string $kind='remind'): bool {
  $tr=q("SELECT * FROM trainers WHERE id=?",[$trId])->fetch();
  if(!$tr || !$tr['email']) return false;
  $lg=(($tr['pref_lang']??'')==='en')?'en':'de';
  $tok=ppt_link_token((int)$tg['id'],$trId);
  $link=base_url().'/ppt.php?token='.$tok;
  $first=explode(' ',preg_replace('/^Dr\.\s*/','',(string)$tr['name']))[0]?:'';
  $title=(($tg['code']??'')?$tg['code'].' - ':'').$tg['topic'];
  $rows='';
  foreach($sessions as $s){
    $due=ppt_due_of($s,$tg);
    $rows.='<tr><td style="padding:4px 12px 4px 0;font-size:13px"><b>'.htmlspecialchars($s['title']).'</b></td>'
      .'<td style="padding:4px 0;font-size:13px;color:'.($overdue?'#D81F26':'#5c666e').';white-space:nowrap">'
      .($due?($lg==='de'?'fällig bis ':'due by ').date('d.m.Y',strtotime($due)):'').'</td></tr>';
  }
  $tplNote='';
  if(!empty($tg['ppt_template'])){
    $tplNote=$lg==='de' ? "\n\nDie Basis-Vorlage findest du auf derselben Seite zum Herunterladen."
                        : "\n\nYou will find the base template for download on the same page.";
  }
  if($lg==='de'){
    if($kind==='request'){
      $subj='Bitte um deine PowerPoints - '.$title;
      $intro="Hallo $first,\n\nfür \"$title\" in ".($tg['city']??'')." bist du für die folgenden PowerPoints eingeplant. "
        ."Über den Link unten kannst du sie hochladen oder kurz den Stand melden.".$tplNote;
    } else {
      $subj=($overdue?'Überfällig: ':'').'PowerPoints für '.$title;
      $intro="Hallo $first,\n\n".($overdue
        ? "für \"$title\" in ".($tg['city']??'')." sind PowerPoints überfällig. Bitte lade sie zeitnah hoch oder melde kurz den Stand - der Link unten führt direkt zu deiner Übersicht."
        : "für \"$title\" in ".($tg['city']??'')." fehlen noch PowerPoints von dir. Über den Link unten kannst du sie hochladen oder den Stand melden.").$tplNote;
    }
    $cta='Folien hochladen & Stand melden';
  } else {
    if($kind==='request'){
      $subj='Request for your PowerPoints - '.$title;
      $intro="Hi $first,\n\nfor \"$title\" in ".($tg['city']??'')." you are scheduled to prepare the following PowerPoints. "
        ."Use the link below to upload them or report the status.".$tplNote;
    } else {
      $subj=($overdue?'Overdue: ':'').'PowerPoints for '.$title;
      $intro="Hi $first,\n\n".($overdue
        ? "PowerPoints for \"$title\" in ".($tg['city']??'')." are overdue. Please upload them soon or give a quick status - the link below takes you straight to your overview."
        : "we are still missing PowerPoints from you for \"$title\" in ".($tg['city']??'').". Use the link below to upload them or report the status.").$tplNote;
    }
    $cta='Upload slides & report status';
  }
  $html=email_html($intro,
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:6px 0">'.$rows.'</table>'
    .cta_button($link,$cta));
  $ok=send_email($tr['email'],$tr['name'],$subj,$html);
  q("INSERT INTO email_log(training_id,trainer_id,to_email,subject,body,lang,status,created_at)
     VALUES(?,?,?,?,?,?,?,?)",[(int)$tg['id'],$trId,$tr['email'],$subj,
     ($kind==='request'?'PowerPoint-Anfrage (':'PowerPoint-Erinnerung (').count($sessions).')',$lg,
     ((cfg()['mail_mode']??'mail')==='log'?'logged':($ok?'sent':'failed')),now()]);
  return $ok;
}
