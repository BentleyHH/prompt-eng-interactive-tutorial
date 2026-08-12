<?php
/**
 * ETAF - „Flugpost“: Postfach-Abruf + Erkennung von Flugbestätigungen
 * -------------------------------------------------------------------
 * Ablauf (poll_mailbox, läuft per Cron oder Button):
 *   1. POP3S-Abruf: neue Mails holen (UIDL-basiert, Mails BLEIBEN im Postfach)
 *   2. MIME zerlegen: Text + HTML + Anhänge (z.B. E-Ticket-PDF)
 *   3. KI liest Passagier, Flüge, Buchungscode (Fallback: Muster-Erkennung)
 *   4. Zuordnung vorschlagen: Passagier → Trainer, Flugdatum → Training
 *   5. Landet zur Prüfung in der Flugpost-Inbox; „Übernehmen“ füllt die
 *      Reisedaten und verknüpft die Mail (Ticket hängt später an der Agenda).
 * Alles dependency-frei (fsockopen/TLS), wie der SMTP-Versand.
 */
require_once __DIR__.'/lib.php';
require_once __DIR__.'/ai.php';

/* ============================================================
   1) POP3S - minimaler Client. Mails bleiben auf dem Server,
      bereits Geholtes wird über die UIDL wiedererkannt.
   ============================================================ */
function pop3_fetch_new(array $cfg, int $limit=15): array {
  $host=$cfg['host']??''; $port=(int)($cfg['port']??995);
  $secure=$cfg['secure']??'ssl';                      // 'ssl' | 'none' (Tests)
  if($host==='') return ['ok'=>false,'error'=>'Kein Postfach-Host konfiguriert.','mails'=>[]];
  $remote=($secure==='ssl'?'ssl://':'').$host.':'.$port;
  $fp=@stream_socket_client($remote,$en,$es,20);
  if(!$fp) return ['ok'=>false,'error'=>"Verbindung zu $remote fehlgeschlagen ($es $en).",'mails'=>[]];
  stream_set_timeout($fp,25);
  $line=function() use($fp){ return rtrim((string)fgets($fp,2048),"\r\n"); };
  $cmd=function($c) use($fp,$line){ fwrite($fp,$c."\r\n"); return $line(); };
  $ok=function($r){ return strpos($r,'+OK')===0; };
  $greet=$line();
  if(!$ok($greet)){
    fclose($fp);
    // Häufigster Fall: IMAP-Port erwischt (993/143) - IMAP grüßt mit "* OK".
    $hint=strpos($greet,'* OK')===0
      ? "Auf Port $port antwortet IMAP, nicht POP3. Bitte in config.php beim mailbox-Block 'port' => 995 eintragen (POP3 über SSL)."
      : 'POP3-Server meldet Fehler beim Verbinden.';
    return ['ok'=>false,'error'=>$hint,'mails'=>[]];
  }
  if(!$ok($cmd('USER '.($cfg['user']??'')))){ fclose($fp); return ['ok'=>false,'error'=>'POP3: Benutzer abgelehnt.','mails'=>[]]; }
  if(!$ok($cmd('PASS '.($cfg['pass']??'')))){ fclose($fp); return ['ok'=>false,'error'=>'POP3: Passwort abgelehnt (Zugangsdaten in config.php prüfen).','mails'=>[]]; }
  // UIDL: Liste aller Nachrichten mit eindeutiger ID
  if(!$ok($cmd('UIDL'))){ $cmd('QUIT'); fclose($fp); return ['ok'=>false,'error'=>'POP3: UIDL nicht unterstützt.','mails'=>[]]; }
  $list=[];
  while(($l=$line())!=='.' && $l!==''){ $p=explode(' ',trim($l),2); if(count($p)===2) $list[(int)$p[0]]=$p[1]; }
  // Nur Neues laden
  $new=[];
  foreach($list as $num=>$uid){
    $seen=q("SELECT id FROM travel_mail WHERE uid=?",[$uid])->fetch();
    if(!$seen) $new[$num]=$uid;
  }
  $mails=[];
  foreach(array_slice($new,0,$limit,true) as $num=>$uid){
    if(!$ok($cmd('RETR '.$num))) continue;
    $raw='';
    while(($l=fgets($fp,4096))!==false){
      if(rtrim($l,"\r\n")==='.') break;
      if(substr($l,0,2)==='..') $l=substr($l,1);     // Punkt-Stuffing rückgängig
      $raw.=$l;
      if(strlen($raw)>12*1024*1024) break;           // Schutz: max. 12 MB je Mail
    }
    $mails[]=['uid'=>$uid,'raw'=>$raw];
  }
  $cmd('QUIT'); fclose($fp);
  return ['ok'=>true,'mails'=>$mails,'total_new'=>count($new)];
}

