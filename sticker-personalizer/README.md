# ETAF Booklet-Personalisierung

Zwei Werkzeuge in einem Paket für die ETAF-Booklets:

1. **Officer-ID-Booklet** – das Aufkleber-/Badge-Booklet
   (`OM_BOOKLET_…_74401_74445.pdf`) anhand einer **Excel-Tabelle** personalisieren
   (Name, Rolle/Bedeutung, pro Person eindeutiger QR). → Abschnitt **A**.
2. **CBRN-Exhibit-Booklet** – ein druckfertiges Master-Booklet
   (`ETAF_CBRN_REDZONE_…_MASTER.pdf`) als **Massenware** mit je **eindeutiger
   Referenznummer** erzeugen. Jeder **QR-Code**, jeder **Barcode** und jede
   **Text-Stelle** wird konsistent ausgetauscht und anschließend **100 %
   verifiziert**. → Abschnitt **B**.

> **Schnellstart für Nicht-Techniker:** siehe [`ANLEITUNG.md`](ANLEITUNG.md) –
> Python installieren, `start.bat` (Windows) bzw. `start.sh` (macOS/Linux)
> doppelklicken, Browser auf http://127.0.0.1:5000.

---

## Installation

**Mac (am einfachsten):** Python von python.org installieren und `Start.command`
doppelklicken – siehe [`ANLEITUNG.md`](ANLEITUNG.md). Sonst:

```bash
cd sticker-personalizer
pip install -r requirements.txt          # reine pip-Installation, keine Systembibliothek
# optional nur für PDF/A:  macOS: brew install ghostscript | Ubuntu: sudo apt-get install -y ghostscript
```

---

# A) Officer-ID-Booklet (Aufkleber, aus Excel)

Pro Person eine Seite mit **Name**, **Bedeutung/Rolle**, **Officer-ID** und einem
**pro Person eindeutigen QR-Code** (zwei je Seite). Heraus kommt eine
druckfertige Booklet-PDF im Stil des Originals.

| Modus | Befehl | Ergebnis |
|-------|--------|----------|
| **overlay** | `overlay` | Nutzt die **Original-PDF** als Hintergrund, ersetzt nur QR + Name. Druckidentisch. |
| **generate** | `generate` | Rendert das Booklet aus einer **selbst entworfenen Vorlage** neu. Frei skalierbar. |

```bash
python personalize.py init-excel teams.xlsx          # Excel-Vorlage erzeugen

python personalize.py overlay teams.xlsx \           # druckidentisch
    --original OM_BOOKLET_260209_Booklet_1_74401_74445.pdf \
    --out booklet_personalisiert.pdf --qr-base-url https://etaf.example/o

python personalize.py generate teams.xlsx \          # neu aus eigener Vorlage
    --out booklet_neu.pdf --qr-base-url https://etaf.example/o
```

Excel-Spalten (tolerant erkannt): `Name`, `Bedeutung`/`Rolle`, `Team`,
`OfficerID` (leer = ab 74401), `Site`, `QR`/`URL`. QR-Inhalt-Priorität:
Spalte `QR` > `--qr-base-url` + ID > Fallback `Officer ID <id>`.

---

# B) CBRN-Exhibit-Booklet (Massenware mit Referenznummer)

Das CBRN-Booklet trägt eine **eindeutige Referenz** aus Team-Code, Country-Code
und einer fortlaufenden **Unique Reference Number** (im Master `CBRN 971 0035`).
Diese Referenz kommt **dutzendfach** vor – als Text, als **QR-Codes** und als
**Code128-Barcodes**, über fast alle Seiten verteilt. Für eine Auflage von z. B.
100 Stück muss jede Kopie eine andere Nummer tragen, und **jedes** Vorkommen muss
korrekt sein, damit es im DVI-Einsatz zu keiner Verwechslung kommt.

### Master analysieren

```bash
python personalize.py booklet-info ETAF_CBRN_REDZONE_..._MASTER.pdf
```

```
Quell-Referenz: 'CBRN 971 0035' (Ref-Breite 4)
  Bild-Symbole: 11  (QR=5, Barcode=6)
  Vektor-Symbole: 42 (z.B. Asservaten-Labels)
```

### 100 Kopien erzeugen (fortlaufend ab 0035)

```bash
python personalize.py booklet ETAF_CBRN_REDZONE_..._MASTER.pdf \
    --start 35 --count 100 --out-dir druck/
```

Ergebnis im Ordner `druck/`:

- **eine kombinierte Druck-PDF** (alle Kopien hintereinander, für die Druckerei) **und**
- **100 Einzel-PDFs**, gebündelt als **ZIP** (zur Einzelablage/Nachverfolgung).

Das Feld **„Book No: __ of __"** auf der Titelseite wird automatisch als
„laufende Nr. of Gesamt" gefüllt (`1 of 100`, `2 of 100`, …).

### Weitere Optionen

