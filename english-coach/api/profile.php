<?php
require __DIR__ . '/_bootstrap.php';
require_auth();

$action = $_GET['action'] ?? 'get';

function setting_get(string $k): ?string {
    $st = db()->prepare('SELECT v FROM settings WHERE k = ?');
    $st->execute([$k]);
    $v = $st->fetchColumn();
    return $v === false ? null : (string)$v;
}
function setting_set(string $k, string $v): void {
    db()->prepare('INSERT INTO settings (k,v) VALUES (?,?) ON DUPLICATE KEY UPDATE v=VALUES(v)')
        ->execute([$k, $v]);
}

if ($action === 'get') {
    $profile = setting_get('profile');
    $memory  = setting_get('memory');
    ok([
        'profile' => $profile ? json_decode($profile, true) : null,
        'memory'  => $memory ? json_decode($memory, true) : [],
    ]);
}

if ($action === 'save') {
    $in = body();
    $profile = [
        'name'      => trim((string)($in['name'] ?? '')),
        'job'       => trim((string)($in['job'] ?? '')),
        'interests' => trim((string)($in['interests'] ?? '')),
        'goals'     => trim((string)($in['goals'] ?? '')),
    ];
    setting_set('profile', json_encode($profile, JSON_UNESCAPED_UNICODE));
    ok(['ok' => true, 'profile' => $profile]);
}

if ($action === 'forget') {
    setting_set('memory', json_encode([], JSON_UNESCAPED_UNICODE));
    ok(['ok' => true]);
}

fail(400, 'Unbekannte action.');
