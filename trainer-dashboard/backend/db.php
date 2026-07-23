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

  $d->exec("CREATE TABLE IF NOT EXISTS clients (
    id VARCHAR(24) PRIMARY KEY,
    name VARCHAR(160), short VARCHAR(24), color VARCHAR(16),
    cal VARCHAR(24), country VARCHAR(16), sort_order INT DEFAULT 0)$eng");

  $d->exec("CREATE TABLE IF NOT EXISTS trainings (
    id $pk,
    client_id VARCHAR(24),
    topic VARCHAR(190), city VARCHAR(96), country VARCHAR(16),
    kw VARCHAR(24), month VARCHAR(24), spec VARCHAR(96),
    start_date VARCHAR(12), end_date VARCHAR(12), code VARCHAR(16),
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

  // Material-Katalog + Positionen je Training + Typ-Vorlagen
  $d->exec("CREATE TABLE IF NOT EXISTS materials (
    id VARCHAR(24) PRIMARY KEY,
    name VARCHAR(160), unit VARCHAR(24), cat VARCHAR(64), sort_order INT DEFAULT 0)$eng");
  $d->exec("CREATE TABLE IF NOT EXISTS training_materials (
    id $pk, training_id INT, material_id VARCHAR(24), qty INT DEFAULT 0)$eng");
  $d->exec("CREATE TABLE IF NOT EXISTS material_presets (
    id $pk, spec VARCHAR(96), material_id VARCHAR(24), qty INT DEFAULT 0)$eng");

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
    "dresscode VARCHAR(160)","per_diem VARCHAR(64)","travel_notes TEXT","agenda TEXT",
    "client_id VARCHAR(24)","start_date VARCHAR(12)","end_date VARCHAR(12)","code VARCHAR(16)"
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
  // Vorlagen sicherstellen (fügt auch bei bestehenden Installationen fehlende Vorlagen wie t4 nach)
  seed_templates();
  // Kunden sicherstellen (auch für bestehende Installationen) + bestehende Trainings zuordnen
  if((int)q("SELECT COUNT(*) c FROM clients")->fetch()['c']===0){
    seed_clients();
    q("UPDATE trainings SET client_id='cl-adp' WHERE (client_id IS NULL OR client_id='')");
  }
  // Material-Katalog sicherstellen (auch für bestehende Installationen)
  if((int)q("SELECT COUNT(*) c FROM materials")->fetch()['c']===0){
    seed_materials();
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
   ['t4',
    'Absage / Planänderung','Planänderung — {{topic}} in {{city}} ({{kw}})',
    "Hallo {{firstName}},\n\nvielen Dank für deine Zusage zu „{{topic}}“ in {{city}} ({{kw}}). Leider müssen wir kurzfristig umplanen und können dich für diesen Einsatz doch nicht einsetzen — die Voraussetzungen haben sich geändert.\n\nDas hat nichts mit dir persönlich zu tun. Wir kommen bei der nächsten passenden Gelegenheit sehr gern wieder auf dich zu. Danke für dein Verständnis!\n\nHerzliche Grüße\nDein ETAF-Koordinationsteam",
    'Cancellation / change of plan','Change of plan — {{topic}} in {{city}} ({{kw}})',
    "Hi {{firstName}},\n\nthank you for accepting \"{{topic}}\" in {{city}} ({{kw}}). Unfortunately we have to reschedule at short notice and won't be able to assign you to this session after all — the requirements have changed.\n\nThis is not related to you personally. We'll gladly get back in touch for the next suitable opportunity. Thank you for your understanding!\n\nBest regards\nYour ETAF coordination team"],
  ];
  foreach($T as $r){
    // Nur fehlende Vorlagen anlegen — bestehende (evtl. angepasste) Texte nicht überschreiben.
    if((int)q("SELECT COUNT(*) c FROM templates WHERE id=?",[$r[0]])->fetch()['c']===0){
      q("INSERT INTO templates(id,de_name,de_subject,de_body,en_name,en_subject,en_body) VALUES(?,?,?,?,?,?,?)",$r);
    }
  }
}

/** Standard-Kunde: Abu Dhabi Police — DVI (idempotent). */
function seed_clients(): void {
  $clients=[
    ['cl-adp','Abu Dhabi Police — DVI','ADP','#B23A42','firebrick','UAE',1],
  ];
  foreach($clients as $c){
    if((int)q("SELECT COUNT(*) c FROM clients WHERE id=?",[$c[0]])->fetch()['c']===0){
      q("INSERT INTO clients(id,name,short,color,cal,country,sort_order) VALUES(?,?,?,?,?,?,?)",$c);
    }
  }
}

