<?php
/** ETAF — E-Mail-Versand (mail() / SMTP / log) inkl. Magic-Link-Buttons */

require_once __DIR__.'/lib.php';

/** Baut die drei Antwort-Buttons (Magic-Links) als HTML — tabellenbasiert,
 *  gestapelt und mit voller Breite, damit sie in jedem Mail-Client (inkl.
 *  Apple Mail, Outlook, Gmail) sauber und gut tippbar dargestellt werden. */
/** Minimalistisches Strich-Icon als Inline-SVG (für die Web-Bestätigungsseiten).
 *  stroke=currentColor → erbt automatisch die Textfarbe des Buttons. */
function stroke_icon(string $name, int $size=20): string {
  $p = [
    'check' => '<path d="M20 6 9 17l-5-5"/>',
    'x'     => '<path d="M18 6 6 18M6 6l12 12"/>',
    'maybe' => '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.3a2.4 2.4 0 1 1 3 2.3c-.8.3-1.4.9-1.4 1.9"/><path d="M12 16.7h.01"/>',
    'alert' => '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h16.9a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    'inbox' => '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.5 5.5 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.5A2 2 0 0 0 16.8 4H7.2a2 2 0 0 0-1.7 1.5z"/>',
  ];
  $d=$p[$name] ?? '';
  return '<svg width="'.$size.'" height="'.$size.'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-4px;margin-right:9px">'.$d.'</svg>';
}

function response_buttons(string $tok, string $lang): string {
  $base=base_url().'/respond.php?token='.$tok.'&answer=';
  // Schlanke, monochrome Strich-Zeichen (kommen in jedem Mail-Client an).
  $L = $lang==='de'
    ? ['yes'=>'✓&nbsp;&nbsp;Ja, verfügbar','maybe'=>'○&nbsp;&nbsp;Vielleicht','no'=>'✕&nbsp;&nbsp;Nein']
    : ['yes'=>'✓&nbsp;&nbsp;Yes, available','maybe'=>'○&nbsp;&nbsp;Maybe','no'=>'✕&nbsp;&nbsp;No'];
  // Dunkle Schrift auf hellem Grund + farbiger Rahmen: bleibt in JEDEM Mail-Client
  // lesbar — auch wenn Hintergrundfarben entfernt werden (dann steht die Beschriftung
  // farbig auf Weiß statt weiß auf Weiß / unsichtbar).
  $btn=function($url,$label,$text,$bg,$border){
    return '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 10px;border-collapse:separate">'
      .'<tr><td align="center" bgcolor="'.$bg.'" style="border:2px solid '.$border.';border-radius:8px">'
      .'<a href="'.$url.'" target="_blank" style="display:block;padding:13px 18px;color:'.$text.';'
      .'font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;line-height:20px;'
      .'text-decoration:none">'.$label.'</a>'
      .'</td></tr></table>';
  };
  // Kurze Schritt-für-Schritt-Erklärung (zweistufig, damit nichts unklar ist).
  $steps = $lang==='de'
    ? '<b>So antwortest du:</b><br>1. Unten auf deine Antwort tippen &nbsp;·&nbsp; 2. Auf der nächsten Seite mit einem Klick <b>bestätigen</b> &nbsp;·&nbsp; 3. Du erhältst eine kurze Bestätigungs-E-Mail.'
    : '<b>How to reply:</b><br>1. Tap your answer below &nbsp;·&nbsp; 2. <b>Confirm</b> with one click on the next page &nbsp;·&nbsp; 3. You\'ll receive a short confirmation e-mail.';
  $note = '<div style="margin:18px 0 12px;padding:11px 14px;background:#f4f6f8;border:1px solid #e2e5e8;'
    .'border-radius:10px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.55;color:#5c666e">'
    .$steps.'</div>';
  return '<div style="margin:6px 0 0;max-width:360px">'
    .$note
    .$btn($base.'yes',  $L['yes'],  '#1E7A4D','#E9F6EF','#2E9E6B')
    .$btn($base.'maybe',$L['maybe'],'#8A5410','#FBF2DF','#C77E1E')
    .$btn($base.'no',   $L['no'],   '#B21620','#FDEBEB','#D81F26')
    .'</div>';
}

