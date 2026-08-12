<?php
/**
 * ETAF - Datensicherung (automatisch + manuell)
 * ---------------------------------------------------------------
 * Die Automatik (cron.php bzw. der Automatik-Button) legt einmal täglich
 * einen kompletten Datenbank-Dump als .sql.gz in backend/backups/ ab und
 * behält die letzten 14 Stände. Der Ordner ist per .htaccess gesperrt -
 * Download nur über diese Seite mit Schlüssel.
 *
 * Aufruf:   backend/backup.php?key=<cron_key>            → Übersicht
 *           backend/backup.php?key=<cron_key>&run=1      → jetzt sichern
 *           backend/backup.php?key=<cron_key>&download=<datei>
 *
 * Wiederherstellen: .sql.gz entpacken und die .sql-Datei in phpMyAdmin
 * (artfiles-Kundenmenü) in die Datenbank importieren.
 */
require_once __DIR__.'/db.php';

/** Backup-Ordner sicherstellen (inkl. Zugriffsschutz). */
function backup_dir(): string {
  $d=__DIR__.'/backups';
  if(!is_dir($d)) @mkdir($d,0775,true);
  if(!is_file($d.'/.htaccess')) @file_put_contents($d.'/.htaccess',"Require all denied\n");
  if(!is_file($d.'/index.html')) @file_put_contents($d.'/index.html','');
  return $d;
}

/** Vorhandene Sicherungen, neueste zuerst. */
function backup_list(): array {
  $out=[];
  foreach(glob(backup_dir().'/etaf-backup-*.sql.gz') ?: [] as $f){
    $out[]=['file'=>basename($f),'size'=>filesize($f),'mtime'=>filemtime($f)];
  }
  usort($out, fn($a,$b)=>$b['mtime']<=>$a['mtime']);
  return $out;
}

/** Kompletten Datenbank-Dump als SQL schreiben ($w = Schreib-Callback). */
function backup_dump(callable $w): void {
  $w("-- ETAF Trainer-Koordination - Datensicherung\n-- Erstellt: ".gmdate('Y-m-d H:i:s')." UTC\n\n");
  if(is_sqlite()){
    $tables=array_column(q("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name")->fetchAll(),'name');
  } else {
    $w("SET FOREIGN_KEY_CHECKS=0;\nSET NAMES utf8mb4;\n\n");
    $tables=array_map('current', q("SHOW TABLES")->fetchAll(PDO::FETCH_NUM));
  }
  foreach($tables as $t){
    if(!preg_match('/^[A-Za-z0-9_]+$/',$t)) continue;
    if(is_sqlite()){
      $r=q("SELECT sql FROM sqlite_master WHERE type='table' AND name=?",[$t])->fetch();
      $create=($r['sql']??'').';';
    } else {
      $r=q("SHOW CREATE TABLE `$t`")->fetch(PDO::FETCH_NUM);
      $create=($r[1]??'').';';
    }
    $w("DROP TABLE IF EXISTS `$t`;\n$create\n");
    $st=q("SELECT * FROM `$t`");
    while($row=$st->fetch(PDO::FETCH_ASSOC)){
      $cols='`'.implode('`,`',array_keys($row)).'`';
      $vals=implode(',', array_map(fn($v)=>$v===null?'NULL':db()->quote((string)$v), array_values($row)));
      $w("INSERT INTO `$t` ($cols) VALUES ($vals);\n");
    }
    $w("\n");
  }
  if(!is_sqlite()) $w("SET FOREIGN_KEY_CHECKS=1;\n");
}

/** Sicherung erstellen + alte Stände aufräumen. */
function backup_run(int $keep=14): array {
  $dir=backup_dir();
  if(!is_writable($dir)) return ['ok'=>false,'error'=>'Ordner backend/backups ist nicht beschreibbar.'];
  $file=$dir.'/etaf-backup-'.gmdate('Ymd-His').'.sql.gz';
  $gz=@gzopen($file,'wb6');
  if(!$gz) return ['ok'=>false,'error'=>'Sicherungsdatei konnte nicht angelegt werden.'];
  try{ backup_dump(fn(string $s)=>gzwrite($gz,$s)); }
  catch(Throwable $e){ gzclose($gz); @unlink($file); return ['ok'=>false,'error'=>$e->getMessage()]; }
  gzclose($gz);
  // Integritätsprüfung: die Datei muss sich entpacken lassen und unseren Kopf tragen -
  // eine kaputte Sicherung wäre schlimmer als keine, weil sie falsche Sicherheit gibt.
  $chk=@gzopen($file,'rb');
  $head=$chk?(string)gzread($chk,64):'';
  if($chk) gzclose($chk);
  if(strpos($head,'ETAF')===false || filesize($file)<200){
    @unlink($file);
    return ['ok'=>false,'error'=>'Sicherung ließ sich nicht zurücklesen - Datei verworfen.'];
  }
  // Aufbewahrung: nur die letzten $keep Stände behalten
  $all=backup_list();
  foreach(array_slice($all,$keep) as $old){ @unlink($dir.'/'.$old['file']); }
  return ['ok'=>true,'file'=>basename($file),'size'=>filesize($file),'kept'=>min(count($all),$keep)];
}

