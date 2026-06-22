<?php
require __DIR__ . '/_bootstrap.php';
require_auth();

$action = $_GET['action'] ?? '';

/* ------------------------------------------------------------------ *
 *  Der Coach: System-Prompt
 * ------------------------------------------------------------------ */
function coach_system(string $topicTitle, string $topicDesc, string $level, string $perso = '', bool $isStart = false): string {
    $persoBlock = $perso !== '' ? "\n\nWhat you remember about this learner (use it naturally, never list it back robotically):\n{$perso}\n" : '';
    $goalRule = $isStart
        ? "- Because this is the START of the scenario, also invent ONE small, concrete, achievable mini-goal for this chat (e.g. \"order a coffee and ask for a recommendation\") and put it in \"goal_de\" (in German). Keep it light and fun."
        : "- Set \"goal_met\" to true ONLY if the learner has clearly achieved the scenario's mini-goal in this message; otherwise false or omit it.";
    return <<<SYS
You are "Coach", a warm, patient English conversation partner and tutor for a
German native speaker. Their current CEFR level is about {$level} and their goal
is to reach C1. IMPORTANT context about this learner: they often feel they lack
vocabulary and are AFRAID of failing in conversations, so they avoid speaking.
Your single most important job is to keep them talking and feeling safe and
capable. Build their confidence on every turn.

The current scenario is: "{$topicTitle}" — {$topicDesc}{$persoBlock}

Rules for your behaviour:
- Speak natural, idiomatic English slightly ABOVE their current level (the i+1
  principle) so they stretch, but stay understandable.
- Keep your spoken reply SHORT: 2–4 sentences, then ask ONE engaging follow-up
  question so the conversation never stalls. Let THEM do most of the talking.
- NEVER lecture or correct everything. Pick at most the 1–2 most useful
  corrections from their last message. If they made no meaningful mistakes,
  give zero corrections and just praise.
- Be specific and warm in encouragement, never generic.
- Stay inside the scenario. Play your role naturally (e.g. the interviewer,
  the barista, a colleague). Weave in what you remember about them when natural.
- If the learner writes in German or mixes languages, gently keep going in
  English and model how to say it.
- In "remember", add 0–2 NEW, durable facts you just learned about the learner
  (interests, job, plans, preferences) — short phrases, English. Skip trivia.
{$goalRule}

Respond with ONLY a single valid JSON object (no markdown, no code fences),
with EXACTLY these keys:
{
  "reply":          "your spoken English reply (this is what gets read aloud)",
  "reply_de":       "a natural German translation of 'reply' for support",
  "feedback":       [ { "original": "what they said", "better": "improved version", "note_de": "short German why" } ],
  "vocab":          [ { "en": "useful B2/C1 word or phrase", "de": "German meaning", "example": "short English example sentence" } ],
  "encouragement_de": "one short, warm German sentence that lowers their fear",
  "remember":       [ "new durable fact about the learner" ],
  "goal_de":        "the mini-goal in German (only on the first message of a scenario, else omit)",
  "goal_met":       false,
  "level_estimate": "A2|B1|B2|C1|C2 — your estimate of their level from their latest message"
}
"feedback", "vocab" and "remember" may be empty arrays. Include 1–3 vocab items
that are genuinely useful for this scenario at the B2→C1 range. Keep it concise.
SYS;
}

/* Liest Profil + Gedächtnis + schwierige Vokabeln und baut einen Kontextblock. */
function personalization(): string {
    $get = function (string $k) {
        $st = db()->prepare('SELECT v FROM settings WHERE k = ?');
        $st->execute([$k]);
        $v = $st->fetchColumn();
        return $v === false ? null : json_decode((string)$v, true);
    };
    $lines = [];
    $p = $get('profile');
    if (is_array($p)) {
        if (!empty($p['name']))      $lines[] = "Name: {$p['name']}";
        if (!empty($p['job']))       $lines[] = "Job/role: {$p['job']}";
        if (!empty($p['interests'])) $lines[] = "Interests: {$p['interests']}";
        if (!empty($p['goals']))     $lines[] = "Their goals: {$p['goals']}";
    }
    $m = $get('memory');
    if (is_array($m) && $m) {
        $lines[] = 'Things you remember: ' . implode('; ', array_slice($m, -25));
    }
    // ein paar schwierige Vokabeln zum sanften Wiederverwenden
    $weak = db()->query('SELECT en FROM vocabulary ORDER BY ease ASC, RAND() LIMIT 8')->fetchAll(PDO::FETCH_COLUMN);
    if ($weak) $lines[] = 'Words they are still practising (try to reuse a couple naturally): ' . implode(', ', $weak);

    return implode("\n", $lines);
}

