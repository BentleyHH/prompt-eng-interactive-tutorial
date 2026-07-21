<?php
/**
 * ETAF Trainer-Koordination — Konfiguration
 * ------------------------------------------------------------------
 * Kopiere diese Datei nach `config.php` und trage deine Werte ein.
 * `config.php` wird NICHT ins Git eingecheckt (siehe .gitignore) und
 * ist per .htaccess vor direktem Zugriff geschützt.
 * ------------------------------------------------------------------
 */
return [

  // ---- Datenbank (artfiles.de: MySQL) -----------------------------
  // artfiles nennt den Host oft "sql.local" oder "sqlXXX.artfiles.de".
  // Datenbankname / Benutzer / Passwort stehen in deinem artfiles-Kundenmenü.
  'driver' => 'mysql',            // 'mysql' (produktiv) | 'sqlite' (lokaler Test)
  'db_host' => 'sql.local',
  'db_name' => 'DEIN_DB_NAME',
  'db_user' => 'DEIN_DB_USER',
  'db_pass' => 'DEIN_DB_PASSWORT',
  'db_charset' => 'utf8mb4',
  'sqlite_path' => __DIR__ . '/data.sqlite',   // nur für lokalen SQLite-Test

  // ---- Zugang -----------------------------------------------------
  // 6-stelliger PIN. Wird beim ersten Start gehasht in der DB abgelegt.
  // Danach kannst du den PIN in der DB (Tabelle app_config) ändern.
  'default_pin' => '481509',
  'session_days' => 14,           // wie lange ein Login (Token) gültig ist

  // ---- Organisation / Absender ------------------------------------
  'org_name' => 'ETAF',
  'from_email' => 'trainer@etaf-dvi.org',
  'from_name' => 'ETAF Koordination',
  // Basis-URL der Installation (ohne Slash am Ende). Wird für die
  // Magic-Link-Buttons in den E-Mails gebraucht. Leer lassen = automatisch.
  'base_url' => '',               // z.B. 'https://dashboard.etaf-dvi.org'

  // ---- E-Mail-Versand ---------------------------------------------
  // 'mail'  = PHP mail() (auf artfiles meist ok für die eigene Domain)
  // 'smtp'  = SMTP mit Login (zuverlässiger, empfohlen für trainer@…)
  // 'log'   = nichts versenden, nur in DB protokollieren (zum Testen)
  'mail_mode' => 'mail',
  'smtp' => [
    'host' => 'smtp.artfiles.de',
    'port' => 587,                // 587 = STARTTLS, 465 = SSL
    'secure' => 'tls',            // 'tls' | 'ssl'
    'user' => 'trainer@etaf-dvi.org',
    'pass' => '',
  ],

  // ---- Demo-Daten -------------------------------------------------
  // true = beim ersten Start Beispiel-Trainer/-Trainings anlegen.
  // Auf false stellen, sobald du echte Daten importiert hast.
  'seed_demo' => true,
];
