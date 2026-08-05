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
       'mailfetch.php','mailtest.php','cron.php','respond.php','plan.php','transfer.php','reset.php'];
$missing=[];
foreach($need as $f){ if(!is_file(__DIR__.'/'.$f)) $missing[]=$f; }
row('Alle Backend-Dateien vorhanden', count($missing)===0,
    $missing?'<b>Fehlt:</b> '.esc(implode(', ',$missing)).' — bitte das komplette ZIP hochladen.':'');

/* 3) config.php fehlerfrei? (Tippfehler beim Bearbeiten sind die häufigste Ursache) */
$cfg=null; $cfgErr='';
if(is_file(__DIR__.'/config.php')){
  try{ $cfg=(static function(){ return include __DIR__.'/config.php'; })(); }
  catch(\Throwable $e){ $cfgErr=$e->getMessage(); }
  if($cfgErr==='' && !is_array($cfg)) $cfgErr='config.php liefert kein Array zurück (return [ … ]; fehlt?).';
}else $cfgErr='config.php fehlt.';
row('config.php lesbar (keine Tippfehler)', $cfgErr==='', $cfgErr!==''?'<b>'.esc($cfgErr).'</b>':'');

if(is_array($cfg)){
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
