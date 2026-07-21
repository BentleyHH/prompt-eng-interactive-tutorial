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
    $ageH=($now-strtotime($r['created_at']))/3600;
    if($ageH>=$reminderH && (int)($r['reminder_count']??0)<1){
      $lang=($r['lang']==='de')?'de':'en';
      $tg=['topic'=>$r['topic'],'city'=>$r['city'],'country'=>$r['country'],
           'kw'=>$r['kw'],'month'=>$r['month'],'need_cnt'=>$r['need_cnt']];
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
          if(($now-strtotime($r['created_at']))/3600 >= $escalateH) $gaps++;
        }
      }
      $needMore=max(0,(int)$tg['need_cnt']-$active);
      $toAdd=min($gaps,$needMore);
      for($i=0;$i<$toAdd;$i++){
        $cand=next_candidate($tgId);
        if(!$cand) break;
        $lang='en';
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
  return ['ok'=>true,'reminded'=>$reminded,'advanced'=>$advanced,'auto_advance'=>$autoAdv];
}
