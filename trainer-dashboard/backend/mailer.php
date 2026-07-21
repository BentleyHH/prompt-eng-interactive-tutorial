<?php
/** ETAF — E-Mail-Versand (mail() / SMTP / log) inkl. Magic-Link-Buttons */

require_once __DIR__.'/lib.php';

/** Baut die drei Antwort-Buttons (Magic-Links) als HTML. */
function response_buttons(string $tok, string $lang): string {
  $base=base_url().'/respond.php?token='.$tok.'&answer=';
  $L = $lang==='de'
    ? ['yes'=>'✅ Ja, verfügbar','maybe'=>'🤔 Vielleicht','no'=>'❌ Nein']
    : ['yes'=>'✅ Yes, available','maybe'=>'🤔 Maybe','no'=>'❌ No'];
  $btn=function($url,$label,$bg) {
    return '<a href="'.$url.'" style="display:inline-block;margin:4px;padding:11px 18px;'
      .'border-radius:8px;font:600 14px system-ui,Arial,sans-serif;color:#fff;'
      .'text-decoration:none;background:'.$bg.'">'.$label.'</a>';
  };
  return '<div style="margin:22px 0">'
    .$btn($base.'yes',$L['yes'],'#2E9E6B')
    .$btn($base.'maybe',$L['maybe'],'#C77E1E')
    .$btn($base.'no',$L['no'],'#D81F26')
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

/**
 * Versendet eine Anfrage-Mail. Gibt true/false zurück.
 * $mode: 'mail' | 'smtp' | 'log'
 */
function send_email(string $toEmail, string $toName, string $subject, string $html): bool {
  $c=cfg();
  $mode=$c['mail_mode']??'mail';
  if($mode==='log') return true; // nur protokollieren (Aufrufer schreibt email_log)

  $from=$c['from_email']; $fromName=$c['from_name']??'ETAF';
  if($mode==='smtp') return smtp_send($toEmail,$subject,$html,$c['smtp'],$from,$fromName);

  // PHP mail()
  $headers = 'MIME-Version: 1.0'."\r\n"
    .'Content-Type: text/html; charset=UTF-8'."\r\n"
    .'From: '.mb_encode_mimeheader($fromName).' <'.$from.'>'."\r\n"
    .'Reply-To: '.$from."\r\n";
  return @mail($toEmail, mb_encode_mimeheader($subject), $html, $headers);
}

/** Minimaler SMTP-Client (AUTH LOGIN, STARTTLS/SSL). Ohne externe Libs. */
function smtp_send(string $to, string $subject, string $html, array $s, string $from, string $fromName): bool {
  $host=$s['host']; $port=(int)$s['port']; $secure=$s['secure']??'tls';
  $remote=($secure==='ssl'?'ssl://':'').$host.':'.$port;
  $fp=@stream_socket_client($remote,$en,$es,15);
  if(!$fp) return false;
  $read=function() use($fp){ $d=''; while($line=fgets($fp,515)){ $d.=$line; if(substr($line,3,1)===' ') break; } return $d; };
  $cmd=function($c) use($fp,$read){ fwrite($fp,$c."\r\n"); return $read(); };
  $read();
  $cmd('EHLO '.($_SERVER['HTTP_HOST']??'localhost'));
  if($secure==='tls'){
    $cmd('STARTTLS');
    if(!stream_socket_enable_crypto($fp,true,STREAM_CRYPTO_METHOD_TLS_CLIENT)) { fclose($fp); return false; }
    $cmd('EHLO '.($_SERVER['HTTP_HOST']??'localhost'));
  }
  $cmd('AUTH LOGIN');
  $cmd(base64_encode($s['user']));
  $r=$cmd(base64_encode($s['pass']));
  if(strpos($r,'235')===false){ fclose($fp); return false; }
  $cmd('MAIL FROM:<'.$from.'>');
  $cmd('RCPT TO:<'.$to.'>');
  $r=$cmd('DATA');
  if(strpos($r,'354')===false){ fclose($fp); return false; }
  $data='From: '.mb_encode_mimeheader($fromName).' <'.$from.'>'."\r\n"
    .'To: <'.$to.'>'."\r\n"
    .'Subject: '.mb_encode_mimeheader($subject)."\r\n"
    .'MIME-Version: 1.0'."\r\n"
    .'Content-Type: text/html; charset=UTF-8'."\r\n\r\n"
    .$html."\r\n.";
  $r=$cmd($data);
  $cmd('QUIT'); fclose($fp);
  return strpos($r,'250')!==false;
}