/* ============================================================
   2) MIME - Header, Text/HTML, Anhänge (rekursiv über multipart)
   ============================================================ */
function mime_decode_header(string $s): string {
  $d=@mb_decode_mimeheader($s);
  return $d!==false && $d!=='' ? $d : $s;
}
function mime_headers(string $head): array {
  $h=[]; $lines=preg_split('/\r?\n/',$head); $cur='';
  foreach($lines as $l){
    if($l==='') continue;
    if($l[0]===' '||$l[0]==="\t"){ $cur.=' '.trim($l); continue; }   // Fortsetzungszeile
    if($cur!==''){ [$k,$v]=array_pad(explode(':',$cur,2),2,''); $h[strtolower(trim($k))]=trim($v); }
    $cur=$l;
  }
  if($cur!==''){ [$k,$v]=array_pad(explode(':',$cur,2),2,''); $h[strtolower(trim($k))]=trim($v); }
  return $h;
}
function mime_param(string $header, string $param): string {
  if(preg_match('/'.$param.'\s*=\s*"([^"]*)"/i',$header,$m)) return $m[1];
  if(preg_match('/'.$param.'\s*=\s*([^;\s]+)/i',$header,$m)) return $m[1];
  return '';
}
function mime_decode_body(string $body, string $enc, string $charset): string {
  $enc=strtolower(trim($enc));
  if($enc==='base64') $body=(string)base64_decode(preg_replace('/\s+/','',$body));
  elseif($enc==='quoted-printable') $body=quoted_printable_decode($body);
  if($charset!=='' && strtolower($charset)!=='utf-8'){
    $c=@mb_convert_encoding($body,'UTF-8',$charset);
    if($c!==false) $body=$c;
  }
  return $body;
}
/** Zerlegt eine rohe Mail in ['subject','from','date','text','html','atts'=>[[name,mime,data]]]. */
function mime_parse(string $raw): array {
  $pos=strpos($raw,"\r\n\r\n"); $sep=4;
  if($pos===false){ $pos=strpos($raw,"\n\n"); $sep=2; }
  if($pos===false){ $pos=strlen($raw); $sep=0; }
  $h=mime_headers(substr($raw,0,$pos));
  $body=substr($raw,$pos+$sep);
  $out=['subject'=>mime_decode_header($h['subject']??''),
        'from'=>mime_decode_header($h['from']??''),
        'date'=>$h['date']??'', 'text'=>'', 'html'=>'', 'atts'=>[]];
  mime_walk($h['content-type']??'text/plain', $h['content-transfer-encoding']??'', $h['content-disposition']??'', $body, $out);
  if($out['text']==='' && $out['html']!==''){
    $t=preg_replace('#<(style|script)\b.*?</\1>#si','',$out['html']);
    $t=preg_replace('#<br\s*/?>|</(p|div|tr|li|h[1-6])>#i',"\n",$t);
    $out['text']=trim(preg_replace('/[ \t]+/',' ',html_entity_decode(strip_tags($t),ENT_QUOTES|ENT_HTML5,'UTF-8')));
  }
  return $out;
}
function mime_walk(string $ctype, string $enc, string $disp, string $body, array &$out): void {
  $mime=strtolower(trim(explode(';',$ctype)[0] ?: 'text/plain'));
  if(strpos($mime,'multipart/')===0){
    $b=mime_param($ctype,'boundary'); if($b==='') return;
    $parts=preg_split('/\r?\n--'.preg_quote($b,'/').'(--)?\r?\n?/',"\n".$body);
    foreach($parts as $part){
      if(trim($part)===''||trim($part)==='--') continue;
      $pp=strpos($part,"\r\n\r\n"); $ps=4;
      if($pp===false){ $pp=strpos($part,"\n\n"); $ps=2; }
      if($pp===false) continue;
      $ph=mime_headers(substr($part,0,$pp));
      mime_walk($ph['content-type']??'text/plain', $ph['content-transfer-encoding']??'',
                $ph['content-disposition']??'', substr($part,$pp+$ps), $out);
    }
    return;
  }
  $fname=mime_param($disp,'filename') ?: mime_param($ctype,'name');
  $isAtt = stripos($disp,'attachment')!==false || ($fname!=='' && $mime!=='text/plain' && $mime!=='text/html');
  if($isAtt){
    $data=mime_decode_body($body,$enc,'');
    if(strlen($data)>0 && strlen($data)<=8*1024*1024){
      $out['atts'][]=['name'=>mime_decode_header($fname?:'anhang'),'mime'=>$mime,'data'=>$data];
    }
    return;
  }
  $charset=mime_param($ctype,'charset');
  $txt=mime_decode_body($body,$enc,$charset);
  if($mime==='text/plain' && $out['text']==='') $out['text']=trim($txt);
  elseif($mime==='text/html' && $out['html']==='') $out['html']=$txt;
}