| Option | Wirkung |
|--------|---------|
| `--refs "35,40,100-105"` | Explizite Nummern/Bereiche statt `--start/--count`. |
| `--skip "50,51,77"` | Bei fortlaufend bestimmte (z. B. vergebene) Nummern auslassen. |
| `--ref-width 4` | Stellenzahl der Nummer (Standard: wie im Master → 4, mit führenden Nullen). |
| `--team CBRN` / `--country 971` | Team- bzw. Country-Code überschreiben (Standard: wie Master). |
| `--only-combined` / `--only-individual` | Nur eine der beiden Ausgabeformen. |
| `--book-total 100` | Gesamtzahl im „Book No"-Feld festlegen. |
| `--thorough` | Jede einzelne Symbol-Platzierung prüfen (sonst je Objekt eine – gleich sicher, schneller). |
| `--no-verify` | Verifikation überspringen (**nicht** für den Druck empfohlen). |

### Wie die Korrektheit garantiert wird

Das Booklet enthält zwei Arten von Symbolen, die **automatisch erkannt** werden:

- **Bild-Symbole** – QR-/Barcode-Bildobjekte, die seitenübergreifend mehrfach
  platziert sind. Das Bildobjekt wird **einmal** ersetzt; alle Platzierungen
  aktualisieren sich pixelgenau (Position/Größe/Rotation bleiben erhalten).
  Zusammengesetzte Label-Kacheln (die nur zufällig einen QR enthalten) werden
  zuverlässig **ausgeschlossen** und unverändert übernommen.
- **Vektor-Symbole** – einzeln gezeichnete QR-Codes mit Suffix (Asservaten-Labels
  `… - 1` … `… - N`). Sie werden zellweise neu erzeugt; das Suffix bleibt erhalten.

Nach jeder Kopie läuft eine **Verifikation**: jedes Symbol wird neu gescannt und
der Textlayer geprüft. Bleibt **irgendwo** die alte Nummer stehen oder trägt ein
Symbol die falsche Nummer, **bricht der Lauf sofort mit Fehlermeldung ab** – es
wird also nie eine fehlerhafte Datei in den Druck gegeben. Titel
(`CBRN RED ZONE`) und Dokumentcode im Fuß bleiben bewusst unverändert.

Zusätzlich läuft ein **Druckvorstufen-Check** mit: Alle Sonderfarben/Volltöne
(Stanze, Perforation, Nut/Rill, Passer) müssen als **Reinfarbe** erhalten bleiben
(nicht in Prozessfarbe umgewandelt, nicht entfernt), und **keine Schneide-/
Falzmarke** darf verschoben, angeschnitten oder umgefärbt sein. Andernfalls →
sofortiger Stopp. So bleibt die Datei für Stanze/Plotter korrekt.

---

# C) Dashboard (lokale Web-App)

Für 5–10 wiederkehrende Protokolle gibt es ein **lokales Web-Dashboard**
(`webapp/`) zum Verwalten, Produzieren und Nachverfolgen – mit Ampel-Status,
Excel-Import, Doppel-Schutz-Ledger und FTP-tauglicher SQLite-Datenbank.

```bash
python -m webapp.app        # -> http://127.0.0.1:5000
```

Details: siehe [`webapp/README.md`](webapp/README.md).

---

## Projektstruktur

```
sticker-personalizer/
├── personalize.py          CLI (init-excel | overlay | generate | booklet-info | booklet)
├── requirements.txt
├── assets/etaf_logo.png    aus dem Original extrahiertes Logo
├── examples/
│   ├── teams_example.xlsx          Beispiel-Tabelle (Officer-ID)
│   └── sample_output_generate.pdf  Muster-Ergebnis (generate-Modus)
└── sticker/
    ├── config.py           Maße, Farben, Positionen (Officer-ID)
    ├── qr_util.py          QR-Erzeugung (Vektor/Bild)
    ├── barcode_util.py     Code128-Barcode-Erzeugung (Bild)
    ├── excel_io.py         Excel lesen + Datenmodell
    ├── overlay.py          Officer-ID-Modus „overlay"
    ├── template.py         Officer-ID-Modus „generate"
    └── booklet.py          CBRN-Massenproduktion + 100%-Verifikation

webapp/                     lokales Dashboard (Flask + SQLite)
├── app.py                  Flask-Routen (REST + Seiten, Login-Schutz)
├── db.py                   SQLite (Protokolle, Läufe, Ledger, Benutzer, Audit, Settings)
├── jobs.py                 Analyse/Produktion (parallel) + Doppel-/Lücken-Check + KI-Insight
├── orders.py               Excel-Auftragsvorlage erzeugen/einlesen
├── auth.py                 Login, Benutzer, Zugriffsschutz
├── seal.py                 HMAC-Integritäts-Siegel je Nummer
├── pdfa.py                 PDF/A-Archivkopie (Ghostscript) + Symbol-Prüfung
├── ftp_util.py             FTP-/FTPS-Upload der Ergebnisse
├── exports.py              CSV-Ledger + Produktionsnachweis-PDF
├── templates/              index.html + login.html
└── static/                 app.js + style.css
```

## Hinweise

- Die **Master-/Original-PDFs werden nicht mitgeliefert**; jeweils den eigenen
  Pfad angeben.
- Verifikation und Symbol-Erkennung nutzen `zxing-cpp` (selbst-enthaltenes
  pip-Wheel, keine Systembibliothek). Optionaler Fallback: `pyzbar` (+ libzbar).
- Schrift ist Helvetica-Bold (metrisch nah an Arial-BoldMT des Originals);
  Referenznummern werden auf die Master-Stellenzahl mit führenden Nullen
  aufgefüllt, damit ersetzte Zahlen exakt sitzen.
