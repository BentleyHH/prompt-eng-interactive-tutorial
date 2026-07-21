<?php
/**
 * ETAF — Datenschicht (PDO, MySQL + SQLite kompatibel)
 * Self-provisioning: legt Tabellen bei Bedarf an und seedet Demo-Daten.
 */

function cfg(): array {
  static $c=null;
  if($c===null){
    $f=__DIR__.'/config.php';
    $c = is_file($f) ? require $f : require __DIR__.'/config.sample.php';
  }
  return $c;
}

function db(): PDO {
  static $pdo=null;
  if($pdo) return $pdo;
  $c=cfg();
  if(($c['driver']??'mysql')==='sqlite'){
    $pdo=new PDO('sqlite:'.$c['sqlite_path']);
    $pdo->exec('PRAGMA foreign_keys=ON');
  } else {
    $dsn=sprintf('mysql:host=%s;dbname=%s;charset=%s',$c['db_host'],$c['db_name'],$c['db_charset']??'utf8mb4');
    $pdo=new PDO($dsn,$c['db_user'],$c['db_pass']);
  }
  $pdo->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
  $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE,PDO::FETCH_ASSOC);
  return $pdo;
}

function is_sqlite(): bool { return (cfg()['driver']??'mysql')==='sqlite'; }

/** Prepared query helper */
function q(string $sql, array $params=[]): PDOStatement {
  $st=db()->prepare($sql);
  $st->execute($params);
  return $st;
}
function now(): string { return gmdate('Y-m-d H:i:s'); }
function token(int $len=32): string { return bin2hex(random_bytes($len/2)); }

