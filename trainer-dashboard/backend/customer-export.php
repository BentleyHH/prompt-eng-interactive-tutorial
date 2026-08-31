<?php
/**
 * ETAF - Kundenbereich: Excel-Downloads (Teilnehmer-Stand, Zertifikatsregister,
 * Nachweisregister, Wochenpaket, Flugdaten).
 * Aufruf: customer-export.php?type=students|certs|register|week|flight[&training=<id>]
 * Auth: X-Auth-Token-Header + Freigabe "darf sehen".
 */
require_once __DIR__.'/lib.php';
ensure_schema();
require_cust_view();
$type=(string)($_GET['type']??'');
$tgId=(int)($_GET['training']??0);
[$file,$bin]=cust_gen_attachment($type,$tgId);
audit('cust.export','cust','','Export heruntergeladen: '.$file);
header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
header('Content-Disposition: attachment; filename="'.$file.'"');
header('Content-Length: '.strlen($bin));
header('X-Content-Type-Options: nosniff');
echo $bin;
