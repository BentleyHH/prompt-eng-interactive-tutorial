<?php
/**
 * ETAF — Cron-Endpunkt für die Automatik (Erinnerungen + Nachrücken).
 * Auf artfiles als Cronjob einrichten, z.B. stündlich:
 *   curl -s "https://deine-domain.de/dashboard/backend/cron.php?key=DEIN_CRON_KEY"
 * Der Schlüssel steht in config.php (cron_key).
 */
require_once __DIR__.'/lib.php';
require_once __DIR__.'/automation.php';

try { ensure_schema(); }
catch(Throwable $e){ http_response_code(500); echo 'db error'; exit; }

$key=$_GET['key'] ?? '';
$expected=(string)(cfg()['cron_key'] ?? '');
if($key==='' || $expected==='' || !hash_equals($expected,$key)){
  http_response_code(403); echo 'forbidden'; exit;
}

$res=run_automation();
header('Content-Type: application/json; charset=utf-8');
echo json_encode($res, JSON_UNESCAPED_UNICODE);
