<?php
/**
 * ETAF - iCal-Feed (Abo-Link) für Google/Apple/Outlook.
 * Aufruf:  ics.php?key=<ics_key>[&client=<client_id>]
 * Liefert einen abonnierbaren, sich automatisch aktualisierenden Kalender.
 * Farbe/Kategorie je Kunde. Kein Login - durch den Schlüssel geschützt.
 */
require_once __DIR__.'/lib.php';
ensure_schema();

$key = (string)($_GET['key'] ?? '');
$cfgKey = (string)(cfg()['ics_key'] ?? '');
if($cfgKey==='' || !hash_equals($cfgKey, $key)){
  http_response_code(403);
  header('Content-Type: text/plain; charset=utf-8');
  echo "Forbidden. Gültigen ?key= angeben (ics_key in config.php setzen).";
  exit;
}

$clientId  = isset($_GET['client']) ? (string)$_GET['client'] : '';
$trainerId = isset($_GET['trainer']) ? (int)$_GET['trainer'] : 0;   // persönlicher Feed: nur Zusagen dieses Trainers

/* ISO-Woche → Montag (UTC) */
function iso_week_monday(int $year, int $week): DateTimeImmutable {
  $d = new DateTimeImmutable(sprintf('%04d-01-01', $year), new DateTimeZone('UTC'));
  $d = $d->modify('+'.(($week-1)*7).' days');
  $dow = (int)$d->format('N'); // 1..7
  return $dow<=4 ? $d->modify('-'.($dow-1).' days') : $d->modify('+'.(8-$dow).' days');
}
function ics_esc(string $s): string {
  return str_replace(["\\",";",",","\r\n","\n"], ["\\\\","\\;","\\,","\\n","\\n"], $s);
}
function training_year(array $tg): int {
  if(preg_match('/(\d{2})\D*$/', (string)($tg['month']??''), $m)) return 2000 + (int)$m[1];
  return (int)gmdate('Y');
}
function training_week(array $tg): int {
  $n = (int)preg_replace('/\D/','', (string)($tg['kw']??''));
  return $n>0 ? $n : 1;
}

$clients = [];
foreach(q("SELECT * FROM clients")->fetchAll() as $c){ $clients[$c['id']] = $c; }

if($trainerId>0){
  $rows = q("SELECT DISTINCT t.* FROM trainings t
             JOIN requests r ON r.training_id=t.id
             WHERE r.trainer_id=? AND r.status IN('yes','confirmed')".($clientId!==''?" AND t.client_id=?":""),
            $clientId!=='' ? [$trainerId,$clientId] : [$trainerId])->fetchAll();
  $trRow = q("SELECT name FROM trainers WHERE id=?",[$trainerId])->fetch();
  $calName = 'ETAF Einsätze'.($trRow?' · '.$trRow['name']:'');
} else {
  $sql = "SELECT * FROM trainings";
  $params = [];
  if($clientId!==''){ $sql .= " WHERE client_id=?"; $params[]=$clientId; }
  $rows = q($sql, $params)->fetchAll();
  $calName = 'ETAF Trainings'.($clientId!=='' && isset($clients[$clientId]) ? ' · '.$clients[$clientId]['name'] : '');
}
$stamp = gmdate('Ymd\THis\Z');

$out = ["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//ETAF//Trainer-Koordination//DE",
  "CALSCALE:GREGORIAN","METHOD:PUBLISH","X-WR-CALNAME:".ics_esc($calName),
  "X-WR-TIMEZONE:UTC"];

foreach($rows as $tg){
  if(!empty($tg['start_date']) && preg_match('/^\d{4}-\d{2}-\d{2}$/', $tg['start_date'])){
    $start = new DateTimeImmutable($tg['start_date'], new DateTimeZone('UTC'));
    $endBase = (!empty($tg['end_date']) && preg_match('/^\d{4}-\d{2}-\d{2}$/', $tg['end_date']))
      ? new DateTimeImmutable($tg['end_date'], new DateTimeZone('UTC')) : $start;
    $end = $endBase->modify('+1 day'); // DTEND exklusiv
  } else {
    $start = iso_week_monday(training_year($tg), training_week($tg));
    $end   = $start->modify('+2 days'); // 2-Tage-Training, DTEND exklusiv
  }
  $cl    = ($tg['client_id']!==null && isset($clients[$tg['client_id']])) ? $clients[$tg['client_id']] : null;
  $yes   = (int)q("SELECT COUNT(*) c FROM requests WHERE training_id=? AND status IN('yes','confirmed')",[$tg['id']])->fetch()['c'];
  $summary = ($cl ? $cl['short'].' · ' : '').$tg['topic'];
  $desc = $tg['spec'].' - '.$yes.'/'.$tg['need_cnt'].($cl ? ' · '.$cl['name'] : '');

  $out[] = "BEGIN:VEVENT";
  $out[] = "UID:tg".$tg['id']."@etaf-trainer";
  $out[] = "DTSTAMP:".$stamp;
  $out[] = "DTSTART;VALUE=DATE:".$start->format('Ymd');
  $out[] = "DTEND;VALUE=DATE:".$end->format('Ymd');
  $out[] = "SUMMARY:".ics_esc($summary);
  $out[] = "LOCATION:".ics_esc($tg['city'].', '.$tg['country']);
  $out[] = "CATEGORIES:".ics_esc($cl ? $cl['name'] : 'ETAF');
  if($cl && !empty($cl['cal'])) $out[] = "COLOR:".$cl['cal'];
  $out[] = "DESCRIPTION:".ics_esc($desc);
  $out[] = "END:VEVENT";
}
$out[] = "END:VCALENDAR";

header('Content-Type: text/calendar; charset=utf-8');
header('Content-Disposition: inline; filename="etaf-trainings.ics"');
echo implode("\r\n", $out)."\r\n";
