# Deployment auf artfiles.de (PHP + MySQL)

Schritt-für-Schritt, um aus dem Prototyp ein echtes, von mehreren Geräten
nutzbares Tool zu machen. Zeitaufwand: ~20–30 Minuten.

## 0. Voraussetzungen
- artfiles-Webhosting mit **PHP 8.x** und **einer MySQL-Datenbank**
- FTP-/SFTP-Zugang (oder den artfiles-Dateimanager)
- Eine E-Mail-Adresse `trainer@…` (für Versand & spätere Antworten)

## 1. Datenbank anlegen
Im artfiles-Kundenmenü eine MySQL-Datenbank erstellen. Du bekommst:
- **Host** (oft `sql.local` oder `sqlXXX.artfiles.de`)
- **Datenbankname**, **Benutzer**, **Passwort**

> Das Schema musst du **nicht** von Hand einspielen — das Backend legt die
> Tabellen beim ersten Aufruf automatisch an. (Wer möchte, kann `backend/schema.sql`
> über phpMyAdmin importieren.)

## 2. Dateien hochladen
Lade den **Inhalt** von `trainer-dashboard/` in das Web-Verzeichnis (Document Root)
der Subdomain **`cockpit.dvi-systems.com`**, sodass `index.html` direkt unter
`https://cockpit.dvi-systems.com/` liegt. Wichtig: `icons/` und `manifest.webmanifest`
**mit hochladen** (für die App-Installation aufs Handy). Struktur danach:
```
(Document Root von cockpit.dvi-systems.com)
  index.html
  manifest.webmanifest
  icons/               ← App-Icons (ETAF)
  config.js            ← aus config.js.sample erstellen (Schritt 4)
  backend/
    api.php  respond.php  db.php  lib.php  mailer.php
    agenda.php  ics.php  cron.php  ai.php  automation.php
    ppt.php  pptmail.php  verify.php  check.php
    config.php          ← aus config.sample.php erstellen (Schritt 3)
    .htaccess  schema.sql
```

## 3. Backend konfigurieren
`backend/config.sample.php` → kopieren nach `backend/config.php` und ausfüllen:
```php
'driver'   => 'mysql',
'db_host'  => 'sql.local',          // dein artfiles-Host
'db_name'  => 'DEIN_DB_NAME',
'db_user'  => 'DEIN_DB_USER',
'db_pass'  => 'DEIN_DB_PASSWORT',
'default_pin' => '481509',          // dein Wunsch-PIN (wird gehasht gespeichert)
'from_email'  => 'trainer@dvi-systems.com',
'base_url'    => 'https://cockpit.dvi-systems.com/backend',
'mail_mode'   => 'mail',            // erst 'log' zum Testen, dann 'mail' oder 'smtp'
'anthropic_key' => '',              // Claude-API-Key für KI-Import (leer = aus)
'cron_key'    => 'ein-zufälliger-wert', // schützt backend/cron.php
'ics_key'     => 'ein-kalender-schluessel', // schützt den iCal-Abo-Link (backend/ics.php)
'seed_demo'   => true,              // Beispieldaten (inkl. 3 Kunden) beim ersten Start
```
> `config.php` wird durch `.htaccess` vor direktem Zugriff geschützt und ist im
> Git ausgeschlossen. **Niemals Zugangsdaten committen.**

## 4. Frontend auf Live-Modus stellen
`config.js.sample` → kopieren nach `config.js` (neben `index.html`):
```js
window.ETAF = { apiBase: 'backend', pollMs: 8000 };
```
Ohne diese Datei läuft das Dashboard weiter als lokale Demo — praktisch zum Zeigen.

## 5. Öffnen & testen
- `https://cockpit.dvi-systems.com/` aufrufen → PIN eingeben.
- Ein Training öffnen → **Sammelanfrage senden**. Bei `mail_mode='log'` wird
  nichts verschickt, aber alles protokolliert — sichtbar unter **Protokoll** im
  Dashboard (und in der DB-Tabelle `email_log`).
- Auf `mail_mode='mail'` (oder `'smtp'`) umstellen, sobald der Versand echt sein soll.

## 6. E-Mail-Versand
- **`mail`** — nutzt PHP `mail()`. Auf artfiles für die eigene Domain meist ok.
- **`smtp`** — zuverlässiger (empfohlen für `trainer@…`). SMTP-Daten in `config.php`:
  ```php
  'mail_mode' => 'smtp',
  'smtp' => ['host'=>'smtp.artfiles.de','port'=>587,'secure'=>'tls',
             'user'=>'trainer@dvi-systems.com','pass'=>'DEIN_MAIL_PASSWORT'],
  ```

