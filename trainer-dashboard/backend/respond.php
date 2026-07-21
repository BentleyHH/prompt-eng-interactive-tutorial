<?php
/**
 * ETAF — Magic-Link-Landeseite
 * Der Trainer klickt in der E-Mail auf ✅/🤔/❌ → Status landet sofort in der DB.
 * Aufruf: respond.php?token=<tok>&answer=yes|maybe|no
 */
require_once __DIR__.'/lib.php';
ensure_schema();

$tok=$_GET['token']??'';
$ans=$_GET['answer']??'';
$map=['yes'=>'yes','maybe'=>'maybe','no'=>'no'];

$req = $tok ? q("SELECT r.*, t.topic, t.city, t.kw FROM requests r
  JOIN trainings t ON t.id=r.training_id WHERE r.tok=?",[$tok])->fetch() : null;

$lang = $req['lang'] ?? 'de';
$ok = $req && isset($map[$ans]);
if($ok){
  q("UPDATE requests SET status=?, responded_at=? WHERE id=?",[$map[$ans], now(), $req['id']]);
}

$L = $lang==='de' ? [
  'thanks'=>'Danke für deine Rückmeldung!',
  'yes'=>'Klasse — wir haben notiert, dass du <b>verfügbar</b> bist.',
  'maybe'=>'Notiert: <b>vielleicht</b>. Wir melden uns.',
  'no'=>'Schade — notiert, dass du <b>nicht</b> kannst. Danke trotzdem!',
  'change'=>'Du kannst deine Antwort jederzeit über die Buttons in der E-Mail ändern.',
  'err'=>'Dieser Link ist ungültig oder abgelaufen.',
  're'=>'Training',
] : [
  'thanks'=>'Thanks for your reply!',
  'yes'=>'Great — we noted that you are <b>available</b>.',
  'maybe'=>'Noted: <b>maybe</b>. We\'ll be in touch.',
  'no'=>'Too bad — noted that you <b>can\'t</b> make it. Thanks anyway!',
  'change'=>'You can change your answer any time via the buttons in the email.',
  'err'=>'This link is invalid or has expired.',
  're'=>'Training',
];
$msg = $ok ? $L[$map[$ans]] : $L['err'];
$col = $ans==='yes'?'#2E9E6B':($ans==='no'?'#D81F26':'#C77E1E');
?>
<!doctype html><html lang="<?=htmlspecialchars($lang)?>"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>ETAF</title>
<style>
  body{margin:0;min-height:100vh;display:grid;place-items:center;background:#f4f5f6;
    font:16px/1.6 system-ui,-apple-system,Segoe UI,Arial,sans-serif;color:#242b31;padding:24px}
  .card{max-width:440px;background:#fff;border:1px solid #e2e5e8;border-radius:16px;
    box-shadow:0 10px 30px -14px rgba(35,43,49,.25);padding:34px 32px;text-align:center}
  .logo{font-weight:800;font-size:34px;letter-spacing:-.05em;color:#3e4852}
  .logo span{color:#d81f26}
  .bar{height:4px;width:56px;border-radius:4px;background:<?=$col?>;margin:16px auto 22px}
  h1{font-size:20px;margin:0 0 10px}
  p{color:#5c666e;margin:6px 0}
  .ctx{margin-top:18px;font-size:13px;color:#8a939a}
  @media (prefers-color-scheme:dark){
    body{background:#12171c;color:#e9edf0}.card{background:#1a2127;border-color:#28323a}
    .logo{color:#aeb9c2}p{color:#a2adb5}.ctx{color:#6e7a82}
  }
</style></head><body>
  <div class="card">
    <div class="logo">ETAF<span>.</span></div>
    <div class="bar"></div>
    <?php if($ok): ?>
      <h1><?=$L['thanks']?></h1>
      <p><?=$msg?></p>
      <?php if($req): ?><div class="ctx"><?=$L['re']?>: <b><?=htmlspecialchars($req['topic'])?></b><br><?=htmlspecialchars($req['city'].' · '.$req['kw'])?></div><?php endif; ?>
      <p class="ctx"><?=$L['change']?></p>
    <?php else: ?>
      <h1><?=$L['err']?></h1>
    <?php endif; ?>
  </div>
</body></html>
