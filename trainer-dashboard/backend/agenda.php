<?php
/**
 * ETAF — Druckbare persönliche Reise-Agenda.
 * Aufruf per Token-Link aus der E-Mail: agenda.php?token=<tok>
 * Kein Login nötig; zeigt Training, Reisedaten, Flug/Zimmer und Agenda.
 */
require_once __DIR__.'/lib.php';
ensure_schema();

$tok=$_GET['token'] ?? '';
$req = $tok ? q("SELECT r.*, t.*, r.trainer_id AS trid, r.lang AS rlang
                 FROM requests r JOIN trainings t ON t.id=r.training_id
                 WHERE r.tok=?",[$tok])->fetch() : null;
$tr  = $req ? q("SELECT * FROM trainers WHERE id=?",[$req['trid']])->fetch() : null;
$tv  = $req ? q("SELECT * FROM travel WHERE training_id=? AND trainer_id=?",[$req['training_id'],$req['trid']])->fetch() : null;

$lang = ($req['rlang'] ?? 'de')==='en' ? 'en' : 'de';
$agenda = $req ? (json_decode($req['agenda'] ?: '[]', true) ?: []) : [];

$L = $lang==='de' ? [
  'title'=>'Reise-Agenda','training'=>'Training','for'=>'Für','when'=>'Zeitraum','where'=>'Ort',
  'venue'=>'Veranstaltungsort','hotel'=>'Hotel','meet'=>'Treffpunkt','contact'=>'Ansprechpartner vor Ort',
  'dress'=>'Dresscode','perdiem'=>'Per Diem','arr'=>'Anreise','dep'=>'Abreise','fout'=>'Hinflug',
  'fret'=>'Rückflug','room'=>'Zimmer','notes'=>'Hinweise','travel'=>'Reise & Logistik',
  'flight'=>'Deine Reisedaten','program'=>'Programm','print'=>'Drucken','err'=>'Dieser Link ist ungültig oder abgelaufen.',
  'nodata'=>'— noch nicht hinterlegt —','passport'=>'Reisepass gültig bis','visa'=>'Visum',
  'visa_none'=>'—','visa_needed'=>'benötigt','visa_applied'=>'beantragt','visa_approved'=>'genehmigt','visa_rejected'=>'abgelehnt'
] : [
  'title'=>'Travel agenda','training'=>'Training','for'=>'For','when'=>'Period','where'=>'Location',
  'venue'=>'Venue','hotel'=>'Hotel','meet'=>'Meeting point','contact'=>'On-site contact',
  'dress'=>'Dress code','perdiem'=>'Per diem','arr'=>'Arrival','dep'=>'Departure','fout'=>'Outbound flight',
  'fret'=>'Return flight','room'=>'Room','notes'=>'Notes','travel'=>'Travel & logistics',
  'flight'=>'Your travel details','program'=>'Programme','print'=>'Print','err'=>'This link is invalid or has expired.',
  'nodata'=>'— not set yet —','passport'=>'Passport valid until','visa'=>'Visa',
  'visa_none'=>'—','visa_needed'=>'needed','visa_applied'=>'applied','visa_approved'=>'approved','visa_rejected'=>'rejected'
];
function e($s){ return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); }
$na = $L['nodata'];
?>
<!doctype html><html lang="<?=e($lang)?>"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>ETAF · <?=e($L['title'])?></title>
<style>
  :root{--ink:#242b31;--muted:#5c666e;--line:#e2e5e8;--brand:#3e4852;--accent:#d81f26}
  *{box-sizing:border-box}
  body{margin:0;background:#f4f5f6;color:var(--ink);
    font:15px/1.55 system-ui,-apple-system,"Segoe UI",Arial,sans-serif}
  .wrap{max-width:800px;margin:0 auto;padding:24px}
  .sheet{background:#fff;border:1px solid var(--line);border-radius:14px;padding:34px 38px}
  .top{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap}
  .logo{font-weight:800;font-size:30px;letter-spacing:-.05em;color:var(--brand)}
  .logo span{color:var(--accent)}
  .eyebrow{color:var(--muted);font-size:12px;font-weight:700;letter-spacing:.16em;text-transform:uppercase}
  h1{font-size:24px;margin:4px 0 2px;letter-spacing:-.01em}
  .sub{color:var(--muted)}
  .bar{height:3px;background:var(--brand);border-radius:3px;margin:18px 0 22px}
  h2{font-size:13px;text-transform:uppercase;letter-spacing:.08em;color:var(--brand);
    margin:22px 0 8px;border-bottom:1px solid var(--line);padding-bottom:6px}
  .kv{display:grid;grid-template-columns:190px 1fr;gap:6px 14px;font-size:14.5px}
  .kv .k{color:var(--muted)} .kv .v{font-weight:600}
  table{width:100%;border-collapse:collapse;font-size:14.5px}
  td{padding:8px 6px;border-bottom:1px solid var(--line);vertical-align:top}
  td.t{white-space:nowrap;color:var(--brand);font-weight:700;width:120px}
  td.d{white-space:nowrap;color:var(--muted);width:70px}
  .btn{display:inline-block;padding:10px 18px;border-radius:9px;background:var(--brand);color:#fff;
    font-weight:600;text-decoration:none;border:none;cursor:pointer;font-size:14px}
  .toolbar{max-width:800px;margin:0 auto;padding:0 24px 18px;text-align:right}
  .foot{margin-top:24px;color:var(--muted);font-size:12px;text-align:center}
  @media print{
    body{background:#fff}
    .toolbar{display:none}
    .wrap{padding:0}
    .sheet{border:none;border-radius:0;padding:0}
    @page{margin:16mm}
  }
</style></head>
<body>
<?php if(!$req): ?>
  <div class="wrap"><div class="sheet"><div class="logo">ETAF<span>.</span></div>
    <p style="margin-top:18px"><?=e($L['err'])?></p></div></div>
<?php else: ?>
  <div class="toolbar"><button class="btn" onclick="window.print()">🖨 <?=e($L['print'])?></button></div>
  <div class="wrap"><div class="sheet">
    <div class="top">
      <div>
        <div class="eyebrow"><?=e($L['title'])?></div>
        <h1><?=e($req['topic'])?></h1>
        <div class="sub"><?=e($req['city'].', '.$req['country'].' · '.$req['kw'].' · '.$req['month'])?></div>
      </div>
      <div class="logo">ETAF<span>.</span></div>
    </div>
    <div class="bar"></div>

    <div class="kv">
      <div class="k"><?=e($L['for'])?></div><div class="v"><?=e($tr['name']??'')?></div>
      <div class="k"><?=e($L['where'])?></div><div class="v"><?=e($req['city'].', '.$req['country'])?></div>
      <?php if(!empty($req['venue'])): ?><div class="k"><?=e($L['venue'])?></div><div class="v"><?=e($req['venue'])?></div><?php endif; ?>
    </div>

    <h2><?=e($L['flight'])?></h2>
    <div class="kv">
      <div class="k"><?=e($L['arr'])?></div><div class="v"><?=e($tv['arrival']??'') ?: $na?></div>
      <div class="k"><?=e($L['dep'])?></div><div class="v"><?=e($tv['departure']??'') ?: $na?></div>
      <div class="k"><?=e($L['fout'])?></div><div class="v"><?=e($tv['flight_out']??'') ?: $na?></div>
      <div class="k"><?=e($L['fret'])?></div><div class="v"><?=e($tv['flight_return']??'') ?: $na?></div>
      <div class="k"><?=e($L['room'])?></div><div class="v"><?=e($tv['room']??'') ?: $na?></div>
      <?php if(in_array($req['country'],['UAE','KSA']) || !empty($tv['passport_expiry']) || (($tv['visa_status']??'none')!=='none')): ?>
        <div class="k"><?=e($L['passport'])?></div><div class="v"><?=e($tv['passport_expiry']??'') ?: $na?></div>
        <div class="k"><?=e($L['visa'])?></div><div class="v"><?=e($L['visa_'.($tv['visa_status'] ?? 'none')] ?? '—')?></div>
      <?php endif; ?>
      <?php if(!empty($tv['visa_notes'])): ?><div class="k"><?=e($L['visa'])?></div><div class="v"><?=e($tv['visa_notes'])?></div><?php endif; ?>
      <?php if(!empty($tv['notes'])): ?><div class="k"><?=e($L['notes'])?></div><div class="v"><?=e($tv['notes'])?></div><?php endif; ?>
    </div>

    <?php
    /* Sessions dieses Trainers in dieser Woche (aus dem Wochenplan) */
    $mySess = trainer_week_sessions((int)$req['training_id'], (int)$req['trid']);
    if($mySess):
      $dayN  = $lang==='de' ? ['Montag','Dienstag','Mittwoch','Donnerstag','Freitag'] : ['Monday','Tuesday','Wednesday','Thursday','Friday'];
      $halfN = $lang==='de' ? ['am'=>'Vormittag','pm'=>'Nachmittag'] : ['am'=>'Morning','pm'=>'Afternoon'];
    ?>
    <h2><?=e($lang==='de'?'Deine Sessions in dieser Woche':'Your sessions this week')?></h2>
    <table><?php foreach($mySess as $s):
      $when = $s['dayIdx']!==null
        ? $dayN[$s['dayIdx']].($s['date']?', '.date('d.m.',strtotime($s['date'])):'')
        : ($lang==='de'?'noch nicht terminiert':'not scheduled yet');
      $slot = $s['half'] ? ($halfN[$s['half']]??'') : ''; ?>
      <tr><td class="d" style="width:110px;white-space:nowrap"><?=e($when)?></td>
          <td class="t" style="width:90px"><?=e($slot)?></td>
          <td><b><?=e($lang==='en'&&$s['title_en']!==''?$s['title_en']:$s['title'])?></b> · <?=e((string)$s['dur'])?> h
            <?php if($s['pptMine']): ?><br><span style="color:#B23A42;font-weight:600"><?=e($lang==='de'?'PowerPoint: von dir vorzubereiten':'PowerPoint: to be prepared by you')?></span><?php endif; ?>
            <?php if(!empty($s['mat'])): ?><br><span style="color:var(--muted)">📦 <?=e($s['mat'])?></span><?php endif; ?>
          </td></tr>
    <?php endforeach; ?></table>
    <?php endif; ?>

    <h2><?=e($L['travel'])?></h2>
    <div class="kv">
      <div class="k"><?=e($L['hotel'])?></div><div class="v"><?=e(trim(($req['hotel']??'').' · '.($req['hotel_addr']??''),' ·')) ?: $na?></div>
      <div class="k"><?=e($L['meet'])?></div><div class="v"><?=e($req['meeting_point']??'') ?: $na?></div>
      <div class="k"><?=e($L['contact'])?></div><div class="v"><?=e(trim(($req['contact_name']??'').' · '.($req['contact_phone']??''),' ·')) ?: $na?></div>
      <div class="k"><?=e($L['dress'])?></div><div class="v"><?=e($req['dresscode']??'') ?: $na?></div>
      <div class="k"><?=e($L['perdiem'])?></div><div class="v"><?=e($req['per_diem']??'') ?: $na?></div>
      <?php if(!empty($req['travel_notes'])): ?><div class="k"><?=e($L['notes'])?></div><div class="v"><?=e($req['travel_notes'])?></div><?php endif; ?>
    </div>

    <?php if($agenda): ?>
    <h2><?=e($L['program'])?></h2>
    <table><?php foreach($agenda as $a): ?>
      <tr><td class="d"><?=e($a['day']??'')?></td><td class="t"><?=e($a['time']??'')?></td><td><?=e($a['title']??'')?></td></tr>
    <?php endforeach; ?></table>
    <?php endif; ?>

    <div class="foot">ETAF · Trainer-Koordination</div>
  </div></div>
<?php endif; ?>
</body></html>
