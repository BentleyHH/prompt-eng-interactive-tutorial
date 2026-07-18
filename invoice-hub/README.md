# Rechnungs-Hub

Zentrale, automatisierte Rechnungsverarbeitung für **zwei Firmen + Privat** —
ein selbstgebautes Gegenstück zu GetMyInvoices, sevDesk & Co., zugeschnitten
auf Postfach-Ingestion, KI-Extraktion mit Claude und saubere Ablage auf OneDrive.

> **Status:** lauffähiges Fundament. Die komplette Pipeline läuft sofort im
> **Dry-Run** mit Beispielrechnungen (keine Zugänge nötig). Die echten
> Anbindungen (Gmail, Claude, Microsoft Graph) sind implementiert und über
> `.env` aktivierbar.

---

## Ist das überhaupt machbar? — Ehrliche Einordnung

| Baustein | Machbarkeit | Anmerkung |
|---|---|---|
| Postfach überwachen (`rechnungen@…`) | ✅ robust | Gmail API / IMAP, Standard |
| Rechnungen auslesen (PDF, ZUGFeRD, XRechnung) | ✅ robust | Claude für PDFs, XML nativ |
| Firma A / B / Privat trennen | ✅ robust | **getrennte Postfächer pro Einheit** |
| Eingang/Ausgang erkennen | ✅ robust | über eigene USt-IdNr. |
| Sortiert auf OneDrive ablegen | ✅ robust | Microsoft Graph API |
| Fehlende Rechnungen melden | ✅ robust | eigener „Radar" (siehe unten) |
| **Telekom & Co. „automatisch runterziehen"** | ⚠️ **fragil** | siehe Kasten |

> **Zur „Telekom anschließen"-Frage:** Es gibt **keine offizielle Kunden-API**
> von Telekom, Vodafone, Stromanbietern etc. GetMyInvoices löst das über
> **Portal-Bots (RPA)** — die brechen bei jedem Website-Umbau, scheitern an
> 2FA/Captcha und bewegen sich AGB-technisch in einer Grauzone. Deshalb pflegt
> GetMyInvoices ein ganzes Team für ~10.000 Portal-Connectoren.
>
> **Der robustere Weg (Empfehlung):** Bei jedem Anbieter als Rechnungs-E-Mail
> das jeweilige Postfach hinterlegen (oder dorthin weiterleiten). Fast jeder
> Anbieter mailt die Rechnung — das Postfach wird zur zentralen Wahrheit, kein
> Bot, der bricht. Portal-RPA lässt sich später gezielt nur für die wenigen
> Anbieter ergänzen, die zwingend Download verlangen (Andockpunkt im Code:
> weitere `DocumentSource` in `src/ingest/`).

---

## Die eigene Idee: „Fehlende-Rechnung-Radar"

GetMyInvoices & Co. sind überwiegend **reaktiv** — sie sammeln, was reinkommt.
Der Radar dreht das um: Er kennt deine **wiederkehrenden** Rechnungen (Telekom
monatlich, Hosting, Strom …) und **meldet aktiv, wenn eine erwartete Rechnung
ausbleibt** — bevor sie beim Jahresabschluss als fehlende Betriebsausgabe
auffällt. Konfiguriert unter `recurring:` in `config/entities.yaml`.

Zweiter Vorteil gegenüber vielen Tools: **native E-Rechnung**. Seit der
E-Rechnungspflicht im deutschen B2B (2025 ff.) kommen Rechnungen zunehmend als
**ZUGFeRD/XRechnung**. Der Hub liest das eingebettete XML direkt aus — ohne OCR,
100 % genau (`src/extract/zugferd.py`).

---

## Manueller Import (Papierrechnung / Quittung / Foto)

Nicht alles kommt per E-Mail. Für Post-Rechnungen, Kassenbons und abfotografierte
Belege gibt es drei Wege — alle enden in derselben Pipeline (Extraktion →
Klassifikation → Ablage):

**1. Drop-Ordner** — Datei in `inbox/<Einheit>/` legen, dann `run` starten:
```
inbox/Privat/Quittung_Baumarkt.jpg
inbox/Firma B UG/Papierrechnung.pdf
```
> Tipp: `inbox/` als **OneDrive-Ordner** synchronisieren → vom Handy ein Foto in
> `inbox/Privat/` ablegen, fertig.

**2. CLI-Einzelimport:**
```bash
python -m src.cli import "Quittung.jpg" --entity "Privat"
```

**3. Dashboard** — Drag & Drop der Datei in die Import-Zone.

