<?php
// Gemeinsame Basis für alle API-Endpunkte: Config laden, DB verbinden,
// JSON-Helfer, Auth-Prüfung und der Aufruf der Claude API.

declare(strict_types=1);
mb_internal_encoding('UTF-8');
date_default_timezone_set('UTC');

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

// Preflight (falls Frontend mal auf anderer Domain läuft)
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers: Content-Type, X-Auth-Token');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    http_response_code(204);
    exit;
}

function fail(int $code, string $msg, array $extra = []): void {
    http_response_code($code);
    echo json_encode(array_merge(['error' => $msg], $extra), JSON_UNESCAPED_UNICODE);
    exit;
}

function ok($data = []): void {
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function body(): array {
    $raw = file_get_contents('php://input');
    if ($raw === '' || $raw === false) return [];
    $j = json_decode($raw, true);
    return is_array($j) ? $j : [];
}

// --- Konfiguration -------------------------------------------------------
$cfgPath = __DIR__ . '/config.php';
if (!file_exists($cfgPath)) {
    fail(500, 'config.php fehlt. Bitte config.sample.php kopieren und ausfüllen.');
}
$CONFIG = require $cfgPath;

// --- Datenbank (PDO) -----------------------------------------------------
function db(): PDO {
    static $pdo = null;
    global $CONFIG;
    if ($pdo === null) {
        $d = $CONFIG['db'];
        $dsn = "mysql:host={$d['host']};dbname={$d['name']};charset={$d['charset']}";
        try {
            $pdo = new PDO($dsn, $d['user'], $d['pass'], [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]);
        } catch (Throwable $e) {
            fail(500, 'Datenbank-Verbindung fehlgeschlagen.');
        }
    }
    return $pdo;
}

// --- Auth: einfaches Passwort -> Token -----------------------------------
function expected_token(): string {
    global $CONFIG;
    return hash_hmac('sha256', 'english-coach-auth', $CONFIG['session_secret']);
}

function client_token(): string {
    $h = $_SERVER['HTTP_X_AUTH_TOKEN'] ?? '';
    if ($h !== '') return $h;
    return (string)($_GET['token'] ?? '');
}

function require_auth(): void {
    if (!hash_equals(expected_token(), client_token())) {
        fail(401, 'Nicht eingeloggt.');
    }
}

// --- Claude API ----------------------------------------------------------
// $messages: [['role'=>'user'|'assistant','content'=>'...'], ...]
function claude(string $system, array $messages, ?int $maxTokens = null): array {
    global $CONFIG;
    $a = $CONFIG['anthropic'];
    $payload = [
        'model'      => $a['model'],
        'max_tokens' => $maxTokens ?? $a['max_tokens'],
        'system'     => $system,
        'messages'   => $messages,
    ];
    $ch = curl_init('https://api.anthropic.com/v1/messages');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_HTTPHEADER     => [
            'content-type: application/json',
            'x-api-key: ' . $a['api_key'],
            'anthropic-version: ' . $a['version'],
        ],
        CURLOPT_POSTFIELDS     => json_encode($payload, JSON_UNESCAPED_UNICODE),
        CURLOPT_TIMEOUT        => 90,
    ]);
    $res  = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err  = curl_error($ch);
    curl_close($ch);

    if ($res === false)  fail(502, 'Claude API nicht erreichbar.', ['detail' => $err]);
    $j = json_decode($res, true);
    if ($code !== 200) {
        $m = $j['error']['message'] ?? ('HTTP ' . $code);
        fail(502, 'Claude API Fehler: ' . $m);
    }
    // Text aus den content-Blöcken zusammensetzen
    $text = '';
    foreach (($j['content'] ?? []) as $block) {
        if (($block['type'] ?? '') === 'text') $text .= $block['text'];
    }
    return ['text' => $text, 'raw' => $j];
}

// Versucht, ein JSON-Objekt aus Claudes Antwort zu extrahieren.
function extract_json(string $text): ?array {
    $t = trim($text);
    // ```json ... ``` entfernen
    if (str_starts_with($t, '```')) {
        $t = preg_replace('/^```[a-zA-Z]*\s*/', '', $t);
        $t = preg_replace('/\s*```$/', '', $t);
    }
    $j = json_decode($t, true);
    if (is_array($j)) return $j;
    // Fallback: erstes {...} herausschneiden
    $start = strpos($t, '{');
    $end   = strrpos($t, '}');
    if ($start !== false && $end !== false && $end > $start) {
        $j = json_decode(substr($t, $start, $end - $start + 1), true);
        if (is_array($j)) return $j;
    }
    return null;
}