/* Merge neuer Fakten ins Langzeit-Gedächtnis (dedupe, gedeckelt). */
function merge_memory(array $data): void {
    $facts = array_filter(array_map('trim', (array)($data['remember'] ?? [])));
    if (!$facts) return;
    $st = db()->prepare('SELECT v FROM settings WHERE k = "memory"');
    $st->execute();
    $cur = json_decode((string)$st->fetchColumn(), true);
    if (!is_array($cur)) $cur = [];
    foreach ($facts as $f) {
        if (!in_array($f, $cur, true)) $cur[] = $f;
    }
    $cur = array_slice($cur, -60); // Deckel
    db()->prepare('INSERT INTO settings (k,v) VALUES ("memory",?) ON DUPLICATE KEY UPDATE v=VALUES(v)')
        ->execute([json_encode(array_values($cur), JSON_UNESCAPED_UNICODE)]);
}

/* Speichert Vokabeln + Fortschritt nach einer Coach-Antwort. */
function save_artifacts(array $data, int $convId, ?int $topicId, string $level): void {
    $today = date('Y-m-d');
    $newVocab = 0;

    // Vokabeln (dedupe per UNIQUE en)
    $ins = db()->prepare(
        'INSERT INTO vocabulary (en, de, example, topic_id, source_conversation_id, due_at)
         VALUES (?,?,?,?,?,?)
         ON DUPLICATE KEY UPDATE de = VALUES(de), example = VALUES(example)'
    );
    foreach (($data['vocab'] ?? []) as $v) {
        $en = trim((string)($v['en'] ?? ''));
        if ($en === '') continue;
        $ins->execute([
            $en,
            trim((string)($v['de'] ?? '')),
            trim((string)($v['example'] ?? '')),
            $topicId,
            $convId,
            $today,
        ]);
        if ($ins->rowCount() === 1) $newVocab++; // 1 = neu eingefügt
    }

    // Tagesfortschritt hochzählen
    $lvl = (string)($data['level_estimate'] ?? $level);
    $p = db()->prepare(
        'INSERT INTO progress (day, messages_count, new_vocab, level_estimate)
         VALUES (?, 1, ?, ?)
         ON DUPLICATE KEY UPDATE
            messages_count = messages_count + 1,
            new_vocab      = new_vocab + VALUES(new_vocab),
            level_estimate = VALUES(level_estimate)'
    );
    $p->execute([$today, $newVocab, $lvl]);
}

/* Baut die Nachrichten-Historie für Claude (nur Rolle + Text). */
function history_for_claude(int $convId, int $limit = 20): array {
    $st = db()->prepare(
        'SELECT role, content FROM messages
         WHERE conversation_id = ? ORDER BY id DESC LIMIT ?'
    );
    $st->bindValue(1, $convId, PDO::PARAM_INT);
    $st->bindValue(2, $limit, PDO::PARAM_INT);
    $st->execute();
    $rows = array_reverse($st->fetchAll());
    $msgs = array_map(fn($r) => ['role' => $r['role'], 'content' => $r['content']], $rows);
    // Die Claude API verlangt, dass die Historie mit einer 'user'-Rolle beginnt.
    // Unsere erste Nachricht ist die Begrüßung des Coaches (assistant) -> davor
    // einen kurzen, synthetischen Auftakt einfügen.
    if (!empty($msgs) && $msgs[0]['role'] === 'assistant') {
        array_unshift($msgs, ['role' => 'user', 'content' => '[Beginning of the conversation.]']);
    }
    return $msgs;
}

/* ------------------------------------------------------------------ *
 *  Aktionen
 * ------------------------------------------------------------------ */