### Kommen keine Mails an? → Diagnose-Seite
Rufe auf:
```
https://cockpit.dvi-systems.com/backend/mailtest.php?key=DEIN_CRON_KEY&to=deine@mail.de
```
(`key` = `cron_key` aus `config.php`.) Die Seite zeigt die aktive Konfiguration,
verschickt eine Test-Mail und protokolliert den **kompletten SMTP-Dialog** — so
sieht man sofort, ob es an Verbindung, Login (Passwort!), Empfänger oder erst an
der Zustellung (Spam / fehlendes SPF/DKIM) liegt. Das Passwort wird nie angezeigt.

Häufigste Ursachen:
- `mail_mode` steht auf `'log'` → es wird nichts versendet. Auf `'smtp'` stellen.
- SMTP-`pass` ist leer oder falsch → „Login abgelehnt (kein 235)".
- Mail wird angenommen, kommt aber nicht an → **Spam-Ordner** prüfen und
  **SPF/DKIM** für `dvi-systems.com` im DNS setzen (siehe unten).

## Wie der Verfügbarkeits-Rückkanal funktioniert
Jede Anfrage-E-Mail enthält drei Buttons **✅ Ja / 🤔 Vielleicht / ❌ Nein**.
Dahinter steckt ein persönlicher Magic-Link (`respond.php?token=…`). Klickt der
Trainer, wird der Status **sofort in der Datenbank** gesetzt und erscheint beim
nächsten Poll (Standard alle 8 s) automatisch im Dashboard — auf allen Geräten.
Es muss niemand eine E-Mail lesen oder abtippen.

