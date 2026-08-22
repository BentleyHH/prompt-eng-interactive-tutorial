<?php
/**
 * ETAF - Magic-Link-Landeseite (zweistufig, scanner-sicher)
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

$req = $tok ? q("SELECT r.*, t.topic, t.city, t.country, t.kw, t.month, t.need_cnt, t.start_date, t.end_date FROM requests r
  JOIN trainings t ON t.id=r.training_id WHERE r.tok=?",[$tok])->fetch() : null;

$lang = ($req['lang'] ?? 'de')==='en' ? 'en' : 'de';
/* Kontext-Zeile: Ort · echtes Datum (falls vorhanden) · KW */
$whenLine = '';
if($req){
  $range = fmt_date_range($req['start_date']??null, $req['end_date']??null, $lang);
  $whenLine = htmlspecialchars(trim(implode(' · ', array_filter([$req['city'], $range, kw_label($req['kw'],$lang)]))));
}
$validAns = isset($map[$ans]);

/* ---- Nur bei echtem POST wird gespeichert + Mail geschickt ---- */
$committed=false;
if($isCommit && $req && $validAns){
  $committed=true;
  $changed = ($req['status'] ?? '') !== $map[$ans];
  q("UPDATE requests SET status=?, responded_at=? WHERE id=?",[$map[$ans], now(), $req['id']]);

  /* Bestätigungs-E-Mail - nur bei tatsächlicher Änderung, also genau einmal. */
  $tr = $changed ? q("SELECT * FROM trainers WHERE id=?",[$req['trainer_id']])->fetch() : null;
  if($tr && !empty($tr['email'])){
    $tg=['topic'=>$req['topic'],'city'=>$req['city'],'country'=>$req['country']??'',
         'kw'=>kw_label($req['kw'],$lang),'month'=>$req['month']??'','need_cnt'=>$req['need_cnt']??''];
    $word = $lang==='de'
      ? ['yes'=>'zugesagt (verfügbar)','maybe'=>'mit „vielleicht“ geantwortet','no'=>'abgesagt']
      : ['yes'=>'confirmed (available)','maybe'=>'answered “maybe”','no'=>'declined'];
    $subj = fill_tpl($lang==='de'
      ? 'Bestätigung deiner Antwort - {{topic}} ({{city}})'
      : 'Confirmation of your reply - {{topic}} ({{city}})', $tg, $tr);
    $intro = fill_tpl($lang==='de'
      ? "Hallo {{firstName}},\n\nvielen Dank! Für „{{topic}}“ in {{city}} ({{kw}}) haben wir notiert, dass du ".$word[$map[$ans]].".\n\nFalls sich etwas ändert oder etwas dazwischenkommt, kannst du deine Antwort jederzeit über die Buttons unten anpassen - die neue Antwort ersetzt automatisch die alte."
      : "Hi {{firstName}},\n\nthank you! For \"{{topic}}\" in {{city}} ({{kw}}) we noted that you ".$word[$map[$ans]].".\n\nIf anything changes, you can update your answer any time via the buttons below - the new answer automatically replaces the old one.",
      $tg, $tr);
    $buttons = response_buttons($tok, $lang);
    if($map[$ans]==='yes'){
      $intro .= $lang==='de'
        ? "\n\nDamit die Flüge gebucht werden können, gib bitte kurz deine Reisedaten an (Abflughafen, An- und Abreise) - Button unten. Dauert keine zwei Minuten."
        : "\n\nSo the flights can be booked, please provide your travel details (departure airport, arrival and departure) - button below. Takes less than two minutes.";
      $buttons = cta_button(base_url().'/respond.php?token='.$tok.'&travel=1',
        $lang==='de'?'Reisedaten angeben':'Provide travel details','#2E9E6B').$buttons;
    }
    $html = email_html($intro, $buttons);
    $sent = send_email($tr['email'], $tr['name'], $subj, $html);
    $st = (cfg()['mail_mode']??'mail')==='log' ? 'logged' : ($sent?'sent':'failed');
    q("INSERT INTO email_log(training_id,trainer_id,to_email,subject,body,lang,status,created_at)
       VALUES(?,?,?,?,?,?,?,?)",
      [$req['training_id'],$req['trainer_id'],$tr['email'],$subj,$intro,$lang,$st,now()]);
  }
}