/** Material-Katalog (DVI/Forensik) anlegen (idempotent). */
function seed_materials(): void {
  $M=[
    ['m-dvi','DVI-Kit (pre-coded)','Set','Kits',1],
    ['m-bag','Leichensack','Stk','Verbrauch',2],
    ['m-cbrn','CBRN-Kit','Set','Kits',3],
    ['m-am','Protokoll — Ante Mortem','Stk','Protokolle',4],
    ['m-pm','Protokoll — Post Mortem','Stk','Protokolle',5],
    ['m-dna','DNA-Probenset','Set','Proben',6],
    ['m-fp','Fingerprint-Set','Set','Proben',7],
    ['m-dent','Zahnstatus-Formular (Odontologie)','Stk','Protokolle',8],
    ['m-glove','Einmalhandschuhe','Box','Verbrauch',9],
    ['m-suit','CBRN-Schutzanzug','Stk','Verbrauch',10],
  ];
  foreach($M as $m){
    if((int)q("SELECT COUNT(*) c FROM materials WHERE id=?",[$m[0]])->fetch()['c']===0){
      q("INSERT INTO materials(id,name,unit,cat,sort_order) VALUES(?,?,?,?,?)",$m);
    }
  }
}

/** Typ-Vorlagen (Schwerpunkt → Materialliste). */
function mat_presets(): array {
  return [
    "Post Mortem"=>[["m-dvi",8],["m-pm",40],["m-dna",20],["m-fp",20],["m-dent",20],["m-glove",10],["m-bag",20]],
    "Ante Mortem"=>[["m-am",40],["m-glove",6]],
    "Scene & Recovery"=>[["m-dvi",8],["m-bag",30],["m-glove",10],["m-am",20]],
    "CBRN"=>[["m-cbrn",50],["m-suit",40],["m-bag",20],["m-glove",12]],
    "Simulation"=>[["m-dvi",10],["m-bag",40],["m-am",40],["m-pm",40],["m-glove",15]],
  ];
}

