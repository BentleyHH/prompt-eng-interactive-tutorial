<?php
/**
 * ETAF - Folien-Seite je Trainer (Magic-Link, kein Login).
 * Aufruf: ppt.php?token=<requests.tok>  - identifiziert Trainer + Training.
 * Der Trainer sieht seine Sessions mit Fälligkeit, lädt die Basis-Vorlage
 * herunter, lädt fertige Folien hoch oder meldet den Stand ("in Arbeit",
 * Notiz z.B. "liegt im SharePoint"). Uploads landen in backend/uploads/ppt.
 */
require_once __DIR__.'/lib.php';
ensure_schema();

$tok=$_GET['token'] ?? ($_POST['token'] ?? '');
$req = $tok ? q("SELECT r.*, t.*, r.trainer_id AS trid, r.lang AS rlang
                 FROM requests r JOIN trainings t ON t.id=r.training_id
                 WHERE r.tok=?",[$tok])->fetch() : null;
$tr  = $req ? q("SELECT * FROM trainers WHERE id=?",[$req['trid']])->fetch() : null;
$lang = ($req['rlang'] ?? 'de')==='en' ? 'en' : 'de';

$L = $lang==='de' ? [
  'title'=>'Deine PowerPoints','due'=>'fällig bis','open'=>'offen','work'=>'in Arbeit','done'=>'da',
  'tpl'=>'Basis-Vorlage herunterladen','upload'=>'Datei hochladen','replace'=>'Datei ersetzen',
  'note'=>'Notiz (z.B. Ablageort)','save'=>'Stand speichern','uploaded'=>'Hochgeladen',
  'none'=>'Für dich ist hier aktuell nichts offen - alles erledigt.',
  'err'=>'Dieser Link ist ungültig oder abgelaufen.',
  'okUp'=>'Danke - die Datei ist angekommen und der Status steht auf "da".',
  'okSt'=>'Danke - der Stand ist gespeichert.',
  'hint'=>'Hochladen erlaubt: %s · max. %d MB. Alternativ Status setzen und im Notizfeld sagen, wo die Datei liegt.',
  'overdue'=>'überfällig','myfile'=>'Meine Datei',
] : [
  'title'=>'Your PowerPoints','due'=>'due by','open'=>'open','work'=>'in progress','done'=>'done',
  'tpl'=>'Download base template','upload'=>'Upload file','replace'=>'Replace file',
  'note'=>'Note (e.g. storage location)','save'=>'Save status','uploaded'=>'Uploaded',
  'none'=>'Nothing is open for you here - all done.',
  'err'=>'This link is invalid or has expired.',
  'okUp'=>'Thank you - the file has arrived and the status is set to "done".',
  'okSt'=>'Thank you - the status has been saved.',
  'hint'=>'Allowed uploads: %s · max. %d MB. Or set the status and note where the file lives.',
  'overdue'=>'overdue','myfile'=>'My file',
];
function e($s){ return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); }

/* Sessions dieses Trainers: zuständig (ppt_by) oder - wenn niemand zuständig
   ist - im Session-Team. Nur Folien-relevante Typen. */
function ppt_my_sessions(array $req): array {
  $out=[];
  foreach(q("SELECT * FROM training_sessions WHERE training_id=? ORDER BY sort,id",[$req['training_id']])->fetchAll() as $s){
    if(!ppt_relevant($s)) continue;
    $ids=json_decode(($s['trainer_ids']??'')?:'',true);
    if(!is_array($ids)) $ids=$s['trainer_id']?[(string)$s['trainer_id']]:[];
    $mine=((string)($s['ppt_by']??''))===(string)$req['trid']
       || (!$s['ppt_by'] && in_array((string)$req['trid'],array_map('strval',$ids),true));
    if($mine) $out[]=$s;
  }
  return $out;
}

$msg=''; $msgKind='ok';
if($req && $_SERVER['REQUEST_METHOD']==='POST'){
  $sid=(int)($_POST['sid']??0);
  $mine=array_filter(ppt_my_sessions($req), fn($s)=>(int)$s['id']===$sid);
  if($mine){
    $s=array_values($mine)[0];
    if(($_POST['act']??'')==='upload'){
      $res=ppt_store_upload($_FILES['file']??[], 'tg'.$req['training_id'].'-s'.$sid);
      if(is_string($res)){ $msg=$res; $msgKind='err'; }
      else{
        if(!empty($s['ppt_file'])) @unlink(ppt_dir().'/'.basename($s['ppt_file']));
        q("UPDATE training_sessions SET ppt='vorhanden', ppt_file=?, ppt_file_name=?, ppt_file_size=?, ppt_file_at=? WHERE id=?",
          [$res['name'],$res['orig'],$res['size'],now(),$sid]);
        audit_as(['name'=>($tr['name']??'Trainer')],'ppt.upload','training',(string)$req['training_id'],
          mb_substr((string)$s['title'],0,50).' ('.$res['orig'].')');
        $msg=$L['okUp'];
      }
    } elseif(($_POST['act']??'')==='status'){
      $st=in_array($_POST['ppt']??'',['','inArbeit','vorhanden'],true)?$_POST['ppt']:'';
      q("UPDATE training_sessions SET ppt=?, ppt_note=? WHERE id=?",
        [$st, mb_substr(trim((string)($_POST['note']??'')),0,255), $sid]);
      audit_as(['name'=>($tr['name']??'Trainer')],'ppt.setStatus','training',(string)$req['training_id'],
        mb_substr((string)$s['title'],0,60).' -> '.($st?:'offen'));
      $msg=$L['okSt'];
    }
  }
}

