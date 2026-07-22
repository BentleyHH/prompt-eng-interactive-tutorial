# ETAF Trainer-Koordination

Werkzeug für die Koordination der ETAF-Trainingsprogramme. Vorgeladen ist das reale
**Operational DVI Elite Team Programme 2026–2027** für **Abu Dhabi Police** (24 Einsätze
Sep 2026 – Nov 2027, inkl. PM-Modul in Weeze, Train-the-Trainer-Blöcke und Zertifizierung).
Das Tool ist **mandantenfähig** (mehrere Kunden/Projekte parallel möglich, je eigene Farbe)
mit **Gesamt-Leitstand** über alle Kunden. Kompletter Ablauf – von der KI-Vorauswahl über die
E-Mail-Anfrage bis zum automatischen Verfügbarkeits-Rücklauf ins Dashboard.

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
- **Mehrere Kunden/Projekte parallel**: jedes Training gehört zu einem Kunden mit eigener Farbe.
  Kunden-Umschalter oben (**„Alle Kunden"** oder einzeln), Kunden anlegen/umbenennen/umfärben,
  Training per Klick einem Kunden zuordnen.
- **Gesamt-Leitstand** (bei „Alle Kunden"): Portfolio-Kachel je Kunde — **wo es brennt**
  (kritisch), was **in Arbeit** und was **fertig besetzt** ist, mit Mini-Balken; Klick filtert.
- **Übersicht** mit KPIs und Besetzungs-Timeline (Ampel: besetzt / in Arbeit / kritisch),
  Timeline & Listen zusätzlich kundenfarbig
- **Kalender-Export**: **iCal-Datei (.ics)** aller Trainings mit echten Terminen (aus KW+Jahr),
  Farbe/Kategorie pro Kunde → direkt in Google/Apple/Outlook importierbar; im Live-Betrieb auch
  als **abonnierbarer Link** (`ics.php`, aktualisiert sich automatisch).
- **Druckbarer Wandkalender**: chronologische Monatsübersicht, farbcodiert pro Kunde, Querformat
  zum Ausdrucken/an-die-Wand-hängen.
- **Echtes Programm vorgeladen**: das DVI-Programm 2026–2027 (W1–W20, TtT-Blöcke, Final) mit
  **exakten Terminen** (Datumsbereiche statt nur KW), Orten (Abu Dhabi bzw. Weeze) und Schwerpunkten
  (INTERPOL-DVI-Phasen: DVI-Grundlagen, Data Management, Ante/Post Mortem, Reconciliation,
  Scene & Recovery, CBRN, Simulation, Site-Folder, Train-the-Trainer, Zertifizierung).
- **Trainings direkt anlegen/bearbeiten/löschen** im Dashboard (Kunde, Thema, Ort, Beginn/Ende,
  Schwerpunkt, benötigte Trainer, Teilnehmer) — nicht nur per Import.
- **Intelligente Materialliste** je Training: Positionen (Material + Anzahl) aus einem zentralen
  **Material-Katalog** (DVI-Kits, Leichensäcke, CBRN-Kits, Ante-/Post-Mortem-Protokolle, DNA-/
  Fingerprint-Sets, Schutzanzüge, Verbrauchsmaterial). Pro **Schwerpunkt** eine **Typ-Vorlage** —
  neue Trainings dieses Typs bekommen die richtige Liste automatisch beim Anlegen. Als **Packliste
  druckbar**.
- **Trainings** mit Besetzungsstand; Detailansicht je Training
- **KI-Vorauswahl**: Trainer werden nach Fachgebiet, Region, UAE-Erfahrung, Auslastung &
  Bewertung gerankt (Fit-%). Manuell in Reihenfolge anfragen, Nachrücker rutschen nach
- **E-Mail-Composer** (Slide-over) mit Vorlagen, gefüllten Platzhaltern und Mini-Editor;
  Absender `trainer@dvi-systems.com`
- **Simulierter Rücklauf**: nach dem Senden „trudeln Antworten ein“ und färben den Status
  (zugesagt / vielleicht / abgesagt) automatisch zurück ins Dashboard
- **Schnell-Ersatz**: Ein-Klick-Blitzanfrage an die besten verfügbaren Trainer bei Ausfall
- **Reiseplanung & druckbare Agenda**: je Training Reisedaten (Hotel, Treffpunkt, Ansprechpartner,
  Dresscode, Per Diem, Hinweise) + Programm/Agenda; je Trainer Flug- & Zimmerdaten. Daraus wird
  eine **persönliche, druckbare Reise-Agenda** erzeugt — im Dashboard ansehen/drucken und per
  **E-Mail mit Druck-Link** an den Trainer senden (`agenda.php`, öffnet ohne Login).
- **Visum-Workflow (Abu Dhabi)**: je Trainer Reisepass-Gültigkeit und Visum-Status
  (benötigt / beantragt / genehmigt / abgelehnt) mit Notizen; Statusampel im Roster. Die
  **Automatik erinnert** bestätigte UAE-Trainer ohne genehmigtes Visum einmalig automatisch
  an die Reisepass-Kopie (per Cron, idempotent). Pass-/Visum-Angaben erscheinen auch auf der Agenda.
- **Automatische Flugvorschläge**: pro Trainer werden aus Heimatregion → Zielflughafen
  passende Verbindungen vorgeschlagen (z. B. München → Abu Dhabi) und per Klick in die
  Flugdaten übernommen — spart Tipparbeit bei der Reiseplanung.
- **E-Mail-Protokoll**: eigene Ansicht mit allen versendeten E-Mails (Empfänger, Betreff,
  Sprache, Zeitpunkt, Status) — Anfragen, Erinnerungen, Visum-Hinweise und Agenda-Mails
  an einem Ort nachvollziehbar.
- **KI-Import**: Trainer → „Profile importieren" → Lebenslauf/Excel/Angebot einfügen → KI
  extrahiert strukturierte Profile (Claude API, Modell `claude-opus-4-8`) → prüfen → übernehmen
- **Automatik**: Erinnerungen nach X Stunden ohne Antwort + optionales automatisches Nachrücken
  (nächstbester Trainer bei Absage/Überfälligkeit). Manuell per Knopf oder automatisch per Cron.
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
| DVI-Programm 2026–2027 | vorgeladen (24 Einsätze, exakte Termine) | **seed_demo → DB** | Folge-Programme |
| Trainings pflegen | anlegen/bearbeiten/löschen | **anlegen/bearbeiten/löschen (DB)** | Serien/Wiederholungen |
| Materialliste | voll + Typ-Vorlagen | **materials/-presets-Tabellen** | Bestände/Nachbestellung |
| Mehrere Kunden | voll (localStorage) | **clients-Tabelle + Zuordnung** | Rollen/Rechte je Kunde |
| Gesamt-Leitstand | voll | **kundenübergreifende Übersicht** | Auslastungsreport |
| Kalender-Export | .ics-Download | **.ics + Abo-Link (`ics.php`)** | 2-Wege-Sync (CalDAV) |
| Wandkalender | Druck (Querformat) | Druck (Querformat) | PDF-Serienexport |
| Daten | localStorage | **MySQL @ artfiles** | Backups, Rollen |
| Login | jeder 6-stellige PIN | **PIN serverseitig geprüft + Rate-Limit** | + Magic-Link, Audit-Log |
| E-Mail | simuliert | **PHP mail() / SMTP** | Vorlagen-Editor je Kampagne |
| Verfügbarkeit | Zufalls-Simulation | **Magic-Link ✅/🤔/❌ → DB → Polling** | + KI-Parsing freier Antworten |
| KI-Matching | Heuristik im Browser | Heuristik (serverfähig, auch fürs Nachrücken) | Feineres Ranking / Lernen |
| KI-Profilanlage | simuliert (Textzerlegung) | **Claude API (`claude-opus-4-8`), strukturierte Extraktion** | Auto-Anlage aus Angeboten |
| Erinnerungen/Nachrücken | Demo-Simulation | **Automatik + Cron (nach X Std.)** | Eskalationsstufen, Vertretungspools |
| Reiseplanung & Agenda | voll (localStorage) | **DB + druckbare Agenda + E-Mail-Druck-Link** | Buchungs-Import der Airlines |
| Visum-Workflow (UAE) | voll (localStorage) | **Pass/Visum-Status + automatische Erinnerung (Cron)** | Anbindung an Visum-Dienstleister |
| Flugvorschläge | Heuristik im Browser | Heuristik (region→Zielflughafen) | Echtzeit-Preise/Buchung |
| E-Mail-Protokoll | localStorage-Log | **`email_log`-Tabelle (alle Mails)** | Zustellstatus/Bounces |

Nicht vergessen: 50 Trainerprofile = personenbezogene Daten mit internationalem Transfer
(Abu Dhabi) → Einwilligung, AVV mit artfiles, Löschkonzept und HTTPS von Anfang an. Details in `DEPLOY.md`.
