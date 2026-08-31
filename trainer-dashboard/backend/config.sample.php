<?php
/**
 * ETAF Trainer-Koordination - Konfiguration
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
  // Absender der Trainer-Anfragen. Mailbox muss existieren (SPF/DKIM sauber setzen).
  'from_email' => 'trainer@dvi-systems.com',
  'from_name' => 'ETAF Koordination',
  // Wohin Rückmeldungen der Trainer („Da stimmt etwas nicht“) als Hinweis gehen.
  // Leer lassen = an from_email. Zusätzlich landet jede Rückmeldung im Dashboard.
  'notify_email' => '',
  // Basis-URL des Backends (ohne Slash am Ende). Wird für die Magic-Link-Buttons
  // in den E-Mails gebraucht. Leer lassen = automatisch aus dem Request.
  'base_url' => 'https://cockpit.dvi-systems.com/backend',

  // ---- E-Mail-Versand ---------------------------------------------
  // 'mail'  = PHP mail() (auf artfiles meist ok für die eigene Domain)
  // 'smtp'  = SMTP mit Login (zuverlässiger, empfohlen für trainer@…)
  // 'log'   = nichts versenden, nur in DB protokollieren (zum Testen)
  'mail_mode' => 'mail',
  'smtp' => [
    'host' => 'smtp.artfiles.de',
    'port' => 587,                // 587 = STARTTLS, 465 = SSL
    'secure' => 'tls',            // 'tls' | 'ssl'
    'user' => 'trainer@dvi-systems.com',
    'pass' => '',
  ],

  // ---- Flugpost: Postfach-Abruf für Flugbestätigungen -------------
  // Die Automatik ruft dieses Postfach per POP3 ab (Mails BLEIBEN liegen),
  // erkennt Flugbuchungen per KI und schlägt die Zuordnung zu Trainer +
  // Training vor. Empfehlung: eigene Adresse anlegen (z.B. fluege@…) und
  // Buchungsbestätigungen dorthin weiterleiten - dann liest die KI nicht
  // das ganze Hauptpostfach. Leer lassen = Funktion aus.
  'mailbox' => [
    'host' => 'pop3.artfiles.de',
    'port' => 995,                 // 995 = POP3 über SSL
    'secure' => 'ssl',
    'user' => '',                  // volle E-Mail-Adresse
    'pass' => '',
  ],

  // ---- Folien-Postfach (z.B. content@…) ---------------------------
  // Hierhin schicken die Trainer ihre fertigen PowerPoints. Das Cockpit
  // liest das Postfach mit, ordnet jede Mail über den Betreff einer Session
  // zu und setzt den Haken. Die Dateien bleiben im Postfach - gespeichert
  // werden nur Absender, Zeitpunkt und Dateiname.
  'ppt_mailbox' => [
    'host' => 'pop3.artfiles.de',
    'port' => 995,
    'secure' => 'ssl',
    'user' => '',                  // z.B. content@dvi-systems.com
    'pass' => '',
  ],

  // ---- KI: Profilanlage aus Text (Claude API) ---------------------
  // API-Key aus console.anthropic.com. Leer lassen = KI-Import deaktiviert
  // (das Dashboard läuft trotzdem, der Import zeigt dann einen Hinweis).
  'anthropic_key' => '',
  'anthropic_model' => 'claude-opus-4-8',

  // ---- Automatik: Erinnerungen & Nachrücken -----------------------
  // Diese Werte sind Startwerte; sie lassen sich im Dashboard ändern.
  'reminder_hours' => 48,   // nach X h ohne Antwort: Erinnerung senden
  'escalate_hours' => 72,   // nach X h ohne Antwort: als überfällig behandeln
  'auto_advance'   => false, // true = bei Absage/Überfälligkeit automatisch nachrücken
  // Schlüssel zum Absichern des Cron-Aufrufs (backend/cron.php?key=...).
  'cron_key' => 'CHANGE_ME_zufälliger_wert',

  // ---- Kalender-Abo (iCal-Feed) -----------------------------------
  // Schlüssel für den abonnierbaren Kalender-Link:
  //   backend/ics.php?key=<ics_key>[&client=<client_id>]
  // Diesen Link in Google/Apple/Outlook als "Kalender abonnieren" eintragen -
  // er aktualisiert sich automatisch. Leer lassen = Feed deaktiviert.
  'ics_key' => 'CHANGE_ME_kalender_schluessel',

  // ---- Demo-Daten -------------------------------------------------
  // true = beim ersten Start Beispiel-Trainer/-Trainings anlegen.
  // Auf false stellen, sobald du echte Daten importiert hast.
  'seed_demo' => true,

  // Nach wie vielen Stunden ohne Aktivitaet eine Sitzung ablaeuft (Neuanmeldung
  // noetig). Standard 24. 0 = keine Leerlauf-Grenze (nicht empfohlen).
  'session_idle_hours' => 24,

  // Absender fuer den Flugdaten-Versand an den Kunden (z.B. fluege@dvi-systems.com).
  // Leer = normaler Absender (from_email). Die Adresse muss zur eigenen Domain
  // gehoeren, sonst lehnen Empfaenger-Server die Mail ab.
  'flight_from' => '',

  // Zwei-Faktor: wie viele Tage ein Geraet nach erfolgreichem Code-Login
  // gemerkt wird ("Dieses Geraet merken"). Standard 14, hoechstens 90.
  'tfa_trust_days' => 14,

  // Absender fuer den Kundenbereich (Lieferplan-Sendungen an ADP),
  // z.B. adp@dvi-systems.com. Leer = normaler Absender (from_email).
  'customer_from' => 'adp@dvi-systems.com',

  // ---- Eigene SMTP-Konten je Absenderadresse -----------------------
  // Auf gemeinsam genutztem Hosting darf ein SMTP-Konto meist nur unter der
  // eigenen Adresse senden. Hat adp@ (oder fluege@) ein eigenes Postfach,
  // hier die Zugangsdaten hinterlegen - dann geht die Mail wirklich unter
  // dieser Adresse raus. Host/Port/Verschluesselung kommen aus 'smtp'.
  // Leer lassen = alles laeuft ueber das Standard-SMTP-Konto.
  'smtp_accounts' => [
    // 'adp@dvi-systems.com'    => ['user' => 'adp@dvi-systems.com',    'pass' => ''],
    // 'fluege@dvi-systems.com' => ['user' => 'fluege@dvi-systems.com', 'pass' => ''],
  ],

  // ---- Kunden-Postfach (z.B. adp@dvi-systems.com) ------------------
  // Das Cockpit liest dieses Postfach stuendlich mit und ordnet Antworten
  // ueber den Betreff der passenden Lieferplan-Position zu (Bereich Kunde).
  // Leer lassen = Funktion aus. Die Mails bleiben im Postfach liegen.
  'customer_mailbox' => [
    'host' => 'pop3.artfiles.de',
    'port' => 995,
    'secure' => 'ssl',
    'user' => '',                  // z.B. adp@dvi-systems.com
    'pass' => '',
  ],
];