/* ---- Reisedaten des Trainers fuer diese Woche (Selbstauskunft) ----
   Der Kunde bucht die Fluege selbst - deshalb fragen wir direkt bei der
   Zusage Abflughafen & Co. ab. Der Link ist tokengebunden; gespeichert
   wird nur fuer genau dieses Training und diesen Trainer. */
$travelSaved=false; $travelErr='';
$doTravel = $isCommit && ($_POST['travelsave']??'')==='1' && $req;
if($doTravel){
  $g=fn($k,$max=96)=>mb_substr(trim((string)($_POST[$k]??'')),0,$max);
  $dep=$g('dep'); $ret=$g('ret'); $arr=$g('arr',24); $depDay=$g('dpt',24);
  $fo=$g('fo',190); $fr=$g('fr',190); $note=$g('note',600);
  $pnm=$g('pnm',190); $pno=$g('pno',64); $pnat=$g('pnat',64); $pbd=$g('pbd',20); $pex=$g('pex',20);
  if($dep===''){ $travelErr=$lang==='de'?'Bitte den Abflughafen angeben.':'Please enter your departure airport.'; }
  else{
    $ex=q("SELECT * FROM travel WHERE training_id=? AND trainer_id=?",[$req['training_id'],$req['trainer_id']])->fetch();
    if($ex){
      q("UPDATE travel SET dep_airport=?,ret_airport=?,arrival=?,departure=?,flight_out=?,flight_return=?,
         notes=CASE WHEN ?='' THEN notes ELSE ? END, updated_at=? WHERE id=?",
        [$dep,$ret,$arr,$depDay,$fo,$fr,$note,$note,now(),$ex['id']]);
    } else {
      q("INSERT INTO travel(training_id,trainer_id,dep_airport,ret_airport,arrival,departure,flight_out,flight_return,notes,updated_at)
         VALUES(?,?,?,?,?,?,?,?,?,?)",[$req['training_id'],$req['trainer_id'],$dep,$ret,$arr,$depDay,$fo,$fr,$note,now()]);
    }
    q("UPDATE trainers SET home_airport=? WHERE id=?",[$dep,$req['trainer_id']]);
    // Passangaben nur uebernehmen, wenn etwas eingetragen wurde
    $sets=[]; $vals=[];
    foreach([['passport_name',$pnm],['passport_number',$pno],['passport_nationality',$pnat],
             ['passport_birthdate',$pbd],['passport_expiry',$pex]] as [$col,$v]){
      if($v!==''){ $sets[]="$col=?"; $vals[]=$v; }
    }
    if($sets){ $vals[]=now(); $vals[]=$req['trainer_id'];
      q("UPDATE trainers SET ".implode(',',$sets).",passport_updated_at=? WHERE id=?",$vals); }
    $trn=q("SELECT name FROM trainers WHERE id=?",[$req['trainer_id']])->fetch();
    audit_as(['id'=>null,'name'=>(string)($trn['name']??'Trainer')],'travel.selfService','training',
      (string)$req['training_id'],'Reisedaten über den Antwort-Link angegeben ('.$dep.')');
    $travelSaved=true;
  }
}
/* Formular zeigen: direkt nach der Zusage, per Mail-Button (travel=1) oder nach dem Speichern */
$showTravel = $req && (
  ($committed && $map[$ans]==='yes') ||
  (($_GET['travel']??'')==='1' && in_array(($req['status']??''),['yes','confirmed'],true)) ||
  $doTravel );
$tvRow=[]; $trRow=[];
if($showTravel){
  $tvRow=q("SELECT * FROM travel WHERE training_id=? AND trainer_id=?",[$req['training_id'],$req['trainer_id']])->fetch()?:[];
  $trRow=q("SELECT * FROM trainers WHERE id=?",[$req['trainer_id']])->fetch()?:[];
}
$tvDef=function(string $k,string $fallback='') use($tvRow){ return htmlspecialchars(trim((string)($tvRow[$k]??''))!==''?(string)$tvRow[$k]:$fallback,ENT_QUOTES,'UTF-8'); };
$dayShift=function(?string $d,int $days){ if(!$d) return ''; $t=strtotime($d); return $t?gmdate('Y-m-d',$t+$days*86400):''; };
$passMissing = $showTravel && (trim((string)($trRow['passport_number']??''))==='' || trim((string)($trRow['passport_name']??''))==='');

$L = $lang==='de' ? [
  'confirmTitle'=>'Kurz bestätigen',
  'confirmLead'=>'Bitte tippe auf deine Antwort - erst dann wird sie gespeichert.',
  'yesBtn'=>'Ja, verfügbar','maybeBtn'=>'Vielleicht','noBtn'=>'Nein',
  'thanks'=>'Danke für deine Rückmeldung!',
  'yes'=>'Klasse - wir haben notiert, dass du <b>verfügbar</b> bist.',
  'maybe'=>'Notiert: <b>vielleicht</b>. Wir melden uns.',
  'no'=>'Schade - notiert, dass du <b>nicht</b> kannst. Danke trotzdem!',
  'change'=>'Du kannst deine Antwort jederzeit über die Buttons in der E-Mail ändern.',
  'err'=>'Dieser Link ist ungültig oder abgelaufen.',
  're'=>'Training',
  'tvTitle'=>'Deine Reisedaten für diese Woche',
  'tvLead'=>'Der Kunde bucht die Flüge selbst. Mit diesen Angaben kann direkt gebucht werden - bitte kurz ausfüllen oder prüfen.',
  'tvDep'=>'Abflughafen','tvDepPh'=>'z.B. Frankfurt (FRA)',
  'tvRet'=>'Rückflug nach','tvRetPh'=>'leer = wie Abflughafen',
  'tvArr'=>'Anreisetag','tvDpt'=>'Abreisetag',
  'tvFo'=>'Flugwunsch Hinflug','tvFoPh'=>'z.B. Abflug abends, Direktflug',
  'tvFr'=>'Flugwunsch Rückflug','tvFrPh'=>'z.B. Nachtflug ok',
  'tvPassHead'=>'Passangaben (fehlen uns noch - nötig für die Buchung)',
  'tvPnm'=>'Name laut Reisepass','tvPno'=>'Passnummer','tvPnat'=>'Nationalität',
  'tvPbd'=>'Geburtsdatum','tvPex'=>'Pass gültig bis',
  'tvNote'=>'Bemerkung (optional)','tvNotePh'=>'z.B. Vielflieger-Nummer, Sitzplatzwunsch',
  'tvSave'=>'Reisedaten speichern',
  'tvSaved'=>'Reisedaten gespeichert - vielen Dank! Du kannst sie über denselben Link jederzeit anpassen.',
  'tvPrivacy'=>'Die Angaben gehen nur an die ETAF-Koordination und an den Kunden zur Flugbuchung.',
] : [
  'confirmTitle'=>'Please confirm',
  'confirmLead'=>'Tap your answer - it is only saved after you confirm.',
  'yesBtn'=>'Yes, available','maybeBtn'=>'Maybe','noBtn'=>'No',
  'thanks'=>'Thanks for your reply!',
  'yes'=>'Great - we noted that you are <b>available</b>.',
  'maybe'=>'Noted: <b>maybe</b>. We\'ll be in touch.',
  'no'=>'Too bad - noted that you <b>can\'t</b> make it. Thanks anyway!',
  'change'=>'You can change your answer any time via the buttons in the email.',
  'err'=>'This link is invalid or has expired.',
  're'=>'Training',
  'tvTitle'=>'Your travel details for this week',
  'tvLead'=>'The client books the flights themselves. With these details the booking can be made right away - please fill in or check briefly.',
  'tvDep'=>'Departure airport','tvDepPh'=>'e.g. Frankfurt (FRA)',
  'tvRet'=>'Return to','tvRetPh'=>'empty = same as departure airport',
  'tvArr'=>'Arrival day','tvDpt'=>'Departure day',
  'tvFo'=>'Outbound preference','tvFoPh'=>'e.g. evening departure, direct flight',
  'tvFr'=>'Return preference','tvFrPh'=>'e.g. night flight ok',
  'tvPassHead'=>'Passport details (still missing - needed for booking)',
  'tvPnm'=>'Name as in passport','tvPno'=>'Passport number','tvPnat'=>'Nationality',
  'tvPbd'=>'Date of birth','tvPex'=>'Passport valid until',
  'tvNote'=>'Notes (optional)','tvNotePh'=>'e.g. frequent flyer number, seat preference',
  'tvSave'=>'Save travel details',
  'tvSaved'=>'Travel details saved - thank you! You can adjust them any time via the same link.',
  'tvPrivacy'=>'The details go only to ETAF coordination and to the client for the flight booking.',
];

$col = $ans==='yes'?'#2E9E6B':($ans==='no'?'#D81F26':'#C77E1E');
$action = htmlspecialchars(base_url().'/respond.php');
$etok = htmlspecialchars($tok);
/* Ein Antwort-Button als POST-Formular (nur so wird wirklich gespeichert). */
function opt($action,$etok,$key,$label,$text,$strong,$primary){
  $style = $primary
    ? "background:$strong;color:#fff;border:2px solid $strong"
    : "background:#fff;color:$text;border:2px solid $strong";
  $icon = stroke_icon($key==='yes'?'check':($key==='no'?'x':'maybe'));
  return '<form method="post" action="'.$action.'" style="margin:0 0 12px">'
    .'<input type="hidden" name="token" value="'.$etok.'">'
    .'<input type="hidden" name="answer" value="'.$key.'">'
    .'<button type="submit" style="display:flex;align-items:center;justify-content:center;width:100%;padding:15px 18px;border-radius:10px;'
    .'font:600 16px system-ui,Arial,sans-serif;cursor:pointer;'.$style.'">'.$icon.$label.'</button>'
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
  .tv{text-align:left;margin-top:22px;border-top:1px solid #e2e5e8;padding-top:18px}
  .tv h2{font-size:17px;margin:0 0 6px}
  .tv .lead{font-size:14px;margin:0 0 14px}
  .tv .grid{display:grid;grid-template-columns:1fr 1fr;gap:10px 12px}
  .tv label{display:block;font-size:11px;font-weight:700;color:#5c666e;text-transform:uppercase;
    letter-spacing:.05em;margin:0 0 4px}
  .tv input,.tv textarea{width:100%;box-sizing:border-box;padding:10px 11px;border:1px solid #e2e5e8;
    border-radius:8px;font:15px system-ui,Arial,sans-serif;background:#f8f9fa;color:#242b31}
  .tv textarea{min-height:60px;margin-top:4px}
  .tv .passhead{margin:16px 0 8px;font-weight:700;font-size:14px;color:#8a5410}
  .tv .save{display:block;width:100%;margin-top:16px;padding:14px;border-radius:10px;cursor:pointer;
    font:700 15px system-ui,Arial,sans-serif;background:#3E4852;color:#fff;border:2px solid #3E4852}
  .tv .ok{background:#e9f6ef;border:1px solid #bfe3cf;color:#1E7A4D;border-radius:10px;padding:11px 14px;margin:0 0 12px;font-size:14px}
  .tv .errbox{background:#fdeaea;border:1px solid #f2c2c2;color:#B21620;border-radius:10px;padding:11px 14px;margin:0 0 12px;font-size:14px}
  @media (max-width:520px){ .tv .grid{grid-template-columns:1fr} }
  @media (prefers-color-scheme:dark){
    body{background:#12171c;color:#e9edf0}.card{background:#1a2127;border-color:#28323a}
    .logo{color:#aeb9c2}p,.ctx{color:#a2adb5}.ctx b{color:#e9edf0}.foot{color:#6e7a82}
  }
</style></head><body>
  <div class="card">
    <div class="logo" style="display:flex;justify-content:center"><?=etaf_logo_svg(34)?></div>
    <div class="bar"></div>
    <?php if($committed || $doTravel || ($showTravel && !$isCommit && ($_GET['travel']??'')==='1')): ?>
      <?php if($committed): ?>
        <h1><?=$L['thanks']?></h1>
        <p><?=$L[$map[$ans]]?></p>
      <?php endif; ?>
      <?php if($req): ?><div class="ctx"><?=$L['re']?>: <b><?=htmlspecialchars($req['topic'])?></b><br><?=$whenLine?></div><?php endif; ?>
      <?php if($showTravel): ?>
        <div class="tv">
          <h2><?=$L['tvTitle']?></h2>
          <?php if($travelSaved): ?><div class="ok"><?=$L['tvSaved']?></div><?php endif; ?>
          <?php if($travelErr): ?><div class="errbox"><?=htmlspecialchars($travelErr)?></div><?php endif; ?>
          <p class="lead"><?=$L['tvLead']?></p>
          <form method="post" action="<?=$action?>">
            <input type="hidden" name="token" value="<?=$etok?>">
            <input type="hidden" name="travelsave" value="1">
            <div class="grid">
              <div><label><?=$L['tvDep']?> *</label>
                <input name="dep" required placeholder="<?=$L['tvDepPh']?>" value="<?=$tvDef('dep_airport',(string)($trRow['home_airport']??''))?>"></div>
              <div><label><?=$L['tvRet']?></label>
                <input name="ret" placeholder="<?=$L['tvRetPh']?>" value="<?=$tvDef('ret_airport')?>"></div>
              <div><label><?=$L['tvArr']?></label>
                <input name="arr" type="date" value="<?=$tvDef('arrival',$dayShift($req['start_date']??null,-1))?>"></div>
              <div><label><?=$L['tvDpt']?></label>
                <input name="dpt" type="date" value="<?=$tvDef('departure',$dayShift($req['end_date']??null,1))?>"></div>
              <div><label><?=$L['tvFo']?></label>
                <input name="fo" placeholder="<?=$L['tvFoPh']?>" value="<?=$tvDef('flight_out')?>"></div>
              <div><label><?=$L['tvFr']?></label>
                <input name="fr" placeholder="<?=$L['tvFrPh']?>" value="<?=$tvDef('flight_return')?>"></div>
            </div>
            <?php if($passMissing): ?>
              <div class="passhead"><?=$L['tvPassHead']?></div>
              <div class="grid">
                <div><label><?=$L['tvPnm']?></label>
                  <input name="pnm" value="<?=htmlspecialchars((string)($trRow['passport_name']??''),ENT_QUOTES,'UTF-8')?>"></div>
                <div><label><?=$L['tvPno']?></label>
                  <input name="pno" value="<?=htmlspecialchars((string)($trRow['passport_number']??''),ENT_QUOTES,'UTF-8')?>"></div>
                <div><label><?=$L['tvPnat']?></label>
                  <input name="pnat" value="<?=htmlspecialchars((string)($trRow['passport_nationality']??''),ENT_QUOTES,'UTF-8')?>"></div>
                <div><label><?=$L['tvPbd']?></label>
                  <input name="pbd" type="date" value="<?=htmlspecialchars((string)($trRow['passport_birthdate']??''),ENT_QUOTES,'UTF-8')?>"></div>
                <div><label><?=$L['tvPex']?></label>
                  <input name="pex" type="date" value="<?=htmlspecialchars((string)($trRow['passport_expiry']??''),ENT_QUOTES,'UTF-8')?>"></div>
              </div>
            <?php endif; ?>
            <label style="margin-top:12px"><?=$L['tvNote']?></label>
            <textarea name="note" placeholder="<?=$L['tvNotePh']?>"><?=$tvDef('notes')?></textarea>
            <button type="submit" class="save"><?=$L['tvSave']?></button>
            <p class="foot" style="margin-top:10px"><?=$L['tvPrivacy']?></p>
          </form>
        </div>
      <?php else: ?>
        <p class="foot"><?=$L['change']?></p>
      <?php endif; ?>
    <?php elseif($req): ?>
      <h1><?=$L['confirmTitle']?></h1>
      <div class="ctx"><?=$L['re']?>: <b><?=htmlspecialchars($req['topic'])?></b><br><?=$whenLine?></div>
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