/** HTML-Rumpf im ETAF-Look. */
function email_html(string $bodyText, string $buttons): string {
  $esc=nl2br(htmlspecialchars($bodyText, ENT_QUOTES, 'UTF-8'));
  return '<!doctype html><html><body style="margin:0;background:#f4f5f6;padding:24px">'
    .'<div style="max-width:560px;margin:auto;background:#fff;border:1px solid #e2e5e8;'
    .'border-radius:14px;padding:28px 30px;font:15px/1.6 system-ui,Arial,sans-serif;color:#242b31">'
    .'<div style="font-weight:800;font-size:26px;letter-spacing:-.04em;color:#3e4852">'
    .'ETAF<span style="color:#d81f26">.</span></div>'
    .'<div style="height:1px;background:#e2e5e8;margin:16px 0 20px"></div>'
    .'<div>'.$esc.'</div>'.$buttons
    .'<div style="height:1px;background:#e2e5e8;margin:20px 0 12px"></div>'
    .'<div style="font-size:12px;color:#8a939a">ETAF · Trainer-Koordination</div>'
    .'</div></body></html>';
}

/** Einsatz-Tabelle (für E-Mail und Bestätigungsseite). $sched aus trainer_schedule(). */
function plan_table_html(array $sched, string $lang): string {
  $h = $lang==='de'
    ? ['status'=>'Status','when'=>'Zeitraum','where'=>'Ort','what'=>'Training','empty'=>'Aktuell keine Einsätze hinterlegt.']
    : ['status'=>'Status','when'=>'Period','where'=>'Location','what'=>'Training','empty'=>'No assignments on record yet.'];
  $pill=['yes'=>'#2E9E6B','confirmed'=>'#2E9E6B','maybe'=>'#C77E1E','asked'=>'#5c666e'];
  if(!$sched) return '<p style="color:#8a939a;font-family:Arial,sans-serif;font-size:14px">'.$h['empty'].'</p>';
  $rows='';
  foreach($sched as $t){
    $st=$t['rstatus']; $col=$pill[$st] ?? '#5c666e';
    $range=fmt_date_range($t['start_date']??null,$t['end_date']??null,$lang);
    $when = $range ? htmlspecialchars($range) : htmlspecialchars($t['kw']??'');
    $whenSub = ($range && !empty($t['kw'])) ? '<div style="color:#8a939a;font-size:11px">'.htmlspecialchars($t['kw']).'</div>' : '';
    $loc=htmlspecialchars(trim(($t['city']??'').(($t['country']??'')?', '.$t['country']:'')));
    $tw=travel_window($t['start_date']??null,$t['end_date']??null,$lang);
    $twLbl=$lang==='de'?'Reisezeitraum inkl. An-/Abreise':'Travel window incl. arrival/departure';
    $rows.='<tr>'
      .'<td style="padding:9px 10px;border-bottom:1px solid #eef0f2;white-space:nowrap;vertical-align:top">'
      .'<span style="display:inline-block;padding:2px 9px;border-radius:20px;font-size:12px;font-weight:700;color:#fff;background:'.$col.'">'.status_word($st,$lang).'</span></td>'
      .'<td style="padding:9px 10px;border-bottom:1px solid #eef0f2;font-size:13px;white-space:nowrap;vertical-align:top">'.$when.$whenSub.'</td>'
      .'<td style="padding:9px 10px;border-bottom:1px solid #eef0f2;font-size:13px;vertical-align:top">'.$loc.'</td>'
      .'<td style="padding:9px 10px;border-bottom:1px solid #eef0f2;font-size:13px;vertical-align:top"><b>'.htmlspecialchars($t['topic']).'</b>'
      .($tw?'<div style="color:#8a939a;font-size:12px;margin-top:2px">'.$twLbl.': '.htmlspecialchars($tw).'</div>':'')
      .(($tl=travel_line($t,$lang))?'<div style="color:#8a939a;font-size:12px;margin-top:2px">'.$tl.'</div>':'')
      .'</td></tr>';
  }
  return '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" '
    .'style="border-collapse:collapse;margin:6px 0 4px;font-family:Arial,Helvetica,sans-serif;color:#242b31">'
    .'<tr style="text-align:left;color:#8a939a;font-size:12px">'
    .'<th style="padding:0 10px 6px">'.$h['status'].'</th><th style="padding:0 10px 6px">'.$h['when'].'</th>'
    .'<th style="padding:0 10px 6px">'.$h['where'].'</th><th style="padding:0 10px 6px">'.$h['what'].'</th></tr>'
    .$rows.'</table>';
}

