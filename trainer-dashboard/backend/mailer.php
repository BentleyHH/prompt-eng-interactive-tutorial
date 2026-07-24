<?php
/** ETAF — E-Mail-Versand (mail() / SMTP / log) inkl. Magic-Link-Buttons */

require_once __DIR__.'/lib.php';

/** Baut die drei Antwort-Buttons (Magic-Links) als HTML — tabellenbasiert,
 *  gestapelt und mit voller Breite, damit sie in jedem Mail-Client (inkl.
 *  Apple Mail, Outlook, Gmail) sauber und gut tippbar dargestellt werden. */
function response_buttons(string $tok, string $lang): string {
  $base=base_url().'/respond.php?token='.$tok.'&answer=';
  $L = $lang==='de'
    ? ['yes'=>'✅&nbsp; Ja, verfügbar','maybe'=>'🤔&nbsp; Vielleicht','no'=>'❌&nbsp; Nein']
    : ['yes'=>'✅&nbsp; Yes, available','maybe'=>'🤔&nbsp; Maybe','no'=>'❌&nbsp; No'];
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
    $when=trim(($t['start_date']?htmlspecialchars($t['start_date']):'').($t['kw']?'  ('.htmlspecialchars($t['kw']).')':''));
    $loc=htmlspecialchars(trim(($t['city']??'').(($t['country']??'')?', '.$t['country']:'')));
    $rows.='<tr>'
      .'<td style="padding:9px 10px;border-bottom:1px solid #eef0f2;white-space:nowrap">'
      .'<span style="display:inline-block;padding:2px 9px;border-radius:20px;font-size:12px;font-weight:700;color:#fff;background:'.$col.'">'.status_word($st,$lang).'</span></td>'
      .'<td style="padding:9px 10px;border-bottom:1px solid #eef0f2;font-size:13px;white-space:nowrap">'.$when.'</td>'
      .'<td style="padding:9px 10px;border-bottom:1px solid #eef0f2;font-size:13px">'.$loc.'</td>'
      .'<td style="padding:9px 10px;border-bottom:1px solid #eef0f2;font-size:13px"><b>'.htmlspecialchars($t['topic']).'</b></td>'
      .'</tr>';
  }
  return '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" '
    .'style="border-collapse:collapse;margin:6px 0 4px;font-family:Arial,Helvetica,sans-serif;color:#242b31">'
    .'<tr style="text-align:left;color:#8a939a;font-size:12px">'
    .'<th style="padding:0 10px 6px">'.$h['status'].'</th><th style="padding:0 10px 6px">'.$h['when'].'</th>'
    .'<th style="padding:0 10px 6px">'.$h['where'].'</th><th style="padding:0 10px 6px">'.$h['what'].'</th></tr>'
    .$rows.'</table>';
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
