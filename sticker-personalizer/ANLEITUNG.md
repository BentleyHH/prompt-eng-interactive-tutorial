# Schnellstart – in 3 Schritten

Du brauchst nur **einmal** etwas einzurichten. Danach reicht ein Doppelklick.

## Schritt 1 – Python installieren (nur einmal)

- **Windows / macOS:** https://www.python.org/downloads/ → großen gelben Knopf
  „Download" klicken, Datei öffnen, durchklicken.
  - **Windows-WICHTIG:** im ersten Installationsfenster unten das Häkchen
    **„Add Python to PATH"** setzen, dann „Install Now".
- **Linux (Ubuntu/Debian):** Terminal öffnen und einfügen:
  `sudo apt-get install -y python3 python3-venv python3-pip`

## Schritt 2 – Programm starten

- **Windows:** Doppelklick auf **`start.bat`**
- **macOS / Linux:** Doppelklick auf **`start.sh`**
  (falls es nur im Editor aufgeht: Terminal im Ordner öffnen und `./start.sh`
  eingeben; einmalig vorher `chmod +x start.sh`).

Beim **ersten Mal** lädt es 1–2 Minuten die benötigten Pakete – das ist normal.
Danach geht es sofort.

## Schritt 3 – Im Browser öffnen

Browser öffnen und eingeben: **http://127.0.0.1:5000**
Erster Login: **admin** / **admin** (Passwort danach oben rechts ändern).

Fertig. 🎉

---

### Zwei optionale Zusatzwerkzeuge

Nur nötig, wenn du diese Funktionen wirklich nutzt – das Programm läuft auch ohne:

| Funktion | Was fehlt sonst | Installation (einmalig) |
|----------|-----------------|--------------------------|
| **QR/Barcode-Prüfung** (Verifikation) | Produktion meldet „libzbar" fehlt | **Win:** meist automatisch dabei. **macOS:** `brew install zbar` · **Linux:** `sudo apt-get install -y libzbar0` |
| **PDF/A-Archiv** | nur PDF/A-Erstellung | **Win:** Ghostscript von https://ghostscript.com/releases/ · **macOS:** `brew install ghostscript` · **Linux:** `sudo apt-get install -y ghostscript` |

> „brew" ist der Mac-Installer von https://brew.sh – einmal einrichten, dann
> funktionieren die `brew install …`-Befehle.

### Wo liegen meine Daten?

Alles (Datenbank, hochgeladene Master, erzeugte PDFs) liegt im Unterordner
**`webapp/data/`**. Diesen Ordner per FTP sichern = komplettes Backup.

### Hilfe

- „Seite nicht erreichbar" im Browser? → Das schwarze Start-Fenster muss offen
  bleiben, solange du arbeitest.
- Etwas klemmt? Start-Fenster schließen und `start`-Datei erneut doppelklicken.
