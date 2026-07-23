<?php
/**
 * ETAF — E-Mail-Diagnose
 * ---------------------------------------------------------------
 * Zeigt die aktuelle Mail-Konfiguration, verschickt eine Test-Mail
 * und protokolliert den kompletten SMTP-Dialog — damit man sofort
 * sieht, WO es klemmt (Verbindung, Login, Empfänger, Zustellung).
 *
 * Aufruf:  backend/mailtest.php?key=<cron_key>&to=deine@mail.de
 * Der key ist derselbe wie für den Cron-Job (cron_key in config.php).
 * Das Passwort wird NIE angezeigt (nur, ob es gesetzt ist).
 * ---------------------------------------------------------------
 */
require_once __DIR__.'/lib.php';
require_once __DIR__.'/mailer.php';
header('Content-Type: text/html; charset=utf-8');

$c   = cfg();
$key = $_GET['key'] ?? '';
$to  = trim($_GET['to'] ?? '');

function esc($s){ return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); }

/* Schlüssel-Schutz (wie beim Cron) */
$need = (string)($c['cron_key'] ?? '');
if($need==='' || $key!==$need){
  http_response_code(403);
  echo '<meta charset="utf-8"><body style="font:15px system-ui;padding:30px;color:#242b31">'
     .'<h2>ETAF — E-Mail-Diagnose</h2>'
     .'<p>Zugriff nur mit gültigem <code>?key=</code> (entspricht <code>cron_key</code> aus config.php).</p>'
     .'<p>Beispiel: <code>backend/mailtest.php?key=DEIN_CRON_KEY&amp;to=deine@mail.de</code></p>'
     .'</body>';
  exit;
}

$mode = $c['mail_mode'] ?? 'mail';
$smtp = $c['smtp'] ?? [];
$rows = [
  'mail_mode'   => $mode,
  'from_email'  => $c['from_email'] ?? '(leer)',
  'from_name'   => $c['from_name'] ?? '(leer)',
  'base_url'    => base_url(),
  'SMTP host'   => $smtp['host'] ?? '(leer)',
  'SMTP port'   => $smtp['port'] ?? '(leer)',
  'SMTP secure' => $smtp['secure'] ?? '(leer)',
  'SMTP user'   => $smtp['user'] ?? '(leer)',
  'SMTP pass'   => !empty($smtp['pass']) ? '••• gesetzt ('.strlen((string)$smtp['pass']).' Zeichen)' : '⚠ LEER',
];

/* Optional: Test-Mail verschicken */
$did=false; $ok=false; $err=''; $trace=[];
if($to!==''){
  $did=true;
  $html = email_html("Dies ist eine Test-Mail aus der ETAF-Diagnose.\n\nWenn du das liest, funktioniert der Versand technisch.", '');
  $ok   = send_email($to, 'Test', 'ETAF — Test-Mail (Diagnose)', $html);
  $err  = $GLOBALS['__mail_err'] ?? '';
  $trace= $GLOBALS['__smtp_trace'] ?? [];
}

