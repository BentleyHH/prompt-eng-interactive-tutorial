<?php
require __DIR__ . '/_bootstrap.php';
require_auth();

$action = $_GET['action'] ?? 'list';

if ($action === 'list') {
    $rows = db()->query('SELECT * FROM topics ORDER BY is_custom DESC, category, title')->fetchAll();
    ok(['topics' => $rows]);
}

if ($action === 'create') {
    $in    = body();
    $title = trim((string)($in['title'] ?? ''));
    if ($title === '') fail(400, 'Titel fehlt.');
    $desc  = trim((string)($in['description'] ?? ''));
    $emoji = trim((string)($in['emoji'] ?? '💬')) ?: '💬';
    $cat   = trim((string)($in['category'] ?? 'custom')) ?: 'custom';

    // slug erzeugen + eindeutig machen
    $base = preg_replace('/[^a-z0-9]+/', '-', strtolower($title));
    $base = trim((string)$base, '-') ?: 'thema';
    $slug = $base; $i = 2;
    $chk  = db()->prepare('SELECT 1 FROM topics WHERE slug = ?');
    while (true) {
        $chk->execute([$slug]);
        if (!$chk->fetch()) break;
        $slug = $base . '-' . $i++;
    }
    $st = db()->prepare(
        'INSERT INTO topics (slug,title,description,category,emoji,is_custom)
         VALUES (?,?,?,?,?,1)'
    );
    $st->execute([$slug, $title, $desc, $cat, $emoji]);
    ok(['id' => (int)db()->lastInsertId(), 'slug' => $slug]);
}

if ($action === 'delete') {
    $in = body();
    $id = (int)($in['id'] ?? 0);
    $st = db()->prepare('DELETE FROM topics WHERE id = ? AND is_custom = 1');
    $st->execute([$id]);
    ok(['deleted' => $st->rowCount()]);
}

fail(400, 'Unbekannte action.');