// Neues Gespräch starten -> Coach begrüßt & eröffnet das Szenario
if ($action === 'start') {
    $in      = body();
    $topicId = (int)($in['topic_id'] ?? 0) ?: null;
    $level   = preg_replace('/[^A-C0-9]/', '', strtoupper((string)($in['level'] ?? 'B2'))) ?: 'B2';

    $topic = ['title' => 'Free conversation', 'description' => 'An open, friendly chat.'];
    if ($topicId) {
        $st = db()->prepare('SELECT * FROM topics WHERE id = ?');
        $st->execute([$topicId]);
        $t = $st->fetch();
        if ($t) $topic = $t;
    }

    $st = db()->prepare('INSERT INTO conversations (topic_id, title, level) VALUES (?,?,?)');
    $st->execute([$topicId, $topic['title'], $level]);
    $convId = (int)db()->lastInsertId();

    $system = coach_system($topic['title'], (string)$topic['description'], $level, personalization(), true);
    $kick   = "[The learner just opened the scenario \"{$topic['title']}\". "
            . "Greet them warmly in English, set the scene in one or two sentences, "
            . "and ask one easy opening question to get them talking.]";

    $resp = claude($system, [['role' => 'user', 'content' => $kick]]);
    $data = extract_json($resp['text']) ?? ['reply' => $resp['text']];

    $ins = db()->prepare(
        'INSERT INTO messages (conversation_id, role, content, meta) VALUES (?,?,?,?)'
    );
    $ins->execute([$convId, 'assistant', (string)($data['reply'] ?? ''), json_encode($data, JSON_UNESCAPED_UNICODE)]);
    save_artifacts($data, $convId, $topicId, $level);
    merge_memory($data);

    ok(['conversation_id' => $convId, 'message' => $data]);
}

// Nutzer schreibt/spricht -> Coach antwortet
if ($action === 'message') {
    $in     = body();
    $convId = (int)($in['conversation_id'] ?? 0);
    $text   = trim((string)($in['text'] ?? ''));
    if ($convId <= 0 || $text === '') fail(400, 'conversation_id und text nötig.');

    $st = db()->prepare('SELECT * FROM conversations WHERE id = ?');
    $st->execute([$convId]);
    $conv = $st->fetch();
    if (!$conv) fail(404, 'Gespräch nicht gefunden.');

    $topic = ['title' => $conv['title'], 'description' => ''];
    if ($conv['topic_id']) {
        $ts = db()->prepare('SELECT * FROM topics WHERE id = ?');
        $ts->execute([$conv['topic_id']]);
        $t = $ts->fetch();
        if ($t) $topic = $t;
    }

    // Nutzernachricht speichern
    db()->prepare('INSERT INTO messages (conversation_id, role, content) VALUES (?,?,?)')
        ->execute([$convId, 'user', $text]);

    $system   = coach_system($topic['title'], (string)$topic['description'], $conv['level'], personalization(), false);
    $messages = history_for_claude($convId);
    $resp = claude($system, $messages);
    $data = extract_json($resp['text']) ?? ['reply' => $resp['text']];

    db()->prepare('INSERT INTO messages (conversation_id, role, content, meta) VALUES (?,?,?,?)')
        ->execute([$convId, 'assistant', (string)($data['reply'] ?? ''), json_encode($data, JSON_UNESCAPED_UNICODE)]);
    save_artifacts($data, $convId, $conv['topic_id'] ? (int)$conv['topic_id'] : null, $conv['level']);
    merge_memory($data);

    // updated_at anstoßen
    db()->prepare('UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = ?')->execute([$convId]);

    ok(['message' => $data]);
}

// Liste der bisherigen Gespräche
if ($action === 'list') {
    $rows = db()->query(
        'SELECT c.id, c.title, c.level, c.updated_at, t.emoji
         FROM conversations c LEFT JOIN topics t ON t.id = c.topic_id
         ORDER BY c.updated_at DESC LIMIT 50'
    )->fetchAll();
    ok(['conversations' => $rows]);
}

// Ein Gespräch mit allen Nachrichten laden
if ($action === 'get') {
    $convId = (int)($_GET['id'] ?? 0);
    $st = db()->prepare('SELECT * FROM messages WHERE conversation_id = ? ORDER BY id');
    $st->execute([$convId]);
    $msgs = array_map(function ($m) {
        $m['meta'] = $m['meta'] ? json_decode($m['meta'], true) : null;
        return $m;
    }, $st->fetchAll());
    ok(['messages' => $msgs]);
}

fail(400, 'Unbekannte action.');
