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

/** Login mit PIN, gibt Session-Token zurück (mit einfachem Rate-Limit). */
function do_login(string $pin): array {
  $ip=client_ip();
  $row=q("SELECT cnt,window_start FROM login_attempts WHERE ip=?",[$ip])->fetch();
  $win=$row['window_start']??null; $cnt=(int)($row['cnt']??0);
  if($win && (strtotime($win) > time()-600) && $cnt>=8){
    fail('Zu viele Versuche. Bitte in ein paar Minuten erneut probieren.',429);
  }
  $hash=config_get('pin_hash');
  if(!$hash || !password_verify($pin, $hash)){
    if(!$win || strtotime($win) <= time()-600){
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
  $trainers=array_map(function($r){
    return [
      'id'=>(string)$r['id'], 'name'=>$r['name'], 'email'=>$r['email'], 'phone'=>$r['phone'],
      'spec'=>json_decode($r['spec']?:'[]',true), 'region'=>$r['region'],
      'langs'=>json_decode($r['langs']?:'[]',true),
      'uae'=>(bool)$r['uae'], 'load'=>(int)$r['load_lvl'],
      'color'=>$r['color'], 'rating'=>$r['rating'],
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
        'room'=>$tv['room'],'notes'=>$tv['notes']]; }
    }
    unset($e);
  }

  $trainings=array_map(function($r) use ($byT){
    return [
      'id'=>(string)$r['id'], 'topic'=>$r['topic'], 'city'=>$r['city'], 'country'=>$r['country'],
      'kw'=>$r['kw'], 'month'=>$r['month'], 'spec'=>$r['spec'],
      'need'=>(int)$r['need_cnt'], 'participants'=>(int)$r['participants'],
      'travel'=>[
        'venue'=>$r['venue']??'', 'hotel'=>$r['hotel']??'', 'hotelAddr'=>$r['hotel_addr']??'',
        'meetingPoint'=>$r['meeting_point']??'', 'contactName'=>$r['contact_name']??'',
        'contactPhone'=>$r['contact_phone']??'', 'dresscode'=>$r['dresscode']??'',
        'perDiem'=>$r['per_diem']??'', 'notes'=>$r['travel_notes']??'',
        'agenda'=>json_decode($r['agenda']?:'[]',true) ?: [],
      ],
      'roster'=>$byT[(string)$r['id']] ?? [],
    ];
  }, q("SELECT * FROM trainings ORDER BY id")->fetchAll());

  $templates=array_map(function($r){
    return ['id'=>$r['id'],
      'de'=>['name'=>$r['de_name'],'subject'=>$r['de_subject'],'body'=>$r['de_body']],
      'en'=>['name'=>$r['en_name'],'subject'=>$r['en_subject'],'body'=>$r['en_body']]];
  }, q("SELECT * FROM templates ORDER BY id")->fetchAll());

  return ['ok'=>true,'lang'=>'de','emailLang'=>'en',
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

function base_url(): string {
  $c=cfg();
  if(!empty($c['base_url'])) return rtrim($c['base_url'],'/');
  $https=(!empty($_SERVER['HTTPS'])&&$_SERVER['HTTPS']!=='off')||($_SERVER['SERVER_PORT']??'')==='443';
  $host=$_SERVER['HTTP_HOST']??'localhost';
  $dir=rtrim(dirname($_SERVER['SCRIPT_NAME']??'/'),'/'); // .../backend
  return ($https?'https':'http').'://'.$host.$dir;
}
