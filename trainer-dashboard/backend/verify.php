<?php
/**
 * ETAF - Oeffentliche Pruefung einer Zertifikatsnummer.
 * Aufruf: verify.php?nr=ETAF-2026-0001-AB12  (kein Login)
 *
 * Bewusst sparsam: die Seite bestaetigt oder verneint, nennt Name, Lehrgang
 * und Ergebnis - aber keine Einzelnoten. Wer die Nummer nicht kennt, erfaehrt
 * nichts; die Nummer selbst steht nur auf dem Papier.
 */
require_once __DIR__.'/lib.php';
ensure_schema();

header('Cache-Control: no-store, no-cache, must-revalidate');
header('X-Robots-Tag: noindex, nofollow');

if(!function_exists('e')){
  function e($s){ return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); }
}

$nr   = trim((string)($_GET['nr'] ?? $_POST['nr'] ?? ''));
$lang = (($_GET['lang'] ?? '')==='en') ? 'en' : 'de';
$c    = $nr!=='' ? cert_verify($nr) : null;

/* Zu haeufiges Raten ausbremsen - eine Sekunde je Fehlversuch reicht,
   um systematisches Durchprobieren unattraktiv zu machen. */
if($nr!=='' && !$c) usleep(700000);

$L = $lang==='de' ? [
  'title'=>'Zertifikat prüfen',
  'sub'=>'Geben Sie die Prüfnummer ein, die unten auf dem Zertifikat steht.',
  'nr'=>'Prüfnummer','check'=>'Prüfen',
  'valid'=>'Gültig - dieses Zertifikat wurde von ETAF ausgestellt.',
  'unknown'=>'Diese Prüfnummer ist uns nicht bekannt.',
  'unknownHint'=>'Bitte prüfen Sie die Schreibweise. Die Nummer steht am Fuß des Zertifikats.',
  'revoked'=>'Zurückgezogen - dieses Zertifikat ist nicht mehr gültig.',
  'name'=>'Name','rank'=>'Dienstgrad','unit'=>'Einheit','cohort'=>'Lehrgang',
  'scope'=>'Umfang','result'=>'Ergebnis','issued'=>'Ausgestellt am','revokedAt'=>'Zurückgezogen am',
  'kindBlock'=>'Trainingsblock','kindProg'=>'Gesamtes Programm',
  'pass'=>'bestanden','merit'=>'mit Auszeichnung','fail'=>'nicht bestanden',
  'foot'=>'ETAF - European Training and Assessment Facility · Trainer-Koordination',
  'privacy'=>'Diese Seite bestätigt nur die Echtheit. Einzelbewertungen werden nicht angezeigt.',
  'failNote'=>'Dieses Dokument weist Teilnahme und Ergebnis nach. Es ist kein Nachweis über ein Bestehen.',
] : [
  'title'=>'Verify certificate',
  'sub'=>'Enter the verification number printed at the foot of the certificate.',
  'nr'=>'Verification number','check'=>'Verify',
  'valid'=>'Valid - this certificate was issued by ETAF.',
  'unknown'=>'This verification number is not known to us.',
  'unknownHint'=>'Please check the spelling. The number is printed at the foot of the certificate.',
  'revoked'=>'Revoked - this certificate is no longer valid.',
  'name'=>'Name','rank'=>'Rank','unit'=>'Unit','cohort'=>'Course',
  'scope'=>'Scope','result'=>'Result','issued'=>'Issued on','revokedAt'=>'Revoked on',
  'kindBlock'=>'Training block','kindProg'=>'Full programme',
  'pass'=>'passed','merit'=>'passed with merit','fail'=>'not passed',
  'foot'=>'ETAF - European Training and Assessment Facility · Trainer Coordination',
  'privacy'=>'This page only confirms authenticity. Individual scores are not shown.',
  'failNote'=>'This document records attendance and outcome. It is not evidence of a pass.',
];
$fmt = function(?string $ts) : string {
  if(!$ts) return '-';
  $t=ts($ts); if(!$t) return '-';
  return gmdate('d.m.Y', $t);
};
?>
<!doctype html><html lang="<?=e($lang)?>"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>ETAF · <?=e($L['title'])?></title>
<style>
  :root{--ink:#242b31;--muted:#5c666e;--line:#e2e5e8;--brand:#3e4852;--accent:#d81f26;
        --good:#2e9e6b;--good-bg:#e4f3eb;--warn:#c77e1e;--warn-bg:#f8ecd7;
        --crit:#d81f26;--crit-bg:#fbe6e7}
  *{box-sizing:border-box}
  body{margin:0;background:#f4f5f6;color:var(--ink);
    font:15px/1.55 system-ui,-apple-system,"Segoe UI",Arial,sans-serif}
  .wrap{max-width:620px;margin:0 auto;padding:34px 20px}
  .sheet{background:#fff;border:1px solid var(--line);border-radius:14px;padding:30px 32px}
  .logo{font-weight:800;font-size:30px;letter-spacing:-.05em;color:var(--brand)}
  .logo span{color:var(--accent)}
  .eyebrow{color:var(--muted);font-size:12px;font-weight:700;letter-spacing:.16em;text-transform:uppercase}
  h1{font-size:22px;margin:14px 0 3px;letter-spacing:-.01em}
  .sub{color:var(--muted);margin-bottom:20px}
  label{display:block;font-size:12px;font-weight:700;text-transform:uppercase;
    letter-spacing:.06em;color:var(--muted);margin:0 0 6px}
  input{width:100%;padding:12px 13px;border:1px solid var(--line);border-radius:9px;
    font:600 16px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.04em;
    color:var(--ink);background:#fff}
  input:focus{outline:2px solid var(--brand);outline-offset:1px}
  .btn{display:inline-block;margin-top:12px;padding:12px 22px;border-radius:9px;
    background:var(--brand);color:#fff;font-weight:650;border:none;cursor:pointer;font-size:15px}
  .res{margin:22px 0 0;border-radius:11px;padding:15px 17px;border:1px solid;
    border-left-width:5px;font-weight:650}
  .res.ok{background:var(--good-bg);border-color:var(--good);color:#1c6f4a}
  .res.no{background:var(--crit-bg);border-color:var(--crit);color:#a1161c}
  .res.rv{background:var(--warn-bg);border-color:var(--warn);color:#8c580f}
  .res .hint{font-weight:400;margin-top:4px;font-size:13.5px}
  .kv{display:grid;grid-template-columns:150px 1fr;gap:7px 14px;font-size:14.5px;margin-top:20px}
  .kv .k{color:var(--muted)} .kv .v{font-weight:600}
  .nr{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.04em}
  .foot{margin-top:22px;color:var(--muted);font-size:12px;text-align:center;line-height:1.5}
  .lang{float:right;font-size:12.5px}
  .lang a{color:var(--muted);text-decoration:none;padding:3px 7px;border-radius:6px}
  .lang a.on{background:var(--brand);color:#fff}
  @media(max-width:480px){ .kv{grid-template-columns:1fr;gap:1px 0} .kv .k{margin-top:9px} }
</style></head><body>
<div class="wrap"><div class="sheet">
  <div class="lang">
    <a href="?nr=<?=e(rawurlencode($nr))?>&lang=de" class="<?=$lang==='de'?'on':''?>">DE</a>
    <a href="?nr=<?=e(rawurlencode($nr))?>&lang=en" class="<?=$lang==='en'?'on':''?>">EN</a>
  </div>
  <div class="logo">ETAF<span>.</span></div>
  <div class="eyebrow"><?=e($lang==='de'?'Zertifikatsprüfung':'Certificate verification')?></div>
  <h1><?=e($L['title'])?></h1>
  <div class="sub"><?=e($L['sub'])?></div>

  <form method="get" autocomplete="off">
    <input type="hidden" name="lang" value="<?=e($lang)?>">
    <label for="nr"><?=e($L['nr'])?></label>
    <input id="nr" name="nr" value="<?=e($nr)?>" placeholder="ETAF-2026-0001-AB12" spellcheck="false">
    <button class="btn" type="submit"><?=e($L['check'])?></button>
  </form>

<?php if($nr!==''): ?>
  <?php if(!$c): ?>
    <div class="res no"><?=e($L['unknown'])?>
      <div class="hint"><?=e($L['unknownHint'])?></div></div>
  <?php else: ?>
    <div class="res <?=$c['revoked']?'rv':'ok'?>">
      <?=e($c['revoked'] ? $L['revoked'] : $L['valid'])?>
      <?php if(!$c['revoked'] && $c['result']==='fail'): ?>
        <div class="hint"><?=e($L['failNote'])?></div>
      <?php endif; ?>
    </div>
    <div class="kv">
      <div class="k"><?=e($L['nr'])?></div><div class="v nr"><?=e($c['no'])?></div>
      <div class="k"><?=e($L['name'])?></div><div class="v"><?=e($c['name'])?></div>
      <?php if($c['rank']): ?><div class="k"><?=e($L['rank'])?></div><div class="v"><?=e($c['rank'])?></div><?php endif; ?>
      <?php if($c['unit']): ?><div class="k"><?=e($L['unit'])?></div><div class="v"><?=e($c['unit'])?></div><?php endif; ?>
      <?php if($c['cohort']): ?><div class="k"><?=e($L['cohort'])?></div><div class="v"><?=e($c['cohort'])?></div><?php endif; ?>
      <div class="k"><?=e($L['scope'])?></div>
      <div class="v"><?=e($c['kind']==='programme' ? $L['kindProg'] : $L['kindBlock'])?><?=
        $c['title'] ? ' · '.e($c['title']) : ''?></div>
      <div class="k"><?=e($L['result'])?></div>
      <div class="v"><?=e($L[$c['result']] ?? '-')?></div>
      <div class="k"><?=e($L['issued'])?></div><div class="v"><?=e($fmt($c['issuedAt']))?></div>
      <?php if($c['revoked']): ?>
        <div class="k"><?=e($L['revokedAt'])?></div><div class="v"><?=e($fmt($c['revokedAt']))?></div>
      <?php endif; ?>
    </div>
  <?php endif; ?>
<?php endif; ?>

  <div class="foot"><?=e($L['privacy'])?><br><?=e($L['foot'])?></div>
</div></div>
</body></html>