/** Schema anlegen (idempotent) + Seed */
function ensure_schema(): void {
  $pk = is_sqlite() ? 'INTEGER PRIMARY KEY AUTOINCREMENT' : 'INT UNSIGNED AUTO_INCREMENT PRIMARY KEY';
  $eng = is_sqlite() ? '' : ' ENGINE=InnoDB DEFAULT CHARSET=utf8mb4';
  $d=db();

  $d->exec("CREATE TABLE IF NOT EXISTS app_config (
    k VARCHAR(64) PRIMARY KEY, v TEXT)$eng");

  $d->exec("CREATE TABLE IF NOT EXISTS sessions (
    token VARCHAR(64) PRIMARY KEY, created_at VARCHAR(20), last_seen VARCHAR(20))$eng");

  $d->exec("CREATE TABLE IF NOT EXISTS login_attempts (
    ip VARCHAR(64) PRIMARY KEY, cnt INT, window_start VARCHAR(20))$eng");

  $d->exec("CREATE TABLE IF NOT EXISTS trainers (
    id $pk,
    name VARCHAR(160), email VARCHAR(190), phone VARCHAR(64),
    spec TEXT, region VARCHAR(64), langs TEXT,
    uae INT DEFAULT 0, load_lvl INT DEFAULT 0,
    color VARCHAR(16), rating VARCHAR(8),
    created_at VARCHAR(20))$eng");

  $d->exec("CREATE TABLE IF NOT EXISTS trainings (
    id $pk,
    topic VARCHAR(190), city VARCHAR(96), country VARCHAR(16),
    kw VARCHAR(24), month VARCHAR(24), spec VARCHAR(96),
    need_cnt INT DEFAULT 5, participants INT DEFAULT 0,
    venue VARCHAR(255), hotel VARCHAR(190), hotel_addr VARCHAR(255),
    meeting_point VARCHAR(255), contact_name VARCHAR(160), contact_phone VARCHAR(64),
    dresscode VARCHAR(160), per_diem VARCHAR(64), travel_notes TEXT, agenda TEXT,
    created_at VARCHAR(20))$eng");

  // Reisedaten je Trainer (Flug, Zimmer, Visum)
  $d->exec("CREATE TABLE IF NOT EXISTS travel (
    id $pk,
    training_id INT, trainer_id INT,
    arrival VARCHAR(48), departure VARCHAR(48),
    flight_out VARCHAR(190), flight_return VARCHAR(190),
    room VARCHAR(48), notes TEXT,
    visa_status VARCHAR(16) DEFAULT 'none', passport_expiry VARCHAR(20),
    visa_notes TEXT, visa_reminded INT DEFAULT 0,
    updated_at VARCHAR(20))$eng");

  $d->exec("CREATE TABLE IF NOT EXISTS templates (
    id VARCHAR(16) PRIMARY KEY,
    de_name VARCHAR(120), de_subject VARCHAR(255), de_body TEXT,
    en_name VARCHAR(120), en_subject VARCHAR(255), en_body TEXT)$eng");

  $d->exec("CREATE TABLE IF NOT EXISTS requests (
    id $pk,
    training_id INT, trainer_id INT,
    status VARCHAR(16) DEFAULT 'asked',
    lang VARCHAR(4) DEFAULT 'en',
    tok VARCHAR(64),
    note TEXT,
    created_at VARCHAR(20), responded_at VARCHAR(20))$eng");

  $d->exec("CREATE TABLE IF NOT EXISTS email_log (
    id $pk,
    training_id INT, trainer_id INT, to_email VARCHAR(190),
    subject VARCHAR(255), body TEXT, lang VARCHAR(4),
    status VARCHAR(16), created_at VARCHAR(20))$eng");

  // PIN einmalig setzen
  if(!config_get('pin_hash')){
    config_set('pin_hash', password_hash(cfg()['default_pin'], PASSWORD_DEFAULT));
  }
  if(!config_get('org_name')) config_set('org_name', cfg()['org_name']);

  // Migrationen (idempotent): Erinnerungs-Spalten für requests
  try{ db()->exec("ALTER TABLE requests ADD COLUMN reminded_at VARCHAR(20)"); }catch(Throwable $e){}
  try{ db()->exec("ALTER TABLE requests ADD COLUMN reminder_count INT DEFAULT 0"); }catch(Throwable $e){}
  // Migrationen (idempotent): Reise-Spalten für trainings
  foreach([
    "venue VARCHAR(255)","hotel VARCHAR(190)","hotel_addr VARCHAR(255)",
    "meeting_point VARCHAR(255)","contact_name VARCHAR(160)","contact_phone VARCHAR(64)",
    "dresscode VARCHAR(160)","per_diem VARCHAR(64)","travel_notes TEXT","agenda TEXT"
  ] as $col){ try{ db()->exec("ALTER TABLE trainings ADD COLUMN $col"); }catch(Throwable $e){} }
  // Migrationen (idempotent): Visum-Spalten für travel
  foreach([
    "visa_status VARCHAR(16) DEFAULT 'none'","passport_expiry VARCHAR(20)",
    "visa_notes TEXT","visa_reminded INT DEFAULT 0"
  ] as $col){ try{ db()->exec("ALTER TABLE travel ADD COLUMN $col"); }catch(Throwable $e){} }

  // Automatik-Standardwerte
  $ac=cfg();
  if(config_get('reminder_hours')===null) config_set('reminder_hours',(string)($ac['reminder_hours']??48));
  if(config_get('escalate_hours')===null) config_set('escalate_hours',(string)($ac['escalate_hours']??72));
  if(config_get('auto_advance')===null)   config_set('auto_advance', !empty($ac['auto_advance'])?'1':'0');

  // Demo-Seed
  if((cfg()['seed_demo']??false) && (int)q("SELECT COUNT(*) c FROM trainers")->fetch()['c']===0){
    seed_demo();
  }
  // Vorlagen sicherstellen
  if((int)q("SELECT COUNT(*) c FROM templates")->fetch()['c']===0){
    seed_templates();
  }
}

function config_get(string $k){
  $r=q("SELECT v FROM app_config WHERE k=?",[$k])->fetch();
  return $r ? $r['v'] : null;
}
function config_set(string $k,string $v): void {
  if(is_sqlite()){
    q("INSERT INTO app_config(k,v) VALUES(?,?) ON CONFLICT(k) DO UPDATE SET v=excluded.v",[$k,$v]);
  } else {
    q("INSERT INTO app_config(k,v) VALUES(?,?) ON DUPLICATE KEY UPDATE v=VALUES(v)",[$k,$v]);
  }
}