## Sicherheit & DSGVO (bitte beachten)
- **HTTPS** verwenden (artfiles bietet Let's-Encrypt-Zertifikate).
- 6-stelliger PIN ist bewusst niedrigschwellig — für sensible Bestände zusätzlich
  auf HTTPS + ggf. IP-/Passwortschutz des Verzeichnisses setzen.
- 50 Trainerprofile = personenbezogene Daten, teils Transfer nach Abu Dhabi:
  Einwilligung der Trainer, Auftragsverarbeitung mit artfiles (AVV), Löschkonzept
  und EU-Hosting mitdenken.
- Regelmäßige DB-Backups im artfiles-Menü aktivieren.

## KI-Import (Profile aus Lebenslauf / Excel / Angebot)
- API-Key von **console.anthropic.com** holen und als `anthropic_key` in `config.php` eintragen
  (Modell: `claude-opus-4-8`).
- Im Dashboard unter **Trainer → Profile importieren**: Text einfügen → **Mit KI analysieren** →
  erkannte Profile prüfen → **übernehmen**. Ohne Key bleibt der Import deaktiviert (klarer Hinweis).

## Automatik (Erinnerungen + Nachrücken) per Cron
Im Dashboard unter **Automatik** einstellbar: Erinnerung nach X Stunden, „überfällig nach" X Stunden,
und „automatisch nachrücken" (bei Absage/Überfälligkeit den nächstbesten Trainer anfragen).
Manuell auslösbar über **Jetzt prüfen & senden**. Für den Automatikbetrieb im artfiles-Kundenmenü
einen **Cronjob** anlegen, z. B. stündlich:
```
curl -s "https://cockpit.dvi-systems.com/backend/cron.php?key=DEIN_CRON_KEY"
```
Der `key` muss mit `cron_key` aus `config.php` übereinstimmen (schützt den Endpunkt).

## Reiseplanung & druckbare Agenda
Im Training unter **„✈ Reise & Agenda"** trägst du Hotel, Treffpunkt, Ansprechpartner, Dresscode,
Per Diem, Hinweise und das Programm ein; je Trainer (Status „zugesagt") Flug- & Zimmerdaten.
Über **🖨 Agenda** siehst/druckst du die persönliche Reise-Info; über **✉ Agenda senden** bekommt
der Trainer eine E-Mail mit **Druck-Link** (`backend/agenda.php?token=…`) — die Seite öffnet ohne
Login und lässt sich direkt ausdrucken. Der Token ist der der jeweiligen Anfrage; nichts weiter zu
konfigurieren.

## Zertifizierung der Teilnehmer
Der Bereich **„Zertifizierung"** braucht keine zusätzliche Einrichtung - die Tabellen legt das
Backend beim ersten Aufruf selbst an und füllt den Kriterienkatalog einmalig mit dem
DVI-Startkatalog (5 Hauptkriterien, 22 Kriterien, davon 6 K.-o.-Kriterien). Danach ist der
Katalog frei änderbar; wird ein Kriterium bereits benutzt, archiviert das Cockpit es statt
es zu löschen, damit ältere Bewertungen lesbar bleiben.

Unter **Katalog → Bewertungsregeln** stellst du Skala, Bestehensgrenze, Auszeichnungsgrenze,
K.-o.-Schwelle und Mindestanwesenheit ein. Sie gelten für alle Blöcke.

Zeugnisse (je Block) und Abschlusszertifikate (ganzer Lehrgang) bekommen eine fortlaufende
**Prüfnummer**. Wer sie hat, kann die Echtheit ohne Login bestätigen lassen:

```
https://cockpit.dvi-systems.com/backend/verify.php?nr=ETAF-2026-0001-AB12
```

Die Seite nennt Name, Umfang, Ergebnis und Ausstellungsdatum - **keine Einzelnoten**. Sie ist
für Suchmaschinen gesperrt (`noindex`) und bremst Fehlversuche aus. Zurückgezogene Dokumente
zeigt sie als ungültig an. Der Link steht am Fuß jedes gedruckten Papiers; er richtet sich
automatisch nach der Adresse, unter der das Cockpit läuft.

### Teilnehmer einsammeln
Unter **Zertifizierung -> Teilnehmer -> Liste einlesen** liegt eine **Excel-Vorlage**
(deutsch oder englisch) zum Herunterladen. Sie hat drei Blaetter: ein leeres
Erfassungsblatt, ein Beispielblatt mit fuenf erfundenen Personen und ein Blatt mit
Ausfuellhinweisen. Die Vorlage geht an den Kunden; die ausgefuellte Datei wird an
derselben Stelle wieder hochgeladen (.xlsx oder .csv).

Die Spalten werden an der Ueberschrift erkannt - deutsch wie englisch, in beliebiger
Reihenfolge und auch mit den ueblichen Abweichungen wie „Pers.-Nr." oder
„Einheit/Abteilung". Geburtsdaten in `12.04.1988`, `12/04/1988`, `1988-04-12` und als
Excel-Tageszahl werden vereinheitlicht. Leerzeilen, doppelte Kopfzeilen und bereits
vorhandene Personen werden uebersprungen und in der Rueckmeldung gezaehlt.

### Vor dem Echtstart aufraeumen
Wenn der Auftrag steht und die echten Teilnehmer kommen, entfernt
**Zertifizierung -> Katalog -> Daten zuruecksetzen** (nur fuer Administratoren) alle
Uebungsdaten: Teilnehmer, Teilnahmen, Bewertungen, Einzelwertungen und ausgestellte
Zertifikate. Der Kriterienkatalog bleibt erhalten, wenn du das nicht ausdruecklich
mit ankreuzt. Trainings, Trainer, Wochenplaene und Folien sind nicht betroffen.
Der Vorgang laesst sich nicht rueckgaengig machen, verlangt deshalb das getippte
Wort RESET und landet im Protokoll.

### Zwischenbilanz fuer den Kunden
**Zertifizierung -> Auswertung -> Zwischenbilanz** schneidet alle Zahlen nach
Zeitraum: Monat, Quartal, Halbjahr, Jahr, Gesamt oder frei gewaehlt, mit Pfeilen
zum Blaettern. Verglichen wird automatisch mit dem gleich langen Zeitraum davor.
Der Bericht zeigt Fortschritt, Entwicklung, Kompetenzprofil und je Teilnehmer eine
Ampel mit Trend - die Regel dahinter steht unter der Tabelle, damit der Kunde die
Einordnung nachvollziehen und selbst nachjustieren kann. Druck und CSV wie ueberall.

## Visum-Workflow (Abu Dhabi)
Im Reise-Editor je Trainer trägst du **Reisepass gültig bis** und **Visum-Status**
(benötigt / beantragt / genehmigt / abgelehnt) samt Notizen ein; im Roster zeigt eine
Statusampel den Stand. Die Automatik (siehe Cron oben) erinnert **bestätigte UAE-Trainer
ohne genehmigtes Visum** einmalig automatisch an die Reisepass-Kopie — idempotent, es geht
also keine doppelte Erinnerung raus. Pass- und Visum-Angaben erscheinen auch auf der
druckbaren Agenda (`agenda.php`).

## Automatische Flugvorschläge
Im Reise-Editor liefert **„Flüge vorschlagen"** aus Heimatregion → Zielflughafen passende
Verbindungen (z. B. München → Abu Dhabi). Ein Klick auf **Übernehmen** trägt Hin-/Rückflug
in die Reisedaten ein. Die Vorschläge sind heuristisch (keine Live-Preise) und dienen als
Ausfüllhilfe — die endgültige Buchung machst du wie gewohnt selbst.

## E-Mail-Protokoll
Der Menüpunkt **Protokoll** listet alle versendeten E-Mails (Empfänger, Betreff, Sprache,
Zeitpunkt, Status) — Anfragen, Erinnerungen, Visum-Hinweise und Agenda-Mails an einem Ort.
Grundlage ist die Tabelle `email_log`, die bei jedem Versand (auch bei `mail_mode='log'`)
befüllt wird.

## Vorgeladenes Programm (DVI Elite Team 2026–2027)
Die Standard-Installation legt das reale **Operational DVI Elite Team Programme 2026–2027** an:
24 Einsätze (W1–W20 mit exakten Datumsbereichen, PM-Modul in Weeze als Kohorte A/B, zwei
Train-the-Trainer-Blöcke und die Abschluss-Zertifizierung), Kunde **Abu Dhabi Police — DVI**.
Im **Demo-Modus** wird das Programm beim ersten Laden nach einem Update automatisch übernommen
(Sprache, Einstellungen, E-Mail-Protokoll & Vorlagen bleiben erhalten). Willst du im Demo-Modus
ganz neu starten, `localStorage` leeren.

## Mehrere Kunden / Projekte
Das Tool ist mandantenfähig: jedes Training gehört zu einem **Kunden** mit eigener Farbe. Oben rechts
schaltest du zwischen **„Alle Kunden"** und einem einzelnen Kunden um; bei „Alle Kunden" zeigt der
**Leitstand** je Kunde eine Kachel (wo es brennt / in Arbeit / fertig besetzt). Standardmäßig ist nur
**Abu Dhabi Police — DVI** angelegt; weitere Kunden (z. B. weitere Behörden/Länder) ergänzt du über
**⚙ Kunden verwalten** (Name, Kürzel, Farbe, Land). Ein Training ordnest du in der Detailansicht per
Auswahlfeld einem Kunden zu.

## Trainings anlegen & bearbeiten
Unter **Trainings → + Neues Training** legst du ein Training direkt im Dashboard an (Kunde, Thema,
Ort, Land, Beginn/Ende als Datum, Schwerpunkt, benötigte Trainer, Teilnehmer). Aus dem Datum werden
Kalenderwoche und Monat automatisch abgeleitet. Bestehende Trainings öffnest und bearbeitest (oder
löschst) du über **✎ Bearbeiten** in der Detailansicht.

## Intelligente Materialliste
Jedes Training hat eine **Materialliste** (Positionen = Material + Anzahl). Die Materialien pflegst
du zentral über **⚙ Material-Katalog** (DVI-Kits, Leichensäcke, CBRN-Kits, Ante-/Post-Mortem-
Protokolle, DNA-/Fingerprint-Sets, Schutzanzüge, Verbrauchsmaterial) mit Bezeichnung, Einheit und
Kategorie. In der Trainingsansicht unter **Material bearbeiten** setzt du Positionen und Mengen.

**Typ-Vorlagen (intelligent):** Über **💾 Als Standard für „<Schwerpunkt>" speichern** hinterlegst du
die Standard-Materialliste für einen Schwerpunkt (z. B. „Post Mortem" oder „CBRN"). Legst du ein neues
Training mit demselben Schwerpunkt an, wird diese Liste **automatisch übernommen**. Über
**🖨 Materialliste** druckst du die Liste als Packliste. (Ausgeliefert sind bereits Vorlagen für
Post Mortem, Ante Mortem, Scene & Recovery, CBRN und Simulation.)

## Kalender: iCal-Export & Wandkalender
- **iCal-Datei (.ics)**: Über **⤓ iCal (.ics)** lädst du alle Trainings der aktuellen Kunden-Auswahl
  als Kalenderdatei herunter (exakte Termine, Farbe/Kategorie pro Kunde) und importierst
  sie in Google/Apple/Outlook.
- **Abonnierbarer Link (Live)**: Setze `ics_key` in `config.php` und trage in deinem Kalender
  „Kalender abonnieren" mit dieser URL ein — er aktualisiert sich automatisch:
  ```
  https://cockpit.dvi-systems.com/backend/ics.php?key=DEIN_ICS_KEY
  ```
  Optional nur ein Kunde: `…&client=<client_id>` (z. B. `cl-adp`).
- **Wandkalender (Druck)**: Über **📅 Wandkalender** öffnet sich eine chronologische, farbcodierte
  Monatsübersicht — im Querformat zum Ausdrucken und An-die-Wand-hängen.

## Was später noch dazukommen könnte
- KI-Auswertung frei geschriebener E-Mail-Antworten (zusätzlich zu den Magic-Link-Buttons).
- Anbindung an Airline-Buchung / Visum-Dienstleister, Rollen & Audit-Log.
- 2-Wege-Kalender-Sync (CalDAV) statt reinem Abo-Feed.
