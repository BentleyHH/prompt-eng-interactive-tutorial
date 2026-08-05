<?php
/**
 * ETAF — Automatik: Erinnerungen nach X Stunden + automatisches Nachrücken.
 * Wird per Cron (cron.php) oder Button (api.php?action=automation.run) ausgelöst.
 */
require_once __DIR__.'/lib.php';
require_once __DIR__.'/mailer.php';

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
        ? 'Erinnerung: Verfügbarkeit — {{topic}} ({{city}})'
        : 'Reminder: availability — {{topic}} ({{city}})', $tg,$tr);
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
    $subj=fill_tpl($lang==='de'?'Visum & Reisepass — {{topic}} in {{city}}':'Visa & passport — {{topic}} in {{city}}',$tg,$tr);
    $bodyText=fill_tpl($lang==='de'
      ? "Hallo {{firstName}},\n\nfür „{{topic}}“ in {{city}} ({{kw}}) benötigen wir für dein Visum bitte eine Kopie deines Reisepasses (mind. 6 Monate gültig). Schick sie uns möglichst bald — wir kümmern uns dann um den Rest."
      : "Hi {{firstName}},\n\nfor \"{{topic}}\" in {{city}} ({{kw}}) we need a copy of your passport (valid at least 6 months) for your visa. Please send it to us soon — we'll take care of the rest.",
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
        $subj='Reisepass abgelaufen — bitte erneuern';
        $lead1="dein Reisepass ist am $expNice abgelaufen.";
        $lead2="Bitte beantrage zeitnah einen neuen Pass und schick uns anschließend ein Foto der Datenseite — wir hinterlegen es dann in deinem Profil.";
      } else {
        $subj='Reisepass läuft bald ab — rechtzeitig erneuern';
        $lead1="dein Reisepass läuft am $expNice ab (in $daysLeft Tagen).";
        $lead2="Für Einsätze im Ausland (z.B. UAE) sollte der Pass bei der Einreise noch mindestens 6 Monate gültig sein. Bitte beantrage rechtzeitig einen neuen Pass und schick uns danach ein Foto der Datenseite — wir hinterlegen es dann in deinem Profil.";
      }
      $bodyText="Hallo $fn,\n\n$lead1\n\n$lead2\n\nVielen Dank!\nETAF-Koordination";
    } else {
      $expNice=date('d M Y',$exp);
      if($daysLeft<0){
        $subj='Passport expired — please renew';
        $lead1="your passport expired on $expNice.";
        $lead2="Please apply for a new passport soon and send us a photo of the data page afterwards — we'll store it in your profile.";
      } else {
        $subj='Passport expiring soon — please renew in time';
        $lead1="your passport expires on $expNice (in $daysLeft days).";
        $lead2="For assignments abroad (e.g. UAE) the passport should be valid for at least 6 more months on entry. Please apply for a new passport in time and send us a photo of the data page afterwards — we'll store it in your profile.";
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
        $subj=fill_tpl('Availability request — {{topic}} ({{city}}, {{kw}})',$tg,$cand);
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

  /* 7) Aufräumen: abgelaufene Sitzungen, alte Einmal-Links, alte Login-Sperren */
  try{
    $maxDays=(int)(cfg()['session_days']??14);
    q("DELETE FROM sessions WHERE created_at < ?",[gmdate('Y-m-d H:i:s', $now-$maxDays*86400)]);
    q("DELETE FROM reset_tokens WHERE created_at < ?",[gmdate('Y-m-d H:i:s', $now-86400)]);
    q("DELETE FROM login_attempts WHERE window_start < ?",[gmdate('Y-m-d H:i:s', $now-3600)]);
  }catch(Throwable $e){}

  return ['ok'=>true,'reminded'=>$reminded,'advanced'=>$advanced,'visa'=>$visa,'transfer'=>$transfer,
          'passport'=>$passport,'mail_fetched'=>$mailFetched,'mail_flights'=>$mailFlights,
          'backup'=>$backupFile,'auto_advance'=>$autoAdv];
}
