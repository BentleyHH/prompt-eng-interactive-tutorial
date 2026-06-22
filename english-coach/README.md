# English Coach 🗣️

Dein persönlicher Englisch-Gesprächspartner, der dich von **B-Level nach C1** bringt —
mit echten Gesprächen (Sprache **und** Text), sanften Korrekturen, automatisch
gesammelten Vokabeln (Spaced Repetition), Fortschritt und einem persönlichen Lernplan.

Läuft komplett auf deinem **Artfiles.de-Webhosting** (PHP + MySQL). Dein Claude-API-Key
liegt **sicher auf dem Server** und ist nie im Browser sichtbar.

---

## Was die App kann

- **Gespräche im Thema** – Smalltalk, Vorstellungsgespräch, Meeting, Reisen, Diskussion …
  Eigene Themen kannst du jederzeit hinzufügen.
- **Audio-first** – Mikro antippen und sprechen (Speech-to-Text), Coach liest seine
  Antwort vor (Text-to-Speech). Tippen geht natürlich auch.
- **Angstfrei** – der Coach hält dich am Reden, korrigiert höchstens 1–2 Dinge pro Runde
  und ermutigt dich. Genau gegen die Angst, „im Gespräch zu versagen".
- **Vokabeln automatisch** – nützliche B2/C1-Wörter aus dem Gespräch landen in deiner
  Datenbank und kommen per Spaced Repetition zum Wiederholen zurück.
- **Deutsch-Stütze** – jede Coach-Antwort hat eine deutsche Übersetzung auf Knopfdruck.
- **Plan & Fortschritt** – Streak, Level-Schätzung, 4-Wochen-Plan vom Coach.
- **PWA** – „Zum Home-Bildschirm hinzufügen" → fühlt sich an wie eine App.

### Ehrlich zur „Bildschirm aus"-Idee
Mobile Browser frieren JavaScript und Mikrofon ein, sobald das Display gesperrt wird.
Deshalb:
- ✅ Während die App offen ist, hält ein **Wake-Lock** den Bildschirm an.
- ✅ **Vorlesen** läuft als Audio kurz weiter, auch wenn du wegschaust.
- ❌ Dass die App dir *zuhört und antwortet, während das Display aus ist*, geht in einer
  Web-App nicht zuverlässig — das schafft nur eine native App. (Kann ein späterer Schritt sein.)

---

## Installation auf Artfiles (Schritt für Schritt)

### 1. Datenbank anlegen
1. Im **Artfiles DCP → Datenbanken** eine MySQL-Datenbank anlegen (Name, User, Passwort notieren).
2. **phpMyAdmin** öffnen, die Datenbank auswählen.
3. Reiter **Importieren** → Datei `db/schema.sql` hochladen und ausführen.
4. Nochmal **Importieren** → `db/seed_topics.sql` (legt Start-Themen an).

### 2. Config ausfüllen
1. `api/config.sample.php` kopieren nach `api/config.php`.
2. Eintragen:
   - **db**: Host (meist `localhost`), Name, User, Passwort der Datenbank.
   - **app_password**: dein Login-Passwort für die App.
   - **session_secret**: eine lange zufällige Zeichenkette (z. B. 40+ Zeichen).
   - **anthropic.api_key**: dein Key von <https://console.anthropic.com>.
   - **anthropic.model**: `claude-sonnet-4-6` (schnell & stark) oder `claude-opus-4-8` (beste Qualität).

### 3. Dateien hochladen
Den **Inhalt** des Ordners `english-coach/` per FTP in dein Webverzeichnis legen
(z. B. nach `/htdocs/coach/`), sodass `index.html` und der Ordner `api/` nebeneinander liegen.

> Wichtig: Über **HTTPS** aufrufen. Mikrofon und PWA funktionieren nur über HTTPS.

### 4. Aufrufen
`https://deine-domain.de/coach/` öffnen → mit deinem `app_password` einloggen → Thema wählen → losreden.
Auf dem Handy: Browser-Menü → „Zum Home-Bildschirm hinzufügen".

---

## Aufbau (für später / Erweiterungen)

```
english-coach/
├─ index.html            Oberfläche (eine Seite, 4 Tabs)
├─ css/styles.css
├─ js/
│  ├─ api.js             fetch-Wrapper inkl. Login-Token
│  ├─ speech.js          TTS, STT (Mikro), Wake-Lock
│  └─ app.js             gesamte App-Logik
├─ api/                  PHP-Backend
│  ├─ _bootstrap.php     DB, Auth, Claude-Aufruf
│  ├─ auth.php           Login → Token
│  ├─ topics.php         Themen (CRUD)
│  ├─ conversation.php   Gespräche + Coach-Prompt  ← Herzstück
│  ├─ vocab.php          Vokabeln + Spaced Repetition (SM-2)
│  └─ progress.php       Statistik + Lernplan
└─ db/
   ├─ schema.sql         Tabellen
   └─ seed_topics.sql    Start-Themen
```

### Voraussetzungen
- PHP **8.0+** mit cURL (Standard bei Artfiles).
- MySQL/MariaDB.
- Moderner Browser. Mikro-Eingabe am besten in **Chrome/Edge/Safari**.

### Modell wechseln / Kosten
In `api/config.php` unter `anthropic.model`. Pro Gesprächsrunde fallen je nach Modell
nur wenige Cent an. Mit `max_tokens` lässt sich die Antwortlänge steuern.

### Sicherheit
- `api/config.php` ist in `.gitignore` und wird **nie** eingecheckt.
- Alle API-Endpunkte verlangen das Login-Token → der Claude-Key kann nicht „angezapft" werden.

---

## Mögliche nächste Schritte
- Aussprache-Bewertung, rollenbasierte Szenarien mit Zielen
- Export der Vokabeln (Anki/CSV)
- Mehrere Profile / echte Benutzerkonten
- Native App (für echtes Weiterlaufen bei gesperrtem Bildschirm)
