<?php
/**
 * ETAF - Folien-Postfach (z.B. content@...)
 * ---------------------------------------------------------------
 * Die Trainer schicken ihre fertigen PowerPoints an ein eigenes Postfach.
 * Dieses Modul liest das Postfach, ordnet jede Mail einer Session zu und
 * setzt den Haken automatisch. Die Datei selbst wird NICHT gespeichert -
 * sie bleibt im Postfach bzw. in eurer Ablage; im Cockpit stehen nur
 * Absender, Zeitpunkt und Dateiname, damit nachvollziehbar ist, was
 * wann eingegangen ist.
 *
 * Zuordnung in dieser Reihenfolge:
 *   1. Betreff enthält den Wochen-Code (W2, TtT-I, …)  -> Training
 *   2. Bester Titel-Treffer innerhalb dieses Trainings -> Session
 *   3. Absender-Adresse -> Trainer; bleibt genau eine offene Folie
 *      dieses Trainers übrig, wird sie genommen
 * Was sich nicht sicher zuordnen lässt, landet als „offen“ in der
 * Folien-Ansicht und wird dort mit einem Klick zugewiesen.
 */
require_once __DIR__.'/lib.php';
require_once __DIR__.'/mailfetch.php';

/** Anhänge, die als Foliensatz zählen. */
const PPTMAIL_EXT=['ppt','pptx','pot','potx','pdf','key','odp','zip'];

function pptmail_cfg(): array { return cfg()['ppt_mailbox'] ?? []; }
function pptmail_ready(): bool {
  $c=pptmail_cfg();
  return !empty($c['host']) && !empty($c['user']) && !empty($c['pass']);
}

/** Text für den Vergleich vereinheitlichen (Umlaute, Satzzeichen, Groß/Klein). */
function pptmail_norm(string $s): string {
  $s=mb_strtolower($s,'UTF-8');
  $s=strtr($s,['ä'=>'ae','ö'=>'oe','ü'=>'ue','ß'=>'ss','&'=>' und ']);
  $s=preg_replace('/[^a-z0-9]+/',' ',$s);
  return trim(preg_replace('/\s+/',' ',$s));
}

/** Wie ähnlich sind Betreff und Session-Titel? 0..1 */
function pptmail_similarity(string $a, string $b): float {
  $a=pptmail_norm($a); $b=pptmail_norm($b);
  if($a===''||$b==='') return 0.0;
  if(strpos($a,$b)!==false || strpos($b,$a)!==false) return 1.0;
  // Wortüberdeckung: robuster als ein Zeichenvergleich, wenn im Betreff
  // noch "AW:", Dateinamen oder Zusätze stehen.
  $wa=array_filter(explode(' ',$a), fn($w)=>mb_strlen($w)>3);
  $wb=array_filter(explode(' ',$b), fn($w)=>mb_strlen($w)>3);
  if(!$wa||!$wb) return 0.0;
  $hit=count(array_intersect($wa,$wb));
  return $hit / max(1,min(count($wa),count($wb)));
}

/** Nur Anhänge, die nach einem Foliensatz aussehen. */
function pptmail_atts(array $mail): array {
  $out=[];
  foreach(($mail['atts']??[]) as $a){
    $ext=strtolower(pathinfo((string)($a['name']??''),PATHINFO_EXTENSION));
    if(in_array($ext,PPTMAIL_EXT,true))
      $out[]=['name'=>mb_substr((string)$a['name'],0,180),'size'=>strlen((string)($a['data']??''))];
  }
  return $out;
}

/** Absenderadresse aus einem From-Header ziehen. */
function pptmail_addr(string $from): string {
  if(preg_match('/<([^>]+)>/',$from,$m)) return strtolower(trim($m[1]));
  return strtolower(trim($from));
}

/**
 * Mail einer Session zuordnen.
 * @return array{trainingId:?int, sessionId:?int, trainerId:?int, how:string}
 */
