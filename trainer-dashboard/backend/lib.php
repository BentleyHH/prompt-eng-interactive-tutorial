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
    // Fehlversuche gehören ins Protokoll: nur Adresse und Herkunft, nie das
    // eingegebene Passwort. Der Grund bleibt bewusst grob.
    $grund = !$u ? 'unbekannte Adresse'
           : (((int)$u['active']!==1) ? 'Konto gesperrt' : 'falsches Passwort');
    audit_as($u?:['id'=>null,'name'=>$email],'login.failed','user',(string)($u['id']??''),
      $email.' - '.$grund.' (IP '.client_ip().')');
    fail('E-Mail oder Passwort ist nicht korrekt.',401);
  }
  login_guard_reset();
  q("UPDATE users SET last_login=? WHERE id=?",[now(),$u['id']]);
  $tok=issue_session((int)$u['id']);
  audit_as($u,'login','user',(string)$u['id'],'angemeldet (IP '.client_ip().')');
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
    case 'pptmail.assign':
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
    $matByT[(string)$m['training_id']][]=['matId'=>$m['material_id'],'qty'=>(int)$m['qty'],'ok'=>(int)($m['ok']??0)];
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
/* ---- Abgabeweg der Folien -------------------------------------------------
   'upload' = Datei landet auf dem Webspace (backend/uploads/ppt)
   'mail'   = Trainer schickt sie an ein eigenes Postfach (z.B. content@...);
              das Cockpit fuehrt dann nur noch Anfrage und Bearbeitungsstand.
   Ein einheitlicher Betreff macht das Postfach selbstsortierend.          */
/** Ist in der config.php ein Folien-Postfach hinterlegt? */
function ppt_mailbox_set(): bool {
  $c=cfg()['ppt_mailbox']??[];
  return !empty($c['host']) && !empty($c['user']);
}
function ppt_delivery(): string {
  $set=config_get('ppt_delivery');
  // Noch nie bewusst gewählt? Dann entscheidet die Einrichtung: Wer ein
  // Folien-Postfach hinterlegt hat, will die Abgabe per Mail - sonst waeren
  // es zwei Schalter fuer eine Sache, und einer bliebe garantiert stehen.
  if($set===null || $set==='') return ppt_mailbox_set() ? 'mail' : 'upload';
  return $set==='mail' ? 'mail' : 'upload';
}
/** Abgabe-Adresse: eigene Angabe, sonst das Postfach aus der config.php. */
function ppt_mail_addr(): string {
  $a=trim((string)(config_get('ppt_mail')??''));
  if($a!=='') return $a;
  return trim((string)((cfg()['ppt_mailbox']['user'])??''));
}
/** Abgabe laeuft per Mail (nur wenn auch eine Adresse hinterlegt ist). */
function ppt_by_mail(): bool { return ppt_delivery()==='mail' && ppt_mail_addr()!==''; }
/** Einheitlicher Betreff: "<Code> - <Session>" - so liegt im Postfach sofort
 *  auf der Hand, wohin eine Datei gehoert. */
