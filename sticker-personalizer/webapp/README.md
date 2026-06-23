# Booklet-Dashboard (lokale Web-App)

Ein lokales Dashboard zum **Verwalten, Produzieren und Nachverfolgen** der
Booklet-Massenproduktion. Es nutzt dieselbe Engine wie das CLI
(`sticker.booklet`) und legt alles in einer **SQLite-Datei** ab – Datenbank und
Ausgaben liegen unter `webapp/data/` und lassen sich **1:1 per FTP sichern**.

> Hinweis: Die PDF-Produktion + 100%-Verifikation braucht **Python**
> (PyMuPDF/zxing-cpp). Reines Static-FTP kann sie nicht ausführen – darum läuft
> das Dashboard lokal (oder auf einem kleinen Server) und der FTP dient als
> Ablage/Backup.

## Starten

```bash
cd sticker-personalizer
pip install -r requirements.txt                # reine pip-Installation
# optional nur für PDF/A:  macOS: brew install ghostscript | Ubuntu: sudo apt-get install -y ghostscript
python -m webapp.app
# -> http://127.0.0.1:5000     (erster Login: admin / admin – danach Passwort ändern)
```

> macOS am einfachsten: `Start.command` doppelklicken (siehe `ANLEITUNG.md`).

## Funktionen

- **Protokolle importieren** (Master-PDF hochladen). Es laufen automatisch die
  Analyse und eine **Ampel**:
  - 🟠 orange = läuft, 🔴 rot = Fehler, 🟢 grün = sauber analysiert, ⚪ grau = neu.
- **Analyse** erkennt Quell-Referenz (Team/Country/Nummer), QR-/Barcode-Objekte
  und Vektor-Symbole.
- **Produzieren**: ein Protokoll anklicken, **Country-Code** + **Bereich/Menge**
  angeben (z. B. *Von 1 Bis 2000*, oder *ab 35 × 100*, oder explizit *3–48* zum
  Nachdruck). Lauf läuft im Hintergrund mit Fortschrittsbalken und endet grün
  (verifiziert) oder rot (mit Fehlermeldung – nichts geht fehlerhaft in den Druck).
- **Excel-Import**: pro Protokoll eine **Vorlage herunterladen**, offline
  ausfüllen (mehrere Aufträge je Zeile), wieder hochladen → Vorschau mit
  Doppel-Prüfung, dann zeilenweise produzieren.
- **Doppel-Schutz / Ledger**: jede je erzeugte Nummer wird gespeichert.
  Eindeutigkeit gilt je **(Protokoll + Country-Code + Nummer)** – dieselbe `0035`
  ist also für DE (`49`) und Abu Dhabi (`4971`) erlaubt. Vor jedem Lauf wird
  geprüft, was schon existiert; im Modus **neu** werden Doppelte übersprungen,
  im Modus **nachdruck** bewusst erneut erzeugt.
- **Druckvorstufen-Check** (automatisch je Kopie): bestätigt, dass alle
  Sonderfarben (Stanze/Perfo/Nut/Passer) als Reinfarbe erhalten bleiben und
  keine Schneide-/Falzmarke verändert wurde – sonst wird der Lauf rot. Die
  erkannten Sonderfarben stehen in der Protokoll-Analyse.
- **Abdeckung**: Anzahl, Bereich (min–max) und **Lücken** je Country.
- **Downloads**: kombinierte Druck-PDF und ZIP der Einzel-PDFs je Lauf.

### Zusätzliche Funktionen

- **Login + Audit-Log**: Anmeldung (Rollen *admin*/*operator*); jede Aktion
  (Import, Produktion, Export, FTP …) wird mit Benutzer und Zeit protokolliert
  (Knopf „Audit-Log"). Erststart legt `admin`/`admin` an.
- **Parallele Produktion**: Feld „Parallel" (1–8) baut mehrere Kopien
  gleichzeitig (Prozesse) – ~3× schneller (≈ 3 min statt 10 min für 100 Stück).
- **Integritäts-Siegel**: jede Nummer erhält ein HMAC-Siegel mit Prüfziffer
  (mod 97). Über `/api/verify?protocol=…&country=…&ref=…&seal=…` lässt sich
  später zweifelsfrei prüfen, dass eine Nummer aus dieser Produktion stammt.
- **PDF/A-Archivkopie**: Checkbox „PDF/A-Archiv" (oder Knopf je Lauf) erzeugt
  eine ISO-Archivversion. Nach der Konvertierung werden Stichproben neu gescannt;
  verliert die PDF/A ein Symbol, wird sie **verworfen** (keine kaputte Archivdatei).
  Läuft als Hintergrundschritt nach dem (bereits grünen) Lauf – Ghostscript ist
  bei sehr großen kombinierten PDFs langsam (~15 s je Booklet), das Dashboard
  bleibt derweil bedienbar.
- **FTP-Upload**: in den *Einstellungen* (Admin) Host/Port/Benutzer/Passwort/TLS
  hinterlegen und testen. Checkbox „nach FTP hochladen" lädt Druck-PDF, ZIP und
  PDF/A nach jedem Lauf hoch; alternativ Knopf „FTP-Upload" je Lauf.
- **Export / Produktionsnachweis**: „CSV" (Ledger mit Siegeln, Excel-tauglich)
  und „Nachweis-PDF" (Produktionsnachweis mit Zusammenfassung und Nummernliste).
- **KI-Check**: Knopf „KI-Check" liefert eine Klartext-Übersicht je Country
  (Bereich, Lücken, nächste freie Nummer, Nachdrucke, Auffälligkeiten).

## Datenablage / Backup

```
webapp/data/
├── app.db              SQLite-Datenbank (Protokolle, Läufe, Ledger)
├── masters/            hochgeladene Master-PDFs
└── output/run_<id>/    erzeugte Druck-PDF + Einzel-ZIP je Lauf
```

Den ganzen Ordner `webapp/data/` per FTP sichern = vollständiges Backup inkl.
Historie der bereits produzierten Nummern.

## API (Kurzüberblick)

| Methode | Pfad | Zweck |
|---------|------|-------|
| GET  | `/api/protocols` | Liste inkl. Ampel-Status |
| POST | `/api/protocols` | Master-PDF hochladen (multipart) → analysiert |
| GET  | `/api/protocols/<id>?country=49` | Detail + Abdeckung + Läufe |
| GET  | `/api/protocols/<id>/template.xlsx` | Auftragsvorlage (Excel) |
| POST | `/api/protocols/<id>/check` | Bereich prüfen (neu/doppelt/nächste freie) |
| POST | `/api/protocols/<id>/orders/preview` | Auftrags-Excel importieren (Vorschau) |
| POST | `/api/protocols/<id>/produce` | Lauf starten (Bereich/Menge/Modus) |
| GET  | `/api/runs/<id>` | Status/Fortschritt |
| GET  | `/api/runs/<id>/download/combined`·`/zip`·`/pdfa` | Ergebnis herunterladen |
| POST | `/api/runs/<id>/pdfa` · `/ftp` | PDF/A erzeugen · per FTP hochladen |
| GET  | `/api/produced?protocol=<id>&country=49` | Ledger + Abdeckung |
| GET  | `/api/produced/export.csv` · `/certificate.pdf` | CSV-Ledger · Nachweis-PDF |
| GET  | `/api/protocols/<id>/insight` | KI-Klartext-Übersicht |
| GET  | `/api/verify?protocol=&country=&ref=&seal=` | Siegel prüfen |
| GET/POST | `/api/settings` · `/api/users` · `/api/audit` | Admin: FTP/Benutzer/Log |
