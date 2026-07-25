<?php
/**
 * ETAF — Transfer-/Abholliste für den Kunden + Empfangsbestätigung
 * ---------------------------------------------------------------
 * GET  transfer.php?token=<tok> → zeigt die Liste + einen POST-Button.
 *      Ändert nichts (scanner-sicher).
 * POST → speichert die Empfangsbestätigung EINMAL.
 * ---------------------------------------------------------------
 */
require_once __DIR__.'/lib.php';
require_once __DIR__.'/mailer.php';
ensure_schema();

$isCommit = ($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST';
$tok  = $_POST['token'] ?? $_GET['token'] ?? '';
$note = trim((string)($_POST['note'] ?? ''));

$row = $tok ? q("SELECT tt.*, c.name, c.contact_name FROM transfer_tokens tt
  JOIN clients c ON c.id=tt.client_id WHERE tt.tok=?",[$tok])->fetch() : null;

$committed=false;
if($isCommit && $row){
  $committed=true;
  q("UPDATE transfer_tokens SET confirmed_at=?, note=? WHERE client_id=?",[now(), ($note!==''?$note:null), $row['client_id']]);
}
$rows = $row ? client_transfer_list((string)$row['client_id']) : [];
$action = htmlspecialchars(base_url().'/transfer.php');
$etok = htmlspecialchars($tok);
function esc($s){ return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); }
?>
<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>ETAF — Transfer</title>
<style>
  body{margin:0;min-height:100vh;background:#f4f5f6;padding:24px;box-sizing:border-box;
    font:16px/1.6 system-ui,-apple-system,Segoe UI,Arial,sans-serif;color:#242b31}
  .card{max-width:680px;margin:auto;background:#fff;border:1px solid #e2e5e8;border-radius:16px;
    box-shadow:0 10px 30px -14px rgba(35,43,49,.25);padding:30px 30px;box-sizing:border-box}
  .logo{font-weight:800;font-size:30px;letter-spacing:-.05em;color:#3e4852}.logo span{color:#d81f26}
  h1{font-size:20px;margin:14px 0 4px}.sub{color:#8a939a;margin:0 0 16px;font-size:14px}
  table{border-collapse:collapse;width:100%;margin:8px 0 4px}
  th{text-align:left;color:#8a939a;font-size:12px;padding:0 8px 6px;font-weight:600}
  td{padding:9px 8px;border-bottom:1px solid #eef0f2;font-size:14px;vertical-align:top}
  .empty{color:#8a939a;padding:14px 0}
  form{margin:20px 0 0}
  .note{width:100%;box-sizing:border-box;margin:0 0 10px;padding:10px 12px;border:1px solid #e2e5e8;border-radius:9px;font:15px system-ui,Arial,sans-serif}
  button{display:block;width:100%;padding:15px 18px;border-radius:10px;font:600 16px system-ui,Arial,sans-serif;cursor:pointer;background:#2E9E6B;color:#fff;border:2px solid #2E9E6B}
  .done{background:#e9f6ef;border:1px solid #bfe3cf;color:#1E7A4D;border-radius:12px;padding:16px 18px;margin-top:6px}
  .foot{margin-top:18px;font-size:12px;color:#8a939a}
  /* --- Phone: every row becomes a card instead of scrolling sideways --- */
  @media (max-width:560px){
    body{padding:14px}
    .card{padding:22px 18px;border-radius:14px}
    h1{font-size:18px}
    table,tbody,tr,td{display:block;width:100%}
    tr:first-child{display:none}              /* header row: values are labelled instead */
    tr{border:1px solid #e2e5e8;border-radius:12px;padding:12px 14px;margin:0 0 10px;box-sizing:border-box}
    td{border:none;padding:3px 0;font-size:14px;white-space:normal!important}
    td[data-l]::before{content:attr(data-l);display:block;font-size:11px;font-weight:700;
      letter-spacing:.06em;text-transform:uppercase;color:#8a939a;margin-bottom:1px}
    button{padding:16px 18px}
  }
  @media (prefers-color-scheme:dark){
    body{background:#12171c;color:#e9edf0}.card{background:#1a2127;border-color:#28323a}
    .logo{color:#aeb9c2}.sub,.foot,th{color:#6e7a82}td{border-color:#28323a}
    .note{background:#12171c;border-color:#28323a;color:#e9edf0}
    @media (max-width:560px){ tr{border-color:#28323a} }
  }
</style></head><body>
  <div class="card">
    <div class="logo">ETAF<span>.</span></div>
    <?php if(!$row): ?>
      <h1>This link is invalid or has expired.</h1>
    <?php else: ?>
      <h1>Trainer arrivals &amp; transfer — <?=esc($row['name'])?></h1>
      <p class="sub">Please arrange pickup &amp; hotel transfer for the trainers below.</p>
      <?php if(!$rows): ?>
        <div class="empty">No confirmed trainers yet.</div>
      <?php else: ?>
        <table>
          <tr><th>Trainer</th><th>Arrival</th><th>Departure</th><th>Hotel</th><th>Training / Location</th></tr>
          <?php foreach($rows as $r):
            $arr=trim(($r['arrival']?:'').($r['flight_out']?' · '.$r['flight_out']:''));
            $dep=trim(($r['departure']?:'').($r['flight_return']?' · '.$r['flight_return']:''));
            $hotel=trim(($r['hotel']?:'').($r['room']?' · '.$r['room']:'')); ?>
            <tr>
              <td data-l="Trainer"><b><?=esc($r['trainer'])?></b><?php if($r['phone']): ?><br><span class="sub">☎ <?=esc($r['phone'])?></span><?php endif; ?></td>
              <td data-l="Arrival"><?=esc($arr?:'—')?></td><td data-l="Departure"><?=esc($dep?:'—')?></td><td data-l="Hotel"><?=esc($hotel?:'—')?></td>
              <td data-l="Training / Location"><?=esc($r['topic'])?><br><span class="sub"><?=esc(trim(($r['city']??'').(($r['country']??'')?', '.$r['country']:'')))?></span></td>
            </tr>
          <?php endforeach; ?>
        </table>
      <?php endif; ?>

      <?php if($committed): ?>
        <div class="done"><?=stroke_icon('check',18)?><b>Thank you!</b> Receipt confirmed — we have noted that your team will handle the transfers.</div>
      <?php else: ?>
        <form method="post" action="<?=$action?>">
          <input type="hidden" name="token" value="<?=$etok?>">
          <input class="note" name="note" placeholder="Optional note (e.g. contact person / questions)">
          <button type="submit"><?=stroke_icon('check')?>Received &amp; confirmed</button>
        </form>
      <?php endif; ?>
      <div class="foot">ETAF · Trainer Coordination</div>
    <?php endif; ?>
  </div>
</body></html>
