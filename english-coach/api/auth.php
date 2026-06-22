<?php
require __DIR__ . '/_bootstrap.php';

// POST { password } -> { token }
$in = body();
$pw = (string)($in['password'] ?? '');

if (!hash_equals((string)$CONFIG['app_password'], $pw)) {
    // kleine Verzögerung gegen Brute-Force
    usleep(400000);
    fail(401, 'Falsches Passwort.');
}
ok(['token' => expected_token()]);
