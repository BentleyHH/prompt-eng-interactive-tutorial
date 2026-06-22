<?php
// Kopiere diese Datei nach "config.php" und trage deine echten Werte ein.
// config.php wird NICHT in Git eingecheckt (siehe .gitignore).
return [
    // --- MySQL-Zugangsdaten (aus dem Artfiles DCP > Datenbanken) ---
    'db' => [
        'host'    => 'localhost',     // bei Artfiles meist 'localhost'
        'name'    => 'DEINE_DATENBANK',
        'user'    => 'DEIN_DB_USER',
        'pass'    => 'DEIN_DB_PASS',
        'charset' => 'utf8mb4',
    ],

    // --- Login-Schutz der App (ein einfaches Passwort reicht für 1 Person) ---
    'app_password'   => 'bitte-aendern',
    // Lange, zufällige Zeichenkette — schützt die Login-Tokens:
    'session_secret' => 'bitte-durch-langen-zufallsstring-ersetzen',

    // --- Claude API (Key bei console.anthropic.com erstellen) ---
    'anthropic' => [
        'api_key'    => 'sk-ant-...',
        // Empfehlung: schnelles, starkes Modell für flüssige Gespräche.
        // Für maximale Qualität: 'claude-opus-4-8'.
        'model'      => 'claude-sonnet-4-6',
        'version'    => '2023-06-01',
        'max_tokens' => 1100,
    ],

    // --- Optional: natürliche Premium-Stimme (OpenAI Text-to-Speech) ---
    // Leer lassen = App nutzt die kostenlose Browser-Stimme.
    // Key von https://platform.openai.com/api-keys. Sehr günstig pro Satz.
    'openai' => [
        'api_key'   => '',                 // z. B. 'sk-...'  (leer = aus)
        'tts_model' => 'gpt-4o-mini-tts',  // natürliche, günstige Stimme
        'voice'     => 'alloy',            // alloy, echo, fable, nova, onyx, shimmer, …
    ],
];