/** Transfer-/Abholtabelle (für Kunden-E-Mail und Bestätigungsseite). */
function transfer_table_html(array $rows, string $lang): string {
  $h = $lang==='de'
    ? ['tr'=>'Trainer','arr'=>'Anreise','dep'=>'Abreise','hotel'=>'Hotel','ctx'=>'Training / Ort','empty'=>'Noch keine bestätigten Trainer.']
    : ['tr'=>'Trainer','arr'=>'Arrival','dep'=>'Departure','hotel'=>'Hotel','ctx'=>'Training / Location','empty'=>'No confirmed trainers yet.'];
  if(!$rows) return '<p style="color:#8a939a;font-family:Arial,sans-serif;font-size:14px">'.$h['empty'].'</p>';
  $cell='padding:9px 10px;border-bottom:1px solid #eef0f2;font-size:13px;vertical-align:top';
  $body='';
  foreach($rows as $r){
    $arr=trim(($r['arrival']?htmlspecialchars($r['arrival']):'').($r['flight_out']?' · '.htmlspecialchars($r['flight_out']):''));
    $dep=trim(($r['departure']?htmlspecialchars($r['departure']):'').($r['flight_return']?' · '.htmlspecialchars($r['flight_return']):''));
    $hotel=trim(($r['hotel']?htmlspecialchars($r['hotel']):'').($r['room']?' · '.htmlspecialchars($r['room']):''));
    $ctx=htmlspecialchars($r['topic']).' · '.htmlspecialchars(trim(($r['city']??'').(($r['country']??'')?', '.$r['country']:'')));
    $body.='<tr>'
      .'<td style="'.$cell.'"><b>'.htmlspecialchars($r['trainer']).'</b>'.($r['phone']?'<div style="color:#8a939a;font-size:12px">☎ '.htmlspecialchars($r['phone']).'</div>':'').'</td>'
      .'<td style="'.$cell.'">'.($arr?:'—').'</td>'
      .'<td style="'.$cell.'">'.($dep?:'—').'</td>'
      .'<td style="'.$cell.'">'.($hotel?:'—').'</td>'
      .'<td style="'.$cell.'">'.$ctx.'</td></tr>';
  }
  return '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" '
    .'style="border-collapse:collapse;margin:6px 0 4px;font-family:Arial,Helvetica,sans-serif;color:#242b31">'
    .'<tr style="text-align:left;color:#8a939a;font-size:12px">'
    .'<th style="padding:0 10px 6px">'.$h['tr'].'</th><th style="padding:0 10px 6px">'.$h['arr'].'</th>'
    .'<th style="padding:0 10px 6px">'.$h['dep'].'</th><th style="padding:0 10px 6px">'.$h['hotel'].'</th>'
    .'<th style="padding:0 10px 6px">'.$h['ctx'].'</th></tr>'.$body.'</table>';
}

/** Transfer-/Abholliste an den Kunden senden (Erst-Versand oder Erinnerung).
 *  Bei $reminder=true bleibt der Token/Bestätigungsstand erhalten. */
