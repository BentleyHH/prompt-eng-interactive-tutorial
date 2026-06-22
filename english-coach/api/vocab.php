<?php
require __DIR__ . '/_bootstrap.php';
require_auth();

$action = $_GET['action'] ?? 'list';

// Alle Vokabeln (neueste zuerst)
if ($action === 'list') {
    $rows = db()->query('SELECT * FROM vocabulary ORDER BY created_at DESC LIMIT 500')->fetchAll();
    ok(['vocab' => $rows]);
}

// Heute fällige Karten zum Wiederholen
if ($action === 'due') {
    $st = db()->prepare(
        'SELECT * FROM vocabulary WHERE due_at <= CURDATE() OR due_at IS NULL
         ORDER BY due_at ASC LIMIT 40'
    );
    $st->execute();
    ok(['due' => $st->fetchAll()]);
}

// Karte bewerten — SM-2 lite. quality: 0 (vergessen) .. 5 (perfekt)
if ($action === 'review') {
    $in = body();
    $id = (int)($in['id'] ?? 0);
    $q  = max(0, min(5, (int)($in['quality'] ?? 0)));

    $st = db()->prepare('SELECT * FROM vocabulary WHERE id = ?');
    $st->execute([$id]);
    $v = $st->fetch();
    if (!$v) fail(404, 'Vokabel nicht gefunden.');

    $ease = (float)$v['ease'];
    $reps = (int)$v['repetitions'];
    $intv = (int)$v['interval_days'];

    if ($q < 3) {                 // falsch -> zurücksetzen
        $reps = 0;
        $intv = 1;
    } else {
        $reps++;
        if     ($reps === 1) $intv = 1;
        elseif ($reps === 2) $intv = 6;
        else                 $intv = (int)round($intv * $ease);
        $ease = $ease + (0.1 - (5 - $q) * (0.08 + (5 - $q) * 0.02));
        if ($ease < 1.3) $ease = 1.3;
    }
    $due = date('Y-m-d', strtotime("+{$intv} days"));

    db()->prepare(
        'UPDATE vocabulary SET ease=?, repetitions=?, interval_days=?, due_at=?, last_reviewed_at=CURDATE()
         WHERE id=?'
    )->execute([$ease, $reps, $intv, $due, $id]);

    ok(['id' => $id, 'next_due' => $due, 'interval_days' => $intv]);
}

// Vokabel manuell hinzufügen
if ($action === 'add') {
    $in = body();
    $en = trim((string)($in['en'] ?? ''));
    if ($en === '') fail(400, 'en fehlt.');
    db()->prepare(
        'INSERT INTO vocabulary (en, de, example, due_at) VALUES (?,?,?,CURDATE())
         ON DUPLICATE KEY UPDATE de=VALUES(de), example=VALUES(example)'
    )->execute([$en, trim((string)($in['de'] ?? '')), trim((string)($in['example'] ?? ''))]);
    ok(['ok' => true]);
}

if ($action === 'delete') {
    $in = body();
    db()->prepare('DELETE FROM vocabulary WHERE id = ?')->execute([(int)($in['id'] ?? 0)]);
    ok(['ok' => true]);
}

fail(400, 'Unbekannte action.');