function seed_templates(): void {
  $T=[
   ['t1',
    'Verfügbarkeits-Anfrage','Anfrage Verfügbarkeit — {{topic}} ({{city}}, {{kw}})',
    "Hallo {{firstName}},\n\nwir planen das Training „{{topic}}“ in {{city}} ({{kw}}) und würden dich sehr gern als Trainer dabei haben.\n\n• Training: {{topic}}\n• Ort: {{city}}, {{country}}\n• Zeitraum: {{kw}} / {{month}}\n• Team: {{teamSize}} Trainer\n\nBitte gib uns über die Buttons unten kurz Bescheid, ob du verfügbar bist. Deine Antwort landet automatisch in unserer Planung.\n\nHerzliche Grüße\nDein ETAF-Koordinationsteam",
    'Availability request','Availability request — {{topic}} ({{city}}, {{kw}})',
    "Hi {{firstName}},\n\nwe're planning the training \"{{topic}}\" in {{city}} ({{kw}}) and would love to have you on the team.\n\n• Training: {{topic}}\n• Location: {{city}}, {{country}}\n• Period: {{kw}} / {{month}}\n• Team: {{teamSize}} trainers\n\nPlease let us know via the buttons below whether you're available. Your reply lands automatically in our planning.\n\nBest regards\nYour ETAF coordination team"],
   ['t2',
    'Zusage-Bestätigung + Reisedaten','Bestätigung & Reisedaten — {{topic}} in {{city}}',
    "Hallo {{firstName}},\n\nsuper, danke für deine Zusage zu „{{topic}}“ in {{city}}!\n\n• Anreise: 1 Tag vor Trainingsbeginn ({{kw}})\n• Flug/Hotel: Vorschlag folgt separat\n• Ansprechpartner vor Ort: wird nachgereicht\n\nBitte prüfe deine Reisepass-Gültigkeit (mind. 6 Monate) — wichtig für die Einreise UAE.\n\nHerzliche Grüße\nETAF-Koordination",
    'Confirmation + travel details','Confirmation & travel details — {{topic}} in {{city}}',
    "Hi {{firstName}},\n\ngreat, thanks for accepting \"{{topic}}\" in {{city}}!\n\n• Arrival: 1 day before the training starts ({{kw}})\n• Flight/hotel: proposal to follow separately\n• On-site contact: to be provided\n\nPlease check your passport validity (min. 6 months) — important for entry to the UAE.\n\nBest regards\nETAF Coordination"],
   ['t3',
    'Kurzfristiger Ersatz','Kurzfristig: Einspringen möglich? — {{topic}} ({{city}})',
    "Hallo {{firstName}},\n\nbei „{{topic}}“ in {{city}} ({{kw}}) ist kurzfristig ein Trainer ausgefallen. Könntest du eventuell einspringen?\n\nWer zuerst zusagt, bekommt den Platz. Jede Rückmeldung hilft uns enorm.\n\nDanke dir!\nETAF-Koordination",
    'Short-notice replacement','Short notice: able to step in? — {{topic}} ({{city}})',
    "Hi {{firstName}},\n\na trainer has dropped out of \"{{topic}}\" in {{city}} ({{kw}}) at short notice. Could you possibly step in?\n\nWhoever accepts first gets the slot. Every reply helps us enormously.\n\nThank you!\nETAF Coordination"],
  ];
  foreach($T as $r){
    q("INSERT INTO templates(id,de_name,de_subject,de_body,en_name,en_subject,en_body) VALUES(?,?,?,?,?,?,?)",$r);
  }
}