/* Downloads über den Token: Basis-Vorlage oder die eigene Datei. */
if($req && isset($_GET['dl'])){
  if($_GET['dl']==='template'){
    ppt_stream((string)($req['ppt_template']??''),(string)($req['ppt_template_name']??''));
  } else {
    $sid=(int)$_GET['dl'];
    foreach(ppt_my_sessions($req) as $s){
      if((int)$s['id']===$sid) ppt_stream((string)$s['ppt_file'],(string)$s['ppt_file_name']);
    }
    http_response_code(404); exit('Not found');
  }
}

$my = $req ? ppt_my_sessions($req) : [];
$today=gmdate('Y-m-d');
$docTitle=$req ? 'ETAF PowerPoints '.($tr['name']??'').' '.((string)($req['code']??'')) : 'ETAF · PowerPoints';
?>
<!doctype html><html lang="<?=e($lang)?>"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title><?=e($docTitle)?></title>
<style>
  :root{--ink:#242b31;--muted:#5c666e;--faint:#8a939a;--line:#e2e5e8;--brand:#3e4852;--accent:#d81f26;
    --good:#2E9E6B;--warn:#C77E1E;--crit:#D81F26}
  *{box-sizing:border-box}
  body{margin:0;background:#f4f5f6;color:var(--ink);font:15px/1.55 system-ui,-apple-system,"Segoe UI",Arial,sans-serif}
  .wrap{max-width:760px;margin:0 auto;padding:24px 16px}
  .sheet{background:#fff;border:1px solid var(--line);border-radius:14px;padding:26px 26px 20px}
  .top{display:flex;align-items:flex-start;justify-content:space-between;gap:14px}
  .eyebrow{color:var(--muted);font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase}
  h1{font-size:21px;margin:4px 0 2px}
  .sub{color:var(--muted);font-size:13.5px}
  .bar{height:3px;background:var(--brand);border-radius:3px;margin:16px 0 18px}
  .msg{border:1px solid var(--good);border-left-width:4px;background:#eef7f2;color:var(--good);
    border-radius:9px;padding:10px 14px;margin:0 0 14px;font-weight:600;font-size:14px}
  .msg.err{border-color:var(--crit);background:#fdf1f1;color:var(--crit)}
  .card{border:1px solid var(--line);border-radius:11px;padding:14px 16px;margin:0 0 12px}
  .card h3{margin:0 0 2px;font-size:15px}
  .meta{color:var(--muted);font-size:12.5px}
  .meta.over{color:var(--crit);font-weight:700}
  .stbtns{display:flex;gap:6px;margin:10px 0 8px;flex-wrap:wrap}
  .stbtns button{border:1px solid var(--line);background:#fff;border-radius:20px;padding:7px 14px;
    font:600 13px system-ui,Arial,sans-serif;color:var(--muted);cursor:pointer}
  .stbtns button.on{background:var(--brand);border-color:var(--brand);color:#fff}
  .stbtns button.on.done{background:var(--good);border-color:var(--good)}
  input[type=text]{width:100%;border:1px solid var(--line);border-radius:9px;padding:9px 11px;font:inherit}
  .rowline{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:8px}
  .btn{display:inline-block;padding:9px 15px;border-radius:9px;background:var(--brand);color:#fff;
    font:600 13.5px system-ui,Arial,sans-serif;text-decoration:none;border:none;cursor:pointer}
  .btn.line{background:#fff;color:var(--ink);border:1px solid var(--line)}
  .file{font-size:12.5px;color:var(--muted)}
  .hint{color:var(--faint);font-size:12px;margin:14px 0 0}
  .foot{margin-top:18px;color:var(--muted);font-size:12px;text-align:center}
</style></head>
<body>
<div class="wrap">
<?php if(!$req): ?>
  <div class="sheet"><div style="color:var(--brand);display:flex"><?=etaf_logo_svg(30)?></div>
    <p style="margin-top:16px"><?=e($L['err'])?></p></div>
<?php else: ?>
  <div class="sheet">
    <div class="top">
      <div>
        <div class="eyebrow"><?=e($L['title'])?></div>
        <h1><?=e((($req['code']??'')?$req['code'].' - ':'').$req['topic'])?></h1>
        <div class="sub"><?=e(($tr['name']??'').' · '.($req['city']??''))?><?php
          if(!empty($req['start_date'])) echo e(' · '.date('d.m.',strtotime($req['start_date']))
            .(!empty($req['end_date'])&&$req['end_date']!==$req['start_date']?'-'.date('d.m.Y',strtotime($req['end_date'])):date('Y',strtotime($req['start_date']))));
        ?></div>
      </div>
      <div style="color:var(--brand);display:flex;flex:none"><?=etaf_logo_svg(28)?></div>
    </div>
    <div class="bar"></div>
    <?php if($msg): ?><div class="msg<?=$msgKind==='err'?' err':''?>"><?=e($msg)?></div><?php endif; ?>
    <?php if(!empty($req['ppt_template'])): ?>
      <div class="rowline" style="margin:0 0 14px">
        <a class="btn line" href="ppt.php?token=<?=e($tok)?>&dl=template">⬇ <?=e($L['tpl'])?><?=e($req['ppt_template_name']?' ('.$req['ppt_template_name'].')':'')?></a>
      </div>
    <?php endif; ?>
    <?php if(!$my): ?><p class="meta"><?=e($L['none'])?></p><?php endif; ?>
    <?php foreach($my as $s):
      $due=ppt_due_of($s,$req); $over=$due && $due<$today && ($s['ppt']??'')!=='vorhanden'; ?>
      <div class="card">
        <h3><?=e($s['title'])?></h3>
        <div class="meta<?=$over?' over':''?>"><?php
          echo e($due ? $L['due'].' '.date('d.m.Y',strtotime($due)).($over?' · '.$L['overdue']:'') : '');
        ?></div>
        <form method="post" enctype="multipart/form-data">
          <input type="hidden" name="token" value="<?=e($tok)?>">
          <input type="hidden" name="sid" value="<?=e((string)$s['id'])?>">
          <input type="hidden" name="ppt" id="st-<?=e((string)$s['id'])?>" value="<?=e($s['ppt']??'')?>">
          <div class="stbtns">
            <?php foreach([['',$L['open']],['inArbeit',$L['work']],['vorhanden',$L['done']]] as $o): ?>
              <button type="button" class="<?=($s['ppt']??'')===$o[0]?('on'.($o[0]==='vorhanden'?' done':'')):''?>"
                onclick="pick(this,'<?=e((string)$s['id'])?>','<?=e($o[0])?>')"><?=e($o[1])?></button>
            <?php endforeach; ?>
          </div>
          <input type="text" name="note" placeholder="<?=e($L['note'])?>" value="<?=e($s['ppt_note']??'')?>">
          <div class="rowline">
            <button class="btn line" type="submit" name="act" value="status"><?=e($L['save'])?></button>
            <label class="btn" style="position:relative;overflow:hidden">
              <?=e($s['ppt_file']?$L['replace']:$L['upload'])?>
              <input type="file" name="file" accept=".ppt,.pptx,.pot,.potx,.pdf"
                style="position:absolute;inset:0;opacity:0;cursor:pointer"
                onchange="this.form.act.value='upload';this.form.submit()">
            </label>
            <input type="hidden" name="act" value="status">
            <?php if(!empty($s['ppt_file'])): ?>
              <span class="file">✓ <?=e($L['myfile'])?>:
                <a href="ppt.php?token=<?=e($tok)?>&dl=<?=e((string)$s['id'])?>"><?=e($s['ppt_file_name']?:'Datei')?></a>
                (<?=e(($s['ppt_file_size']??0)<1048576?round(($s['ppt_file_size']??0)/1024).' KB':round(($s['ppt_file_size']??0)/1048576,1).' MB')?><?=e($s['ppt_file_at']?', '.date('d.m.Y',ts($s['ppt_file_at'])):'')?>)</span>
            <?php endif; ?>
          </div>
        </form>
      </div>
    <?php endforeach; ?>
    <div class="hint"><?=e(sprintf($L['hint'], implode(', ',PPT_EXT), (int)round(ppt_max_bytes()/1048576)))?></div>
  </div>
  <div class="foot">ETAF · Trainer-Koordination</div>
<?php endif; ?>
</div>
<script>
function pick(btn,sid,val){
  document.getElementById('st-'+sid).value=val;
  const box=btn.parentElement;
  box.querySelectorAll('button').forEach(b=>b.classList.remove('on','done'));
  btn.classList.add('on'); if(val==='vorhanden') btn.classList.add('done');
}
</script>
</body></html>
