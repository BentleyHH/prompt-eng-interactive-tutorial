<?php
/**
 * ETAF - Empfangs-/Abnahmebestätigung für den Kunden (zweistufig, scanner-sicher)
 * ---------------------------------------------------------------
 * GET  ack.php?token=<tok>  → zeigt NUR die Seite mit den Knöpfen. Ändert nichts.
 *      (E-Mail-Scanner rufen nur GET auf → der Link wird nicht "verbraucht".)
 * POST → speichert Bestätigung ODER Einwand und entwertet den Link nicht -
 *        derselbe Link zeigt danach den Stand (nachvollziehbar für den Kunden).
 * In der Datenbank liegt nur der Hash des Tokens.
 */
require_once __DIR__.'/lib.php';
ensure_schema();
header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: same-origin');
function e2($s){ return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); }

$isCommit = ($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST';
$tok = (string)($_POST['token'] ?? $_GET['token'] ?? '');
$row = $tok!=='' ? q("SELECT * FROM cust_items WHERE tok=?",[hash('sha256',$tok)])->fetch() : null;
if(!$row) usleep(300000);   // Raten unattraktiv machen

$did=''; $err='';
if($isCommit && $row){
  $act=(string)($_POST['act']??'');
  $name=mb_substr(trim((string)($_POST['name']??'')),0,190);
  if($act==='confirm'){
    q("UPDATE cust_items SET status='confirmed', confirmed_at=?, confirmed_by=?, updated_at=? WHERE id=?",
      [now(), $name!==''?$name:'per Link bestätigt', now(), $row['id']]);
    audit_as(['id'=>null,'name'=>$name?:'Kunde'],'cust.confirmed','cust',(string)$row['id'],
      $row['title'].' - Empfang/Abnahme bestätigt'.($name!==''?' von '.$name:''));
    $did='confirm';
  } elseif($act==='object'){
    $txt=mb_substr(trim((string)($_POST['text']??'')),0,2000);
    if($txt===''){ $err='Please describe the objection briefly.'; }
    else{
      q("UPDATE cust_items SET status='objection', objection=?, objection_at=?, confirmed_by=?, updated_at=? WHERE id=?",
        [$txt, now(), $name, now(), $row['id']]);
      audit_as(['id'=>null,'name'=>$name?:'Kunde'],'cust.objection','cust',(string)$row['id'],
        $row['title'].' - Einwand: '.mb_substr($txt,0,120));
      $did='object';
    }
  }
  $row=q("SELECT * FROM cust_items WHERE id=?",[$row['id']])->fetch();
}
$st=$row['status']??'';
$action=e2(base_url().'/ack.php');
?>
<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>ETAF - Confirmation</title>
<style>
  body{margin:0;min-height:100vh;display:grid;place-items:center;background:#f4f5f6;
    font:16px/1.6 system-ui,-apple-system,Segoe UI,Arial,sans-serif;color:#242b31;padding:24px}
  .card{max-width:480px;width:100%;background:#fff;border:1px solid #e2e5e8;border-radius:16px;
    box-shadow:0 10px 30px -14px rgba(35,43,49,.25);padding:32px 30px;box-sizing:border-box}
  h1{font-size:19px;margin:14px 0 8px}
  p{color:#5c666e;margin:6px 0}
  .item{margin:14px 0;padding:12px 14px;border:1px solid #e2e5e8;border-radius:10px;font-size:14px}
  .item b{color:#242b31}
  label{display:block;font-size:11px;font-weight:700;color:#5c666e;text-transform:uppercase;
    letter-spacing:.05em;margin:12px 0 4px}
  input,textarea{width:100%;box-sizing:border-box;padding:11px 12px;border:1px solid #e2e5e8;
    border-radius:9px;font:15px system-ui,Arial,sans-serif;background:#f8f9fa;color:#242b31}
  textarea{min-height:80px}
  .btn{display:block;width:100%;margin-top:12px;padding:14px;border-radius:10px;cursor:pointer;
    font:700 15px system-ui,Arial,sans-serif;border:2px solid #2E9E6B;background:#2E9E6B;color:#fff}
  .btn.obj{background:#fff;color:#8A5410;border-color:#C77E1E}
  .ok{background:#e9f6ef;border:1px solid #bfe3cf;color:#1E7A4D;border-radius:10px;padding:12px 14px;margin:12px 0;font-size:14px}
  .warn{background:#f8ecd7;border:1px solid #e7cf9f;color:#8A5410;border-radius:10px;padding:12px 14px;margin:12px 0;font-size:14px}
  .err{background:#fdeaea;border:1px solid #f2c2c2;color:#B21620;border-radius:10px;padding:11px 14px;margin:12px 0;font-size:14px}
  .foot{margin-top:16px;font-size:12.5px;color:#8a939a}
</style></head><body>
  <div class="card">
    <div style="color:#3e4852;display:flex;justify-content:center"><?=etaf_logo_svg(34)?></div>
    <?php if(!$row): ?>
      <h1>This link is not valid.</h1>
      <p>Please contact ETAF Coordination if you believe this is an error.</p>
    <?php else: ?>
      <h1>Delivery confirmation</h1>
      <div class="item"><b><?=e2($row['title'])?></b><br>
        Sent: <?=e2(substr((string)$row['sent_at'],0,10))?><?=$row['reminded_at']?' · Reminder: '.e2(substr((string)$row['reminded_at'],0,10)):''?></div>
      <?php if($did==='confirm'): ?>
        <div class="ok"><b>Thank you.</b> Receipt/acceptance has been recorded<?=$row['confirmed_by']?' for '.e2($row['confirmed_by']):''?> on <?=e2(substr((string)$row['confirmed_at'],0,10))?>.</div>
      <?php elseif($did==='object'): ?>
        <div class="warn"><b>Objection recorded.</b> ETAF Coordination has been notified and will follow up.</div>
      <?php elseif($st==='confirmed'): ?>
        <div class="ok">Already confirmed on <?=e2(substr((string)$row['confirmed_at'],0,10))?><?=$row['confirmed_by']?' by '.e2($row['confirmed_by']):''?>.</div>
      <?php elseif($st==='objection'): ?>
        <div class="warn">An objection was recorded on <?=e2(substr((string)$row['objection_at'],0,10))?>. ETAF Coordination will follow up.</div>
      <?php else: ?>
        <?php if($err): ?><div class="err"><?=e2($err)?></div><?php endif; ?>
        <p>Please confirm receipt/acceptance of the delivery above, or record an objection.</p>
        <form method="post" action="<?=$action?>">
          <input type="hidden" name="token" value="<?=e2($tok)?>">
          <input type="hidden" name="act" value="confirm">
          <label>Your name (optional)</label>
          <input name="name" autocomplete="name">
          <button type="submit" class="btn">Confirm receipt / acceptance</button>
        </form>
        <form method="post" action="<?=$action?>">
          <input type="hidden" name="token" value="<?=e2($tok)?>">
          <input type="hidden" name="act" value="object">
          <label>Objection (please describe)</label>
          <textarea name="text"></textarea>
          <label>Your name (optional)</label>
          <input name="name" autocomplete="name">
          <button type="submit" class="btn obj">Submit objection</button>
        </form>
      <?php endif; ?>
      <p class="foot">Nothing is saved by merely opening this page. Your response is recorded only after pressing a button.</p>
    <?php endif; ?>
  </div>
</body></html>
