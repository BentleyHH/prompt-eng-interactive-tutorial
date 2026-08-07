<?php
/**
 * ETAF — Einsatzübersicht + Gesamtbestätigung (zweistufig, scanner-sicher)
 * ---------------------------------------------------------------
 * GET  plan.php?token=<tok>  → zeigt den kompletten Einsatzplan des Trainers
 *      und zwei POST-Buttons. Ändert NICHTS (E-Mail-Scanner rufen nur GET auf).
 * POST → speichert die Gesamtbestätigung („alles korrekt“ oder „Fehler“) EINMAL.
 * ---------------------------------------------------------------
 */
require_once __DIR__.'/lib.php';
require_once __DIR__.'/mailer.php';
ensure_schema();

$isCommit = ($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST';
$tok  = $_POST['token']  ?? $_GET['token']  ?? '';
$act  = $_POST['act']    ?? '';            // 'ok' | 'issue'
$note = trim((string)($_POST['note'] ?? ''));

$row = $tok ? q("SELECT p.*, t.name, t.email, t.id AS tid FROM plan_tokens p
  JOIN trainers t ON t.id=p.trainer_id WHERE p.tok=?",[$tok])->fetch() : null;
$lang = 'de';  // Trainer-Sprache: Übersicht ist bilingual erklärt, Default DE

$committed=false; $result='';
if($isCommit && $row && in_array($act,['ok','issue'],true)){
  $committed=true; $result=$act;
  // Bei „Fehler“: resolved_at zurücksetzen → Rückmeldung erscheint im Dashboard-Posteingang.
  q("UPDATE plan_tokens SET confirmed_at=?, confirm_status=?, note=?, resolved_at=NULL WHERE trainer_id=?",
    [now(), $act, ($act==='issue'?$note:null), $row['tid']]);
  // Projektmanager per E-Mail informieren, damit die Rückmeldung nicht ins Leere läuft.
  if($act==='issue'){
    $notify = trim((string)(cfg()['notify_email'] ?? cfg()['from_email'] ?? ''));
    if($notify!==''){
      $subj = 'Rückmeldung zur Einsatzübersicht — '.$row['name'];
      $body = $row['name']." hat bei der Einsatzübersicht „Da stimmt etwas nicht“ gemeldet.\n\n"
        ."Anmerkung:\n".($note!==''?$note:'(keine Anmerkung)')."\n\n"
        ."Diese Rückmeldung liegt jetzt im Dashboard unter „Rückmeldungen“ zur Bearbeitung bereit.";
      $ok=send_email($notify, cfg()['from_name']??'ETAF', $subj, email_html($body,''));
      $st=(cfg()['mail_mode']??'mail')==='log' ? 'logged' : ($ok?'sent':'failed');
      q("INSERT INTO email_log(training_id,trainer_id,to_email,subject,body,lang,status,created_at)
         VALUES(?,?,?,?,?,?,?,?)",[null,$row['tid'],$notify,$subj,$body,'de',$st,now()]);
    }
  }
}

$sched = $row ? trainer_schedule((int)$row['tid']) : [];
$action = htmlspecialchars(base_url().'/plan.php');
$etok = htmlspecialchars($tok);
function esc($s){ return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); }
?>
<!doctype html><html lang="de"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>ETAF — Einsatzübersicht</title>
<style>
  body{margin:0;min-height:100vh;background:#f4f5f6;padding:24px;box-sizing:border-box;
    font:16px/1.6 system-ui,-apple-system,Segoe UI,Arial,sans-serif;color:#242b31}
  .card{max-width:640px;margin:auto;background:#fff;border:1px solid #e2e5e8;border-radius:16px;
    box-shadow:0 10px 30px -14px rgba(35,43,49,.25);padding:30px 30px;box-sizing:border-box}
  .logo{font-weight:800;font-size:30px;letter-spacing:-.05em;color:#3e4852}.logo span{color:#d81f26}
  h1{font-size:20px;margin:14px 0 4px}.sub{color:#8a939a;margin:0 0 16px;font-size:14px}
  table{border-collapse:collapse;width:100%;margin:8px 0 4px}
  th{text-align:left;color:#8a939a;font-size:12px;padding:0 8px 6px;font-weight:600}
  td{padding:9px 8px;border-bottom:1px solid #eef0f2;font-size:14px;vertical-align:top}
  .pill{display:inline-block;padding:2px 9px;border-radius:20px;font-size:12px;font-weight:700;color:#fff;white-space:nowrap}
  .empty{color:#8a939a;padding:14px 0}
  .btns{margin-top:22px}
  .btns form{margin:0 0 12px}
  .btns button{display:block;width:100%;padding:15px 18px;border-radius:10px;font:600 16px system-ui,Arial,sans-serif;cursor:pointer}
  .ok{background:#2E9E6B;color:#fff;border:2px solid #2E9E6B}
  .issue{background:#fff;color:#B21620;border:2px solid #D81F26}
  .note{width:100%;box-sizing:border-box;margin:4px 0 10px;padding:10px 12px;border:1px solid #e2e5e8;border-radius:9px;font:15px system-ui,Arial,sans-serif}
  .done{background:#e9f6ef;border:1px solid #bfe3cf;color:#1E7A4D;border-radius:12px;padding:16px 18px;margin-top:6px}
  .done.bad{background:#fdeaea;border-color:#f2c2c2;color:#B21620}
  .foot{margin-top:18px;font-size:12px;color:#8a939a}
  /* --- Handy: aus jeder Tabellenzeile wird eine Karte (statt seitlich zu scrollen) --- */
  @media (max-width:560px){
    body{padding:14px}
    .card{padding:22px 18px;border-radius:14px}
    h1{font-size:18px}
    table,tbody,tr,td{display:block;width:100%}
    tr:first-child{display:none}              /* Kopfzeile entfällt, Werte sind beschriftet */
    tr{border:1px solid #e2e5e8;border-radius:12px;padding:12px 14px;margin:0 0 10px;box-sizing:border-box}
    td{border:none;padding:3px 0;font-size:14px;white-space:normal!important}
    td[data-l]::before{content:attr(data-l);display:block;font-size:11px;font-weight:700;
      letter-spacing:.06em;text-transform:uppercase;color:#8a939a;margin-bottom:1px}
    .btns button{padding:16px 18px}
  }
  @media (prefers-color-scheme:dark){
    body{background:#12171c;color:#e9edf0}.card{background:#1a2127;border-color:#28323a}
    .logo{color:#aeb9c2}.sub,.foot,th{color:#6e7a82}td{border-color:#28323a}
    .note{background:#12171c;border-color:#28323a;color:#e9edf0}
    @media (max-width:560px){ tr{border-color:#28323a} }
  }
</style></head><body>
  <div class="card">
    <div class="logo" style="display:flex;justify-content:center"><?=etaf_logo_svg(34)?></div>
    <?php if(!$row): ?>
      <h1>Dieser Link ist ungültig oder abgelaufen.</h1>
      <p class="sub">This link is invalid or has expired.</p>
    <?php else: ?>
      <h1>Einsatzübersicht — <?=esc($row['name'])?></h1>
      <p class="sub">Bitte prüfe deine Einsätze. · Please review your assignments.</p>

      <?php if(!$sched): ?>
        <div class="empty">Aktuell keine Einsätze hinterlegt. · No assignments on record yet.</div>
      <?php else: ?>
        <table>
          <tr><th>Status</th><th>Zeitraum</th><th>Ort</th><th>Training</th></tr>
          <?php foreach($sched as $t): $st=$t['rstatus'];
            $col=($st==='yes'||$st==='confirmed')?'#2E9E6B':($st==='maybe'?'#C77E1E':'#5c666e'); ?>
            <?php $range=fmt_date_range($t['start_date']??null,$t['end_date']??null,'de'); $tw=travel_window($t['start_date']??null,$t['end_date']??null,'de'); ?>
            <tr>
              <td data-l="Status"><span class="pill" style="background:<?=$col?>"><?=esc(status_word($st,'de'))?></span></td>
              <td data-l="Zeitraum" style="white-space:nowrap"><?=esc($range ?: ($t['kw']??''))?><?php if($range && !empty($t['kw'])): ?><br><span class="sub" style="font-size:12px"><?=esc($t['kw'])?></span><?php endif; ?></td>
              <td data-l="Ort"><?=esc(trim(($t['city']??'').(($t['country']??'')?', '.$t['country']:'')))?></td>
              <td data-l="Training"><b><?=esc($t['topic'])?></b>
                <?php if(!empty($t['spec'])): ?><br><span class="sub"><?=esc($t['spec'])?></span><?php endif; ?>
                <?php if($tw): ?><br><span class="sub" style="font-size:12px">✈ Reisezeitraum inkl. An-/Abreise: <?=esc($tw)?></span><?php endif; ?>
                <?php $tl=travel_line($t,'de'); if($tl): ?><br><span class="sub" style="font-size:12px">🧳 <?=$tl?></span><?php endif; ?>
              </td>
            </tr>
          <?php endforeach; ?>
        </table>
      <?php endif; ?>

      <?php if($committed): ?>
        <div class="done <?=$result==='issue'?'bad':''?>">
          <?php if($result==='ok'): ?>
            <?=stroke_icon('check',18)?><b>Danke!</b> Du hast deinen Einsatzplan als korrekt bestätigt.
          <?php else: ?>
            <?=stroke_icon('alert',18)?><b>Notiert.</b> Du hast eine Rückmeldung hinterlassen — wir kümmern uns darum.
          <?php endif; ?>
        </div>
      <?php else: ?>
        <div class="btns">
          <form method="post" action="<?=$action?>">
            <input type="hidden" name="token" value="<?=$etok?>">
            <input type="hidden" name="act" value="ok">
            <button type="submit" class="ok"><?=stroke_icon('check')?>Alles korrekt — bestätigen</button>
          </form>
          <form method="post" action="<?=$action?>">
            <input type="hidden" name="token" value="<?=$etok?>">
            <input type="hidden" name="act" value="issue">
            <input class="note" name="note" placeholder="Optional: Was stimmt nicht? (kurz beschreiben)">
            <button type="submit" class="issue"><?=stroke_icon('alert')?>Da stimmt etwas nicht</button>
          </form>
        </div>
      <?php endif; ?>
      <div class="foot">ETAF · Trainer-Koordination</div>
    <?php endif; ?>
  </div>
</body></html>