function transfer_send(string $clientId, string $lang, bool $reminder=false): array {
  $lang = $lang==='de' ? 'de' : 'en';
  $cl=q("SELECT * FROM clients WHERE id=?",[$clientId])->fetch();
  if(!$cl) return ['ok'=>false,'error'=>'Kunde nicht gefunden.'];
  $to=trim((string)($cl['contact_email']??''));
  if($to==='') return ['ok'=>false,'error'=>'Für diesen Kunden ist keine Kontakt-E-Mail hinterlegt.'];
  $rows=client_transfer_list($clientId);
  $ex=q("SELECT * FROM transfer_tokens WHERE client_id=?",[$clientId])->fetch();
  if($reminder && $ex && !empty($ex['tok'])){
    $tok=$ex['tok']; q("UPDATE transfer_tokens SET reminded_at=? WHERE client_id=?",[now(),$clientId]);
  } else {
    $tok=token(40);
    if($ex) q("UPDATE transfer_tokens SET tok=?, sent_at=?, confirmed_at=NULL, note=NULL, reminded_at=NULL WHERE client_id=?",[$tok,now(),$clientId]);
    else    q("INSERT INTO transfer_tokens(client_id,tok,sent_at) VALUES(?,?,?)",[$clientId,$tok,now()]);
  }
  $cname=trim((string)($cl['contact_name']??''));
  $hi = $cname!=='' ? explode(' ',$cname)[0] : 'Team';
  if($reminder){
    $intro = $lang==='de'
      ? "Hallo $hi,\n\nkurze Erinnerung: Wir hatten dir die Transfer-Übersicht unserer Trainer für {$cl['name']} geschickt. Bitte bestätige uns kurz den Erhalt über den Button unten — danke!"
      : "Hello $hi,\n\na quick reminder: we sent you the transfer overview of our trainers for {$cl['name']}. Please confirm receipt via the button below — thank you!";
  } else {
    $intro = $lang==='de'
      ? "Hallo $hi,\n\nanbei die Übersicht unserer bestätigten Trainer für {$cl['name']} mit An-/Abreise und Hotel — bitte die Abholung/den Transfer entsprechend organisieren.\n\nBitte kurz den Erhalt bestätigen (Button unten)."
      : "Hello $hi,\n\nplease find below our confirmed trainers for {$cl['name']} with arrival/departure and hotel details — kindly arrange pickup/transfer accordingly.\n\nPlease confirm receipt via the button below.";
  }
  $cta = $lang==='de' ? 'Erhalt bestätigen' : 'Confirm receipt';
  $url = base_url().'/transfer.php?token='.$tok;
  $pre = $reminder ? ($lang==='de'?'Erinnerung: ':'Reminder: ') : '';
  $subject = $pre.($lang==='de' ? 'Trainer-Anreise & Transfer — ' : 'Trainer arrivals & transfer — ').$cl['name'];
  $html = email_html($intro, transfer_table_html($rows,$lang).cta_button($url,$cta));
  $ok = send_email($to, $cname ?: $cl['name'], $subject, $html);
  $st = $ok ? ((cfg()['mail_mode']??'mail')==='log'?'logged':'sent') : 'failed';
  q("INSERT INTO email_log(training_id,trainer_id,to_email,subject,body,lang,status,created_at)
     VALUES(?,?,?,?,?,?,?,?)",[null,null,$to,$subject,$intro,$lang,$st,now()]);
  return ['ok'=>true,'sent'=>$ok?1:0,'count'=>count($rows)];
}

/** Ein einzelner CTA-Button (z.B. „Einsatzplan ansehen & bestätigen“). */
function cta_button(string $url, string $label, string $bg='#3E4852'): string {
  return '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:18px 0 4px;max-width:360px">'
    .'<tr><td align="center" bgcolor="'.$bg.'" style="border-radius:8px">'
    .'<a href="'.$url.'" target="_blank" style="display:block;padding:14px 20px;color:#ffffff;'
    .'font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;text-decoration:none">'.$label.'</a>'
    .'</td></tr></table>';
}

/**
 * Versendet eine Anfrage-Mail. Gibt true/false zurück.
 * $mode: 'mail' | 'smtp' | 'log'
 */
function send_email(string $toEmail, string $toName, string $subject, string $html): bool {
  $c=cfg();
  $mode=$c['mail_mode']??'mail';
  $GLOBALS['__mail_err']='';
  if($mode==='log'){ $GLOBALS['__mail_err']="mail_mode='log' — es wird NICHTS versendet, nur protokolliert. Für echten Versand in config.php auf 'smtp' (empfohlen) oder 'mail' umstellen."; return true; }

  $from=$c['from_email']; $fromName=$c['from_name']??'ETAF';
  if($mode==='smtp') return smtp_send($toEmail,$subject,$html,$c['smtp']??[],$from,$fromName);

  // PHP mail()
  $headers = 'MIME-Version: 1.0'."\r\n"
    .'Content-Type: text/html; charset=UTF-8'."\r\n"
    .'From: '.mb_encode_mimeheader($fromName).' <'.$from.'>'."\r\n"
    .'Reply-To: '.$from."\r\n";
  $ok=@mail($toEmail, mb_encode_mimeheader($subject), $html, $headers);
  if(!$ok) $GLOBALS['__mail_err']="PHP mail() hat false zurückgegeben. Auf artfiles ist für die eigene Domain oft mail_mode='smtp' zuverlässiger.";
  return $ok;
}

/** Letzter Versand-Fehler / SMTP-Mitschnitt (für backend/mailtest.php). */
$GLOBALS['__mail_err'] = '';
$GLOBALS['__smtp_trace'] = [];

/** Minimaler SMTP-Client (AUTH LOGIN, STARTTLS/SSL). Ohne externe Libs.
 *  Protokolliert jeden Schritt in $GLOBALS['__smtp_trace'] und setzt bei
 *  Fehlern $GLOBALS['__mail_err] mit Klartext-Grund. */
function smtp_send(string $to, string $subject, string $html, array $s, string $from, string $fromName): bool {
  $GLOBALS['__smtp_trace']=[]; $GLOBALS['__mail_err']='';
  $log=function($line) { $GLOBALS['__smtp_trace'][]=rtrim($line); };
  $host=$s['host']??''; $port=(int)($s['port']??587); $secure=$s['secure']??'tls';
  $remote=($secure==='ssl'?'ssl://':'').$host.':'.$port;
  $log('>> connect '.$remote);
  $fp=@stream_socket_client($remote,$en,$es,15);
  if(!$fp){ $GLOBALS['__mail_err']="Verbindung zu $remote fehlgeschlagen ($es $en). Host/Port/Firewall prüfen."; $log('!! '.$GLOBALS['__mail_err']); return false; }
  $read=function() use($fp,$log){ $d=''; while($line=fgets($fp,515)){ $d.=$line; if(substr($line,3,1)===' ') break; } $log('<< '.trim($d)); return $d; };
  $cmd=function($c,$hide=false) use($fp,$read,$log){ $log('>> '.($hide?'[…base64…]':$c)); fwrite($fp,$c."\r\n"); return $read(); };
  $read();
  $cmd('EHLO '.($_SERVER['HTTP_HOST']??'localhost'));
  if($secure==='tls'){
    $cmd('STARTTLS');
    if(!stream_socket_enable_crypto($fp,true,STREAM_CRYPTO_METHOD_TLS_CLIENT)) { $GLOBALS['__mail_err']='STARTTLS (Verschlüsselung) fehlgeschlagen.'; $log('!! '.$GLOBALS['__mail_err']); fclose($fp); return false; }
    $cmd('EHLO '.($_SERVER['HTTP_HOST']??'localhost'));
  }
  $cmd('AUTH LOGIN');
  $cmd(base64_encode($s['user']??''),true);
  $r=$cmd(base64_encode($s['pass']??''),true);
  if(strpos($r,'235')===false){ $GLOBALS['__mail_err']='Login abgelehnt (kein 235). Benutzer/Passwort in config.php prüfen — user muss die volle E-Mail-Adresse sein.'; fclose($fp); return false; }
  $cmd('MAIL FROM:<'.$from.'>');
  $r=$cmd('RCPT TO:<'.$to.'>');
  if(strpos($r,'250')===false && strpos($r,'251')===false){ $GLOBALS['__mail_err']='Empfänger abgelehnt: '.trim($r); fclose($fp); return false; }
  $r=$cmd('DATA');
  if(strpos($r,'354')===false){ $GLOBALS['__mail_err']='DATA abgelehnt (kein 354): '.trim($r); fclose($fp); return false; }
  $data='From: '.mb_encode_mimeheader($fromName).' <'.$from.'>'."\r\n"
    .'To: <'.$to.'>'."\r\n"
    .'Subject: '.mb_encode_mimeheader($subject)."\r\n"
    .'MIME-Version: 1.0'."\r\n"
    .'Content-Type: text/html; charset=UTF-8'."\r\n\r\n"
    .$html."\r\n.";
  $log('>> [Nachricht … '.strlen($html).' Bytes]');
  fwrite($fp,$data."\r\n"); $r=$read();
  $ok=strpos($r,'250')!==false;
  if(!$ok) $GLOBALS['__mail_err']='Server hat die Nachricht nicht angenommen: '.trim($r);
  $cmd('QUIT'); fclose($fp);
  return $ok;
}