/* Letzte Protokoll-Einträge */
$log=[];
try { ensure_schema(); $log=q("SELECT to_email,subject,status,created_at FROM email_log ORDER BY id DESC LIMIT 8")->fetchAll(); }
catch(Throwable $e){ $log=[]; }
?>
<!doctype html><html lang="de"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><title>ETAF — E-Mail-Diagnose</title>
<style>
 body{font:15px/1.55 system-ui,-apple-system,Segoe UI,Arial,sans-serif;color:#242b31;background:#f4f5f6;margin:0;padding:26px}
 .wrap{max-width:760px;margin:auto}
 h2{margin:0 0 4px}.sub{color:#8a939a;margin:0 0 20px}
 .card{background:#fff;border:1px solid #e2e5e8;border-radius:12px;padding:18px 20px;margin:0 0 16px}
 table{border-collapse:collapse;width:100%}td{padding:5px 8px;border-bottom:1px solid #eef0f2;vertical-align:top}
 td:first-child{color:#5c666e;white-space:nowrap;width:130px}
 .ok{color:#2E9E6B;font-weight:700}.bad{color:#D81F26;font-weight:700}.warn{color:#C77E1E;font-weight:700}
 pre{background:#12171c;color:#d7e2ea;padding:14px 16px;border-radius:10px;overflow:auto;font-size:12.5px;line-height:1.5}
 .hint{background:#fff8ec;border:1px solid #f0e0bd;border-radius:10px;padding:12px 14px;color:#7a5a12;font-size:14px}
 code{background:#eef0f2;padding:1px 5px;border-radius:5px}
 .pill{display:inline-block;padding:2px 9px;border-radius:20px;font-size:12px;font-weight:700}
 .pill.sent{background:#e6f4ec;color:#2E9E6B}.pill.failed{background:#fdeaea;color:#D81F26}.pill.logged{background:#eef0f2;color:#5c666e}
</style></head><body><div class="wrap">
 <h2>ETAF — E-Mail-Diagnose</h2>
 <p class="sub">Prüft Konfiguration und Versand. Passwort wird nicht angezeigt.</p>

 <div class="card">
   <h3 style="margin:0 0 8px">Aktuelle Konfiguration</h3>
   <table><?php foreach($rows as $k=>$v): ?>
     <tr><td><?=esc($k)?></td><td><?= $v==='⚠ LEER' ? '<span class="bad">'.esc($v).'</span>' : esc($v) ?></td></tr>
   <?php endforeach; ?></table>
   <?php if($mode==='log'): ?>
     <p class="hint" style="margin-top:12px">⚠ <b>mail_mode ist <code>log</code></b> — es wird gar nichts versendet, nur protokolliert.
        In <code>config.php</code> auf <code>'smtp'</code> stellen.</p>
   <?php elseif($mode==='smtp' && empty($smtp['pass'])): ?>
     <p class="hint" style="margin-top:12px">⚠ <b>SMTP-Passwort ist leer.</b> Trage in <code>config.php</code> unter <code>'smtp' =&gt; ['pass' =&gt; '…']</code> das Passwort des Postfachs <code><?=esc($smtp['user']??'')?></code> ein.</p>
   <?php endif; ?>
 </div>

 <?php if($did): ?>
 <div class="card">
   <h3 style="margin:0 0 8px">Test-Versand an <?=esc($to)?></h3>
   <p>Ergebnis: <?= $ok ? '<span class="ok">✓ Server hat die Mail angenommen</span>' : '<span class="bad">✗ Versand fehlgeschlagen</span>' ?></p>
   <?php if($err): ?><p class="hint"><b>Grund:</b> <?=esc($err)?></p><?php endif; ?>
   <?php if($ok): ?><p class="sub">Kommt sie trotzdem nicht an, liegt es an der <b>Zustellung</b> (Spam-Ordner prüfen; SPF/DKIM für dvi-systems.com im DNS setzen).</p><?php endif; ?>
   <?php if($trace): ?><pre><?php foreach($trace as $l) echo esc($l)."\n"; ?></pre><?php endif; ?>
 </div>
 <?php else: ?>
 <div class="card">
   <p>Zum Test eine Empfängeradresse anhängen:<br>
   <code>backend/mailtest.php?key=…&amp;to=deine@mail.de</code></p>
 </div>
 <?php endif; ?>

 <div class="card">
   <h3 style="margin:0 0 8px">Letzte 8 Protokoll-Einträge</h3>
   <?php if(!$log): ?><p class="sub">Noch keine E-Mails protokolliert.</p><?php else: ?>
   <table>
     <?php foreach($log as $r): $st=$r['status']; ?>
       <tr><td><span class="pill <?=esc($st)?>"><?=esc($st)?></span></td>
           <td><?=esc($r['to_email'])?> · <?=esc($r['subject'])?><br><span class="sub" style="font-size:12px"><?=esc($r['created_at'])?></span></td></tr>
     <?php endforeach; ?>
   </table>
   <p class="sub" style="margin-top:10px"><b>sent</b> = versendet · <b>failed</b> = Versand scheiterte · <b>logged</b> = nur protokolliert (mail_mode=log)</p>
   <?php endif; ?>
 </div>
</div></body></html>