/* ============================================================
   3) Erkennung - KI (falls Key vorhanden), sonst Muster-Fallback
   ============================================================ */
function extract_flight_info(array $mail): array {
  $text=trim($mail['text']);
  // Falls (fast) kein Text: erstes PDF an die KI geben
  $pdf=null;
  foreach($mail['atts'] as $a){ if($a['mime']==='application/pdf'){ $pdf=$a; break; } }
  if(trim(cfg()['anthropic_key']??'')!==''){
    try{ return ai_extract_flight($text,$mail['subject'],$pdf); }
    catch(Throwable $e){ /* KI nicht erreichbar → Fallback unten */ }
  }
  return regex_extract_flight($text,$mail['subject']);
}
/** Muster-Fallback ohne KI: findet Flugnummern, Daten, Zeiten, Flughäfen, Passagier, Code. */
function regex_extract_flight(string $text, string $subject): array {
  $ex=['is_flight'=>false,'passengers'=>[],'booking_ref'=>'','airline'=>'','segments'=>[],'method'=>'regex'];
  if(preg_match_all('/(?:passagier|passenger|reisende[r]?|name)\s*[:\-]\s*([A-ZÄÖÜ][^\r\n,;]{2,60})/iu',$text,$m))
    $ex['passengers']=array_values(array_unique(array_map('trim',$m[1])));
  if(preg_match('/(?:buchungscode|buchungsnummer|booking\s*(?:ref(?:erence)?|code)|pnr|reservation\s*code|filekey)\s*[:\-]?\s*([A-Z0-9]{5,8})\b/i',$text,$m))
    $ex['booking_ref']=$m[1];
  foreach(preg_split('/\r?\n/',$text) as $line){
    if(!preg_match('/\b([A-Z]{2})\s?(\d{2,4})\b/',$line,$fm)) continue;
    if(!preg_match('/\b(\d{1,2})\.(\d{1,2})\.(\d{4})\b|\b(\d{4})-(\d{2})-(\d{2})\b/',$line,$dm)) continue;
    $date = isset($dm[3])&&$dm[3]!=='' ? sprintf('%04d-%02d-%02d',$dm[3],$dm[2],$dm[1])
                                       : sprintf('%04d-%02d-%02d',$dm[4],$dm[5],$dm[6]);
    preg_match_all('/\b([01]?\d|2[0-3]):([0-5]\d)\b/',$line,$tm,PREG_SET_ORDER);
    preg_match_all('/\b([A-Z]{3})\b/',$line,$am);
    $apts=array_values(array_filter($am[1],fn($a)=>!in_array($a,['THE','UND','VON','BIS','UHR'])));
    $ex['segments'][]=[
      'flight_no'=>$fm[1].' '.$fm[2],
      'dep_airport'=>$apts[0]??'', 'arr_airport'=>$apts[1]??'',
      'dep_time'=>$date.(isset($tm[0])?' '.$tm[0][0]:''),
      'arr_time'=>$date.(isset($tm[1])?' '.$tm[1][0]:''),
    ];
  }
  $ex['is_flight']=count($ex['segments'])>0;
  return $ex;
}

