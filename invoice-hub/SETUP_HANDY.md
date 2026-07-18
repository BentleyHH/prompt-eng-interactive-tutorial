# Handy-Workflow scharf schalten — Foto rein, fertig verbucht

Ziel: Du fotografierst unterwegs eine Papierrechnung oder Quittung, legst sie
in OneDrive ab — der Rechnungs-Hub liest sie **automatisch** aus und archiviert
sie sortiert. Kein manuelles Anstoßen.

```
📱 Handy (OneDrive-App)
   └─ Foto in  OneDrive/Rechnungen-Inbox/Privat/
                         │
                         ▼
   🔄  OneDrive synchronisiert
                         │
                         ▼
   👀  invoice-hub watch  (läuft dauerhaft auf Rechner/NAS/Server)
        → Claude liest aus → sortiert nach /Buchhaltung/... → Dashboard aktualisiert
```

Es gibt **zwei Wege**. Weg A braucht keine Cloud-Zugänge und ist am schnellsten
eingerichtet. Weg B ist vollständig serverseitig (kein Desktop-Sync nötig).

---

## Ordnerstruktur (beide Wege)

Lege in OneDrive einen Sammelordner mit je einem Unterordner pro Einheit an —
exakt die Namen aus `config/entities.yaml`:

```
OneDrive/Rechnungen-Inbox/
├── Privat/
├── Firma A GmbH/
└── Firma B UG/
```

> Der Unterordner bestimmt die Buchungseinheit — genau wie die getrennten
> Postfächer. Ein Foto in `Privat/` wird privat verbucht, eines in `Firma A GmbH/`
> der Firma A.

**Tipp fürs Handy:** In der OneDrive-App gibt es „**+ → Scannen**". Damit
fotografierst du die Rechnung, OneDrive schneidet sie zurecht und legt ein PDF
direkt im gewählten Ordner ab. Alternativ „Hochladen" für ein vorhandenes Foto.

---

## Weg A — lokaler OneDrive-Ordner (empfohlen zum Start)

Du brauchst nur einen immer laufenden Rechner (PC, Mac, Mini-PC, Raspberry Pi,
NAS mit Docker).

1. **OneDrive-Client** auf diesem Rechner installieren und anmelden, sodass
   `Rechnungen-Inbox/` lokal synchronisiert wird.
2. Den lokalen Sync-Pfad als `inbox/` verwenden. Am einfachsten per Symlink:
   ```bash
   # Beispiel (Pfad an dein OneDrive anpassen)
   ln -s "$HOME/OneDrive/Rechnungen-Inbox" invoice-hub/inbox
   ```
   Oder in `src/watch/service.py` bzw. per eigenem Startskript `inbox=` setzen.
3. Zugänge in `.env` eintragen (mindestens `ANTHROPIC_API_KEY`; für die Ablage
   auf OneDrive zusätzlich die `MS_*`-Werte — siehe README).
4. **Watcher starten:**
   ```bash
   python -m src.cli watch --interval 30
   ```
   Ab jetzt wird jedes neue Foto/PDF automatisch verarbeitet.

In `config/entities.yaml` kann `inbox.onedrive_folder` **leer** bleiben — bei
Weg A macht der lokale Sync-Client die Übertragung, der Watcher schaut nur in
den Ordner.

---

## Weg B — vollständig serverseitig (Microsoft Graph)

Kein Desktop-Sync-Client nötig; ein Dienst pollt OneDrive direkt. Ideal für
einen kleinen Cloud-Server.

1. **App-Registrierung** im Entra-/Azure-AD-Portal, Berechtigung
   `Files.ReadWrite.All`, Client-Secret erzeugen.
2. `.env` füllen: `MS_CLIENT_ID`, `MS_CLIENT_SECRET`, `MS_TENANT_ID`,
   `ONEDRIVE_DRIVE_ID` (+ `ANTHROPIC_API_KEY`).
3. In `config/entities.yaml`:
   ```yaml
   inbox:
     onedrive_folder: "/Rechnungen-Inbox"
     poll_interval: 30
   ```
4. **Watcher starten** (der Poller zieht neue Dateien selbst aus OneDrive):
   ```bash
   python -m src.cli watch --interval 30
   ```
   Verarbeitete Originale werden auf OneDrive nach
   `Rechnungen-Inbox/_verarbeitet/` verschoben, damit nichts doppelt läuft.

---

## Dauerbetrieb als Dienst

**Cron** (alle 5 Minuten ein Durchlauf — genügt oft):
```cron
*/5 * * * * cd /pfad/invoice-hub && /usr/bin/python -m src.cli import_once >/dev/null 2>&1
```
> Für Cron `watch --once` verwenden (ein Durchlauf, dann beenden):
> `... && python -m src.cli watch --once`

**systemd** (Linux, Dauerbetrieb):
```ini
# /etc/systemd/system/rechnungs-hub.service
[Unit]
Description=Rechnungs-Hub Auto-Import
After=network-online.target

[Service]
WorkingDirectory=/pfad/invoice-hub
ExecStart=/usr/bin/python -m src.cli watch --interval 30
Restart=always
EnvironmentFile=/pfad/invoice-hub/.env

[Install]
WantedBy=multi-user.target
```
```bash
sudo systemctl enable --now rechnungs-hub
```

**Windows:** Aufgabenplanung → Aufgabe „Bei Anmeldung" →
`python -m src.cli watch --interval 30` im Projektordner.

---

## Ausprobieren (ohne Zugänge)

```bash
python -m src.cli watch --once --dry-run
```
Der Watcher scannt `inbox/`, verarbeitet die dort liegenden Beispiel-Uploads,
schreibt `out/ledger.json` und aktualisiert die Dashboard-Daten. Ein zweiter
Lauf meldet „keine neuen Belege" — verarbeitete Dateien landen in
`inbox/_verarbeitet/`.

---

## Was passiert bei jedem neuen Beleg

1. Datei erkannt → Einheit aus dem Unterordner
2. **Claude** liest Lieferant, Datum, Netto/USt/Brutto (Vision bei Fotos,
   XML bei ZUGFeRD)
3. Eingang/Ausgang, Kategorie, SKR-Konto gesetzt; Duplikate übersprungen
4. Ablage auf OneDrive: `/Buchhaltung/{Einheit}/{Richtung}/{Jahr}/Q{n}/{Monat}/`
5. Aufnahme ins Ledger, Index-/CSV-/DATEV-Export + Dashboard aktualisiert
6. Fehlende-Rechnung-Radar neu bewertet
7. Original nach `_verarbeitet/` weggeräumt

Belege, die Claude nicht sicher lesen kann, erhalten den Status **Prüfen** und
erscheinen so im Dashboard — es geht nichts verloren.
