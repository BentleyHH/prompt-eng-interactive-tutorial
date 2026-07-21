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
Lade den kompletten Ordner `trainer-dashboard/` in dein Webverzeichnis, z. B. nach
`/dashboard/`. Struktur danach:
```
/dashboard/
  index.html
  config.js            ← aus config.js.sample erstellen (Schritt 4)
  backend/
    api.php  respond.php  db.php  lib.php  mailer.php
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
'from_email'  => 'trainer@etaf-dvi.org',
'base_url'    => 'https://deine-domain.de/dashboard/backend',
'mail_mode'   => 'mail',            // erst 'log' zum Testen, dann 'mail' oder 'smtp'
'seed_demo'   => true,              // Beispieldaten beim ersten Start
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
- `https://deine-domain.de/dashboard/` aufrufen → PIN eingeben.
- Ein Training öffnen → **Sammelanfrage senden**. Bei `mail_mode='log'` wird
  nichts verschickt, aber alles protokolliert (Menüpunkt lässt sich später ergänzen;
  vorerst in der DB-Tabelle `email_log` sichtbar).
- Auf `mail_mode='mail'` (oder `'smtp'`) umstellen, sobald der Versand echt sein soll.

## 6. E-Mail-Versand
- **`mail`** — nutzt PHP `mail()`. Auf artfiles für die eigene Domain meist ok.
- **`smtp`** — zuverlässiger (empfohlen für `trainer@…`). SMTP-Daten in `config.php`:
  ```php
  'mail_mode' => 'smtp',
  'smtp' => ['host'=>'smtp.artfiles.de','port'=>587,'secure'=>'tls',
             'user'=>'trainer@etaf-dvi.org','pass'=>'DEIN_MAIL_PASSWORT'],
  ```

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

## Was später leicht ergänzt werden kann
- E-Mail-Protokoll-Ansicht im Dashboard (Daten liegen schon in `email_log`).
- Automatisches Nachrücken + Erinnerungen nach X Stunden ohne Antwort.
- KI: Profile aus Lebensläufen/Excel anlegen, freie E-Mail-Antworten auswerten.
- Reise-/Flug-/Visum-Modul, Rollen & Audit-Log.