function seed_demo(): void {
  $SPEC=["Implantologie","DNA-Diagnostik","Fingerprint Dental","Prothetik","Chirurgie","Digitale Abformung","Guided Surgery","Parodontologie"];
  $REG=["DE-Süd","DE-West","DE-Nord","AT","CH","UAE","UK"];
  $COL=["#3E4852","#B23A42","#4E6E8E","#6E5A86","#3F7A5E","#A6642E","#557088","#8A5A52"];
  $first=["Dr. Amir","Dr. Lena","Dr. Youssef","Dr. Marie","Dr. Ben","Dr. Sara","Dr. Tobias","Dr. Nadia","Dr. Felix","Dr. Clara","Dr. Omar","Dr. Ines","Dr. Jan","Dr. Rania"];
  $last=["Haddad","Vogt","Karim","Petit","Kraus","Mansour","Reuter","El-Sayed","Brandt","Winter","Farouk","Berger","Moeller","Aziz"];
  foreach($first as $i=>$f){
    $spec=[$SPEC[$i%count($SPEC)],$SPEC[($i+3)%count($SPEC)]];
    $langs=$i%3===0?["DE","EN","AR"]:($i%3===1?["DE","EN"]:["EN","AR"]);
    q("INSERT INTO trainers(name,email,phone,spec,region,langs,uae,load_lvl,color,rating,created_at)
       VALUES(?,?,?,?,?,?,?,?,?,?,?)",[
      "$f {$last[$i]}", strtolower(preg_replace('/[^a-z]/','',strtolower($last[$i])))."@example.org",
      "+49 15".(20+$i)." ".(1000000+$i*13731),
      json_encode($spec,JSON_UNESCAPED_UNICODE), $REG[$i%count($REG)], json_encode($langs),
      $i%2===0?1:0, random_int(0,3), $COL[$i%count($COL)], number_format(4+($i%10)/10,1), now()
    ]);
  }
  $locs=[["Abu Dhabi","UAE"],["München","DE"],["Frankfurt","DE"],["Abu Dhabi","UAE"],["Hamburg","DE"],["Wien","AT"],["Abu Dhabi","UAE"],["Zürich","CH"]];
  $topics=["Guided Surgery Level II","DNA-Diagnostik Basiskurs","Fingerprint Dental Advanced","Implantologie Masterclass","Digitale Abformung","Prothetik Kompakt","Full-Arch Workshop","Parodontologie Update"];
  $need=[6,5,8,7,5,6,8,5];
  $mon=["Sep","Okt","Dez","Feb","Mär","Mai","Jul","Sep"];
  foreach($topics as $i=>$tp){
    $kw=8+$i*6;
    q("INSERT INTO trainings(topic,city,country,kw,month,spec,need_cnt,participants,created_at)
       VALUES(?,?,?,?,?,?,?,?,?)",[
      $tp,$locs[$i][0],$locs[$i][1],"KW $kw",$mon[$i]." ’2".($i<3?"6":"7"),
      $SPEC[$i%count($SPEC)],$need[$i],12+$i*2,now()
    ]);
  }
  // Beispiel-Reisedaten + Agenda für das erste Abu-Dhabi-Training
  $agenda=json_encode([
    ['day'=>'Tag 1','time'=>'08:30','title'=>'Registrierung & Welcome Coffee'],
    ['day'=>'Tag 1','time'=>'09:00','title'=>'Guided Surgery — Theorie & Falldiskussion'],
    ['day'=>'Tag 1','time'=>'13:00','title'=>'Lunch'],
    ['day'=>'Tag 1','time'=>'14:00','title'=>'Hands-on Workshop am Modell'],
    ['day'=>'Tag 2','time'=>'09:00','title'=>'Live-OP Demonstration'],
    ['day'=>'Tag 2','time'=>'12:30','title'=>'Q&A & Zertifikatsübergabe'],
  ], JSON_UNESCAPED_UNICODE);
  q("UPDATE trainings SET venue=?,hotel=?,hotel_addr=?,meeting_point=?,contact_name=?,contact_phone=?,dresscode=?,per_diem=?,travel_notes=?,agenda=? WHERE topic=?",[
    'ETAF Training Center, Al Maryah Island','Rosewood Abu Dhabi','Al Maryah Island, Abu Dhabi, UAE',
    'Hotel-Lobby, 07:45 Uhr','Layla Al Nuaimi','+971 50 123 4567','Business casual · OP-Kleidung wird gestellt',
    '120 EUR / Tag','Reisepass mind. 6 Monate gültig. Flughafen-Transfer ist organisiert.',
    $agenda,'Guided Surgery Level II'
  ]);
}
