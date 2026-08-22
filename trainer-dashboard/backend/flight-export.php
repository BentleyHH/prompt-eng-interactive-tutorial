<?php
/**
 * ETAF - Flugdaten-Export (Excel) je Trainingswoche
 * Aufruf: flight-export.php?training=<id>&lang=de|en
 * Auth: Sitzungs-Header X-Auth-Token (die Oberflaeche laedt per fetch,
 * damit kein Token in der URL landet).
 */
require_once __DIR__.'/lib.php';
ensure_schema();
require_auth();
$tgId=(int)($_GET['training']??0);
$lang=($_GET['lang']??'de')==='en'?'en':'de';
[$file,$bin]=flight_xlsx($tgId,$lang);
audit('travel.flightExport','training',(string)$tgId,'Flugdaten-Excel heruntergeladen');
header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
header('Content-Disposition: attachment; filename="'.$file.'"');
header('Content-Length: '.strlen($bin));
header('X-Content-Type-Options: nosniff');
echo $bin;
