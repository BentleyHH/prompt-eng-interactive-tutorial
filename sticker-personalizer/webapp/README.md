# Booklet-Dashboard (lokale Web-App)

Ein lokales Dashboard zum **Verwalten, Produzieren und Nachverfolgen** der
Booklet-Massenproduktion. Es nutzt dieselbe Engine wie das CLI
(`sticker.booklet`) und legt alles in einer **SQLite-Datei** ab – Datenbank und
Ausgaben liegen unter `webapp/data/` und lassen sich **1:1 per FTP sichern**.

> Hinweis: Die PDF-Produktion + 100%-Verifikation braucht **Python**
> (PyMuPDF/pyzbar). Reines Static-FTP kann sie nicht ausführen – darum läuft
> das Dashboard lokal (oder auf einem kleinen Server) und der FTP dient als
> Ablage/Backup.

## Starten

```bash
cd sticker-personalizer
sudo apt-get install -y libzbar0
pip install -r requirements.txt
python -m webapp.app
# -> http://127.0.0.1:5000
```

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
- **Abdeckung**: Anzahl, Bereich (min–max) und **Lücken** je Country.
- **Downloads**: kombinierte Druck-PDF und ZIP der Einzel-PDFs je Lauf.

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
| GET  | `/api/runs/<id>/download/combined`·`/zip` | Ergebnis herunterladen |
| GET  | `/api/produced?protocol=<id>&country=49` | Ledger + Abdeckung |
