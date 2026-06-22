<?php
require __DIR__ . '/_bootstrap.php';
require_auth();

$action = $_GET['action'] ?? 'speak';
$o   = $CONFIG['openai'] ?? [];
$key = trim((string)($o['api_key'] ?? ''));

// Frontend fragt, ob Premium-Stimme verfügbar ist + welche Stimmen es gibt.
if ($action === 'info') {
    ok([
        'available' => $key !== '',
        'voices'    => ['alloy', 'ash', 'ballad', 'coral', 'echo', 'fable', 'nova', 'onyx', 'sage', 'shimmer'],
        'default'   => $o['voice'] ?? 'alloy',
    ]);
}

// Text -> gesprochenes Audio (MP3) erzeugen.
if ($key === '') fail(503, 'Premium-Stimme nicht konfiguriert (kein OpenAI-Key in config.php).');

$in   = body();
$text = trim((string)($in['text'] ?? ''));
if ($text === '') fail(400, 'text fehlt.');
$voice = preg_replace('/[^a-z]/', '', strtolower((string)($in['voice'] ?? ($o['voice'] ?? 'alloy')))) ?: 'alloy';
$model = $o['tts_model'] ?? 'gpt-4o-mini-tts';

$payload = [
    'model'           => $model,
    'voice'           => $voice,
    'input'           => mb_substr($text, 0, 1500),
    'response_format' => 'mp3',
];
$ch = curl_init('https://api.openai.com/v1/audio/speech');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_HTTPHEADER     => [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $key,
    ],
    CURLOPT_POSTFIELDS     => json_encode($payload, JSON_UNESCAPED_UNICODE),
    CURLOPT_TIMEOUT        => 60,
]);
$res  = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$err  = curl_error($ch);
curl_close($ch);

if ($res === false) fail(502, 'TTS nicht erreichbar.', ['detail' => $err]);
if ($code !== 200) {
    $j = json_decode($res, true);
    fail(502, 'TTS-Fehler: ' . ($j['error']['message'] ?? ('HTTP ' . $code)));
}

// Binär ausliefern (überschreibt den JSON-Content-Type aus _bootstrap).
header('Content-Type: audio/mpeg');
header('Content-Length: ' . strlen($res));
echo $res;
exit;
