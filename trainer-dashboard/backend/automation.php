<?php
/**
 * ETAF - Automatik: Erinnerungen nach X Stunden + automatisches Nachrücken.
 * Wird per Cron (cron.php) oder Button (api.php?action=automation.run) ausgelöst.
 */
require_once __DIR__.'/lib.php';
require_once __DIR__.'/mailer.php';

/**
 * Info-Mail (Digest): baut die gewählten Inhalts-Blöcke als HTML.
 * Blöcke: staffing | ppt | travel | inbox | week | passport | reports
 */
function digest_build(array $parts): string {
  $today=gmdate('Y-m-d'); $out='';
  $H=fn($t)=>'<div style="font-weight:800;font-size:15px;margin:18px 0 6px;color:#3e4852">'.$t.'</div>';
  $li=fn($t)=>'<div style="padding:3px 0;font-size:14px;color:#242b31">• '.$t.'</div>';
  $upcoming=q("SELECT * FROM trainings WHERE (end_date>=? OR end_date IS NULL OR end_date='')
               ORDER BY (start_date IS NULL), start_date",[$today])->fetchAll();
  $fmt=fn($tg)=>(($tg['code']??'')?$tg['code'].' · ':'').$tg['topic']
    .((($tg['start_date']??'')!=='')?' ('.date('d.m.',strtotime($tg['start_date'])).')':'');

  if(in_array('staffing',$parts,true)){
    $rows=[];
    foreach($upcoming as $tg){
      $yes=(int)q("SELECT COUNT(*) c FROM requests WHERE training_id=? AND status IN('yes','confirmed')",[$tg['id']])->fetch()['c'];
      $ask=(int)q("SELECT COUNT(*) c FROM requests WHERE training_id=? AND status='asked'",[$tg['id']])->fetch()['c'];
      if($yes<(int)$tg['need_cnt']) $rows[]=$li(htmlspecialchars($fmt($tg))." - <b>$yes/{$tg['need_cnt']}</b> zugesagt".($ask?", $ask angefragt":""));
      if(count($rows)>=8) break;
    }
    $out.=$H('Besetzung').($rows?implode('',$rows):$li('Alle kommenden Trainings sind voll besetzt ✓'));
  }
  if(in_array('ppt',$parts,true)){
    $rows=[];
    foreach($upcoming as $tg){
      try{
        $a=q("SELECT COUNT(*) n, SUM(CASE WHEN ppt='vorhanden' THEN 1 ELSE 0 END) d
              FROM training_sessions WHERE training_id=? AND stype NOT IN('orga','deliverable')",[$tg['id']])->fetch();
      }catch(Throwable $e){ break; }
      $miss=(int)$a['n']-(int)$a['d'];
      if((int)$a['n']>0 && $miss>0) $rows[]=$li(htmlspecialchars($fmt($tg))." - <b>$miss</b> PowerPoint".($miss===1?'':'s')." fehlen");
      if(count($rows)>=8) break;
    }
    $out.=$H('PowerPoints').($rows?implode('',$rows):$li('Alle PowerPoints der kommenden Wochen sind da ✓'));
  }
  if(in_array('travel',$parts,true)){
    $rows=[];
    foreach($upcoming as $tg){
      $n=(int)q("SELECT COUNT(*) c FROM requests r
                 LEFT JOIN travel tv ON tv.training_id=r.training_id AND tv.trainer_id=r.trainer_id
                 WHERE r.training_id=? AND r.status IN('yes','confirmed')
                   AND (tv.id IS NULL OR ((tv.flight_out IS NULL OR tv.flight_out='') AND (tv.arrival IS NULL OR tv.arrival='')))",[$tg['id']])->fetch()['c'];
      if($n>0) $rows[]=$li(htmlspecialchars($fmt($tg))." - <b>$n</b> Trainer ohne Reisedaten");
      if(count($rows)>=8) break;
    }
    $out.=$H('Reisen & Flüge').($rows?implode('',$rows):$li('Reisedaten der zugesagten Trainer sind vollständig ✓'));
  }
  if(in_array('inbox',$parts,true)){
    $fb=(int)q("SELECT COUNT(*) c FROM plan_tokens WHERE confirm_status='issue' AND note IS NOT NULL AND note<>'' AND resolved_at IS NULL")->fetch()['c'];
    $fm=0; try{ $fm=(int)q("SELECT COUNT(*) c FROM travel_mail WHERE status='new'")->fetch()['c']; }catch(Throwable $e){}
    $out.=$H('Posteingang').(($fb||$fm)
      ? ($fb?$li("<b>$fb</b> offene Rückmeldung".($fb===1?'':'en')." von Trainern"):'')
        .($fm?$li("<b>$fm</b> neue Flugpost-Mail".($fm===1?'':'s')." zu prüfen"):'')
      : $li('Keine offenen Rückmeldungen ✓'));
  }
  if(in_array('week',$parts,true)){
    $nx=null; foreach($upcoming as $tg){ if(($tg['start_date']??'')>=$today){ $nx=$tg; break; } }
    if($nx){
      $team=q("SELECT tr.name FROM requests r JOIN trainers tr ON tr.id=r.trainer_id
               WHERE r.training_id=? AND r.status IN('yes','confirmed')",[$nx['id']])->fetchAll(PDO::FETCH_COLUMN);
      $out.=$H('Nächstes Training')
        .$li('<b>'.htmlspecialchars((($nx['code']??'')?$nx['code'].' - ':'').$nx['topic']).'</b>')
        .$li(htmlspecialchars(($nx['city']??'').' · '.fmt_date_range($nx['start_date']??null,$nx['end_date']??null,'de')))
        .$li('Team: '.($team?htmlspecialchars(implode(', ',$team)):'- noch niemand zugesagt -'))
        .((($nx['deliverable']??'')!=='')?$li('Wochenergebnis: '.htmlspecialchars($nx['deliverable'])):'');
    }
  }
  if(in_array('reports',$parts,true)){
    // Kurzbild der letzten drei Monate + was noch zu bewerten ist
    $rep=debrief_report(gmdate('Y-m-d', time()-90*86400), '', '', 'month');
    $rows=[];
    if($rep['n']>0){
      $rows[]=$li('Ø Gesamteindruck: <b>'.number_format((float)($rep['overall']??0),1,',','').'</b> aus '.$rep['n'].' Bericht'.($rep['n']===1?'':'en'));
      $weak=array_values(array_filter($rep['criteria'], fn($c)=>$c['avg']!==null && $c['avg']<3));
      usort($weak, fn($a,$b)=>$a['avg']<=>$b['avg']);
      foreach(array_slice($weak,0,4) as $c){
        $rows[]=$li('Handlungsbedarf: <b>'.htmlspecialchars(debrief_label($c['key'])).'</b> - '
          .number_format((float)$c['avg'],1,',','').' (n='.$c['n'].')');
      }
      $openA=count($rep['actions']??[]);
      if($openA) $rows[]=$li('<b>'.$openA.'</b> offene Maßnahme'.($openA===1?'':'n').' aus den Berichten');
    }
    $miss=debriefs_missing(2);
    foreach(array_slice($miss,0,5) as $m){
      $rows[]=$li('Bericht fehlt: '.htmlspecialchars((($m['code']??'')?$m['code'].' · ':'').$m['topic'])
        .((($m['start_date']??'')!=='')?' ('.date('d.m.',strtotime($m['start_date'])).')':''));
    }
    $out.=$H('Trainingsberichte').($rows?implode('',$rows):$li('Alle gelaufenen Trainings sind bewertet ✓'));
  }
  if(in_array('passport',$parts,true)){
    $lead=(int)(config_get('passport_lead_days')??180); $rows=[];
    foreach(q("SELECT name,passport_expiry FROM trainers WHERE passport_expiry IS NOT NULL AND passport_expiry<>''")->fetchAll() as $trr){
      $exp=strtotime((string)$trr['passport_expiry']); if($exp===false) continue;
      $days=(int)floor(($exp-strtotime($today))/86400);
      if($days<=$lead) $rows[]=$li(htmlspecialchars($trr['name']).' - Reisepass '.($days<0?'<b>abgelaufen</b>':'läuft in <b>'.$days.' Tagen</b> ab'));
    }
    if($rows) $out.=$H('Reisepässe').implode('',array_slice($rows,0,8));
  }
  return $out;
}

/** Digest-Mail an einen Benutzer schicken (auch für die Probe-Mail genutzt). */
function digest_send(array $u): bool {
  $parts=json_decode($u['digest_parts']?:'[]',true)?:['staffing','ppt','inbox'];
  $first=explode(' ',trim((string)($u['name']??'')))[0]?:'';
  $dash=preg_replace('#/backend$#','',base_url());
  $html=email_html("Guten Morgen".($first?" $first":"").",\n\nhier dein aktueller ETAF-Überblick.",
    digest_build($parts).cta_button($dash,'Zum Cockpit'));
  $subj='ETAF Info - '.date('d.m.Y');
  $ok=send_email($u['email'],$u['name']??'',$subj,$html);
  $st=(cfg()['mail_mode']??'mail')==='log' ? 'logged' : ($ok?'sent':'failed');
  q("INSERT INTO email_log(training_id,trainer_id,to_email,subject,body,lang,status,created_at)
     VALUES(?,?,?,?,?,?,?,?)",[null,null,$u['email'],$subj,'Info-Mail (Digest)','de',$st,now()]);
  return $ok;
}


/** HTML-Block einer Auswertung für die Mail - kompakt, ohne Bilder,
 *  damit er in jedem Mailprogramm lesbar bleibt und sich drucken lässt. */
function report_mail_html(array $rep, string $title): string {
  $H=fn($t)=>'<div style="font-weight:800;font-size:15px;margin:18px 0 6px;color:#3e4852">'.$t.'</div>';
  $band=fn($v)=>$v===null?'#8a939a':($v>=4?'#2E9E6B':($v>=3?'#C77E1E':'#D81F26'));
  $num=fn($v)=>$v===null?'-':number_format((float)$v,1,',','');
  $out='<div style="font-family:Arial,Helvetica,sans-serif">'.$H($title);
  $cov = !empty($rep['due']) ? round(($rep['dueDone']??0)/$rep['due']*100).'%' : '-';
  $out.='<div style="font-size:14px;margin-bottom:4px">Ø Gesamteindruck: '
      .'<b style="color:'.$band($rep['overall']??null).';font-size:19px">'.$num($rep['overall']??null).'</b> / 5'
      .' · '.(int)($rep['n']??0).' Bericht'.(((int)($rep['n']??0))===1?'':'e').' · Abdeckung '.$cov.'</div>';

  // Bereiche
  if(!empty($rep['groups'])){
    $cells='';
    foreach(debrief_catalog()['groups'] as $g){
      $x=null; foreach($rep['groups'] as $gg) if($gg['key']===$g['key']) $x=$gg['avg'];
      $cells.='<td style="padding:6px 12px 6px 0;font-size:13px;color:#5c666e">'.htmlspecialchars($g['de'])
        .' <b style="color:'.$band($x).';font-size:15px">'.$num($x).'</b></td>';
    }
    $out.=$H('Bereiche').'<table role="presentation" cellpadding="0" cellspacing="0"><tr>'.$cells.'</tr></table>';
  }
  // Schwächste Werte
  $crit=$rep['criteria']??[];
  usort($crit, fn($a,$b)=>($a['avg']??9)<=>($b['avg']??9));
  $rows='';
  foreach(array_slice($crit,0,6) as $c){
    $w=max(2,(int)round(($c['avg']/5)*160));
    $rows.='<tr><td style="padding:3px 12px 3px 0;font-size:13px;color:#242b31">'.htmlspecialchars(debrief_label($c['key'])).'</td>'
      .'<td style="padding:3px 0"><div style="width:160px;background:#eef0f2;border-radius:4px;height:8px">'
      .'<div style="width:'.$w.'px;height:8px;border-radius:4px;background:'.$band($c['avg']).'"></div></div></td>'
      .'<td style="padding:3px 0 3px 10px;font-size:13px;font-weight:700;white-space:nowrap">'.$num($c['avg']).'<span style="color:#8a939a;font-weight:400"> n='.$c['n'].'</span></td></tr>';
  }
  if($rows) $out.=$H('Schwächste Werte').'<table role="presentation" cellpadding="0" cellspacing="0">'.$rows.'</table>';

  // Trainer
  if(!empty($rep['trainers'])){
    $tr='';
    foreach(array_slice($rep['trainers'],0,10) as $x){
      $tr.='<tr><td style="padding:3px 14px 3px 0;font-size:13px">'.htmlspecialchars($x['name']).'</td>'
        .'<td style="padding:3px 0;font-size:13px;font-weight:700;color:'.$band($x['avg']).'">'.$num($x['avg']).'</td></tr>';
    }
    $out.=$H('Trainerinnen und Trainer').'<table role="presentation" cellpadding="0" cellspacing="0">'.$tr.'</table>';
  }
  // Vorkommnisse und offene Maßnahmen
  if(!empty($rep['flags'])){
    $f=[]; foreach(array_slice($rep['flags'],0,8) as $x) $f[]=htmlspecialchars(debrief_label($x['key'])).' <b>'.$x['n'].'×</b>';
    $out.=$H('Häufigste Vorkommnisse').'<div style="font-size:13px;color:#5c666e">'.implode(' · ',$f).'</div>';
  }
  if(!empty($rep['actions'])){
    $a='';
    foreach(array_slice($rep['actions'],0,10) as $x){
      $a.='<div style="font-size:13px;padding:2px 0">• '.htmlspecialchars($x['text'])
        .' <span style="color:#8a939a">- '.htmlspecialchars($x['owner']?:'?')
        .($x['due']?', '.date('d.m.Y',strtotime($x['due'])):'').($x['code']?' ('.htmlspecialchars($x['code']).')':'').'</span></div>';
    }
    $out.=$H('Offene Maßnahmen').$a;
  }
  return $out.'</div>';
}

/** Quartals- und Jahresauswertung automatisch verschicken.
 *  Läuft in den ersten Tagen eines neuen Quartals genau einmal. */
function send_period_report(): int {
  if(config_get('period_report')==='0') return 0;   // in den Einstellungen abschaltbar
  $now=time();
  $q=(int)ceil(((int)gmdate('n',$now))/3);          // aktuelles Quartal 1..4
  $y=(int)gmdate('Y',$now);
  // Vorquartal bestimmen
  $pq=$q-1; $py=$y; if($pq<1){ $pq=4; $py--; }
  $from=sprintf('%04d-%02d-01',$py,($pq-1)*3+1);
  $to=date('Y-m-t', strtotime(sprintf('%04d-%02d-01',$py,($pq-1)*3+3)));
  $flag='period_report_'.$py.'Q'.$pq;
  if(config_get($flag)!==null) return 0;            // schon verschickt
  // Erst ab dem 2. Tag des neuen Quartals, damit späte Berichte noch eingehen
  if((int)gmdate('j',$now) < 2) return 0;

  $rep=debrief_report($from,$to,'','month');
  if((int)$rep['n']===0){ config_set($flag,now()); return 0; }   // nichts zu berichten

  $admins=q("SELECT email,name FROM users WHERE active=1 AND role='admin' AND email<>''")->fetchAll();
  if(!$admins) return 0;
  $dash=preg_replace('#/backend$#','',base_url());
  $title='Quartalsbericht '.$pq.'/'.$py;
  $sent=0;
  foreach($admins as $a){
    $first=explode(' ',trim((string)($a['name']??'')))[0]?:'';
    $html=email_html("Hallo".($first?" $first":"").",\n\n"
      ."hier die Auswertung aller Trainingsberichte aus dem Quartal "
      .date('d.m.Y',strtotime($from)).' - '.date('d.m.Y',strtotime($to)).".",
      report_mail_html($rep,$title).cta_button($dash,'Auswertung im Cockpit öffnen'));
    $subj='ETAF - '.$title;
    $ok=send_email($a['email'],$a['name']??'',$subj,$html);
    q("INSERT INTO email_log(training_id,trainer_id,to_email,subject,body,lang,status,created_at)
       VALUES(?,?,?,?,?,?,?,?)",[null,null,$a['email'],$subj,$title,'de',
       ((cfg()['mail_mode']??'mail')==='log'?'logged':($ok?'sent':'failed')),now()]);
    if($ok) $sent++;
  }
  config_set($flag,now());
  return $sent;
}


/**
 * PowerPoints nachhalten. Erinnerung an den zuständigen Trainer ab 14 Tagen
 * vor Fälligkeit, danach alle 4 Tage (höchstens 5x); bei Überfälligkeit
 * einmalig eine Eskalation an die Koordination. $force = Knopf "Jetzt
 * erinnern" im Cockpit: schickt sofort, unabhängig von Fenster und Kadenz.
 */
function ppt_chase(bool $force=false, int $onlyTraining=0): array {
  $REMIND_BEFORE=14*86400; $EVERY=4*86400; $MAX=5;
  $today=gmdate('Y-m-d'); $now=time();
  $trainings=[];
  foreach(q("SELECT * FROM trainings")->fetchAll() as $tg) $trainings[(string)$tg['id']]=$tg;

  $byTrainer=[];      // [tgId][trainerId] => [sessions...]
  $overdueAll=[];     // Eskalationsliste
  foreach(q("SELECT * FROM training_sessions ORDER BY training_id,sort,id")->fetchAll() as $s){
    $tg=$trainings[(string)$s['training_id']]??null;
    if(!$tg) continue;
    if($onlyTraining && (int)$tg['id']!==$onlyTraining) continue;
    if(!ppt_relevant($s)) continue;
    if(($s['ppt']??'')==='vorhanden') continue;
    $start=trim((string)($tg['start_date']??''));
    if($start!=='' && $start<$today) continue;              // Training läuft/vorbei
    $due=ppt_due_of($s,$tg);
    if($due==='') continue;
    $owners=ppt_owner_ids($s);                               // explizit oder aus dem Wochenplan
    if(!$owners) continue;                                   // ohne Zuständigen: nur im Cockpit sichtbar
    $overdue=$due<$today;
    if($overdue && !(int)($s['ppt_escalated']??0)) $overdueAll[]=['s'=>$s,'tg'=>$tg];
    if(!$force){
      if($now < strtotime($due.' UTC')-$REMIND_BEFORE) continue;    // noch nicht dran
      if((int)($s['ppt_remind_count']??0)>=$MAX) continue;
      $last=ts($s['ppt_reminded_at']??'');
      if($last && $now-$last<$EVERY) continue;
    }
    foreach($owners as $trId) $byTrainer[(string)$tg['id']][$trId][]=$s;
  }

  $sent=0; $stamped=[];   // je Session nur einmal zaehlen, auch bei mehreren Verantwortlichen
  foreach($byTrainer as $tgId=>$byTr){
    $tg=$trainings[$tgId];
    foreach($byTr as $trId=>$list){
      $od=false; foreach($list as $s){ if(ppt_due_of($s,$tg)<$today){ $od=true; break; } }
      if(ppt_send_reminder($tg,(int)$trId,$list,$od)){
        $sent++;
        foreach($list as $s){
          if(isset($stamped[(string)$s['id']])) continue;
          $stamped[(string)$s['id']]=1;
          q("UPDATE training_sessions SET ppt_reminded_at=?, ppt_remind_count=ppt_remind_count+1 WHERE id=?",[now(),$s['id']]);
        }
      }
    }
  }

  // Eskalation an die Koordination - je Session genau einmal
  $esc=0;
  if($overdueAll && !$force){
    $admins=q("SELECT email,name FROM users WHERE active=1 AND role='admin' AND email<>''")->fetchAll();
    if($admins){
      $tn=[]; foreach(q("SELECT id,name FROM trainers")->fetchAll() as $x) $tn[(string)$x['id']]=$x['name'];
      $li='';
      foreach($overdueAll as $o){
        $due=ppt_due_of($o['s'],$o['tg']);
        $li.='<div style="padding:3px 0;font-size:13px">- <b>'.htmlspecialchars($o['s']['title']).'</b> ('
          .htmlspecialchars((($o['tg']['code']??'')?:'').')').' - '
          .htmlspecialchars(implode(', ',array_map(fn($i)=>$tn[(string)$i]??'?',ppt_owner_ids($o['s'])))?:'?')
          .', fällig '.date('d.m.Y',strtotime($due)).'</div>';
      }
      $dash=preg_replace('#/backend$#','',base_url());
      foreach($admins as $a){
        $first=explode(' ',trim((string)($a['name']??'')))[0]?:'';
        $html=email_html("Hallo".($first?" $first":"").",\n\ndiese PowerPoints sind überfällig - die Trainer wurden bereits erinnert:",
          $li.cta_button($dash,'Folien-Übersicht im Cockpit'));
        $subj='ETAF - '.count($overdueAll).' PowerPoint'.(count($overdueAll)===1?'':'s').' überfällig';
        $ok=send_email($a['email'],$a['name']??'',$subj,$html);
        q("INSERT INTO email_log(training_id,trainer_id,to_email,subject,body,lang,status,created_at)
           VALUES(?,?,?,?,?,?,?,?)",[null,null,$a['email'],$subj,'PowerPoint-Eskalation','de',
           ((cfg()['mail_mode']??'mail')==='log'?'logged':($ok?'sent':'failed')),now()]);
        if($ok)$esc++;
      }
      foreach($overdueAll as $o) q("UPDATE training_sessions SET ppt_escalated=1 WHERE id=?",[$o['s']['id']]);
    }
  }
  return ['reminded'=>$sent,'escalated'=>$esc];
}

function run_automation(): array {
  $reminderH=(int)(config_get('reminder_hours') ?? 48);
  $escalateH=(int)(config_get('escalate_hours') ?? 72);
  $autoAdv  =(config_get('auto_advance')==='1');
  $now=time();
  $reminded=0; $advanced=0;

  /* 1) Erinnerungen: 'asked' älter als reminderH, noch nicht erinnert */
  $rows=q("SELECT r.*, t.topic,t.city,t.country,t.kw,t.month,t.need_cnt,
             tr.name AS tname, tr.email AS temail
           FROM requests r
           JOIN trainings t ON t.id=r.training_id
           JOIN trainers  tr ON tr.id=r.trainer_id
           WHERE r.status='asked'")->fetchAll();
  foreach($rows as $r){
    if(!$r['created_at']) continue;
    $ageH=($now-ts($r['created_at']))/3600;
    if($ageH>=$reminderH && (int)($r['reminder_count']??0)<1){
      $lang=($r['lang']==='de')?'de':'en';
      $tg=['topic'=>$r['topic'],'city'=>$r['city'],'country'=>$r['country'],
           'kw'=>kw_label($r['kw'],$lang),'month'=>$r['month'],'need_cnt'=>$r['need_cnt']];
      $tr=['name'=>$r['tname']];
      $subj=fill_tpl($lang==='de'
        ? 'Erinnerung: Verfügbarkeit - {{topic}} ({{city}})'
        : 'Reminder: availability - {{topic}} ({{city}})', $tg,$tr);
      $bodyText=fill_tpl($lang==='de'
        ? "Hallo {{firstName}},\n\nkurze Erinnerung zu unserer Anfrage für „{{topic}}“ in {{city}} ({{kw}}). Bist du verfügbar? Ein Klick unten genügt."
        : "Hi {{firstName}},\n\njust a quick reminder about our request for \"{{topic}}\" in {{city}} ({{kw}}). Are you available? One click below is enough.",
        $tg,$tr);
      $html=email_html($bodyText, response_buttons($r['tok'],$lang));
      $ok=send_email($r['temail'],$r['tname'],$subj,$html);
      q("INSERT INTO email_log(training_id,trainer_id,to_email,subject,body,lang,status,created_at)
         VALUES(?,?,?,?,?,?,?,?)",
        [$r['training_id'],$r['trainer_id'],$r['temail'],$subj,$bodyText,$lang,$ok?'sent':'failed',now()]);
      q("UPDATE requests SET reminded_at=?, reminder_count=COALESCE(reminder_count,0)+1 WHERE id=?",[now(),$r['id']]);
      if($ok)$reminded++;
    }
  }

  /* 3) Visum-Erinnerungen: UAE-Trainings, bestätigte Trainer ohne genehmigtes Visum (einmalig) */
  $visa=0;
  $vrows=q("SELECT r.trainer_id, r.lang, t.id AS tid, t.topic, t.city, t.country, t.kw, t.month, t.need_cnt,
              tr.name AS tname, tr.email AS temail,
              tv.id AS tvid, tv.visa_status, tv.visa_reminded
            FROM requests r
            JOIN trainings t ON t.id=r.training_id
            JOIN trainers  tr ON tr.id=r.trainer_id
            LEFT JOIN travel tv ON tv.training_id=r.training_id AND tv.trainer_id=r.trainer_id
            WHERE t.country IN('UAE','KSA') AND r.status IN('yes','confirmed')")->fetchAll();
  foreach($vrows as $r){
    if(($r['visa_status']??'none')==='approved') continue;
    if((int)($r['visa_reminded']??0)===1) continue;
    $lang=($r['lang']==='de')?'de':'en';
    $tg=['topic'=>$r['topic'],'city'=>$r['city'],'country'=>$r['country'],'kw'=>kw_label($r['kw'],$lang),'month'=>$r['month'],'need_cnt'=>$r['need_cnt']];
    $tr=['name'=>$r['tname']];
    $subj=fill_tpl($lang==='de'?'Visum & Reisepass - {{topic}} in {{city}}':'Visa & passport - {{topic}} in {{city}}',$tg,$tr);
    $bodyText=fill_tpl($lang==='de'
      ? "Hallo {{firstName}},\n\nfür „{{topic}}“ in {{city}} ({{kw}}) benötigen wir für dein Visum bitte eine Kopie deines Reisepasses (mind. 6 Monate gültig). Schick sie uns möglichst bald - wir kümmern uns dann um den Rest."
      : "Hi {{firstName}},\n\nfor \"{{topic}}\" in {{city}} ({{kw}}) we need a copy of your passport (valid at least 6 months) for your visa. Please send it to us soon - we'll take care of the rest.",
      $tg,$tr);
    $ok=send_email($r['temail'],$r['tname'],$subj,email_html($bodyText,''));
    q("INSERT INTO email_log(training_id,trainer_id,to_email,subject,body,lang,status,created_at)
       VALUES(?,?,?,?,?,?,?,?)",[$r['tid'],$r['trainer_id'],$r['temail'],$subj,$bodyText,$lang,$ok?'sent':'failed',now()]);
    if($r['tvid']) q("UPDATE travel SET visa_reminded=1 WHERE id=?",[$r['tvid']]);
    else q("INSERT INTO travel(training_id,trainer_id,visa_status,visa_reminded,updated_at) VALUES(?,?, 'needed',1,?)",[$r['tid'],$r['trainer_id'],now()]);
    if($ok)$visa++;
  }

  /* 2b) Transfer-Erinnerung: Kunden, die den Erhalt noch nicht bestätigt haben */
  $transfer=0;
  foreach(q("SELECT * FROM transfer_tokens WHERE confirmed_at IS NULL AND sent_at IS NOT NULL")->fetchAll() as $tt){
    if(!$tt['sent_at']) continue;
    if(($now-ts($tt['sent_at']))/3600 < $reminderH) continue;      // noch zu frisch
    if(!empty($tt['reminded_at']) && ($now-ts($tt['reminded_at']))/3600 < $reminderH) continue; // schon erinnert
    $res=transfer_send((string)$tt['client_id'], 'en', true);
    if(!empty($res['ok']) && !empty($res['sent'])) $transfer++;
  }

  /* 4) Reisepass-Erinnerungen: Trainer, deren Pass bald abläuft (oder abgelaufen ist).
        Vorlauf konfigurierbar (passport_lead_days, Standard 180 Tage = 6 Monate).
        Wiederholung höchstens alle 30 Tage, damit niemand zugespamt wird. */
  $passport=0;
  $lead=(int)(config_get('passport_lead_days') ?? 180);
  $today=strtotime('today');
  foreach(q("SELECT * FROM trainers WHERE passport_expiry IS NOT NULL AND passport_expiry<>''")->fetchAll() as $tr){
    $exp=strtotime((string)$tr['passport_expiry']);
    if($exp===false) continue;
    $daysLeft=(int)floor(($exp-$today)/86400);
    if($daysLeft>$lead) continue;                                    // noch genug Vorlauf
    if(!empty($tr['passport_reminded_at']) && ($now-ts($tr['passport_reminded_at']))/86400 < 30) continue; // schon erinnert
    if(empty($tr['email'])) continue;
    $fn=explode(' ', preg_replace('/^Dr\.\s*/','',trim((string)$tr['name'])))[0];
    $lang=(($tr['pref_lang']??'')==='en')?'en':'de';
    if($lang==='de'){
      $expNice=date('d.m.Y',$exp);
      if($daysLeft<0){
        $subj='Reisepass abgelaufen - bitte erneuern';
        $lead1="dein Reisepass ist am $expNice abgelaufen.";
        $lead2="Bitte beantrage zeitnah einen neuen Pass und schick uns anschließend ein Foto der Datenseite - wir hinterlegen es dann in deinem Profil.";
      } else {
        $subj='Reisepass läuft bald ab - rechtzeitig erneuern';
        $lead1="dein Reisepass läuft am $expNice ab (in $daysLeft Tagen).";
        $lead2="Für Einsätze im Ausland (z.B. UAE) sollte der Pass bei der Einreise noch mindestens 6 Monate gültig sein. Bitte beantrage rechtzeitig einen neuen Pass und schick uns danach ein Foto der Datenseite - wir hinterlegen es dann in deinem Profil.";
      }
      $bodyText="Hallo $fn,\n\n$lead1\n\n$lead2\n\nVielen Dank!\nETAF-Koordination";
    } else {
      $expNice=date('d M Y',$exp);
      if($daysLeft<0){
        $subj='Passport expired - please renew';
        $lead1="your passport expired on $expNice.";
        $lead2="Please apply for a new passport soon and send us a photo of the data page afterwards - we'll store it in your profile.";
      } else {
        $subj='Passport expiring soon - please renew in time';
        $lead1="your passport expires on $expNice (in $daysLeft days).";
        $lead2="For assignments abroad (e.g. UAE) the passport should be valid for at least 6 more months on entry. Please apply for a new passport in time and send us a photo of the data page afterwards - we'll store it in your profile.";
      }
      $bodyText="Hi $fn,\n\n$lead1\n\n$lead2\n\nThank you!\nETAF Coordination";
    }
    $ok=send_email($tr['email'],$tr['name'],$subj,email_html($bodyText,''));
    q("INSERT INTO email_log(training_id,trainer_id,to_email,subject,body,lang,status,created_at)
       VALUES(?,?,?,?,?,?,?,?)",[0,$tr['id'],$tr['email'],$subj,$bodyText,$lang,$ok?'sent':'failed',now()]);
    q("UPDATE trainers SET passport_reminded_at=? WHERE id=?",[now(),$tr['id']]);
    if($ok)$passport++;
  }

  /* 2) Nachrücken (optional): pro unterbesetztem Training den nächstbesten Trainer anfragen */
  if($autoAdv){
    foreach(q("SELECT * FROM trainings")->fetchAll() as $tg){
      $tgId=(int)$tg['id'];
      $yes=(int)q("SELECT COUNT(*) c FROM requests WHERE training_id=? AND status IN('yes','confirmed')",[$tgId])->fetch()['c'];
      if($yes>=(int)$tg['need_cnt']) continue;
      $active=(int)q("SELECT COUNT(*) c FROM requests WHERE training_id=? AND status IN('asked','maybe','yes','confirmed')",[$tgId])->fetch()['c'];
      // Lücken = Absagen + überfällige Anfragen
      $gaps=0;
      foreach(q("SELECT status,created_at FROM requests WHERE training_id=?",[$tgId])->fetchAll() as $r){
        if($r['status']==='no'){ $gaps++; continue; }
        if($r['status']==='asked' && $r['created_at']){
          if(($now-ts($r['created_at']))/3600 >= $escalateH) $gaps++;
        }
      }
      $needMore=max(0,(int)$tg['need_cnt']-$active);
      $toAdd=min($gaps,$needMore);
      for($i=0;$i<$toAdd;$i++){
        $cand=next_candidate($tgId);
        if(!$cand) break;
        $lang='en';
        $tg['kw']=kw_label($tg['kw']??'','en');
        $tok=token(40);
        q("INSERT INTO requests(training_id,trainer_id,status,lang,tok,created_at) VALUES(?,?, 'asked',?,?,?)",
          [$tgId,$cand['id'],$lang,$tok,now()]);
        $subj=fill_tpl('Availability request - {{topic}} ({{city}}, {{kw}})',$tg,$cand);
        $bodyText=fill_tpl(
          "Hi {{firstName}},\n\nwe're planning \"{{topic}}\" in {{city}} ({{kw}}) and would love to have you on the team. Are you available? One click below is enough.",
          $tg,$cand);
        $html=email_html($bodyText, response_buttons($tok,$lang));
        $ok=send_email($cand['email'],$cand['name'],$subj,$html);
        q("INSERT INTO email_log(training_id,trainer_id,to_email,subject,body,lang,status,created_at)
           VALUES(?,?,?,?,?,?,?,?)",
          [$tgId,$cand['id'],$cand['email'],$subj,$bodyText,$lang,$ok?'sent':'failed',now()]);
        if($ok)$advanced++;
      }
    }
  }
  /* 5) Flugpost: Postfach abrufen, Flugbestätigungen erkennen (falls konfiguriert) */
  $mailFetched=0; $mailFlights=0;
  if(!empty(cfg()['mailbox']['host']) && !empty(cfg()['mailbox']['pass'])){
    require_once __DIR__.'/mailfetch.php';
    try{ $mp=poll_mailbox(); $mailFetched=(int)($mp['fetched']??0); $mailFlights=(int)($mp['flights']??0); }
    catch(Throwable $e){ /* Postfach-Störung darf den Rest der Automatik nicht stoppen */ }
  }

  /* 6) Tägliche Datensicherung (kompletter DB-Dump nach backend/backups/) */
  $backupFile='';
  try{
    if(config_get('last_backup_day')!==gmdate('Y-m-d')){
      require_once __DIR__.'/backup.php';
      $b=backup_run();
      if(!empty($b['ok'])){ config_set('last_backup_day',gmdate('Y-m-d')); $backupFile=$b['file']; }
    }
  }catch(Throwable $e){ /* Sicherung darf den Rest der Automatik nicht stoppen */ }

  /* 6b) Info-Mails (Digest) je Benutzer - morgens, gemäß eingestelltem Rhythmus */
  $digestSent=0;
  try{
    if((int)gmdate('H')>=5){                       // frühestens ~07:00 deutscher Zeit
      $todayD=gmdate('Y-m-d');
      foreach(q("SELECT * FROM users WHERE active=1 AND email<>'' AND digest_freq IS NOT NULL AND digest_freq<>'off'")->fetchAll() as $u){
        $lastDay=substr((string)($u['digest_last']??''),0,10);
        if($lastDay===$todayD) continue;           // heute schon verschickt
        $due = ($u['digest_freq']==='daily')
          || ($u['digest_freq']==='every2' && (!$lastDay || (strtotime($todayD)-strtotime($lastDay))>=2*86400))
          || ($u['digest_freq']==='weekly' && (int)gmdate('N')===max(1,min(7,(int)($u['digest_day']?:1))));
        if(!$due) continue;
        if(digest_send($u)){ q("UPDATE users SET digest_last=? WHERE id=?",[now(),$u['id']]); $digestSent++; }
      }
    }
  }catch(Throwable $e){ /* Digest darf den Rest nicht stoppen */ }

  /* 6b2) PowerPoints nachhalten (Erinnerung an Trainer + Eskalation) */
  $pptRes=['reminded'=>0,'escalated'=>0];
  try{ $pptRes=ppt_chase(); }catch(Throwable $e){ /* darf den Rest nicht stoppen */ }

  /* 6c) Erinnerung: Training vorbei, aber kein Bericht. Geht an die Koordination
         (Admins mit E-Mail) und nur einmal je Training. */
  $debriefPing=0;
  try{
    $grace=(int)(config_get('debrief_grace_days') ?? 3);
    $missing=debriefs_missing($grace);
    if($missing){
      $admins=q("SELECT email,name FROM users WHERE active=1 AND role='admin' AND email<>''")->fetchAll();
      $dash=preg_replace('#/backend$#','',base_url());
      foreach($missing as $m){
        $flag='debrief_ping_'.(int)$m['id'];
        if(config_get($flag)!==null) continue;              // schon erinnert
        $title=(($m['code']??'')?$m['code'].' - ':'').$m['topic'];
        foreach($admins as $a){
          $html=email_html("Hallo ".(explode(' ',trim((string)($a['name']??'')))[0]?:'')."\n\n"
            ."„".$title."\" in ".($m['city']??'')." ist beendet - ein Trainingsbericht fehlt noch. "
            ."Er dauert nur zwei Minuten und ist die Grundlage für die Wochen-, Monats- und Jahresauswertung.",
            cta_button($dash,'Bericht ausfüllen'));
          $subj='ETAF - Trainingsbericht offen: '.$title;
          $ok=send_email($a['email'],$a['name']??'',$subj,$html);
          q("INSERT INTO email_log(training_id,trainer_id,to_email,subject,body,lang,status,created_at)
             VALUES(?,?,?,?,?,?,?,?)",[(int)$m['id'],null,$a['email'],$subj,'Erinnerung Trainingsbericht','de',
             ((cfg()['mail_mode']??'mail')==='log'?'logged':($ok?'sent':'failed')),now()]);
          if($ok) $debriefPing++;
        }
        config_set($flag, now());
      }
    }
  }catch(Throwable $e){ /* Erinnerung darf den Rest nicht stoppen */ }

  /* 6d) Quartalsbericht (einmal je Quartal an die Koordination) */
  $periodRep=0;
  try{ $periodRep=send_period_report(); }catch(Throwable $e){ /* darf den Rest nicht stoppen */ }

  /* 7) Aufräumen: abgelaufene Sitzungen, alte Einmal-Links, alte Login-Sperren */
  try{
    $maxDays=(int)(cfg()['session_days']??14);
    q("DELETE FROM sessions WHERE created_at < ?",[gmdate('Y-m-d H:i:s', $now-$maxDays*86400)]);
    q("DELETE FROM reset_tokens WHERE created_at < ?",[gmdate('Y-m-d H:i:s', $now-86400)]);
    q("DELETE FROM login_attempts WHERE window_start < ?",[gmdate('Y-m-d H:i:s', $now-3600)]);
    // Rückgängig-Stände nur für die jüngsten 300 Änderungen vorhalten - die
    // Protokollzeilen selbst bleiben vollständig erhalten.
    $keep=q("SELECT id FROM activity WHERE undo_before IS NOT NULL ORDER BY id DESC LIMIT 300")->fetchAll(PDO::FETCH_COLUMN);
    if(count($keep)>=300){
      q("UPDATE activity SET undo_before=NULL, undo_after=NULL, undo_spec=NULL WHERE undo_before IS NOT NULL AND id < ?",
        [min(array_map('intval',$keep))]);
    }
  }catch(Throwable $e){}

  return ['ok'=>true,'reminded'=>$reminded,'advanced'=>$advanced,'visa'=>$visa,'transfer'=>$transfer,
          'passport'=>$passport,'mail_fetched'=>$mailFetched,'mail_flights'=>$mailFlights,
          'digest'=>$digestSent,'debrief_ping'=>$debriefPing,'period_report'=>$periodRep,
          'ppt_reminded'=>$pptRes['reminded'],'ppt_escalated'=>$pptRes['escalated'],'backup'=>$backupFile,'auto_advance'=>$autoAdv];
}