function ppt_mail_subject(array $tg, array $s): string {
  $code=trim((string)($tg['code']??''));
  return ($code!==''?$code.' - ':'').mb_substr((string)($s['title']??''),0,90);
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
/** Hat der Server die Übertragung komplett verworfen? Überschreitet eine
 *  Anfrage post_max_size, leert PHP $_POST und $_FILES restlos - ohne diesen
 *  Test käme gar keine Meldung an und der Upload verschwände lautlos. */
function ppt_post_too_big(): bool {
  return ($_SERVER['REQUEST_METHOD']??'')==='POST'
      && empty($_POST) && empty($_FILES)
      && (int)($_SERVER['CONTENT_LENGTH']??0) > 0;
}
/** Grenze aus der PHP-Konfiguration im Klartext (für Fehlermeldungen). */
function ppt_limit_hint(): string {
  return 'Der Server nimmt derzeit höchstens '.round(ppt_max_bytes()/1048576).' MB an'
    .' (php.ini: upload_max_filesize='.trim((string)ini_get('upload_max_filesize'))
    .', post_max_size='.trim((string)ini_get('post_max_size')).').';
}
function ppt_store_upload(array $f, string $prefix){
  if(ppt_post_too_big())
    return 'Die Datei war zu groß für den Server und wurde komplett abgewiesen. '.ppt_limit_hint();
  $err=(int)($f['error']??UPLOAD_ERR_NO_FILE);
  if($err!==UPLOAD_ERR_OK){
    $txt=[
      UPLOAD_ERR_INI_SIZE  =>'Die Datei überschreitet das Limit des Servers. '.ppt_limit_hint(),
      UPLOAD_ERR_FORM_SIZE =>'Die Datei überschreitet das Limit des Formulars.',
      UPLOAD_ERR_PARTIAL   =>'Die Übertragung wurde abgebrochen - bitte noch einmal versuchen.',
      UPLOAD_ERR_NO_FILE   =>'Es wurde keine Datei ausgewählt.',
      UPLOAD_ERR_NO_TMP_DIR=>'Dem Server fehlt ein Zwischenspeicher für Uploads (upload_tmp_dir). Bitte beim Hoster melden.',
      UPLOAD_ERR_CANT_WRITE=>'Der Server konnte die Datei nicht zwischenspeichern (Schreibrechte).',
      UPLOAD_ERR_EXTENSION =>'Eine PHP-Erweiterung hat den Upload blockiert.',
    ];
    return $txt[$err] ?? ('Upload fehlgeschlagen (Code '.$err.').');
  }
  if(($f['size']??0)>ppt_max_bytes())
    return 'Datei zu groß (max. '.round(ppt_max_bytes()/1048576).' MB). '.ppt_limit_hint();
  $ext=strtolower(pathinfo((string)($f['name']??''),PATHINFO_EXTENSION));
  if(!in_array($ext,PPT_EXT,true)) return 'Nur '.implode(', ',PPT_EXT).' sind erlaubt.';
  // Ablageordner muss existieren UND beschreibbar sein - auf geteiltem Hosting
  // scheitert das Anlegen sonst still an den Rechten des übergeordneten Ordners.
  $dir=ppt_dir();
  if(!is_dir($dir))
    return 'Der Ablageordner konnte nicht angelegt werden: '.$dir
      .' - bitte per FTP anlegen und die Rechte auf 775 setzen.';
  if(!is_writable($dir))
    return 'Der Ablageordner ist nicht beschreibbar: '.$dir
      .' - bitte per FTP die Rechte auf 775 setzen.';
  $name=$prefix.'-'.substr(token(16),0,8).'.'.$ext;
  if(!@move_uploaded_file($f['tmp_name'],$dir.'/'.$name))
    return 'Speichern fehlgeschlagen (Ziel: '.$dir.'). Bitte die Ordnerrechte prüfen - Diagnose unter backend/check.php.';
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
 *  Erst-Anfrage, mit Hinweis auf die Basis-Vorlage).
 *  $lang/$subject/$text: aus dem Kontroll-Dialog angepasste Fassung -
 *  Platzhalter ({{firstName}}, {{topic}}, ...) werden gefüllt, die
 *  Folien-Liste und der persönliche Link werden immer angehängt. */
function ppt_send_reminder(array $tg, int $trId, array $sessions, bool $overdue,
                           string $kind='remind', string $lang='', string $subject='', string $text=''): bool {
  $tr=q("SELECT * FROM trainers WHERE id=?",[$trId])->fetch();
  if(!$tr || !$tr['email']) return false;
  $lg=(($tr['pref_lang']??'')==='en')?'en':'de';
  if(in_array($lang,['de','en'],true)) $lg=$lang;
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
  // Abgabe per Postfach: Adresse und Betreff gehoeren in die Mail, sonst
  // landen Dateien ohne Zuordnung im Postfach.
  $mailNote='';
  if(ppt_by_mail()){
    $addr=ppt_mail_addr();
    $mailNote=$lg==='de'
      ? "\n\nBitte schicke die fertigen Folien als Anhang an ".$addr
        ." - am besten je Session eine eigene Mail mit dem Titel der Session im Betreff."
      : "\n\nPlease send the finished slides as an attachment to ".$addr
        ." - ideally one mail per session with the session title in the subject.";
  }
  if($lg==='de'){
    if($kind==='request'){
      $subj='Bitte um deine PowerPoints - '.$title;
      $intro="Hallo $first,\n\nfür \"$title\" in ".($tg['city']??'')." bist du für die folgenden PowerPoints eingeplant. "
        .(ppt_by_mail()
            ? "Über den Link unten kannst du jederzeit den Stand melden."
            : "Über den Link unten kannst du sie hochladen oder kurz den Stand melden.").$tplNote.$mailNote;
    } else {
      $subj=($overdue?'Überfällig: ':'').'PowerPoints für '.$title;
      $intro="Hallo $first,\n\n".($overdue
        ? "für \"$title\" in ".($tg['city']??'')." sind PowerPoints überfällig. Bitte lade sie zeitnah hoch oder melde kurz den Stand - der Link unten führt direkt zu deiner Übersicht."
        : "für \"$title\" in ".($tg['city']??'')." fehlen noch PowerPoints von dir.").$tplNote.$mailNote;
    }
    $cta='Folien hochladen & Stand melden';
  } else {
    if($kind==='request'){
      $subj='Request for your PowerPoints - '.$title;
      $intro="Hi $first,\n\nfor \"$title\" in ".($tg['city']??'')." you are scheduled to prepare the following PowerPoints. "
        .(ppt_by_mail()
            ? "Use the link below to report the status at any time."
            : "Use the link below to upload them or report the status.").$tplNote.$mailNote;
    } else {
      $subj=($overdue?'Overdue: ':'').'PowerPoints for '.$title;
      $intro="Hi $first,\n\n".($overdue
        ? "PowerPoints for \"$title\" in ".($tg['city']??'')." are overdue. Please upload them soon or give a quick status - the link below takes you straight to your overview."
        : "we are still missing PowerPoints from you for \"$title\" in ".($tg['city']??'').".").$tplNote.$mailNote;
    }
    $cta='Upload slides & report status';
  }
  // Aus dem Kontroll-Dialog angepasste Texte übernehmen (Platzhalter füllen)
  if(trim($subject)!=='') $subj=preg_replace('/[\r\n]+/',' ',fill_tpl(trim($subject),$tg,$tr));
  if(trim($text)!=='')    $intro=fill_tpl($text,$tg,$tr).$tplNote;
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

/* ============================================================
   ZERTIFIZIERUNG - Katalog, Bewertung, Bestehensregeln
   Der Katalog ist frei änderbar. Damit alte Bewertungen dadurch nicht
   nachträglich anders ausfallen, wird bei jedem Abschluss die verwendete
   Katalogfassung mitgespeichert und für Anzeige und Zeugnis herangezogen.
   ============================================================ */
function cert_cfg(): array {
  return [
    'scale'  => max(3,(int)(config_get('cert_scale')??5)),
    'pass'   => max(1,min(100,(int)(config_get('cert_pass')??60))),
    'merit'  => max(1,min(100,(int)(config_get('cert_merit')??85))),
    'koMin'  => (float)(config_get('cert_ko_min')??3),
    'attend' => max(0,min(100,(int)(config_get('cert_attend')??80))),
  ];
}

/** Aktueller Katalog als verschachtelte Liste (Gruppen mit Unterkriterien). */
function cert_catalog(bool $onlyActive=true): array {
  $gw = $onlyActive ? ' WHERE active=1' : '';
  $groups=[];
  foreach(q("SELECT * FROM crit_groups$gw ORDER BY sort_order,id")->fetchAll() as $g){
    $groups[(string)$g['id']]=[
      'id'=>(string)$g['id'],'name'=>$g['name'],'nameEn'=>$g['name_en'],
      'weight'=>(int)$g['weight'],'active'=>((int)$g['active'])===1,'crits'=>[]];
  }
  $cw = $onlyActive ? ' WHERE active=1' : '';
  foreach(q("SELECT * FROM crits$cw ORDER BY sort_order,id")->fetchAll() as $c){
    $gid=(string)$c['group_id'];
    if(!isset($groups[$gid])) continue;
    $groups[$gid]['crits'][]=[
      'id'=>(string)$c['id'],'name'=>$c['name'],'nameEn'=>$c['name_en'],
      'descr'=>$c['descr'],'weight'=>(int)$c['weight'],
      'ko'=>((int)$c['ko'])===1,'active'=>((int)$c['active'])===1];
  }
  // Gruppen ohne Kriterien wären in der Bewertung nur leere Überschriften
  return array_values(array_filter($groups, fn($g)=>count($g['crits'])>0));
}

/**
 * Gesamtwert und Ergebnis berechnen.
 * Gewichtung: Gruppe × Kriterium. Nicht bewertete Kriterien zählen nicht mit -
 * eine halb ausgefüllte Bewertung soll niemanden schlechter dastehen lassen,
 * als er ist; ob sie vollständig ist, zeigt der Fortschritt getrennt an.
 */
function cert_calc(array $catalog, array $scores, int $attendance=100): array {
  $cfg=cert_cfg();
  $sum=0.0; $wsum=0.0; $n=0; $total=0; $koFail=[]; $koIds=[]; $groupRes=[];
  foreach($catalog as $g){
    $gsum=0.0; $gw=0.0; $gn=0;
    foreach($g['crits'] as $c){
      $total++;
      $w=max(1,(int)$g['weight'])*max(1,(int)$c['weight']);
      $v=$scores[$c['id']]??null;
      if($v===null || $v==='') continue;
      $v=(float)$v; $n++;
      $sum+=$v*$w; $wsum+=$w; $gsum+=$v*$w; $gw+=$w; $gn++;
      if(!empty($c['ko']) && $v < $cfg['koMin']){ $koFail[]=$c['name']; $koIds[]=(string)$c['id']; }
    }
    $groupRes[]=['id'=>$g['id'],'name'=>$g['name'],
      'avg'=>$gn?round($gsum/$gw,2):null,'n'=>$gn,'of'=>count($g['crits'])];
  }
  $avg = $wsum>0 ? $sum/$wsum : 0.0;
  $pct = $wsum>0 ? (int)round(($avg/$cfg['scale'])*100) : 0;
  $result='';
  if($n>0){
    if($koFail || $pct<$cfg['pass'] || $attendance<$cfg['attend']) $result='fail';
    elseif($pct>=$cfg['merit']) $result='merit';
    else $result='pass';
  }
  return ['avg'=>round($avg,2),'pct'=>$pct,'result'=>$result,'rated'=>$n,'total'=>$total,
          'koFail'=>$koFail,'koIds'=>$koIds,'groups'=>$groupRes,
          'attendOk'=>$attendance>=$cfg['attend']];
}

/**
 * Fortlaufende Pruefnummer: ETAF-<Jahr>-<laufend>-<Pruefzeichen>.
 * Das Pruefzeichen erschwert das Erfinden von Nummern. Es ist kein
 * Sicherheitsmerkmal - die Echtheit bestaetigt allein verify.php.
 */
function cert_number(string $seed): string {
  $y=gmdate('Y');
  $n=(int)q("SELECT COUNT(*) c FROM certificates")->fetch()['c'] + 1;
  for($try=0;$try<50;$try++){
    $base=sprintf('ETAF-%s-%04d',$y,$n+$try);
    $chk=strtoupper(substr(hash('sha256',$base.'|'.$seed.'|'.(config_get('pin_hash')??'')),0,4));
    $no=$base.'-'.$chk;
    if(!q("SELECT id FROM certificates WHERE cert_no=?",[$no])->fetch()) return $no;
  }
  return sprintf('ETAF-%s-%s',$y,strtoupper(substr(bin2hex(random_bytes(6)),0,10)));
}

/**
 * Stand einer Person: alle Bloecke zusammengefuehrt (mehrere Bewerter je
 * Block werden auf Kriteriumsebene gemittelt). Grundlage von Zeugnis und
 * Abschlusszertifikat.
 */
function cert_student_state(int $sid): array {
  $cfg=cert_cfg(); $cat=cert_catalog(true);
  $tg=[];
  foreach(q("SELECT id,code,topic,start_date,end_date FROM trainings")->fetchAll() as $r)
    $tg[(string)$r['id']]=$r;
  $enrolled=[];
  foreach(q("SELECT * FROM student_training WHERE student_id=?",[$sid])->fetchAll() as $r)
    $enrolled[(string)$r['training_id']]=(int)$r['attendance'];

  $rows=q("SELECT * FROM assessments WHERE student_id=?",[$sid])->fetchAll();
  $ids=array_map(fn($r)=>(int)$r['id'],$rows);
  $sc=[];
  if($ids){
    $ph=implode(',',array_fill(0,count($ids),'?'));
    foreach(q("SELECT * FROM assessment_scores WHERE assessment_id IN ($ph)",$ids)->fetchAll() as $x)
      $sc[(string)$x['assessment_id']][(string)$x['crit_id']]=(float)$x['score'];
  }
  $merge=[];
  foreach($rows as $r){
    $t=(string)$r['training_id'];
    if(!isset($merge[$t])) $merge[$t]=['sum'=>[],'n'=>[],'final'=>true,'att'=>$enrolled[$t]??100,'raters'=>[]];
    if($r['status']!=='final') $merge[$t]['final']=false;
    if($r['rater_name']) $merge[$t]['raters'][]=$r['rater_name'];
    if((int)$r['attendance']>0) $merge[$t]['att']=(int)$r['attendance'];
    foreach($sc[(string)$r['id']]??[] as $cid=>$v){
      $merge[$t]['sum'][$cid]=($merge[$t]['sum'][$cid]??0)+$v;
      $merge[$t]['n'][$cid]=($merge[$t]['n'][$cid]??0)+1;
    }
  }
  $blocks=[]; $gAcc=[]; $sumPct=0; $nPct=0; $anyFail=false; $allFinal=true;
  foreach($enrolled as $t=>$att){
    $m=$merge[$t]??null;
    $scores=[];
    if($m) foreach($m['sum'] as $cid=>$v) $scores[$cid]=$v/max(1,$m['n'][$cid]);
    $calc=cert_calc($cat,$scores,$m?$m['att']:$att);
    $fin=$m?$m['final']:false;
    if(!$fin || $calc['rated']===0) $allFinal=false;
    if($calc['result']==='fail') $anyFail=true;
    if($calc['rated']>0){ $sumPct+=$calc['pct']; $nPct++;
      foreach($calc['groups'] as $g){ if($g['avg']===null) continue;
        $gAcc[$g['id']]=$gAcc[$g['id']]??['name'=>$g['name'],'sum'=>0,'n'=>0];
        $gAcc[$g['id']]['sum']+=$g['avg']; $gAcc[$g['id']]['n']++; }
    }
    $blocks[]=['training'=>(string)$t,
      'code'=>$tg[$t]['code']??'','topic'=>$tg[$t]['topic']??'',
      'date'=>$tg[$t]['start_date']??'','end'=>$tg[$t]['end_date']??'',
      'pct'=>$calc['pct'],'result'=>$calc['result'],'rated'=>$calc['rated'],
      'total'=>$calc['total'],'attendance'=>$m?$m['att']:$att,'final'=>$fin,
      'ko'=>$calc['koFail'],'koIds'=>$calc['koIds'],'groups'=>$calc['groups'],
      'raters'=>array_values(array_unique($m['raters']??[]))];
  }
  usort($blocks, fn($a,$b)=>strcmp($a['date'],$b['date']));
  $groups=[];
  foreach($gAcc as $gid=>$g)
    $groups[]=['id'=>(string)$gid,'name'=>$g['name'],'avg'=>round($g['sum']/max(1,$g['n']),2)];
  $avg=$nPct?(int)round($sumPct/$nPct):0;
  $result = $nPct===0 ? '' : ($anyFail ? 'fail' : ($avg>=$cfg['merit'] ? 'merit' : 'pass'));
  return ['blocks'=>$blocks,'groups'=>$groups,'avgPct'=>$avg,'result'=>$result,
          'blocksRated'=>$nPct,'blocksTotal'=>count($enrolled),
          'allFinal'=>$allFinal && count($enrolled)>0,'cfg'=>$cfg];
}

/**
 * Zeugnis (ein Block) oder Abschlusszertifikat (ganzer Lehrgang) ausstellen.
 * Der Inhalt wird eingefroren, damit ein spaeter geaenderter Katalog das
 * ausgestellte Papier nicht rueckwirkend veraendert.
 */
function cert_issue(int $sid, int $tgId, string $kind, string $by=''): array {
  $st=q("SELECT * FROM students WHERE id=?",[$sid])->fetch();
  if(!$st) throw new RuntimeException('Teilnehmer nicht gefunden.');
  $state=cert_student_state($sid);
  $kind = $kind==='programme' ? 'programme' : 'block';

  if($kind==='block'){
    $b=null; foreach($state['blocks'] as $x) if((string)$x['training']===(string)$tgId) $b=$x;
    if(!$b) throw new RuntimeException('Fuer diesen Block ist der Teilnehmer nicht eingetragen.');
    if(!$b['final']) throw new RuntimeException('Die Bewertung ist noch nicht abgeschlossen.');
    $pct=$b['pct']; $result=$b['result'];
    $title=trim(($b['code']?$b['code'].' - ':'').$b['topic']);
    $snap=['block'=>$b,'groups'=>$b['groups'],'cfg'=>$state['cfg'],'person'=>cert_person_snap($st)];
  } else {
    if(!$state['allFinal']) throw new RuntimeException('Es sind noch nicht alle Bloecke abgeschlossen.');
    $pct=$state['avgPct']; $result=$state['result'];
    $title=$st['cohort'] ?: 'DVI-Programm';
    $snap=['blocks'=>$state['blocks'],'groups'=>$state['groups'],
           'avgPct'=>$state['avgPct'],'cfg'=>$state['cfg'],'person'=>cert_person_snap($st)];
    $tgId=0;
  }

  // Ein zweites Papier fuer dieselbe Sache ersetzt das erste.
  $old=q("SELECT * FROM certificates WHERE student_id=? AND kind=? AND training_id=? AND revoked=0",
         [$sid,$kind,$tgId])->fetch();
  if($old) q("UPDATE certificates SET revoked=1, revoked_at=?, revoke_reason=? WHERE id=?",
             [now(),'Neuausstellung',$old['id']]);

  $no=cert_number($sid.'|'.$tgId.'|'.$kind);
  q("INSERT INTO certificates(student_id,training_id,kind,cert_no,pct,result,
       student_name,student_rank,student_unit,cohort,title,snapshot,issued_at,issued_by)
     VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    [$sid,$tgId,$kind,$no,$pct,$result,$st['name'],$st['rank_title'],$st['unit'],
     $st['cohort'],$title,json_encode($snap,JSON_UNESCAPED_UNICODE),now(),$by]);
  $id=(int)db()->lastInsertId();
  if($kind==='block')
    q("UPDATE assessments SET cert_no=?, cert_at=? WHERE student_id=? AND training_id=?",
      [$no,now(),$sid,$tgId]);
  return cert_row((int)$id);
}

/** Personenangaben, wie sie beim Ausstellen galten. */
function cert_person_snap(array $st): array {
  return ['firstName'=>$st['first_name']??'','lastName'=>$st['last_name']??'',
    'birthDate'=>$st['birth_date']??'','birthPlace'=>$st['birth_place']??'',
    'nationality'=>$st['nationality']??'','staffNo'=>$st['staff_no']??''];
}
function cert_row(int $id): array {
  $r=q("SELECT * FROM certificates WHERE id=?",[$id])->fetch();
  if(!$r) throw new RuntimeException('Zertifikat nicht gefunden.');
  return cert_pub($r,true);
}
function cert_pub(array $r, bool $full=false): array {
  $snap=json_decode((string)$r['snapshot'],true) ?: [];
  $out=['id'=>(string)$r['id'],'no'=>$r['cert_no'],'kind'=>$r['kind'],
    'student'=>(string)$r['student_id'],'training'=>(string)$r['training_id'],
    'name'=>$r['student_name'],'rank'=>$r['student_rank'],'unit'=>$r['student_unit'],
    'birthDate'=>$snap['person']['birthDate'] ?? '',
    'cohort'=>$r['cohort'],'title'=>$r['title'],'pct'=>(int)$r['pct'],'result'=>$r['result'],
    'issuedAt'=>$r['issued_at'],'issuedBy'=>$r['issued_by'],
    'revoked'=>((int)$r['revoked'])===1,'revokedAt'=>$r['revoked_at'],
    'revokeReason'=>$r['revoke_reason']];
  if($full) $out['snapshot']=$snap;
  return $out;
}
/** Oeffentliche Pruefung - bewusst sparsam: bestaetigt, nennt keine Einzelnoten. */
function cert_verify(string $no): ?array {
  $no=strtoupper(trim($no));
  if($no==='') return null;
  $r=q("SELECT * FROM certificates WHERE UPPER(cert_no)=?",[$no])->fetch();
  if(!$r) return null;
  return ['no'=>$r['cert_no'],'kind'=>$r['kind'],'name'=>$r['student_name'],
    'rank'=>$r['student_rank'],'unit'=>$r['student_unit'],'cohort'=>$r['cohort'],
    'title'=>$r['title'],'result'=>$r['result'],'issuedAt'=>$r['issued_at'],
    'revoked'=>((int)$r['revoked'])===1,'revokedAt'=>$r['revoked_at']];
}

/**
 * Auswertung ueber alle Bloecke.
 * Ein Aufruf liefert alles, was die Analyse braucht - bei dieser Datenmenge
 * (Dutzende Teilnehmer, zwei Dutzend Bloecke) ist das schneller und
 * einfacher als viele Einzelabfragen.
 *
 * Mehrere Bewerter je Teilnehmer und Block werden auf Kriteriumsebene
 * gemittelt und dann einmal gerechnet - so entsteht ein gemeinsames
 * Urteil statt konkurrierender Einzelnoten.
 */
function cert_analytics(): array {
  $cfg=cert_cfg();
  $catAll=cert_catalog(false);          // auch archivierte - alte Namen sollen lesbar bleiben
  $catAct=cert_catalog(true);
  $meta=[];
  foreach($catAll as $g) foreach($g['crits'] as $c)
    $meta[$c['id']]=['gid'=>$g['id'],'group'=>$g['name'],'groupEn'=>$g['nameEn'],
      'name'=>$c['name'],'nameEn'=>$c['nameEn'],'ko'=>$c['ko'],
      'active'=>$c['active']&&$g['active']];

  $tg=[];
  foreach(q("SELECT id,code,topic,start_date FROM trainings ORDER BY start_date,id")->fetchAll() as $r)
    $tg[(string)$r['id']]=['id'=>(string)$r['id'],'code'=>$r['code'],'topic'=>$r['topic'],
      'date'=>$r['start_date'],'people'=>0,'rated'=>0,'final'=>0,'avgPct'=>null,
      'pass'=>0,'merit'=>0,'fail'=>0,'open'=>0,'groups'=>[]];

  $st=[];
  foreach(q("SELECT * FROM students ORDER BY name")->fetchAll() as $r)
    $st[(string)$r['id']]=['id'=>(string)$r['id'],'name'=>$r['name'],'rank'=>$r['rank_title'],
      'unit'=>$r['unit'],'cohort'=>$r['cohort'],'staffNo'=>$r['staff_no'],'email'=>$r['email'],
      'team'=>$r['team']??'','track'=>$r['track']??'',
      'active'=>((int)$r['active'])===1,'blocks'=>[],'avgPct'=>null,'groups'=>[],'crits'=>[],
      'pass'=>0,'merit'=>0,'fail'=>0,'open'=>0,'final'=>0];

  $att=[];
  foreach(q("SELECT * FROM student_training")->fetchAll() as $r){
    $s=(string)$r['student_id']; $t=(string)$r['training_id'];
    if(!isset($st[$s])||!isset($tg[$t])) continue;
    $att[$s.'|'.$t]=(int)$r['attendance'];
    $tg[$t]['people']++;
  }

  /* Bewertungen einsammeln und je Teilnehmer+Block zusammenfuehren */
  $rows=q("SELECT * FROM assessments")->fetchAll();
  $byId=[]; foreach($rows as $r) $byId[(string)$r['id']]=$r;
  $sc=[];
  if($rows){
    foreach(q("SELECT * FROM assessment_scores")->fetchAll() as $x){
      $aid=(string)$x['assessment_id'];
      if(!isset($byId[$aid])) continue;
      $sc[$aid][(string)$x['crit_id']]=(float)$x['score'];
    }
  }
  $merged=[]; $raters=[];
  foreach($rows as $r){
    $s=(string)$r['student_id']; $t=(string)$r['training_id'];
    if(!isset($st[$s])||!isset($tg[$t])) continue;
    $k=$s.'|'.$t;
    if(!isset($merged[$k])) $merged[$k]=['s'=>$s,'t'=>$t,'sum'=>[],'n'=>[],
      'final'=>true,'any'=>false,'att'=>$att[$k]??100,'raters'=>[],'notes'=>[]];
    $m=&$merged[$k];
    $m['any']=true;
    if($r['status']!=='final') $m['final']=false;
    if($r['rater_name']) $m['raters'][]=$r['rater_name'];
    foreach(['strengths','todo','comment'] as $f)
      if(trim((string)$r[$f])!=='') $m['notes'][$f][]=trim((string)$r[$f]);
    if((int)$r['attendance']>0) $m['att']=(int)$r['attendance'];
    foreach($sc[(string)$r['id']]??[] as $cid=>$v){
      $m['sum'][$cid]=($m['sum'][$cid]??0)+$v;
      $m['n'][$cid]=($m['n'][$cid]??0)+1;
    }
    unset($m);
    /* Bewerter-Kalibrierung: wie streng urteilt wer? */
    if($r['rater_name'] && (int)$r['pct']>0){
      $rn=$r['rater_name'];
      $raters[$rn]=$raters[$rn]??['name'=>$rn,'n'=>0,'sum'=>0];
      $raters[$rn]['n']++; $raters[$rn]['sum']+=(int)$r['pct'];
    }
  }

  /* Rechnen - je Paar einmal, mit denselben Regeln wie in der Maske */
  $critSum=[]; $critN=[]; $critLow=[]; $allPct=[];
  foreach($merged as $k=>$m){
    $scores=[];
    foreach($m['sum'] as $cid=>$sum) $scores[$cid]=$sum/max(1,$m['n'][$cid]);
    $calc=cert_calc($catAct,$scores,$m['att']);
    $s=$m['s']; $t=$m['t'];
    $blk=['training'=>$t,'pct'=>$calc['pct'],'result'=>$calc['result'],
      'status'=>$m['final']?'final':'draft','attendance'=>$m['att'],
      'rated'=>$calc['rated'],'total'=>$calc['total'],'ko'=>$calc['koFail'],'koIds'=>$calc['koIds'],
      'raters'=>array_values(array_unique($m['raters'])),
      'groups'=>$calc['groups'],'scores'=>$scores,
      'notes'=>$m['notes']];
    $st[$s]['blocks'][]=$blk;
    if($calc['rated']>0){
      $tg[$t]['rated']++;
      $allPct[]=$calc['pct'];
      $tg[$t]['_sum']=($tg[$t]['_sum']??0)+$calc['pct'];
      $r=$calc['result']?:'open';
      if(isset($tg[$t][$r])) $tg[$t][$r]++;
      if(isset($st[$s][$r])) $st[$s][$r]++;
      foreach($calc['groups'] as $g){
        if($g['avg']===null) continue;
        $tg[$t]['groups'][$g['id']]=$tg[$t]['groups'][$g['id']]??['sum'=>0,'n'=>0];
        $tg[$t]['groups'][$g['id']]['sum']+=$g['avg'];
        $tg[$t]['groups'][$g['id']]['n']++;
        $st[$s]['groups'][$g['id']]=$st[$s]['groups'][$g['id']]??['sum'=>0,'n'=>0];
        $st[$s]['groups'][$g['id']]['sum']+=$g['avg'];
        $st[$s]['groups'][$g['id']]['n']++;
      }
      foreach($scores as $cid=>$v){
        $critSum[$cid]=($critSum[$cid]??0)+$v; $critN[$cid]=($critN[$cid]??0)+1;
        if($v < $cfg['koMin']) $critLow[$cid]=($critLow[$cid]??0)+1;
        $st[$s]['crits'][$cid]=$st[$s]['crits'][$cid]??['sum'=>0,'n'=>0];
        $st[$s]['crits'][$cid]['sum']+=$v; $st[$s]['crits'][$cid]['n']++;
      }
    }
    if($m['final']) { $tg[$t]['final']++; $st[$s]['final']++; }
  }

  foreach($tg as $t=>&$row){
    $row['avgPct']=$row['rated']?(int)round($row['_sum']/$row['rated']):null;
    unset($row['_sum']);
    $row['open']=max(0,$row['people']-$row['rated']);
    foreach($row['groups'] as $gid=>&$g){ $g=round($g['sum']/max(1,$g['n']),2); } unset($g);
  } unset($row);

  foreach($st as $s=>&$row){
    $n=0; $sum=0;
    foreach($row['blocks'] as $b) if($b['rated']>0){ $n++; $sum+=$b['pct']; }
    $row['avgPct']=$n?(int)round($sum/$n):null;
    $row['blocksRated']=$n;
    foreach($row['groups'] as $gid=>&$g){ $g=round($g['sum']/max(1,$g['n']),2); } unset($g);
    foreach($row['crits'] as $cid=>&$c){ $c=round($c['sum']/max(1,$c['n']),2); } unset($c);
    usort($row['blocks'], fn($a,$b)=>strcmp($tg[$a['training']]['date']??'',$tg[$b['training']]['date']??''));
  } unset($row);

  $crits=[];
  foreach($meta as $cid=>$m){
    if(!isset($critN[$cid]) && !$m['active']) continue;   // archiviert und nie benutzt
    $crits[]=['id'=>(string)$cid,'name'=>$m['name'],'nameEn'=>$m['nameEn'],
      'group'=>$m['group'],'groupEn'=>$m['groupEn'],'groupId'=>$m['gid'],
      'ko'=>$m['ko'],'active'=>$m['active'],
      'avg'=>isset($critN[$cid])?round($critSum[$cid]/$critN[$cid],2):null,
      'n'=>$critN[$cid]??0,'low'=>$critLow[$cid]??0];
  }
  foreach($raters as &$r){ $r['avg']=(int)round($r['sum']/max(1,$r['n'])); unset($r['sum']); } unset($r);

  $tot=['students'=>0,'assessed'=>0,'final'=>0,'pass'=>0,'merit'=>0,'fail'=>0,
        'avgPct'=>$allPct?(int)round(array_sum($allPct)/count($allPct)):null,
        'blocks'=>count($tg),'assessments'=>count($merged)];
  foreach($st as $row){
    if(!$row['active']) continue;
    $tot['students']++;
    if($row['blocksRated']>0) $tot['assessed']++;
    $tot['final']+=$row['final']; $tot['pass']+=$row['pass'];
    $tot['merit']+=$row['merit']; $tot['fail']+=$row['fail'];
  }

  return ['ok'=>true,'cfg'=>$cfg,'catalog'=>$catAct,
    'trainings'=>array_values($tg),'students'=>array_values($st),
    'crits'=>$crits,'raters'=>array_values($raters),'totals'=>$tot];
}

/* ============================================================
   XLSX LESEN UND SCHREIBEN - ohne zusaetzliche Bibliothek.
   Eine xlsx-Datei ist ein ZIP mit XML darin. Wir brauchen nur zwei
   Eintraege: die Zeichenkettentabelle und das erste Arbeitsblatt.
   ZipArchive ist auf gemieteten Servern nicht immer da, deshalb lesen
   wir das ZIP notfalls selbst - zlib (gzinflate) genuegt dafuer.
   ============================================================ */

/** Einen Eintrag aus einem ZIP im Speicher holen. Null, wenn es ihn nicht gibt. */
function zip_entry(string $bin, string $name): ?string {
  if(class_exists('ZipArchive') && function_exists('sys_get_temp_dir')){
    $tmp=tempnam(sys_get_temp_dir(),'xls');
    if($tmp!==false){
      file_put_contents($tmp,$bin);
      $z=new ZipArchive();
      if($z->open($tmp)===true){
        $out=$z->getFromName($name);
        $z->close(); @unlink($tmp);
        if($out!==false) return $out;
        return null;
      }
      @unlink($tmp);
    }
  }
  // Eigener Weg: zentrales Verzeichnis am Dateiende suchen und rueckwaerts lesen
  $eocd=strrpos($bin,"PK\x05\x06");
  if($eocd===false) return null;
  $cnt=unpack('v',substr($bin,$eocd+10,2))[1];
  $off=unpack('V',substr($bin,$eocd+16,4))[1];
  $p=$off;
  for($i=0;$i<$cnt;$i++){
    if(substr($bin,$p,4)!=="PK\x01\x02") return null;
    $h=unpack('vmethod/vmtime/vmdate/Vcrc/Vcsize/Vusize/vnlen/velen/vclen/vdisk/viattr/Vattr/Vlocal',
              substr($bin,$p+10,36));
    $nm=substr($bin,$p+46,$h['nlen']);
    if($nm===$name){
      $lp=$h['local'];
      if(substr($bin,$lp,4)!=="PK\x03\x04") return null;
      $lh=unpack('vnlen/velen',substr($bin,$lp+26,4));
      $data=substr($bin,$lp+30+$lh['nlen']+$lh['elen'],$h['csize']);
      if($h['method']===0) return $data;
      if($h['method']===8){ $out=@gzinflate($data); return $out===false?null:$out; }
      return null;
    }
    $p += 46 + $h['nlen'] + $h['elen'] + $h['clen'];
  }
  return null;
}

/** Spaltenbuchstaben in einen Index umrechnen: A=0, B=1 … AA=26. */
function xlsx_col(string $ref): int {
  $n=0;
  for($i=0;$i<strlen($ref);$i++){
    $c=ord($ref[$i]);
    if($c<65||$c>90) break;
    $n=$n*26+($c-64);
  }
  return max(0,$n-1);
}

/**
 * Alle Arbeitsblaetter einer xlsx-Datei als Zeilen-/Spaltenraster.
 *
 * Die Blattreihenfolge steht in xl/workbook.xml, die Zuordnung zur Datei in
 * den zugehoerigen Beziehungen. Auf die Namen sheet1.xml, sheet2.xml … ist
 * kein Verlass: Excel behaelt sie bei, wenn man Blaetter verschiebt, und
 * andere Programme vergeben eigene. Deshalb wird richtig aufgeloest.
 *
 * Zahlen kommen als Text zurueck - fuer Stammdaten ist das richtig,
 * eine Personalnummer ist keine Rechengroesse.
 */
function xlsx_sheets(string $bin, int $maxRows=5000, int $maxSheets=12): array {
  $wbXml = zip_entry($bin,'xl/workbook.xml');
  $rels  = zip_entry($bin,'xl/_rels/workbook.xml.rels');
  $shared=[];
  $ss = zip_entry($bin,'xl/sharedStrings.xml');
  if($ss!==null && preg_match_all('~<si>(.*?)</si>~s',$ss,$m)){
    foreach($m[1] as $si){
      $txt='';
      if(preg_match_all('~<t[^>]*>(.*?)</t>~s',$si,$tm)) $txt=implode('',$tm[1]);
      $shared[]=html_entity_decode($txt,ENT_QUOTES|ENT_XML1,'UTF-8');
    }
  }
  // Beziehung -> Dateiname
  $target=[];
  if($rels!==null && preg_match_all('~<Relationship\b[^>]*>~',$rels,$rm)){
    foreach($rm[0] as $tag){
      if(!preg_match('~Id="([^"]+)"~',$tag,$a)) continue;
      if(!preg_match('~Target="([^"]+)"~',$tag,$b)) continue;
      $t=$b[1];
      $t=preg_replace('~^/xl/~','',$t);
      $t=preg_replace('~^\.?/~','',$t);
      if(strpos($t,'worksheets/')!==0 && strpos($t,'xl/')!==0) $t='worksheets/'.basename($t);
      $target[$a[1]] = (strpos($t,'xl/')===0) ? $t : 'xl/'.$t;
    }
  }
  // Blattreihenfolge aus der Arbeitsmappe
  $list=[];
  if($wbXml!==null && preg_match_all('~<sheet\b[^>]*>~',$wbXml,$sm)){
    foreach($sm[0] as $tag){
      $name = preg_match('~name="([^"]*)"~',$tag,$a)
        ? html_entity_decode($a[1],ENT_QUOTES|ENT_XML1,'UTF-8') : '';
      $rid  = preg_match('~r:id="([^"]+)"~',$tag,$b) ? $b[1] : '';
      $file = $target[$rid] ?? '';
      if($file==='') continue;
      $list[]=['name'=>$name,'file'=>$file];
    }
  }
  // Notnagel, wenn die Arbeitsmappe nicht lesbar ist
  if(!$list){
    for($i=1;$i<=$maxSheets;$i++) $list[]=['name'=>'Blatt '.$i,'file'=>'xl/worksheets/sheet'.$i.'.xml'];
  }

  $out=[];
  foreach($list as $sh){
    if(count($out)>=$maxSheets) break;
    $xml = zip_entry($bin,$sh['file']);
    if($xml===null) continue;
    $out[]=['name'=>$sh['name'],'rows'=>xlsx_sheet_rows($xml,$shared,$maxRows)];
  }
  return $out;
}

/** Ein Arbeitsblatt-XML in Zeilen und Spalten aufloesen. */
function xlsx_sheet_rows(string $sheet, array $shared, int $maxRows=5000): array {
  $rows=[];
  if(!preg_match_all('~<row[^>]*>(.*?)</row>~s',$sheet,$rm)) return [];
  foreach($rm[1] as $ri=>$rowXml){
    if($ri>=$maxRows) break;
    $cells=[];
    if(preg_match_all('~<c([^>]*)/>|<c([^>]*)>(.*?)</c>~s',$rowXml,$cm,PREG_SET_ORDER)){
      foreach($cm as $c){
        $attr = $c[1]!=='' ? $c[1] : ($c[2]??'');
        $body = $c[3]??'';
        $idx = preg_match('~r="([A-Z]+)~',$attr,$am) ? xlsx_col($am[1]) : count($cells);
        $type = preg_match('~t="([^"]+)"~',$attr,$tm2) ? $tm2[1] : 'n';
        $val='';
        if($type==='inlineStr'){
          if(preg_match_all('~<t[^>]*>(.*?)</t>~s',$body,$im)) $val=implode('',$im[1]);
        } elseif(preg_match('~<v>(.*?)</v>~s',$body,$vm)){
          $val=$vm[1];
          if($type==='s'){ $val=$shared[(int)$val] ?? ''; }
        }
        $cells[$idx]=trim(html_entity_decode((string)$val,ENT_QUOTES|ENT_XML1,'UTF-8'));
      }
    }
    if(!$cells){ $rows[]=[]; continue; }
    $out=[];
    for($i=0;$i<=max(array_keys($cells));$i++) $out[]=$cells[$i]??'';
    $rows[]=$out;
  }
  return $rows;
}

/** Erstes Arbeitsblatt - der einfache Fall. */
function xlsx_rows(string $bin, int $maxRows=5000): array {
  $sh=xlsx_sheets($bin,$maxRows,1);
  return $sh ? $sh[0]['rows'] : [];
}

/** Eine xlsx-Datei bauen. $sheets = ['Blattname'=>[[zelle,…],…], …] */
function xlsx_build(array $sheets, array $colWidths=[]): string {
  $names=array_keys($sheets);
  $files=[];
  $esc=fn($v)=>htmlspecialchars((string)$v,ENT_QUOTES|ENT_XML1,'UTF-8');
  $files['[Content_Types].xml']=
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    .'<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
    .'<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
    .'<Default Extension="xml" ContentType="application/xml"/>'
    .'<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'
    .'<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>'
    .implode('',array_map(fn($i)=>'<Override PartName="/xl/worksheets/sheet'.($i+1).'.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>',
        array_keys($names)))
    .'</Types>';
  $files['_rels/.rels']=
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    .'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
    .'<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>'
    .'</Relationships>';
  $files['xl/workbook.xml']=
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    .'<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" '
    .'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>'
    .implode('',array_map(fn($i)=>'<sheet name="'.$esc($names[$i]).'" sheetId="'.($i+1).'" r:id="rId'.($i+1).'"/>',
        array_keys($names)))
    .'</sheets></workbook>';
  $files['xl/_rels/workbook.xml.rels']=
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    .'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
    .implode('',array_map(fn($i)=>'<Relationship Id="rId'.($i+1).'" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet'.($i+1).'.xml"/>',
        array_keys($names)))
    .'<Relationship Id="rId'.(count($names)+1).'" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>'
    .'</Relationships>';
  // Zwei Formate: 0 normal, 1 fett (Kopfzeile), 2 grau kursiv (Hinweis)
  $files['xl/styles.xml']=
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    .'<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
    .'<fonts count="3"><font><sz val="11"/><name val="Calibri"/></font>'
    .'<font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>'
    .'<font><i/><sz val="10"/><color rgb="FF6E7A82"/><name val="Calibri"/></font></fonts>'
    .'<fills count="3"><fill><patternFill patternType="none"/></fill>'
    .'<fill><patternFill patternType="gray125"/></fill>'
    .'<fill><patternFill patternType="solid"><fgColor rgb="FF3E4852"/><bgColor indexed="64"/></patternFill></fill></fills>'
    .'<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>'
    .'<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>'
    .'<cellXfs count="3">'
    .'<xf numFmtId="49" fontId="0" fillId="0" borderId="0" applyNumberFormat="1"/>'
    .'<xf numFmtId="0" fontId="1" fillId="2" borderId="0" applyFont="1" applyFill="1"><alignment vertical="center" wrapText="1"/></xf>'
    .'<xf numFmtId="0" fontId="2" fillId="0" borderId="0" applyFont="1"><alignment wrapText="1"/></xf>'
    .'</cellXfs></styleSheet>';

  $i=0;
  foreach($sheets as $name=>$rows){
    $i++;
    $cols='';
    $w=$colWidths[$name]??[];
    if($w){
      $cols='<cols>';
      foreach($w as $ci=>$width) $cols.='<col min="'.($ci+1).'" max="'.($ci+1).'" width="'.$width.'" customWidth="1" style="0"/>';
      $cols.='</cols>';
    }
    $xml='';
    foreach($rows as $r=>$row){
      $cells='';
      foreach(array_values($row) as $c=>$cell){
        $style=0; $val=$cell;
        if(is_array($cell)){ $val=$cell[0]; $style=(int)($cell[1]??0); }
        if($val==='' && $style===0) continue;
        $ref=xlsx_ref($c,$r+1);
        $cells.='<c r="'.$ref.'" s="'.$style.'" t="inlineStr"><is><t xml:space="preserve">'
               .$esc($val).'</t></is></c>';
      }
      $xml.='<row r="'.($r+1).'">'.$cells.'</row>';
    }
    $files['xl/worksheets/sheet'.$i.'.xml']=
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
      .'<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
      .$cols.'<sheetData>'.$xml.'</sheetData></worksheet>';
  }
  return zip_build($files);
}
/** Zellbezug aus Spalten- und Zeilenindex: 0,1 -> A1 */
function xlsx_ref(int $col, int $row): string {
  $s=''; $c=$col+1;
  while($c>0){ $m=($c-1)%26; $s=chr(65+$m).$s; $c=intdiv($c-1-$m,26); }
  return $s.$row;
}
/** Minimales ZIP (deflate) - genug fuer xlsx. */
function zip_build(array $files): string {
  $out=''; $cd=''; $n=0;
  foreach($files as $name=>$data){
    $crc=crc32($data);
    $comp=gzdeflate($data,6);
    if($comp===false){ $comp=$data; $method=0; } else { $method=8; }
    $off=strlen($out);
    $hdr=pack('vvvvvVVVvv',20,0,$method,0,0,$crc,strlen($comp),strlen($data),strlen($name),0);
    $out.="PK\x03\x04".$hdr.$name.$comp;
    $cd.="PK\x01\x02".pack('v',20).$hdr.pack('vvvVV',0,0,0,0,$off).$name;
    $n++;
  }
  $out.=$cd;
  $out.="PK\x05\x06".pack('vvvvVVv',0,0,$n,$n,strlen($cd),strlen($out)-strlen($cd),0);
  return $out;
}

/* ============================================================
   TEILNEHMER-VORLAGE UND IMPORT
   Die Vorlage geht an den Kunden, ausgefuellt kommt sie zurueck.
   Damit beides zusammenpasst, stehen Spalten und Bedeutung an
   einer Stelle: STUD_COLS.
   ============================================================ */

/** Spalten der Vorlage. Der Import erkennt sie an der Ueberschrift,
    deutsch oder englisch, in beliebiger Reihenfolge. */
function stud_cols(): array {
  return [
    ['key'=>'last_name',  'de'=>'Nachname',       'en'=>'Last name',      'w'=>20,
     'hint_de'=>'Pflichtfeld','hint_en'=>'required'],
    ['key'=>'first_name', 'de'=>'Vorname',        'en'=>'First name',     'w'=>18,
     'hint_de'=>'Pflichtfeld','hint_en'=>'required'],
    ['key'=>'birth_date', 'de'=>'Geburtsdatum',   'en'=>'Date of birth',  'w'=>15,
     'hint_de'=>'JJJJ-MM-TT, z.B. 1988-04-12','hint_en'=>'YYYY-MM-DD, e.g. 1988-04-12'],
    ['key'=>'birth_place','de'=>'Geburtsort',     'en'=>'Place of birth', 'w'=>18,
     'hint_de'=>'optional','hint_en'=>'optional'],
    ['key'=>'gender',     'de'=>'Geschlecht',     'en'=>'Gender',         'w'=>12,
     'hint_de'=>'m / w / d','hint_en'=>'m / f / d'],
    ['key'=>'nationality','de'=>'Nationalität',   'en'=>'Nationality',    'w'=>16,
     'hint_de'=>'optional','hint_en'=>'optional'],
    ['key'=>'rank_title', 'de'=>'Dienstgrad',     'en'=>'Rank',           'w'=>16,
     'hint_de'=>'erscheint auf dem Zertifikat','hint_en'=>'appears on the certificate'],
    ['key'=>'unit',       'de'=>'Einheit',        'en'=>'Unit',           'w'=>22,
     'hint_de'=>'Abteilung oder Dienststelle','hint_en'=>'department or station'],
    ['key'=>'team',       'de'=>'Zelle/Team',     'en'=>'Cell/Team',      'w'=>13,
     'hint_de'=>'z.B. Zelle 1 - kann auch später im Cockpit gesetzt werden','hint_en'=>'e.g. Cell 1 - can also be set later in the cockpit'],
    ['key'=>'track',      'de'=>'Gruppe',         'en'=>'Group',          'w'=>17,
     'hint_de'=>'z.B. Teilnehmer oder Train-the-Trainer','hint_en'=>'e.g. Participant or Train-the-Trainer'],
    ['key'=>'staff_no',   'de'=>'Personalnummer', 'en'=>'Staff number',   'w'=>16,
     'hint_de'=>'als Text, führende Nullen bleiben erhalten','hint_en'=>'as text, leading zeros are kept'],
    ['key'=>'email',      'de'=>'E-Mail',         'en'=>'E-mail',         'w'=>26,
     'hint_de'=>'für Rückfragen','hint_en'=>'for queries'],
    ['key'=>'phone',      'de'=>'Telefon',        'en'=>'Phone',          'w'=>18,
     'hint_de'=>'optional','hint_en'=>'optional'],
    ['key'=>'cohort',     'de'=>'Lehrgang',       'en'=>'Course',         'w'=>18,
     'hint_de'=>'leer lassen, wenn im Cockpit gesetzt','hint_en'=>'leave empty if set in the cockpit'],
    ['key'=>'note',       'de'=>'Bemerkung',      'en'=>'Note',           'w'=>26,
     'hint_de'=>'z.B. Vorkenntnisse','hint_en'=>'e.g. prior knowledge'],
  ];
}

/**
 * 20 Beispielpersonen. Sie stehen direkt im Erfassungsblatt der Vorlage
 * und werden beim Einlesen GANZ NORMAL uebernommen - das ist Absicht:
 * Vorlage herunterladen, unveraendert einlesen, 20 Teilnehmer sehen.
 * So prueft man in einer Minute, dass der Weg funktioniert. Der Kunde
 * ersetzt die Zeilen einfach durch seine Leute.
 */
function stud_examples(): array {
  return [
    ['Al Mazrouei','Ahmed','1988-04-12','Abu Dhabi','m','UAE','Captain','Forensic Unit','Zelle 1','Teilnehmer','4401','ahmed.almazrouei@example.ae','+971 50 000 0001','',''],
    ['Al Suwaidi','Fatima','1991-11-03','Al Ain','w','UAE','Lieutenant','Family Liaison','Zelle 1','Teilnehmer','4402','fatima.alsuwaidi@example.ae','+971 50 000 0002','','Arabisch, Englisch'],
    ['Al Nuaimi','Khalid','1985-02-27','Sharjah','m','UAE','Sergeant','Scene Recovery','Zelle 1','Teilnehmer','04403','khalid.alnuaimi@example.ae','+971 50 000 0003','',''],
    ['Al Ketbi','Mariam','1993-07-19','Abu Dhabi','w','UAE','Lieutenant','Data Management','Zelle 1','Teilnehmer','4404','mariam.alketbi@example.ae','+971 50 000 0004','','PlassData geschult'],
    ['Al Shamsi','Omar','1987-01-08','Dubai','m','UAE','Captain','Mortuary Operations','Zelle 1','Teilnehmer','4405','omar.alshamsi@example.ae','+971 50 000 0005','',''],
    ['Al Marri','Yousef','1982-03-07','Abu Dhabi','m','UAE','Major','Identification Board','Zelle 2','Teilnehmer','4406','yousef.almarri@example.ae','+971 50 000 0006','',''],
    ['Al Blooshi','Noura','1990-12-01','Abu Dhabi','w','UAE','Captain','Ante Mortem','Zelle 2','Teilnehmer','4407','noura.alblooshi@example.ae','+971 50 000 0007','',''],
    ['Al Hosani','Saeed','1986-09-22','Al Ain','m','UAE','Sergeant','Scene Recovery','Zelle 2','Teilnehmer','4408','saeed.alhosani@example.ae','+971 50 000 0008','',''],
    ['Al Zaabi','Layla','1992-08-14','Dubai','w','UAE','Captain','Ante Mortem','Zelle 2','Teilnehmer','4409','layla.alzaabi@example.ae','+971 50 000 0009','',''],
    ['Al Rashid','Hassan','1989-05-05','Abu Dhabi','m','UAE','Major','CID','Zelle 2','Teilnehmer','4410','hassan.alrashid@example.ae','+971 50 000 0010','',''],
    ['Al Dhaheri','Aisha','1994-02-17','Abu Dhabi','w','UAE','Lieutenant','Post Mortem','Zelle 3','Teilnehmer','4411','aisha.aldhaheri@example.ae','+971 50 000 0011','',''],
    ['Al Kaabi','Salem','1983-10-30','Fujairah','m','UAE','Major','Logistics','Zelle 3','Teilnehmer','4412','salem.alkaabi@example.ae','+971 50 000 0012','',''],
    ['Al Mansoori','Hessa','1995-06-09','Abu Dhabi','w','UAE','Sergeant','Data Management','Zelle 3','Teilnehmer','4413','hessa.almansoori@example.ae','+971 50 000 0013','',''],
    ['Al Ameri','Rashid','1984-04-21','Al Ain','m','UAE','Captain','Scene Management','Zelle 3','Teilnehmer','4414','rashid.alameri@example.ae','+971 50 000 0014','',''],
    ['Al Falasi','Maitha','1990-01-25','Dubai','w','UAE','Lieutenant','Family Liaison','Zelle 3','Teilnehmer','4415','maitha.alfalasi@example.ae','+971 50 000 0015','',''],
    ['Al Habsi','Sultan','1988-07-13','Abu Dhabi','m','UAE','Sergeant','Mortuary Operations','','Train-the-Trainer','4416','sultan.alhabsi@example.ae','+971 50 000 0016','',''],
    ['Al Qubaisi','Salama','1992-11-28','Abu Dhabi','w','UAE','Captain','Quality Control','','Train-the-Trainer','4417','salama.alqubaisi@example.ae','+971 50 000 0017','',''],
    ['Al Muhairi','Tariq','1986-03-16','Sharjah','m','UAE','Lieutenant','Reconciliation','','Train-the-Trainer','4418','tariq.almuhairi@example.ae','+971 50 000 0018','',''],
    ['Al Romaithi','Shamma','1993-09-04','Abu Dhabi','w','UAE','Sergeant','Ante Mortem','','Train-the-Trainer','4419','shamma.alromaithi@example.ae','+971 50 000 0019','',''],
    ['Al Hammadi','Majid','1981-12-19','Ras Al Khaimah','m','UAE','Major','Command & Control','','Train-the-Trainer','4420','majid.alhammadi@example.ae','+971 50 000 0020','',''],
  ];
}

/**
 * Die Vorlage als xlsx: ein Erfassungsblatt mit 20 Beispielzeilen und ein
 * Hinweisblatt. Bewusst kein getrenntes Beispielblatt mehr - was in der
 * Datei steht, wird uebernommen. Unveraendert eingelesen ergibt die
 * Vorlage also genau 20 Teilnehmer; das ist der eingebaute Selbsttest.
 */
function stud_template_xlsx(string $lang='de'): string {
  $de = $lang!=='en';
  $cols=stud_cols();
  $head=array_map(fn($c)=>[$de?$c['de']:$c['en'],1],$cols);
  $w=array_map(fn($c)=>$c['w'],$cols);

  $sheet1=[$head];
  foreach(stud_examples() as $r) $sheet1[]=$r;

  $t = $de ? [
    'h'=>'So füllen Sie die Liste aus',
    'i1'=>'1. Im Blatt „Teilnehmer“ stehen 20 BEISPIELZEILEN (erfundene Personen). Ersetzen Sie sie durch Ihre Teilnehmer - eine Zeile, eine Person. Nicht gebrauchte Zeilen löschen.',
    'i2'=>'2. Nachname und Vorname sind Pflicht. Alles andere hilft uns, ist aber freiwillig.',
    'i3'=>'3. Die Spalten dürfen Sie umsortieren - wir erkennen sie an der Überschrift. Löschen Sie die Überschriftszeile bitte nicht.',
    'i4'=>'4. Alles, was im Blatt „Teilnehmer“ steht, wird übernommen - auch nicht ersetzte Beispielzeilen. Bitte deshalb wirklich ersetzen oder löschen.',
    'i5'=>'5. Speichern Sie die Datei als .xlsx und senden Sie sie zurück. Auch .csv (Semikolon) geht.',
    'i6'=>'6. Die Angaben erscheinen auf Zeugnis und Zertifikat. Bitte in der Schreibweise, die dort stehen soll.',
    'ch'=>'Spalte','me'=>'Bedeutung',
    'p'=>'Datenschutz: Wir verarbeiten diese Angaben ausschließlich zur Durchführung und Zertifizierung des Lehrgangs.',
  ] : [
    'h'=>'How to fill in this list',
    'i1'=>'1. The "Participants" sheet contains 20 EXAMPLE ROWS (fictitious people). Replace them with your participants - one row, one person. Delete unused rows.',
    'i2'=>'2. Last name and first name are required. Everything else helps us but is optional.',
    'i3'=>'3. You may reorder the columns - we recognise them by their heading. Please do not delete the heading row.',
    'i4'=>'4. Everything on the "Participants" sheet is imported - including example rows you did not replace. So please really replace or delete them.',
    'i5'=>'5. Save the file as .xlsx and send it back. A .csv (semicolon separated) also works.',
    'i6'=>'6. The details appear on the report and the certificate. Please use the spelling that should appear there.',
    'ch'=>'Column','me'=>'Meaning',
    'p'=>'Data protection: we process these details solely to run and certify the course.',
  ];
  $sheet3=[[[$t['h'],1],['',1]],[[STUD_TPL_HELP.' - '.($de?'Anleitung, kein Erfassungsblatt':'instructions, not a data sheet'),2]],[]];
  foreach(['i1','i2','i3','i4','i5','i6'] as $k) $sheet3[]=[$t[$k]];
  $sheet3[]=[];
  $sheet3[]=[[$t['ch'],1],[$t['me'],1]];
  foreach($cols as $c) $sheet3[]=[$de?$c['de']:$c['en'], $de?$c['hint_de']:$c['hint_en']];
  $sheet3[]=[];
  $sheet3[]=[[$t['p'],2]];

  $n1 = $de?'Teilnehmer':'Participants';
  $n3 = $de?'Hinweise':'Notes';
  return xlsx_build([$n1=>$sheet1, $n3=>$sheet3], [$n1=>$w, $n3=>[46,60]]);
}

/** Ueberschrift einer Spalte auf einen Feldnamen abbilden. */
function stud_col_key(string $head): string {
  $h=function_exists('mb_strtolower') ? mb_strtolower(trim($head),'UTF-8') : strtolower(trim($head));
  $h=str_replace(['ä','ö','ü','ß','.','-','_','/','(',')'],['ae','oe','ue','ss','','','','','',''],$h);
  $h=preg_replace('/\s+/','',$h);
  static $map=null;
  if($map===null){
    $map=[];
    foreach(stud_cols() as $c){
      foreach([$c['de'],$c['en']] as $lbl){
        $k=function_exists('mb_strtolower') ? mb_strtolower($lbl,'UTF-8') : strtolower($lbl);
        $k=str_replace(['ä','ö','ü','ß','.','-','_','/','(',')'],['ae','oe','ue','ss','','','','','',''],$k);
        $map[preg_replace('/\s+/','',$k)]=$c['key'];
      }
    }
    // haeufige Abweichungen, die Kunden so schreiben
    $map += [
      'name'=>'last_name','familienname'=>'last_name','surname'=>'last_name','nachnamefamilienname'=>'last_name',
      'firstname'=>'first_name','givenname'=>'first_name','vornamen'=>'first_name',
      'geburtstag'=>'birth_date','dob'=>'birth_date','geb'=>'birth_date','geburtsdatumjjjjmmtt'=>'birth_date',
      'rang'=>'rank_title','dienstgradrang'=>'rank_title','grade'=>'rank_title',
      'abteilung'=>'unit','dienststelle'=>'unit','department'=>'unit','einheitabteilung'=>'unit',
      'personalnr'=>'staff_no','persnr'=>'staff_no','idnr'=>'staff_no','staffno'=>'staff_no','badgenumber'=>'staff_no',
      'mail'=>'email','emailadresse'=>'email','emailaddress'=>'email',
      'telefonnummer'=>'phone','mobil'=>'phone','mobile'=>'phone',
      'kurs'=>'cohort','lehrgangkurs'=>'cohort','course'=>'cohort','kohorte'=>'cohort',
      'bemerkungen'=>'note','notiz'=>'note','notes'=>'note','remark'=>'note',
      'staatsangehoerigkeit'=>'nationality','citizenship'=>'nationality',
      'zelle'=>'team','team'=>'team','cell'=>'team','zelleteam'=>'team','zellenr'=>'team',
      'gruppe'=>'track','track'=>'track','programm'=>'track','ttt'=>'track','ausbildungsgang'=>'track',
      'sex'=>'gender','geschlechtmwd'=>'gender',
    ];
  }
  return $map[$h] ?? '';
}

/** Datum vereinheitlichen: 12.04.1988, 12/04/1988 und Excel-Tageszahlen. */
function stud_date(string $v): string {
  $v=trim($v);
  if($v==='') return '';
  if(preg_match('/^(\d{4})-(\d{2})-(\d{2})/',$v,$m)) return $m[1].'-'.$m[2].'-'.$m[3];
  if(preg_match('~^(\d{1,2})[./](\d{1,2})[./](\d{4})$~',$v,$m))
    return sprintf('%04d-%02d-%02d',$m[3],$m[2],$m[1]);
  // Excel zaehlt Tage ab dem 30.12.1899
  if(ctype_digit($v) && (int)$v>10000 && (int)$v<80000)
    return gmdate('Y-m-d', ((int)$v - 25569) * 86400);
  return $v;
}

/** Erkennungszeichen im Beispielblatt der Vorlage. */
/** Erkennungszeichen im Hinweisblatt der Vorlage. */
const STUD_TPL_HELP = 'ETAF-HINWEISE';

/**
 * Aus einer hochgeladenen Datei die Teilnehmerzeilen herausschaelen.
 *
 * Gelesen werden ALLE Blaetter, nicht nur das erste - Deckblaetter,
 * verschobene Blaetter und Titelzeilen stoeren nicht. Uebersprungen wird
 * einzig das Hinweisblatt der eigenen Vorlage. Alles andere gilt:
 * WAS IN DER DATEI STEHT, WIRD UEBERNOMMEN. Keine stillen Filter -
 * wer die unveraenderte Vorlage einliest, bekommt ihre 20 Beispielzeilen
 * und sieht damit sofort, dass der Weg funktioniert.
 *
 * Rueckgabe: sheets (mit Befund je Blatt), head, people, error.
 */
function stud_parse_file(string $bin): array {
  $R=['sheets'=>[],'sheet'=>'','head'=>[],'rows'=>[],'start'=>0,'people'=>[],'error'=>''];
  $isZip = substr($bin,0,2)==="PK";

  $sheets=[];
  if($isZip){
    $sheets=xlsx_sheets($bin);
    if(!$sheets){ $R['error']='nozip'; return $R; }
  } else {
    $sheets[]=['name'=>'CSV','rows'=>stud_csv_rows($bin)];
  }

  $all=[]; $seen=[]; $bestHead=[]; $bestSheet='';
  foreach($sheets as $s){
    $info=['name'=>$s['name'],'rows'=>count($s['rows']),'people'=>0,'skipped'=>''];
    if(stud_sheet_is_helper($s)){ $info['skipped']='Hinweisblatt'; $R['sheets'][]=$info; continue; }
    $hit=stud_find_head($s['rows']);
    if(!$hit){ $info['skipped']='keine Kopfzeile'; $R['sheets'][]=$info; continue; }
    $people=stud_rows_to_people($s['rows'],$hit['map'],$hit['start']);
    $take=0;
    foreach($people as $p){
      if($p['skip']===''){
        $k=mb_strtolower_x($p['name']);
        if(isset($seen[$k])) continue;           // dieselbe Person auf zwei Blaettern
        $seen[$k]=true; $take++;
      }
      $p['sheet']=$s['name'];
      $all[]=$p;
    }
    $info['people']=$take;
    $R['sheets'][]=$info;
    if(count(array_unique($hit['map']))>count(array_unique($bestHead)) || $bestSheet===''){
      $bestHead=$hit['map']; $bestSheet=$s['name'];
    }
    if(!$R['rows']) $R['rows']=array_slice($s['rows'],0,60);
  }

  if(!$bestHead){
    $R['error']='nohead';
    $R['sheet']=$sheets[0]['name'];
    $R['rows']=array_slice($sheets[0]['rows'],0,8);
    return $R;
  }
  // Doppelte ueber die Blaetter hinweg nur einmal ausgeben
  $out=[]; $seen2=[];
  foreach($all as $p){
    if($p['skip']===''){
      $k=mb_strtolower_x($p['name']);
      if(isset($seen2[$k])) continue;
      $seen2[$k]=true;
    }
    $out[]=$p;
  }
  // Genannt wird das Blatt, aus dem die Leute tatsaechlich kommen -
  // nicht das mit der schoensten Kopfzeile.
  $from=[];
  foreach($out as $p) if($p['skip']==='') $from[$p['sheet']]=($from[$p['sheet']]??0)+1;
  if($from){ arsort($from); $bestSheet=array_key_first($from); }
  $R['sheet']=$bestSheet; $R['head']=$bestHead; $R['people']=$out;
  $R['from']=$from;
  return $R;
}

/** Kleinschreibung auch ohne mbstring. */
function mb_strtolower_x(string $s): string {
  return function_exists('mb_strtolower') ? mb_strtolower($s,'UTF-8') : strtolower($s);
}

/**
 * Nur das Hinweisblatt ueberspringen. Das Beispielblatt wird ganz normal
 * gelesen: Wer seine Leute unter die Musterzeilen tippt, soll sie
 * wiederfinden. Die fuenf erfundenen Personen fallen an anderer Stelle
 * ueber ihren Namen heraus.
 */
function stud_sheet_is_helper(array $sheet): bool {
  $n=mb_strtolower_x(trim((string)$sheet['name']));
  if(in_array($n,['hinweise','notes','anleitung','instructions'],true)) return true;
  foreach(array_slice($sheet['rows'],0,3) as $r){
    foreach((array)$r as $c){
      if(stripos((string)$c, STUD_TPL_HELP)!==false) return true;
    }
  }
  return false;
}

/** CSV robust zerlegen: Zeichensatz und Trennzeichen erraten. */
function stud_csv_rows(string $bin): array {
  if(substr($bin,0,3)==="\xEF\xBB\xBF") $bin=substr($bin,3);
  if(!preg_match('//u',$bin)){
    $bin = function_exists('mb_convert_encoding')
      ? mb_convert_encoding($bin,'UTF-8','Windows-1252')
      : utf8_encode($bin);
  }
  $first=strtok($bin,"\n");
  $sep=';';
  foreach([';' => substr_count($first,';'), ',' => substr_count($first,','),
           "\t"=> substr_count($first,"\t")] as $c=>$n){
    if($n>substr_count($first,$sep)) $sep=$c;
  }
  $rows=[];
  foreach(preg_split('/\r?\n/',$bin) as $line){
    if(trim($line)==='') { $rows[]=[]; continue; }
    $rows[]=array_map(fn($x)=>trim((string)$x),str_getcsv($line,$sep,'"',''));
  }
  return $rows;
}

/** Kopfzeile suchen: erste Zeile mit mindestens zwei erkannten Spalten. */
function stud_find_head(array $rows): ?array {
  $single=null;
  foreach($rows as $ri=>$r){
    if($ri>14) break;
    if(!is_array($r)) continue;
    $m=[];
    foreach($r as $ci=>$h){ $k=stud_col_key((string)$h); if($k) $m[$ci]=$k; }
    $u=array_unique($m);
    if(count($u)>=2) return ['map'=>$m,'start'=>$ri+1];
    // Eine blanke Namensspalte ist auch eine Liste - merken und nur nehmen,
    // wenn sich nichts Besseres findet.
    if($single===null && count($u)===1 && in_array(reset($u),['last_name','first_name'],true)
       && isset($rows[$ri+1]) && trim(implode('',(array)$rows[$ri+1]))!=='')
      $single=['map'=>$m,'start'=>$ri+1];
  }
  return $single;
}

/** Datenzeilen in fertige Personensaetze umwandeln. */
function stud_rows_to_people(array $rows, array $map, int $start): array {
  $out=[];
  for($ri=$start; $ri<count($rows); $ri++){
    $r=$rows[$ri];
    if(!is_array($r)) continue;
    $f=['last_name'=>'','first_name'=>'','birth_date'=>'','birth_place'=>'','gender'=>'',
        'nationality'=>'','rank_title'=>'','unit'=>'','staff_no'=>'','email'=>'',
        'phone'=>'','cohort'=>'','note'=>'','team'=>'','track'=>''];
    foreach($map as $ci=>$key) if(isset($r[$ci])) $f[$key]=trim((string)$r[$ci]);
    if(implode('',$f)==='') continue;
    // Eine zweite Kopfzeile (kopierter Block) ist keine Person
    if(stud_col_key($f['last_name'])==='last_name' || stud_col_key($f['first_name'])==='first_name') continue;
    // Und eine Zeile, in der nur eine Spaltenbezeichnung steht, auch nicht -
    // so rutschen Erlaeuterungstabellen nicht als Personen durch.
    $filled=array_filter($f, fn($v)=>trim((string)$v)!=='');
    if(count($filled)===1 && stud_col_key((string)reset($filled))!=='') continue;
    $name=trim($f['first_name'].' '.$f['last_name']);
    if($name===''){ $out[]=['row'=>$ri+1,'skip'=>'noname']+$f; continue; }
    $f['birth_date']=stud_date($f['birth_date']);
    $out[]=['row'=>$ri+1,'skip'=>'','name'=>$name]+$f;
  }
  return $out;
}

/**
 * Hochgeladene Datei aus dem Aufruf holen - und den haeufigsten Stolperstein
 * benennen: ist der Rumpf groesser als post_max_size, wirft PHP ihn weg und
 * die Anfrage kommt leer an. Ohne diesen Hinweis sucht man an der falschen
 * Stelle.
 */
function stud_upload_bin(array $in): string {
  $raw=(string)($in['file']??'');
  if($raw===''){
    $len=(int)($_SERVER['CONTENT_LENGTH'] ?? 0);
    $max=stud_post_max();
    if($max>0 && $len>$max)
      fail('Die Datei ist fuer diesen Server zu gross (Grenze '.round($max/1048576,1).' MB). '
          .'Bitte die Liste als CSV speichern oder in zwei Teile zerlegen.');
    fail('Es kam keine Datei an.');
  }
  $bin=base64_decode(preg_replace('~^data:[^,]*,~','',$raw), true);
  if($bin===false || $bin==='') fail('Die Datei konnte nicht gelesen werden.');
  if(strlen($bin)>8*1024*1024) fail('Die Datei ist groesser als 8 MB.');
  return $bin;
}
/** post_max_size in Bytes, 0 wenn unbegrenzt. */
function stud_post_max(): int {
  $v=trim((string)ini_get('post_max_size'));
  if($v===''||$v==='0'||$v==='-1') return 0;
  $u=strtolower(substr($v,-1)); $n=(float)$v;
  if($u==='g') $n*=1073741824; elseif($u==='m') $n*=1048576; elseif($u==='k') $n*=1024;
  return (int)$n;
}
