<?php
/**
 * ETAF - Teilnehmerliste als Excel-Vorlage.
 * Aufruf: students-template.php?token=<Sitzung>&lang=de|en
 *
 * Die Datei geht an den Kunden, ausgefuellt kommt sie zurueck und wird im
 * Cockpit unter Zertifizierung -> Teilnehmer -> Liste einlesen eingelesen.
 * Spalten und Bedeutung stehen in lib.php (stud_cols) - Vorlage und Import
 * koennen deshalb nicht auseinanderlaufen.
 */
require_once __DIR__.'/lib.php';
ensure_schema();
require_auth();

$lang = (($_GET['lang'] ?? 'de')==='en') ? 'en' : 'de';
$bin  = stud_template_xlsx($lang);
$name = $lang==='en' ? 'ETAF-participant-list-template.xlsx' : 'ETAF-Teilnehmerliste-Vorlage.xlsx';

header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
header('Content-Disposition: attachment; filename="'.$name.'"');
header('Content-Length: '.strlen($bin));
header('Cache-Control: no-store');
echo $bin;