function seed_demo(): void {
  // Internationale DVI-Faculty (Demo-Pool) — Schwerpunkte = INTERPOL-DVI-Phasen
  $SPEC=["DVI-Grundlagen","Data Management","Ante Mortem","Kommunikation & FCC","Logistik","Post Mortem","Reconciliation","Scene & Recovery","CBRN","Simulation","Site-Folder","Train-the-Trainer","Assessment & Readiness","Zertifizierung"];
  $REG=["DE-Süd","DE-West","DE-Nord","AT","CH","UAE","UK"];
  $COL=["#3E4852","#B23A42","#4E6E8E","#6E5A86","#3F7A5E","#A6642E","#557088","#8A5A52"];
  $first=["Dr. Amir","Dr. Lena","Dr. Youssef","Dr. Marie","Dr. Ben","Dr. Sara","Dr. Tobias","Dr. Nadia","Dr. Felix","Dr. Clara","Dr. Omar","Dr. Ines","Dr. Jan","Dr. Rania"];
  $last=["Haddad","Vogt","Karim","Petit","Kraus","Mansour","Reuter","El-Sayed","Brandt","Winter","Farouk","Berger","Moeller","Aziz"];
  foreach($first as $i=>$f){
    $spec=[$SPEC[$i%count($SPEC)],$SPEC[($i+4)%count($SPEC)]];
    $langs=$i%3===0?["DE","EN","AR"]:($i%3===1?["DE","EN"]:["EN","AR"]);
    q("INSERT INTO trainers(name,email,phone,spec,region,langs,uae,load_lvl,color,rating,created_at)
       VALUES(?,?,?,?,?,?,?,?,?,?,?)",[
      "$f {$last[$i]}", strtolower(preg_replace('/[^a-z]/','',strtolower($last[$i])))."@example.org",
      "+49 15".(20+$i)." ".(1000000+$i*13731),
      json_encode($spec,JSON_UNESCAPED_UNICODE), $REG[$i%count($REG)], json_encode($langs),
      $i%2===0?1:0, random_int(0,3), $COL[$i%count($COL)], number_format(4+($i%10)/10,1), now()
    ]);
  }
  seed_clients();
  seed_materials();
  // Typ-Vorlagen ablegen
  foreach(mat_presets() as $spec=>$lines){
    foreach($lines as $l){ q("INSERT INTO material_presets(spec,material_id,qty) VALUES(?,?,?)",[$spec,$l[0],$l[1]]); }
  }

  // Verbindlicher Programmkalender (ETAF Operational DVI Elite Team Programme 2026–2027, V3.2)
  $MON=["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"];
  $AD=["Abu Dhabi","UAE"]; $WZ=["Weeze","DE"];
  $P=[
    ["W1","2026-09-14","2026-09-18","INTERPOL DVI Principles, Governance & Elite-Team-Struktur",$AD,"DVI-Grundlagen",5,40],
    ["W2","2026-09-28","2026-10-02","DVI Data Management & Reporting (PlassData)",$AD,"Data Management",5,40],
    ["W3","2026-10-12","2026-10-16","Ante Mortem — Family Liaison & Informationsgewinnung",$AD,"Ante Mortem",5,40],
    ["W4","2026-10-26","2026-10-30","Kommunikation: Family Coordination & Media",$AD,"Kommunikation & FCC",5,40],
    ["W5","2026-11-09","2026-11-13","Logistik & Kapazitätsplanung",$AD,"Logistik",5,40],
    ["W6","2026-11-23","2026-11-27","Post Mortem — Prozesse & Qualität",$AD,"Post Mortem",5,40],
    ["W7","2026-12-07","2026-12-11","Reconciliation & Identifizierungs-Entscheidungen",$AD,"Reconciliation",5,40],
    ["W8","2027-01-11","2027-01-15","Scene Management & Recovery",$AD,"Scene & Recovery",5,40],
    ["W9 ★","2027-01-25","2027-01-29","Full Simulation I (MCI) — End-to-End",$AD,"Simulation",8,40],
    ["W10","2027-02-01","2027-02-05","Stage I Final Assessment & Operational Readiness · TtT-Auswahl",$AD,"Assessment & Readiness",5,40],
    ["W11-A","2027-03-22","2027-03-26","PM Practical Module — Kohorte A (Körperspender)",$WZ,"Post Mortem",8,20],
    ["W11-B","2027-04-12","2027-04-16","PM Practical Module — Kohorte B (Körperspender)",$WZ,"Post Mortem",8,20],
    ["W12","2027-04-26","2027-04-30","Public Venues: Shopping Centres",$AD,"Site-Folder",5,40],
    ["W13","2027-05-10","2027-05-14","Transport Hubs: International Airport",$AD,"Site-Folder",5,40],
    ["W14","2027-05-24","2027-05-28","Major Events: Circuit / Arena / Events",$AD,"Site-Folder",5,40],
    ["W15","2027-06-07","2027-06-11","Natural Hazard: Heavy Rainfall / Flooding",$AD,"Site-Folder",5,40],
    ["TtT-I","2027-06-14","2027-06-16","Instructor Development Block I (TtT-Kandidaten)",$AD,"Train-the-Trainer",2,10],
    ["W16","2027-06-21","2027-06-25","CBRN / Nuclear: Contaminated Casualty Scenarios",$AD,"CBRN",5,40],
    ["W17","2027-07-05","2027-07-09","Maritime / Logistik: Port / Industrial Zone",$AD,"Site-Folder",5,40],
    ["W18","2027-07-19","2027-07-23","Energy & Utilities (Öl/Gas, Strom, Wasser, Entsalzung)",$AD,"Site-Folder",5,40],
    ["W19","2027-09-06","2027-09-10","Government / Symbolic Targets & Urban Nodes · National Master Folder",$AD,"Site-Folder",5,40],
    ["TtT-II","2027-10-04","2027-10-06","Instructor Development Block II & Teaching-Assessment",$AD,"Train-the-Trainer",2,10],
    ["W20 ★","2027-10-18","2027-10-22","Full Simulation II + Folder Drill (Pull-Out-Test)",$AD,"Simulation",8,40],
    ["Final","2027-11-08","2027-11-12","Final Readiness Review, Team- & National-Instructor-Zertifizierung",$AD,"Zertifizierung",5,40],
  ];
  $PRE=mat_presets();
  foreach($P as $r){
    [$code,$start,$end,$topic,$loc,$spec,$need,$part]=$r;
    $ts=strtotime($start); $yy=substr($start,2,2);
    $kw="KW ".(int)gmdate('W',$ts); $month=$MON[(int)gmdate('n',$ts)-1]." ’".$yy;
    q("INSERT INTO trainings(client_id,code,topic,city,country,start_date,end_date,kw,month,spec,need_cnt,participants,created_at)
       VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)",[
      'cl-adp',$code,$topic,$loc[0],$loc[1],$start,$end,$kw,$month,$spec,$need,$part,now()
    ]);
    $tid=db()->lastInsertId();
    if(isset($PRE[$spec])){
      foreach($PRE[$spec] as $l){ q("INSERT INTO training_materials(training_id,material_id,qty) VALUES(?,?,?)",[$tid,$l[0],$l[1]]); }
    }
  }
  // Beispiel-Reisedaten + Agenda für W1
  $agenda=json_encode([
    ['day'=>'Tag 1','time'=>'08:30','title'=>'Registrierung & Kick-off'],
    ['day'=>'Tag 1','time'=>'09:00','title'=>'INTERPOL DVI Principles & Governance'],
    ['day'=>'Tag 1','time'=>'14:00','title'=>'Elite-Team-Struktur — 8 funktionale Zellen'],
    ['day'=>'Tag 5','time'=>'11:00','title'=>'Baseline-Competency-Assessment'],
  ], JSON_UNESCAPED_UNICODE);
  q("UPDATE trainings SET venue=?,hotel=?,hotel_addr=?,meeting_point=?,contact_name=?,contact_phone=?,dresscode=?,per_diem=?,travel_notes=?,agenda=? WHERE code=?",[
    'Abu Dhabi Police — DVI Training Facility','Rosewood Abu Dhabi','Al Maryah Island, Abu Dhabi, UAE',
    'Hotel-Lobby, 07:45 Uhr','Lt. Col. Adil Al Ali (Head of DVI)','+971 2 000 0000','Field/OP-Kleidung wird gestellt',
    'nach ETAF-Reiserichtlinie','Reisepass mind. 6 Monate gültig. Flughafen-Transfer organisiert.',
    $agenda,'W1'
  ]);
}