/* ================= Seite (nur bei direktem Aufruf, key-geschützt) ============ */
if(basename($_SERVER['SCRIPT_NAME']??'')==='backup.php'){
  error_reporting(E_ALL); ini_set('display_errors','1');
  header('Content-Type: text/html; charset=utf-8');
  function esc($s){ return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); }
  $c=cfg();
  $need=(string)($c['cron_key']??'');
  $key=(string)($_GET['key']??'');
  if($need==='' || $need==='CHANGE_ME_zufälliger_wert' || !hash_equals($need,$key)){
    http_response_code(403);
    echo '<meta charset="utf-8"><body style="font:15px system-ui;padding:30px;color:#242b31">'
       .'<h2>ETAF - Datensicherung</h2>'
       .'<p>Zugriff nur mit gültigem <code>?key=</code> (entspricht <code>cron_key</code> aus config.php).</p></body>';
    exit;
  }

  /* Download einer Sicherung (Dateiname strikt validiert) */
  $dl=(string)($_GET['download']??'');
  if($dl!==''){
    if(!preg_match('/^etaf-backup-\d{8}-\d{6}\.sql\.gz$/',$dl)){ http_response_code(400); exit('Ungültiger Dateiname.'); }
    $path=backup_dir().'/'.$dl;
    if(!is_file($path)){ http_response_code(404); exit('Datei nicht gefunden.'); }
    header('Content-Type: application/gzip');
    header('Content-Length: '.filesize($path));
    header('Content-Disposition: attachment; filename="'.$dl.'"');
    readfile($path);
    exit;
  }

  /* Jetzt sichern */
  $ran=null;
  if(isset($_GET['run'])){ try{ ensure_schema(); }catch(Throwable $e){} $ran=backup_run(); }

  $list=backup_list();
  $self='backup.php?key='.rawurlencode($key);
  $fmtSize=function($b){ return $b>=1048576 ? round($b/1048576,1).' MB' : round($b/1024).' KB'; };
?>
<!doctype html><html lang="de"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><title>ETAF - Datensicherung</title>
<style>
 body{font:15px/1.55 system-ui,-apple-system,Segoe UI,Arial,sans-serif;color:#242b31;background:#f4f5f6;margin:0;padding:26px}
 .wrap{max-width:720px;margin:auto}
 h2{margin:0 0 4px}.sub{color:#8a939a;margin:0 0 18px}
 .card{background:#fff;border:1px solid #e2e5e8;border-radius:12px;padding:18px 20px;margin:0 0 16px}
 table{border-collapse:collapse;width:100%}td{padding:7px 8px;border-bottom:1px solid #eef0f2;vertical-align:top}
 a.btn{display:inline-block;padding:10px 16px;border-radius:9px;background:#3E4852;color:#fff;font-weight:600;text-decoration:none;font-size:14px}
 a.dl{color:#3E4852;font-weight:600}
 .ok{background:#e9f6ef;border:1px solid #bfe3cf;color:#1E7A4D;border-radius:10px;padding:11px 14px;margin:0 0 14px;font-size:14px}
 .bad{background:#fdeaea;border:1px solid #f2c2c2;color:#B21620;border-radius:10px;padding:11px 14px;margin:0 0 14px;font-size:14px}
 .hint{background:#fff8ec;border:1px solid #f0e0bd;border-radius:10px;padding:12px 14px;color:#7a5a12;font-size:13.5px}
 code{background:#eef0f2;padding:1px 5px;border-radius:5px}
</style></head><body><div class="wrap">
 <div style="color:#3e4852;margin:0 0 10px;display:flex"><svg viewBox="0 0 1752 657" height="26" role="img" aria-label="ETAF" style="display:block;overflow:visible"><path fill="currentColor" fill-rule="evenodd" d="M0 0 349 0 349 110 143 110 143 159 323 159 323 264 143 264 143 320 357 320 357 429 0 429ZM362 0 757 0 757 113 632 113 632 429 487 429 487 113 362 113ZM834 0 977 0 1164 429 1014 429 985 354 823 354 794 429 647 429ZM1181 0 1529 0 1529 110 1326 110 1326 183 1505 183 1505 292 1326 292 1326 429 1181 429ZM905 144 863 250 945 250Z"/><circle cx="1648" cy="552" r="104" fill="#CD1719"/></svg></div>
 <h2>Datensicherung</h2>
 <p class="sub">Tägliche automatische Sicherung (per Cron) · die letzten 14 Stände bleiben erhalten.</p>
 <?php if($ran): ?>
   <?php if(!empty($ran['ok'])): ?><div class="ok">✓ Sicherung erstellt: <b><?=esc($ran['file'])?></b> (<?=esc($fmtSize($ran['size']))?>)</div>
   <?php else: ?><div class="bad">✗ Sicherung fehlgeschlagen: <?=esc($ran['error']??'Unbekannter Fehler')?></div><?php endif; ?>
 <?php endif; ?>
 <div class="card">
   <p style="margin:0 0 14px"><a class="btn" href="<?=esc($self)?>&amp;run=1">Jetzt sichern</a></p>
   <?php if(!$list): ?><p class="sub">Noch keine Sicherungen vorhanden.</p>
   <?php else: ?>
   <table>
     <?php foreach($list as $b): ?>
       <tr><td><a class="dl" href="<?=esc($self)?>&amp;download=<?=esc(rawurlencode($b['file']))?>">⬇ <?=esc($b['file'])?></a></td>
           <td style="white-space:nowrap;color:#8a939a"><?=esc(gmdate('d.m.Y H:i',$b['mtime']))?> UTC</td>
           <td style="white-space:nowrap;text-align:right"><?=esc($fmtSize($b['size']))?></td></tr>
     <?php endforeach; ?>
   </table>
   <?php endif; ?>
 </div>
 <div class="hint"><b>Wiederherstellen:</b> Gewünschte Sicherung herunterladen, entpacken (ergibt eine .sql-Datei)
 und im artfiles-Kundenmenü über <b>phpMyAdmin → Importieren</b> in die Datenbank einspielen.
 Zusätzlich lohnt es sich, gelegentlich eine Sicherung lokal (z.&nbsp;B. auf dem eigenen Rechner) abzulegen.</div>
</div></body></html>
<?php } ?>