Formate: **PDF, JPG, PNG, WebP, HEIC, TIFF** (und `.txt` für bereits erfassten
Text). Fotos/Scans liest **Claude Vision** aus; PDFs mit eingebettetem ZUGFeRD
werden strukturiert gelesen. Belege mit niedriger Konfidenz landen automatisch
im Status **Prüfen**.

---

## Architektur

```
  Postfächer          Extraktion            Klassifikation      Ablage
 ┌───────────┐   ┌───────────────────┐   ┌───────────────┐  ┌────────────┐
 │ Firma A   │   │ ZUGFeRD/XRechnung  │   │ Eingang/      │  │ OneDrive   │
 │ Firma B   │──▶│  → XML nativ       │──▶│  Ausgang      │─▶│ /Firma/    │
 │ Privat    │   │ PDF → Claude       │   │ Kategorie/SKR │  │  Eingang/  │
 └───────────┘   └───────────────────┘   └───────────────┘  │  2026/Q3/  │
       │                                         │          │  07-Juli/  │
       │                                         ▼          └────────────┘
       │                                  ┌───────────────┐        │
       └─────────────────────────────────│ Duplikat-Check│        ▼
                                          └───────────────┘  ┌────────────┐
                        ┌─────────────────────────────────┐  │ Index +    │
                        │ Fehlende-Rechnung-Radar          │─▶│ Dashboard  │
                        └─────────────────────────────────┘  │ DATEV/CSV  │
                                                             └────────────┘
```

Ablagestruktur auf OneDrive (aus `config.storage.path_template`):

```
/Buchhaltung/Firma A/Eingang/2026/Q3/07-Juli/
    2026-07-05_Telekom-Deutschland-GmbH_TK-2026-07-4455_89.90.pdf
```

| Modul | Aufgabe |
|---|---|
| `src/ingest/gmail_source.py` | Rohdokumente aus Postfächern (Gmail API + Dry-Run-Quelle) |
| `src/ingest/upload_source.py` | Manueller Import: PDF/Bild/Scan aus `inbox/<Einheit>/` |
| `src/extract/zugferd.py` | ZUGFeRD/XRechnung-XML nativ parsen |
| `src/extract/claude_extractor.py` | PDF-Rechnungen mit Claude strukturiert auslesen |
| `src/classify/classifier.py` | Richtung, Kategorie, SKR-Konto, Prüf-Gate |
| `src/reconcile/radar.py` | Fehlende-Rechnung-Radar |
| `src/storage/onedrive.py` | Ablage via Microsoft Graph (+ lokaler Dry-Run) |
| `src/storage/index.py` | Index (Dashboard) + CSV + DATEV-Export |
| `src/pipeline.py` | Orchestrierung aller Stufen |

---

## Schnellstart (Dry-Run, ohne Zugänge)

```bash
cd invoice-hub
pip install -r requirements.txt        # nur PyYAML

python -m src.cli run --dry-run        # ganze Pipeline mit Beispielrechnungen
python -m src.cli dashboard --dry-run  # zusätzlich Dashboard-Daten schreiben
pytest tests/ -q                       # Tests
```

Ergebnis:
- `out/onedrive/…` — die gespiegelte OneDrive-Ordnerstruktur mit abgelegten Dateien
- `out/index.json`, `out/index.csv`, `out/datev.csv` — Index & Exporte
- `dashboard/index.html` — im Browser öffnen (läuft auch standalone mit eingebetteten Demodaten)

---

## Produktivbetrieb (echte Zugänge)

1. `cp .env.example .env` und ausfüllen.
2. Abhängigkeiten in `requirements.txt` einkommentieren und installieren.
3. Postfächer/USt-IdNr./OneDrive-Pfade in `config/entities.yaml` eintragen.
4. `python -m src.cli run` (ohne `--dry-run`).

Benötigte Zugänge:
- **Claude:** `ANTHROPIC_API_KEY` (Rechnungsextraktion)
- **Gmail:** OAuth-Client aus der Google Cloud Console (readonly-Scope)
- **OneDrive:** App-Registrierung in Entra/Azure AD, `Files.ReadWrite.All`

> Sicherheit: `.env` und `secrets/` sind in `.gitignore` — niemals einchecken.

---

## Nächste sinnvolle Ausbaustufen

- **Bank-Abgleich** (FinTS/HBCI): Rechnung ↔ Kontoumsatz matchen → „bezahlt?"
- **Portal-Connectoren** gezielt für Anbieter ohne E-Mail-Versand (Playwright)
- **DATEV-Schnittstelle** vollständig (statt vereinfachtem CSV)
- **Weboberfläche** mit Login statt statischem Dashboard
- **Kadenzen** im Radar (quartalsweise/jährlich) erweitern

---

*Demo-Daten sind fiktiv. Kein Steuer-/Rechtsberatungsersatz.*