/* ============================================================
   4) Zuordnung - Passagier → Trainer, Flugdatum → Training
   ============================================================ */
function match_flight(array $ex): array {
  $res=['trainerId'=>null,'trainingId'=>null,'confidence'=>'none'];
  // Trainer über den Nachnamen finden (Passagiernamen kommen oft als "MUSTER/ANNA")
  $trainers=q("SELECT id,name FROM trainers")->fetchAll();
  foreach(($ex['passengers']??[]) as $p){
    $pn=mb_strtolower(preg_replace('/[^\p{L} ]/u',' ',$p));
    foreach($trainers as $tr){
      $last=mb_strtolower(trim(array_slice(explode(' ',preg_replace('/^Dr\.\s*/','',$tr['name'])),-1)[0]??''));
      if($last!=='' && mb_strlen($last)>2 && strpos($pn,$last)!==false){
        $res['trainerId']=(string)$tr['id']; break 2;
      }
    }
  }
  if(!$res['trainerId']) return $res;
  // Erster Flugtag → Training dieses Trainers, dessen Start in der Nähe liegt (−1…+7 Tage)
  $dep=null;
  foreach(($ex['segments']??[]) as $s){ if(!empty($s['dep_time'])){ $dep=substr($s['dep_time'],0,10); break; } }
  if(!$dep) return $res;
  $depTs=strtotime($dep);
  $best=null; $bestDiff=99;
  foreach(q("SELECT t.id,t.start_date FROM requests r JOIN trainings t ON t.id=r.training_id
             WHERE r.trainer_id=? AND r.status IN('yes','confirmed') AND t.start_date IS NOT NULL AND t.start_date<>''",
            [$res['trainerId']])->fetchAll() as $tg){
    $diff=($depTs!==false && ($st=strtotime($tg['start_date']))!==false) ? ($st-$depTs)/86400 : 99;
    if($diff>=-1 && $diff<=7 && abs($diff)<$bestDiff){ $best=(string)$tg['id']; $bestDiff=abs($diff); }
  }
  if($best){ $res['trainingId']=$best; $res['confidence']= $bestDiff<=2 ? 'high' : 'low'; }
  return $res;
}

/* Segmente in Hin-/Rückflug teilen (Lücke > 48 h = neue Reiseetappe) und
   daraus die Felder für die Reisedaten bauen. */
function flight_fields(array $segments): array {
  $seg=array_values(array_filter($segments,fn($s)=>!empty($s['dep_time'])));
  usort($seg,fn($a,$b)=>strcmp($a['dep_time'],$b['dep_time']));
  if(!$seg) return ['flightOut'=>'','flightReturn'=>'','arrival'=>'','departure'=>''];
  $legs=[[]]; $prev=null;
  foreach($seg as $s){
    if($prev!==null){
      $gap=(strtotime(substr($s['dep_time'],0,16))?:0)-(strtotime(substr($prev,0,16))?:0);
      if($gap>48*3600) $legs[]=[];
    }
    $legs[count($legs)-1][]=$s; $prev=$s['arr_time']??$s['dep_time'];
  }
  $fmt=function($leg){ return implode(' / ',array_map(function($s){
    $d=substr($s['dep_time'],0,16);
    return trim(($s['flight_no']??'').' '.($s['dep_airport']??'').'→'.($s['arr_airport']??'').' '.$d);
  },$leg)); };
  $out=$legs[0]; $ret=count($legs)>1?end($legs):[];
  return [
    'flightOut'=>$fmt($out),
    'flightReturn'=>$ret?$fmt($ret):'',
    'arrival'=>($out[count($out)-1]['arr_time']??'') ?: ($out[count($out)-1]['dep_time']??''),
    'departure'=>$ret?($ret[0]['dep_time']??''):'',
  ];
}

/* ============================================================
   5) Poll - kompletter Durchlauf (Cron oder Button „Jetzt abrufen“)
   ============================================================ */