function pptmail_match(array $mail): array {
  $subj=(string)($mail['subject']??'');
  $addr=pptmail_addr((string)($mail['from']??''));
  $res=['trainingId'=>null,'sessionId'=>null,'trainerId'=>null,'how'=>'none'];

  // Absender -> Trainer (auch für die Nachvollziehbarkeit, wenn der Betreff passt)
  if($addr!==''){
    $tr=q("SELECT id FROM trainers WHERE LOWER(email)=?",[$addr])->fetch();
    if($tr) $res['trainerId']=(int)$tr['id'];
  }

  // 1) Wochen-Code im Betreff (W2, W11-A, TtT-I …)
  $tgId=null;
  $nsubj=' '.pptmail_norm($subj).' ';
  foreach(q("SELECT id,code FROM trainings WHERE code IS NOT NULL AND code<>''")->fetchAll() as $tg){
    $code=pptmail_norm((string)$tg['code']);
    if($code!=='' && strpos($nsubj,' '.$code.' ')!==false){ $tgId=(int)$tg['id']; break; }
  }

  // 2) Bester Titel-Treffer - innerhalb des Trainings, sonst über alle
  $rows = $tgId
    ? q("SELECT * FROM training_sessions WHERE training_id=?",[$tgId])->fetchAll()
    : q("SELECT * FROM training_sessions")->fetchAll();
  $best=null; $bestScore=0.0;
  foreach($rows as $s){
    if(!ppt_relevant($s)) continue;
    $sc=max(pptmail_similarity($subj,(string)$s['title']),
            pptmail_similarity($subj,(string)($s['title_en']??'')));
    if($sc>$bestScore){ $bestScore=$sc; $best=$s; }
  }
  // Ohne Code im Betreff muss der Titel deutlich passen, sonst raten wir
  if($best && ($bestScore>=0.6 || ($tgId && $bestScore>=0.4))){
    $res['trainingId']=(int)$best['training_id'];
    $res['sessionId']=(int)$best['id'];
    $res['how']=$tgId?'code+titel':'titel';
    return $res;
  }
  if($tgId) $res['trainingId']=$tgId;

  // 3) Nur ein einziger offener Foliensatz dieses Trainers? Dann ist es der.
  if($res['trainerId']){
    $open=[];
    $cand = $tgId
      ? q("SELECT * FROM training_sessions WHERE training_id=?",[$tgId])->fetchAll()
      : q("SELECT * FROM training_sessions")->fetchAll();
    foreach($cand as $s){
      if(!ppt_relevant($s) || ($s['ppt']??'')==='vorhanden') continue;
      if(in_array($res['trainerId'], ppt_owner_ids($s), true)) $open[]=$s;
    }
    if(count($open)===1){
      $res['trainingId']=(int)$open[0]['training_id'];
      $res['sessionId']=(int)$open[0]['id'];
      $res['how']=$tgId?'code+trainer':'trainer';
    }
  }
  return $res;
}

/** Maildatum (RFC 2822) in unser Format bringen - sonst steht im Cockpit
 *  ein roher Header statt eines lesbaren Datums. */
function pptmail_when(string $raw): string {
  $t=$raw!=='' ? strtotime($raw) : false;
  return $t ? gmdate('Y-m-d H:i:s',$t) : now();
}
/** Haken setzen + Herkunft festhalten (Datei bleibt im Postfach). */
function pptmail_apply(int $sessionId, string $from, string $when, array $atts): void {
  $files=implode(', ', array_map(fn($a)=>$a['name'], $atts));
  q("UPDATE training_sessions SET ppt='vorhanden', ppt_mail_from=?, ppt_mail_at=?, ppt_mail_file=? WHERE id=?",
    [mb_substr($from,0,190), pptmail_when($when), mb_substr($files,0,255), $sessionId]);
}

/**
 * Postfach abrufen, zuordnen, abhaken.
 * @return array{ok:bool,error?:string,fetched:int,applied:int,open:int}
 */
