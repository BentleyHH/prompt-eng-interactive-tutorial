# DVI Proposal Engine

Interner Angebots-Konfigurator mit CRM für **ETAF DVI / DVI-Systems** — Verwaltung von Behörden-Kunden, Modulkatalog (Trainings, Hotels, Hardware, Logistik), KI-gestützte Angebotserstellung und PDF-Export im Lexware-Stil.

## Schnellstart

```bash
npm install
npm run dev        # Server (Port 3001) + Vite-Client (Port 5173)
```

Produktion:

```bash
npm run build      # Client-Bundle + Type-Check
npm start          # Express liefert API + gebauten Client auf Port 3001
```

Beim ersten Start werden Datenbank-Schema und Seed-Daten (28 Katalog-Module in 4 Kategorien, 4 Beispiel-Kunden) automatisch angelegt (`data/dvi.db`).

## KI-Funktionen

- **Angebots-Vorschlag per Prompt** (Bedarf in natürlicher Sprache → Modulauswahl, Trainer-Bedarf, Hotel-Vorschlag, Preis vs. Budget, Angebotstexte DE/EN)
- **Textgenerierung** für Einleitungs-/Abschlusstexte (Deutsch / Englisch / Beides)

Setze dafür einen API-Key:

```bash
export ANTHROPIC_API_KEY=sk-ant-...
# optional: export ANTHROPIC_MODEL=claude-opus-4-8   (Default)
```

**Ohne Key** läuft ein regelbasierter Fallback (Keyword-/Tag-Matching, Budget-Parsing) — die App bleibt voll funktionsfähig.

## Routen

| Route | Inhalt |
|---|---|
| `/` | Dashboard (offene Angebote, Angebotswert, Conversion Rate, letzte Aktivitäten) |
| `/customers`, `/customers/:id` | Kunden-CRM mit Ansprechpartnern + Angebots-Historie |
| `/catalog` | Modulkatalog (Kategorien, Preise/Margen, Verfügbarkeits-Monate, Tags) |
| `/proposals`, `/proposals/new`, `/proposals/:id` | Angebotsliste, Konfigurator (KI + manuell), Editor |
| `/api/proposals/:id/pdf` | PDF-Vorschau (`?download=1` für Download) |
| `/settings` | Firmendaten, Logo-Upload, Nummernkreis-Präfix |

## Tech-Stack & Abweichungen vom Original-Spec

| Spec | Umsetzung | Grund |
|---|---|---|
| MySQL (Drizzle) | **SQLite** via better-sqlite3 (Drizzle, identische Feldnamen) | Kein MySQL-Server in der Zielumgebung; Wechsel auf MySQL ist mechanisch |
| Manus OAuth | **Single-User-Modus** (`userId = 1`) | Manus-Template-Auth nicht verfügbar |
| Puppeteer/react-pdf | **pdfkit** (serverseitig, Lexware-Layout) | Leichtgewichtig, kein Headless-Browser nötig |
| shadcn/ui | Eigene Tailwind-4-Komponenten im „Tactical Command Center"-Design | Gleiche Optik, weniger Abhängigkeiten |
| Drag & Drop Positionen | Hoch/Runter-Buttons | Funktional äquivalent, ohne Zusatz-Library |
| Rich-Text-Editor | Textareas + KI-Generierung | PDF rendert Fließtext; Markup nicht erforderlich |

Übrig bleibt: React 19 + Tailwind 4, Express + tRPC v11, Drizzle ORM, Claude API (`@anthropic-ai/sdk`).

## Geschäftslogik

- **Angebotsnummer:** `AG[JJMMTT]-[Laufnummer]`, Laufnummer pro Tag, Präfix in Einstellungen konfigurierbar
- **Positionssumme:** `Menge × Einzelpreis × (1 − Rabatt/100)`; Netto-Summe wird serverseitig nachgeführt
- **Gewinn/Marge:** VK − EK pro Position, interne Kalkulation im Editor (nicht im PDF)
- **MwSt.:** 0 % Reverse Charge (Default, internationale Kunden) oder 19 % Deutschland
- **Zahlungspläne:** Templates 50/35/15, 50/50, 30/30/30/10 — frei editierbar
- **Verfügbarkeit:** Module tragen `availableMonths`; die KI berücksichtigt sie bei Vorschlägen
