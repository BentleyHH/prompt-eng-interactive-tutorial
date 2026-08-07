<?php
/**
 * ETAF — Basis-Check (bewusst OHNE Abhängigkeiten)
 * ---------------------------------------------------------------
 * Wenn andere Seiten nur „weiß“ bleiben, zeigt diese Seite, woran es
 * liegt: Tippfehler in config.php, fehlende Dateien, DB-Verbindung,
 * falsche base_url. Sie lädt NICHTS aus lib/db — kann also selbst
 * dann laufen, wenn der Rest kaputt ist. Zeigt keine Passwörter.
 * Aufruf: backend/check.php
 */
error_reporting(E_ALL); ini_set('display_errors','1');
header('Content-Type: text/html; charset=utf-8');
function esc($s){ return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); }
function row($label,$ok,$detail=''){
  $sym=$ok===true?'<b style="color:#2E9E6B">✓</b>':($ok===false?'<b style="color:#D81F26">✗</b>':'<b style="color:#C77E1E">⚠</b>');
  echo '<tr><td>'.$sym.'</td><td>'.esc($label).'</td><td>'.$detail.'</td></tr>';
}
?>
<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>ETAF — Basis-Check</title>
<body style="font:15px/1.6 system-ui,Arial,sans-serif;color:#242b31;background:#f4f5f6;margin:0;padding:26px">
<div style="max-width:760px;margin:auto">
<h2 style="margin:0 0 4px">ETAF — Basis-Check</h2>
<p style="color:#8a939a;margin:0 0 18px">PHP <?=esc(PHP_VERSION)?> · <?=esc($_SERVER['HTTP_HOST']??'')?></p>
<div style="background:#fff;border:1px solid #e2e5e8;border-radius:12px;padding:16px 18px">
<table style="border-collapse:collapse;width:100%" cellpadding="6">
<?php
/* 1) PHP-Version */
row('PHP-Version '.PHP_VERSION, version_compare(PHP_VERSION,'8.0','>='), version_compare(PHP_VERSION,'8.0','>=')?'':'PHP 8 nötig — im artfiles-Menü umstellen.');

/* 2) Dateien vollständig? */
$need=['config.php','db.php','lib.php','mailer.php','api.php','ai.php','automation.php',
       'mailfetch.php','mailtest.php','cron.php','respond.php','plan.php','transfer.php','reset.php',
       'backup.php','programme-sessions.json'];
$missing=[];
foreach($need as $f){ if(!is_file(__DIR__.'/'.$f)) $missing[]=$f; }
row('Alle Backend-Dateien vorhanden', count($missing)===0,
    $missing?'<b>Fehlt:</b> '.esc(implode(', ',$missing)).' — bitte das komplette ZIP hochladen.':'');

/* 2b) Zugriffsschutz da? (.htaccess ist am Mac/im FTP-Programm oft unsichtbar,
       weil Dateien mit Punkt am Anfang standardmäßig ausgeblendet werden) */
row('Zugriffsschutz backend/.htaccess vorhanden', is_file(__DIR__.'/.htaccess'),
    is_file(__DIR__.'/.htaccess')?'':'<b>Fehlt!</b> Ohne diese Datei ist config.php (mit Passwörtern) ungeschützt. '
    .'Die Datei heißt exakt <code>.htaccess</code> — sie ist im FTP-Programm oft nur versteckt '
    .'(FileZilla: Server → „Auflistung versteckter Dateien erzwingen“; Finder: Cmd+Shift+Punkt). '
    .'Notfalls als <code>htaccess.txt</code> hochladen und auf dem Server in <code>.htaccess</code> umbenennen.');

/* 3) config.php fehlerfrei? (Tippfehler beim Bearbeiten sind die häufigste Ursache) */
$cfg=null; $cfgErr='';
if(is_file(__DIR__.'/config.php')){
  try{ $cfg=(static function(){ return include __DIR__.'/config.php'; })(); }
  catch(\Throwable $e){ $cfgErr=$e->getMessage(); }
  if($cfgErr==='' && !is_array($cfg)) $cfgErr='config.php liefert kein Array zurück (return [ … ]; fehlt?).';
}else $cfgErr='config.php fehlt.';
row('config.php lesbar (keine Tippfehler)', $cfgErr==='', $cfgErr!==''?'<b>'.esc($cfgErr).'</b>':'');

/* 3b) Sind alle nötigen Einträge vorhanden? (erkennt eine fremde/alte config.php,
       z.B. die des früheren ETAF Dashboards — anderes Format!) */
if(is_array($cfg)){
  $reqKeys=['driver','db_host','db_name','db_user','db_pass','default_pin','session_days',
            'org_name','from_email','from_name','base_url','mail_mode','smtp','mailbox',
            'anthropic_key','reminder_hours','escalate_hours','auto_advance','cron_key','seed_demo'];
  $missK=[];
  foreach($reqKeys as $k){
    if(strpos($k,'db_')===0 && ($cfg['driver']??'mysql')==='sqlite') continue;
    if(!array_key_exists($k,$cfg)) $missK[]=$k;
  }
  row('config.php vollständig (richtiges Format)', count($missK)===0,
      $missK?'<b>Fehlende Einträge:</b> '.esc(implode(', ',$missK))
            .' — das sieht nach einer fremden oder alten config.php aus. Bitte config.sample.php aus dem ZIP als Vorlage nehmen '
            .'oder die funktionierende config.php der bestehenden Installation kopieren und nur base_url anpassen.':'');
}

/* Sensible Details (DB-Status, Konfiguration) nur mit ?key=<cron_key> zeigen.
   Ist config.php kaputt/leer (der eigentliche Rettungsfall), gibt es keinen
   Key zum Prüfen — dann bleibt die Fehlermeldung oben trotzdem sichtbar. */