function poll_mailbox(): array {
  $cfg=cfg()['mailbox']??[];
  if(empty($cfg['host'])||empty($cfg['user'])||empty($cfg['pass']))
    return ['ok'=>false,'error'=>'Postfach nicht konfiguriert (mailbox in config.php).','fetched'=>0,'flights'=>0];
  $r=pop3_fetch_new($cfg);
  if(!$r['ok']) return ['ok'=>false,'error'=>$r['error'],'fetched'=>0,'flights'=>0];
  $flights=0;
  foreach($r['mails'] as $m){
    $p=mime_parse($m['raw']);
    $ex=extract_flight_info($p);
    $match=$ex['is_flight'] ? match_flight($ex) : ['trainerId'=>null,'trainingId'=>null,'confidence'=>'none'];
    $status=$ex['is_flight'] ? 'new' : (count($p['atts'])? 'new' : 'irrelevant');   // ohne Flug & ohne Anhang: still ablegen
    q("INSERT INTO travel_mail(uid,from_addr,subject,received_at,body_text,status,extracted,match_trainer_id,match_training_id,confidence,created_at)
       VALUES(?,?,?,?,?,?,?,?,?,?,?)",
      [$m['uid'],mb_substr($p['from'],0,180),mb_substr($p['subject'],0,240),mb_substr($p['date'],0,40),
       mb_substr($p['text'],0,20000),$status,json_encode($ex,JSON_UNESCAPED_UNICODE),
       $match['trainerId'],$match['trainingId'],$match['confidence'],now()]);
    $mailId=db()->lastInsertId();
    foreach($p['atts'] as $a){
      q("INSERT INTO travel_mail_att(mail_id,name,mime,data) VALUES(?,?,?,?)",
        [$mailId,mb_substr($a['name'],0,180),$a['mime'],base64_encode($a['data'])]);
    }
    if($ex['is_flight']) $flights++;
  }
  return ['ok'=>true,'fetched'=>count($r['mails']),'flights'=>$flights];
}

/** „Übernehmen“: Reisedaten aus der Mail in die Planung schreiben + Mail verknüpfen. */
function mail_apply(int $mailId, int $trId, int $tgId): array {
  $mail=q("SELECT * FROM travel_mail WHERE id=?",[$mailId])->fetch();
  if(!$mail) fail('Mail nicht gefunden.',404);
  $ex=json_decode($mail['extracted']?:'{}',true) ?: [];
  $f=flight_fields($ex['segments']??[]);
  $ref=trim(($ex['booking_ref']??''));
  $note=$ref!=='' ? 'Buchungscode: '.$ref : '';
  $exRow=q("SELECT id,notes FROM travel WHERE training_id=? AND trainer_id=?",[$tgId,$trId])->fetch();
  if($exRow){
    $sets=[]; $vals=[];
    foreach([['arrival',$f['arrival']],['departure',$f['departure']],
             ['flight_out',$f['flightOut']],['flight_return',$f['flightReturn']]] as [$col,$v]){
      if($v!==''){ $sets[]="$col=?"; $vals[]=$v; }
    }
    if($note!=='' && strpos((string)$exRow['notes'],$ref)===false){ $sets[]='notes=?'; $vals[]=trim(($exRow['notes']?'':'').$note.' '.(string)$exRow['notes']); }
    $sets[]='mail_id=?'; $vals[]=$mailId;
    $sets[]='updated_at=?'; $vals[]=now();
    $vals[]=$exRow['id'];
    q("UPDATE travel SET ".implode(',',$sets)." WHERE id=?",$vals);
  } else {
    q("INSERT INTO travel(training_id,trainer_id,arrival,departure,flight_out,flight_return,notes,mail_id,updated_at)
       VALUES(?,?,?,?,?,?,?,?,?)",
      [$tgId,$trId,$f['arrival'],$f['departure'],$f['flightOut'],$f['flightReturn'],$note,$mailId,now()]);
  }
  q("UPDATE travel_mail SET status='applied', match_trainer_id=?, match_training_id=?, applied_at=? WHERE id=?",
    [$trId,$tgId,now(),$mailId]);
  audit('flightmail.apply','training',(string)$tgId,mb_substr($mail['subject'],0,120));
  return ['ok'=>true,'fields'=>$f];
}
