<?php
require __DIR__ . '/_bootstrap.php';
require_auth();

$action = $_GET['action'] ?? 'stats';

// Überblick: Streak, Summen, Level, fällige Vokabeln, letzte Tage
if ($action === 'stats') {
    $days = db()->query('SELECT * FROM progress ORDER BY day DESC LIMIT 30')->fetchAll();

    $totMsg  = (int)db()->query('SELECT COALESCE(SUM(messages_count),0) FROM progress')->fetchColumn();
    $totVoc  = (int)db()->query('SELECT COUNT(*) FROM vocabulary')->fetchColumn();
    $dueVoc  = (int)db()->query('SELECT COUNT(*) FROM vocabulary WHERE due_at <= CURDATE()')->fetchColumn();
    $level   = (string)(db()->query('SELECT level_estimate FROM progress WHERE level_estimate IS NOT NULL ORDER BY day DESC LIMIT 1')->fetchColumn() ?: 'B2');

    // Streak (aufeinanderfolgende Tage mit Aktivität, rückwärts ab heute/gestern)
    $active = db()->query('SELECT day FROM progress WHERE messages_count > 0 ORDER BY day DESC')->fetchAll(PDO::FETCH_COLUMN);
    $streak = 0;
    $cursor = new DateTime('today');
    $set = array_flip($active);
    if (!isset($set[$cursor->format('Y-m-d')])) $cursor->modify('-1 day'); // heute noch nichts ist ok
    while (isset($set[$cursor->format('Y-m-d')])) {
        $streak++;
        $cursor->modify('-1 day');
    }

    ok([
        'level'        => $level,
        'streak'       => $streak,
        'total_msgs'   => $totMsg,
        'total_vocab'  => $totVoc,
        'due_vocab'    => $dueVoc,
        'days'         => array_reverse($days),
    ]);
}

// Persönlichen Lernplan von Claude erzeugen lassen
if ($action === 'plan') {
    $level = (string)(db()->query('SELECT level_estimate FROM progress WHERE level_estimate IS NOT NULL ORDER BY day DESC LIMIT 1')->fetchColumn() ?: 'B2');
    $weak  = db()->query('SELECT en FROM vocabulary ORDER BY ease ASC LIMIT 15')->fetchAll(PDO::FETCH_COLUMN);
    $topics= db()->query('SELECT title FROM topics ORDER BY is_custom DESC LIMIT 12')->fetchAll(PDO::FETCH_COLUMN);

    $weakStr  = $weak  ? implode(', ', $weak)  : '(none yet)';
    $topicStr = $topics ? implode(', ', $topics) : '(none yet)';

    $system = "You are an expert English coach for a German native speaker who is afraid of "
        . "speaking and wants to go from {$level} to C1. Create a concrete, encouraging "
        . "4-week plan. Be realistic and confidence-building. Respond ONLY with JSON: "
        . '{ "summary_de": "2-3 motivating German sentences", '
        . '"weeks": [ { "week": 1, "focus_de": "...", "actions_de": ["...","..."] } ], '
        . '"daily_de": ["small daily habits in German"] }';
    $user = "Current level: {$level}. Tricky vocab so far: {$weakStr}. "
        . "Topics they care about: {$topicStr}. Keep daily effort to ~15 minutes.";

    $resp = claude($system, [['role' => 'user', 'content' => $user]], 1500);
    $plan = extract_json($resp['text']) ?? ['summary_de' => $resp['text'], 'weeks' => [], 'daily_de' => []];

    db()->prepare('INSERT INTO settings (k,v) VALUES ("plan",?) ON DUPLICATE KEY UPDATE v=VALUES(v)')
        ->execute([json_encode($plan, JSON_UNESCAPED_UNICODE)]);
    ok(['plan' => $plan]);
}

// Gespeicherten Plan abrufen
if ($action === 'get_plan') {
    $v = db()->query('SELECT v FROM settings WHERE k = "plan"')->fetchColumn();
    ok(['plan' => $v ? json_decode($v, true) : null]);
}

fail(400, 'Unbekannte action.');
