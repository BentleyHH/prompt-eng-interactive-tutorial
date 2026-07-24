<?php
/**
 * ETAF — Magic-Link-Landeseite (zweistufig, scanner-sicher)
 * ---------------------------------------------------------------
 * GET  respond.php?token=<tok>&answer=yes|maybe|no
 *      → zeigt NUR eine Bestätigungsseite. Ändert NICHTS, sendet NICHTS.
 *        (E-Mail-Scanner / Link-Vorschau rufen nur GET auf → wirkungslos.)
 * POST (Klick auf „Bestätigen“ auf dieser Seite)
 *      → speichert die Antwort und schickt EINMAL die Bestätigungs-Mail.
 * ---------------------------------------------------------------
 */
require_once __DIR__.'/lib.php';
require_once __DIR__.'/mailer.php';
ensure_schema();

$map=['yes'=>'yes','maybe'=>'maybe','no'=>'no'];
$isCommit = ($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST';
$tok = $_POST['token']  ?? $_GET['token']  ?? '';
$ans = $_POST['answer'] ?? $_GET['answer'] ?? '';

$req = $tok ? q("SELECT r.*, t.topic, t.city, t.country, t.kw, t.month, t.need_cnt FROM requests r
  JOIN trainings t ON t.id=r.training_id WHERE r.tok=?",[$tok])->fetch() : null;

$lang = ($req['lang'] ?? 'de')==='en' ? 'en' : 'de';
$validAns = isset($map[$ans]);

/* ---- Nur bei echtem POST wird gespeichert + Mail geschickt ---- */
$committed=false;
if($isCommit && $req && $validAns){
  $committed=true;
  $changed = ($req['status'] ?? '') !== $map[$ans];
  q("UPDATE requests SET status=?, responded_at=? WHERE id=?",[$map[$ans], now(), $req['id']]);

  /* Bestätigungs-E-Mail — nur bei tatsächlicher Änderung, also genau einmal. */
  $tr = $changed ? q("SELECT * FROM trainers WHERE id=?",[$req['trainer_id']])->fetch() : null;
  if($tr && !empty($tr['email'])){
    $tg=['topic'=>$req['topic'],'city'=>$req['city'],'country'=>$req['country']??'',
         'kw'=>$req['kw'],'month'=>$req['month']??'','need_cnt'=>$req['need_cnt']??''];
    $word = $lang==='de'
      ? ['yes'=>'zugesagt (verfügbar)','maybe'=>'mit „vielleicht“ geantwortet','no'=>'abgesagt']
      : ['yes'=>'confirmed (available)','maybe'=>'answered “maybe”','no'=>'declined'];
    $subj = fill_tpl($lang==='de'
      ? 'Bestätigung deiner Antwort — {{topic}} ({{city}})'
      : 'Confirmation of your reply — {{topic}} ({{city}})', $tg, $tr);
    $intro = fill_tpl($lang==='de'
      ? "Hallo {{firstName}},\n\nvielen Dank! Für „{{topic}}“ in {{city}} ({{kw}}) haben wir notiert, dass du ".$word[$map[$ans]].".\n\nFalls sich etwas ändert oder etwas dazwischenkommt, kannst du deine Antwort jederzeit über die Buttons unten anpassen — die neue Antwort ersetzt automatisch die alte."
      : "Hi {{firstName}},\n\nthank you! For \"{{topic}}\" in {{city}} ({{kw}}) we noted that you ".$word[$map[$ans]].".\n\nIf anything changes, you can update your answer any time via the buttons below — the new answer automatically replaces the old one.",
      $tg, $tr);
    $html = email_html($intro, response_buttons($tok, $lang));
    $sent = send_email($tr['email'], $tr['name'], $subj, $html);
    $st = (cfg()['mail_mode']??'mail')==='log' ? 'logged' : ($sent?'sent':'failed');
    q("INSERT INTO email_log(training_id,trainer_id,to_email,subject,body,lang,status,created_at)
       VALUES(?,?,?,?,?,?,?,?)",
      [$req['training_id'],$req['trainer_id'],$tr['email'],$subj,$intro,$lang,$st,now()]);
  }
}

$L = $lang==='de' ? [
  'confirmTitle'=>'Kurz bestätigen',
  'confirmLead'=>'Bitte tippe auf deine Antwort — erst dann wird sie gespeichert.',
  'yesBtn'=>'✅ Ja, verfügbar','maybeBtn'=>'🤔 Vielleicht','noBtn'=>'❌ Nein',
  'thanks'=>'Danke für deine Rückmeldung!',
  'yes'=>'Klasse — wir haben notiert, dass du <b>verfügbar</b> bist.',
  'maybe'=>'Notiert: <b>vielleicht</b>. Wir melden uns.',
  'no'=>'Schade — notiert, dass du <b>nicht</b> kannst. Danke trotzdem!',
  'change'=>'Du kannst deine Antwort jederzeit über die Buttons in der E-Mail ändern.',
  'err'=>'Dieser Link ist ungültig oder abgelaufen.',
  're'=>'Training',
] : [
  'confirmTitle'=>'Please confirm',
  'confirmLead'=>'Tap your answer — it is only saved after you confirm.',
  'yesBtn'=>'✅ Yes, available','maybeBtn'=>'🤔 Maybe','noBtn'=>'❌ No',
  'thanks'=>'Thanks for your reply!',
  'yes'=>'Great — we noted that you are <b>available</b>.',
  'maybe'=>'Noted: <b>maybe</b>. We\'ll be in touch.',
  'no'=>'Too bad — noted that you <b>can\'t</b> make it. Thanks anyway!',
  'change'=>'You can change your answer any time via the buttons in the email.',
  'err'=>'This link is invalid or has expired.',
  're'=>'Training',
];

$col = $ans==='yes'?'#2E9E6B':($ans==='no'?'#D81F26':'#C77E1E');
$action = htmlspecialchars(base_url().'/respond.php');
$etok = htmlspecialchars($tok);
/* Ein Antwort-Button als POST-Formular (nur so wird wirklich gespeichert). */
function opt($action,$etok,$key,$label,$text,$strong,$primary){
  $style = $primary
    ? "background:$strong;color:#fff;border:2px solid $strong"
    : "background:#fff;color:$text;border:2px solid $strong";
  return '<form method="post" action="'.$action.'" style="margin:0 0 12px">'
    .'<input type="hidden" name="token" value="'.$etok.'">'
    .'<input type="hidden" name="answer" value="'.$key.'">'
    .'<button type="submit" style="display:block;width:100%;padding:15px 18px;border-radius:10px;'
    .'font:600 16px system-ui,Arial,sans-serif;cursor:pointer;'.$style.'">'.$label.'</button>'
    .'</form>';
}
?>
<!doctype html><html lang="<?=htmlspecialchars($lang)?>"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>ETAF</title>
<style>
  body{margin:0;min-height:100vh;display:grid;place-items:center;background:#f4f5f6;
    font:16px/1.6 system-ui,-apple-system,Segoe UI,Arial,sans-serif;color:#242b31;padding:24px}
  .card{max-width:440px;width:100%;background:#fff;border:1px solid #e2e5e8;border-radius:16px;
    box-shadow:0 10px 30px -14px rgba(35,43,49,.25);padding:34px 32px;text-align:center;box-sizing:border-box}
  .logo{font-weight:800;font-size:34px;letter-spacing:-.05em;color:#3e4852}
  .logo span{color:#d81f26}
  .bar{height:4px;width:56px;border-radius:4px;background:<?=$col?>;margin:16px auto 22px}
  h1{font-size:20px;margin:0 0 10px}
  p{color:#5c666e;margin:6px 0}
  .ctx{margin:14px 0 20px;font-size:14px;color:#5c666e}
  .ctx b{color:#242b31}
  .foot{margin-top:16px;font-size:13px;color:#8a939a}
  @media (prefers-color-scheme:dark){
    body{background:#12171c;color:#e9edf0}.card{background:#1a2127;border-color:#28323a}
    .logo{color:#aeb9c2}p,.ctx{color:#a2adb5}.ctx b{color:#e9edf0}.foot{color:#6e7a82}
  }
</style></head><body>
  <div class="card">
    <div class="logo">ETAF<span>.</span></div>
    <div class="bar"></div>
    <?php if($committed): ?>
      <h1><?=$L['thanks']?></h1>
      <p><?=$L[$map[$ans]]?></p>
      <?php if($req): ?><div class="ctx"><?=$L['re']?>: <b><?=htmlspecialchars($req['topic'])?></b><br><?=htmlspecialchars($req['city'].' · '.$req['kw'])?></div><?php endif; ?>
      <p class="foot"><?=$L['change']?></p>
    <?php elseif($req): ?>
      <h1><?=$L['confirmTitle']?></h1>
      <div class="ctx"><?=$L['re']?>: <b><?=htmlspecialchars($req['topic'])?></b><br><?=htmlspecialchars($req['city'].' · '.$req['kw'])?></div>
      <p><?=$L['confirmLead']?></p>
      <div style="margin-top:18px">
        <?php
          echo opt($action,$etok,'yes',  $L['yesBtn'],  '#1E7A4D','#2E9E6B', $ans==='yes');
          echo opt($action,$etok,'maybe',$L['maybeBtn'],'#8A5410','#C77E1E', $ans==='maybe');
          echo opt($action,$etok,'no',   $L['noBtn'],   '#B21620','#D81F26', $ans==='no');
        ?>
      </div>
    <?php else: ?>
      <h1><?=$L['err']?></h1>
    <?php endif; ?>
  </div>
</body></html>
