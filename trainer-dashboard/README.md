# ETAF Trainer-Koordination

Werkzeug für die Koordination der Abu-Dhabi-Trainings (ca. 20 Trainingswochen über 14 Monate,
je 5–8 Trainer). Kompletter Ablauf – von der KI-Vorauswahl über die E-Mail-Anfrage bis zum
automatischen Verfügbarkeits-Rücklauf ins Dashboard.

Läuft in **zwei Modi**:

- **Demo** (Standard, ohne Backend): Daten im Browser (`localStorage`), Versand & Rücklauf
  **simuliert**. Ideal zum Zeigen und Abstimmen. → einfach `index.html` öffnen.
- **Live** (PHP + MySQL, z. B. artfiles.de): echtes Backend, zentrale DB, echte E-Mails,
  echter Magic-Link-Rückkanal, von mehreren Geräten nutzbar. → Anleitung in **`DEPLOY.md`**.
  Aktiviert wird der Live-Modus durch eine `config.js` neben `index.html` (aus `config.js.sample`).

## Öffnen (Demo)

`trainer-dashboard/index.html` im Browser öffnen. **Demo-PIN: `481509`** (im Demo-Modus
entsperrt jede 6-stellige Zahl). Läuft auf Desktop und Handy, hell/dunkel automatisch.

## Backend (Live)

Dependency-freies **PHP-8-Backend mit MySQL** (PDO), self-provisioning (legt Tabellen und
Demo-Daten beim ersten Start selbst an). Ordner `backend/`:

| Datei | Zweck |
|---|---|
| `api.php` | JSON-API (Login, State, Anfragen, Vorlagen …) |
| `respond.php` | Magic-Link-Landeseite (Trainer klickt ✅/🤔/❌) |
| `db.php` / `lib.php` / `mailer.php` | Datenschicht, Helfer, E-Mail-Versand (mail/SMTP) |
| `config.sample.php` | Vorlage für `config.php` (DB-Zugang, PIN, Absender, SMTP) |
| `schema.sql` | MySQL-Schema (optional, für manuellen Import) |

Kompletter Aufbau auf artfiles.de: siehe **`DEPLOY.md`**.

## Was der Prototyp zeigt

- **PIN-Login** (6-stellig) als Zugangsschutz
- **Übersicht** mit KPIs und Besetzungs-Timeline über alle 20 Wochen (Ampel: besetzt / in Arbeit / kritisch)
- **Trainings** mit Besetzungsstand; Detailansicht je Training
- **KI-Vorauswahl**: Trainer werden nach Fachgebiet, Region, UAE-Erfahrung, Auslastung &
  Bewertung gerankt (Fit-%). Manuell in Reihenfolge anfragen, Nachrücker rutschen nach
- **E-Mail-Composer** (Slide-over) mit Vorlagen, gefüllten Platzhaltern und Mini-Editor;
  Absender `trainer@etaf-akademie.org`
- **Simulierter Rücklauf**: nach dem Senden „trudeln Antworten ein“ und färben den Status
  (zugesagt / vielleicht / abgesagt) automatisch zurück ins Dashboard
- **Schnell-Ersatz**: Ein-Klick-Blitzanfrage an die besten verfügbaren Trainer bei Ausfall
- **Zweisprachig (DE/EN)**: Oberfläche per Umschalter (Login + Seitenleiste). Im E-Mail-Composer
  ist die **Sprache der Anfrage separat wählbar** (Standard Englisch) mit eigenen Vorlagen je Sprache —
  d. h. auf Deutsch planen, Anfragen auf Englisch versenden.
- **Vorlagen** bearbeiten & speichern (je Sprache DE/EN)
- **Import** (angedeutet): Excel/CSV, Angebot-PDF, KI-Extraktion aus Lebensläufen

Tipp: „Antwort simulieren“ am angefragten Trainer bzw. das Warten nach dem Senden zeigt den
Rücklauf. Über **◐ Design wechseln** hell/dunkel testen.

## Stand & nächste Ausbaustufen

| Baustein | Demo | Live (jetzt) | Später |
|---|---|---|---|
| Daten | localStorage | **MySQL @ artfiles** | Backups, Rollen |
| Login | jeder 6-stellige PIN | **PIN serverseitig geprüft + Rate-Limit** | + Magic-Link, Audit-Log |
| E-Mail | simuliert | **PHP mail() / SMTP** | Vorlagen-Editor je Kampagne |
| Verfügbarkeit | Zufalls-Simulation | **Magic-Link ✅/🤔/❌ → DB → Polling** | + KI-Parsing freier Antworten |
| KI-Matching | Heuristik im Browser | Heuristik (serverfähig) | Claude API: Profile aus Rohdaten + Ranking |
| Reise/Logistik | angedeutet | — | Flug-, Hotel-, Visum-, Per-Diem-Modul (UAE) |

Nicht vergessen: 50 Trainerprofile = personenbezogene Daten mit internationalem Transfer
(Abu Dhabi) → Einwilligung, AVV mit artfiles, Löschkonzept und HTTPS von Anfang an. Details in `DEPLOY.md`.