$needKey = is_array($cfg) && !empty($cfg['cron_key']) && $cfg['cron_key']!=='CHANGE_ME_zufälliger_wert';
$authed  = !$needKey || hash_equals((string)$cfg['cron_key'], (string)($_GET['key'] ?? ''));

if(is_array($cfg) && !$authed){
  row('Detail-Prüfung (Datenbank & Konfiguration)', null,
      'Aus Sicherheitsgründen nur mit Schlüssel: <code>check.php?key=DEIN_CRON_KEY</code> (cron_key aus config.php) aufrufen.');
}
if(is_array($cfg) && $authed){
  /* 4) Datenbank erreichbar? */
  $dbOk=null; $dbErr='';
  try{
    if(($cfg['driver']??'mysql')==='sqlite'){
      new PDO('sqlite:'.($cfg['sqlite_path']??''), null, null, [PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION]);
    }else{
      new PDO('mysql:host='.($cfg['db_host']??'').';dbname='.($cfg['db_name']??'').';charset='.($cfg['db_charset']??'utf8mb4'),
              $cfg['db_user']??'', $cfg['db_pass']??'', [PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION, PDO::ATTR_TIMEOUT=>8]);
    }
    $dbOk=true;
  }catch(\Throwable $e){ $dbOk=false; $dbErr=$e->getMessage(); }
  row('Datenbank-Verbindung', $dbOk, $dbOk?'':esc($dbErr));

  /* 4b) Datenbank-Schema aktuell? (Tabellen aus den letzten Updates vorhanden) */
  if($dbOk){
    try{
      $pdo = ($cfg['driver']??'mysql')==='sqlite'
        ? new PDO('sqlite:'.($cfg['sqlite_path']??''))
        : new PDO('mysql:host='.($cfg['db_host']??'').';dbname='.($cfg['db_name']??'').';charset='.($cfg['db_charset']??'utf8mb4'),
                  $cfg['db_user']??'', $cfg['db_pass']??'');
      $pdo->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
      $missT=[];
      foreach(['users','activity','travel_mail','trainer_reviews','training_sessions'] as $t){
        try{ $pdo->query("SELECT 1 FROM $t LIMIT 1"); }catch(\Throwable $e){ $missT[]=$t; }
      }
      row('Datenbank-Schema aktuell', count($missT)===0,
          $missT?'<b>Fehlende Tabellen:</b> '.esc(implode(', ',$missT)).' — meist ist backend/db.php veraltet. '
                .'Aktuelle db.php hochladen und diese Seite neu laden (die Tabellen werden dann automatisch angelegt).':'');
    }catch(\Throwable $e){ /* DB-Verbindung wurde oben schon bewertet */ }
  }

  /* 4c) Läuft die tägliche Datensicherung? */
  $bfiles=glob(__DIR__.'/backups/etaf-backup-*.sql.gz') ?: [];
  $blast=0; foreach($bfiles as $bf) $blast=max($blast, (int)@filemtime($bf));
  if($blast){
    $bh=(time()-$blast)/3600;
    row('Tägliche Datensicherung', $bh<=36,
        'Letzte Sicherung vor '.round($bh).' Std. · '.count($bfiles).' Stände vorhanden'
        .($bh>36?' — <b>läuft der Cron-Job noch?</b> (backend/cron.php?key=…)':'')
        .' · <a href="backup.php?key='.esc($_GET['key']??'').'">Übersicht & Download</a>');
  } else {
    row('Tägliche Datensicherung', false,
        'Noch keine Sicherung vorhanden. Der stündliche Cron-Job (backend/cron.php?key=…) legt automatisch '
        .'täglich eine an — oder sofort manuell: <a href="backup.php?key='.esc($_GET['key']??'').'&amp;run=1">jetzt sichern</a>.');
  }

  /* 5) base_url passt zur aufgerufenen Domain? (wichtig für alle Links in E-Mails) */
  $bu=(string)($cfg['base_url']??''); $host=$_SERVER['HTTP_HOST']??'';
  $buOk = $bu==='' ? null : (stripos($bu,$host)!==false);
  row('base_url passt zur Domain', $buOk,
      $bu===''?'base_url ist leer (wird automatisch ermittelt — ok).':
      ($buOk?esc($bu):'<b>'.esc($bu).'</b> — die Seite läuft aber auf <b>'.esc($host).'</b>. Bitte base_url in config.php anpassen, sonst zeigen alle Buttons in E-Mails auf die falsche Adresse!'));

  /* 6) Kernkonfiguration gesetzt? (nur ob, nie was) */
  row('SMTP-Passwort gesetzt', !empty($cfg['smtp']['pass']), '');
  row('cron_key gesetzt', !empty($cfg['cron_key']) && $cfg['cron_key']!=='CHANGE_ME_zufälliger_wert', '');
  row('Flugpost-Postfach konfiguriert', !empty($cfg['mailbox']['host'])&&!empty($cfg['mailbox']['user'])&&!empty($cfg['mailbox']['pass']),
      empty($cfg['mailbox']['pass'])?'mailbox-Block in config.php (host/user/pass)':'');
  row('KI-Key (anthropic_key) gesetzt', !empty($cfg['anthropic_key']), empty($cfg['anthropic_key'])?'ohne Key nur einfache Muster-Erkennung':'');
}
?>
</table></div>
<p style="color:#8a939a;font-size:13px;margin-top:14px">Steht überall ✓, aber eine Seite bleibt trotzdem weiß:
Adresse prüfen (Groß-/Kleinschreibung des Dateinamens) und die Detail-Diagnose öffnen:
<code style="background:#eef0f2;padding:1px 5px;border-radius:5px">backend/mailtest.php?key=DEIN_CRON_KEY</code></p>
</div></body>