function pptmail_poll(int $limit=25): array {
  if(!pptmail_ready())
    return ['ok'=>false,'error'=>'Folien-Postfach nicht konfiguriert (ppt_mailbox in config.php).','fetched'=>0,'applied'=>0,'open'=>0];
  $r=pop3_fetch_new(pptmail_cfg(), $limit,
       fn($uid)=>(bool)q("SELECT id FROM ppt_mail WHERE uid=?",[$uid])->fetch());
  if(empty($r['ok'])) return ['ok'=>false,'error'=>$r['error'],'fetched'=>0,'applied'=>0,'open'=>0];

  $applied=0; $open=0;
  foreach($r['mails'] as $m){
    $p=mime_parse($m['raw']);
    $atts=pptmail_atts($p);
    $match=pptmail_match($p);
    $from=pptmail_addr((string)$p['from']);
    $when=(string)$p['date'];
    // Abgehakt wird nur, wenn wirklich ein Foliensatz anhängt und die
    // Zuordnung eindeutig ist - sonst zur Sichtung in die Liste.
    $status='open';
    if($atts && $match['sessionId']){
      pptmail_apply((int)$match['sessionId'], $from, $when, $atts);
      $status='applied'; $applied++;
      audit_as(['name'=>'Folien-Postfach'],'pptmail.apply','training',(string)$match['trainingId'],
        mb_substr((string)$p['subject'],0,80));
    } else {
      $open++;
    }
    q("INSERT INTO ppt_mail(uid,from_addr,subject,received_at,atts,att_count,att_bytes,training_id,session_id,status,note,created_at)
       VALUES(?,?,?,?,?,?,?,?,?,?,?,?)",
      [$m['uid'], mb_substr($from,0,190), mb_substr((string)$p['subject'],0,240), mb_substr($when,0,40),
       json_encode($atts,JSON_UNESCAPED_UNICODE), count($atts),
       array_sum(array_map(fn($a)=>$a['size'],$atts)),
       $match['trainingId'], $match['sessionId'], $status,
       mb_substr($atts?('Zuordnung: '.$match['how']):'Kein Foliensatz im Anhang',0,255), now()]);
  }
  return ['ok'=>true,'fetched'=>count($r['mails']),'applied'=>$applied,'open'=>$open];
}

/** Offene Mails zur Sichtung (für die Folien-Ansicht). */
function pptmail_open_list(int $limit=40): array {
  return array_map(function($r){
    return ['id'=>(string)$r['id'],'from'=>$r['from_addr'],'subject'=>$r['subject'],
            'received'=>$r['received_at'],'atts'=>json_decode($r['atts']?:'[]',true)?:[],
            'attCount'=>(int)$r['att_count'],'attBytes'=>(int)$r['att_bytes'],
            'training'=>$r['training_id']?(string)$r['training_id']:null,
            'note'=>$r['note']];
  }, q("SELECT * FROM ppt_mail WHERE status='open' ORDER BY id DESC LIMIT ".(int)$limit)->fetchAll());
}

/** Von Hand zuordnen: Mail -> Session (setzt den Haken). */
function pptmail_assign(int $mailId, int $sessionId): array {
  $m=q("SELECT * FROM ppt_mail WHERE id=?",[$mailId])->fetch();
  if(!$m) return ['ok'=>false,'error'=>'Mail nicht gefunden.'];
  $s=q("SELECT * FROM training_sessions WHERE id=?",[$sessionId])->fetch();
  if(!$s) return ['ok'=>false,'error'=>'Session nicht gefunden.'];
  $atts=json_decode($m['atts']?:'[]',true)?:[];
  pptmail_apply($sessionId,(string)$m['from_addr'],(string)$m['received_at'],$atts);
  q("UPDATE ppt_mail SET status='applied', training_id=?, session_id=? WHERE id=?",
    [(int)$s['training_id'],$sessionId,$mailId]);
  audit('pptmail.assign','training',(string)$s['training_id'],mb_substr((string)$s['title'],0,80));
  return ['ok'=>true];
}

/** Mail als erledigt/irrelevant beiseitelegen. */
function pptmail_ignore(int $mailId): array {
  q("UPDATE ppt_mail SET status='ignored' WHERE id=?",[$mailId]);
  return ['ok'=>true];
}
