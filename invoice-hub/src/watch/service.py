"""WatchService — der „scharf geschaltete" Handy-Workflow.

Überwacht den lokalen `inbox/`-Ordner und verarbeitet jeden neuen Beleg
automatisch durch die Pipeline (Extraktion → Klassifikation → Ablage) und
schreibt Index + Dashboard-Daten fort.

Der Ordner `inbox/` ist typischerweise ein **OneDrive-synchronisierter Ordner**:
Foto vom Handy in `OneDrive/Rechnungen-Inbox/Privat/` → OneDrive synct es auf
den Rechner/NAS, auf dem dieser Watcher läuft → automatische Verarbeitung.

Für den rein cloudbasierten Weg (ohne Desktop-Sync) zieht der optionale
OneDrive-Poller neue Dateien per Graph API zuerst in die lokale `inbox/`.

Zwei Betriebsarten:
  * scan_once()      -> ein Durchlauf (ideal für Cron / `watch --once`)
  * run(interval)    -> Dauerbetrieb als kleiner Dienst
"""

from __future__ import annotations

import json
import time
from datetime import date, datetime
from pathlib import Path

from ..config import Config, Secrets
from ..ingest.upload_source import SUPPORTED, read_document
from ..models import Invoice, Status
from ..pipeline import Pipeline, OUT_DIR
from ..reconcile.radar import MissingInvoiceRadar
from ..storage.index import write_index

INBOX_DIR = Path(__file__).resolve().parent.parent.parent / "inbox"
DASHBOARD_DATA = Path(__file__).resolve().parent.parent.parent / "dashboard" / "sample_data.json"


class WatchService:
    def __init__(self, config: Config, secrets: Secrets, dry_run: bool = True,
                 inbox: Path = INBOX_DIR, out_dir: Path = OUT_DIR,
                 move_processed: bool | None = None):
        self.config = config
        self.secrets = secrets
        self.dry_run = dry_run
        self.inbox = inbox
        self.out_dir = out_dir
        self.move_processed = (config.inbox.move_processed
                               if move_processed is None else move_processed)
        self.pipe = Pipeline(config, secrets, dry_run=dry_run, out_dir=out_dir)
        self.radar = MissingInvoiceRadar(config)

        self._state_path = out_dir / "watch_state.json"
        self._ledger_path = out_dir / "ledger.json"
        self._seen_files: set[str] = set()
        self._ledger: list[Invoice] = []
        self._load()

    # ------------------------------------------------------------------ API
    def scan_once(self) -> int:
        """Ein Durchlauf: neue Dateien einlesen, verarbeiten, Ausgaben schreiben.
        Gibt die Anzahl neu verarbeiteter Belege zurück."""
        self.pull_from_onedrive()  # no-op ohne Graph-Zugänge / dry-run

        new_files = self._discover()
        processed = 0
        for path in new_files:
            entity = self._entity_for(path)
            doc = read_document(path, entity)
            if doc is None:
                continue
            inv = self.pipe.process(doc)
            self._ledger.append(inv)
            self._seen_files.add(self._sig(path))
            processed += 1
            flag = "⚠️ PRÜFEN" if inv.status == Status.PRUEFEN else "✓"
            print(f"  {flag} {inv.entity}: {inv.vendor or path.name} · "
                  f"{inv.gross if inv.gross is not None else '—'} {inv.currency}")
            if self.move_processed:
                self._archive_file(path, entity)

        if processed:
            self._write_outputs()
            self._save()
        return processed

    def run(self, interval: int | None = None) -> None:  # pragma: no cover
        interval = interval or self.config.inbox.poll_interval
        while True:
            try:
                n = self.scan_once()
                if n:
                    print(f"→ {n} Beleg(e) verarbeitet, Dashboard aktualisiert "
                          f"({datetime.now():%H:%M:%S}).")
            except KeyboardInterrupt:
                print("\n⏹  Watcher beendet.")
                return
            except Exception as exc:  # Dauerbetrieb soll nicht sterben
                print(f"✗ Fehler im Scan: {exc}")
            time.sleep(max(2, interval))

    def pull_from_onedrive(self) -> int:
        """Zieht neue Dateien aus dem OneDrive-Inbox-Ordner in die lokale inbox/.
        No-op im Dry-Run oder ohne Graph-Zugänge."""
        folder = self.config.inbox.onedrive_folder
        if self.dry_run or not folder or not self.secrets.ms_client_id:
            return 0
        from .onedrive_poller import OneDriveInboxPoller  # pragma: no cover
        return OneDriveInboxPoller(self.config, self.secrets, self.inbox).pull()

    # -------------------------------------------------------------- intern
    def _discover(self) -> list[Path]:
        if not self.inbox.exists():
            return []
        found = []
        for path in sorted(self.inbox.rglob("*")):
            if not path.is_file() or "_verarbeitet" in path.parts:
                continue
            if path.suffix.lower() not in SUPPORTED:
                continue
            if path.name.endswith(".txt") and path.with_suffix("").suffix.lower() in SUPPORTED:
                continue  # OCR-Sidecar zu einem Bild/PDF
            if self._sig(path) in self._seen_files:
                continue
            found.append(path)
        return found

    def _entity_for(self, path: Path) -> str:
        try:
            rel = path.relative_to(self.inbox)
        except ValueError:
            return "Unbekannt"
        folder = rel.parts[0] if len(rel.parts) > 1 else ""
        for e in self.config.entities:
            if e.name.lower() == folder.lower():
                return e.name
        for e in self.config.entities:
            if folder and (folder.lower() in e.name.lower() or e.name.lower() in folder.lower()):
                return e.name
        return folder or "Unbekannt"

    def _archive_file(self, path: Path, entity: str) -> None:
        dest_dir = self.inbox / "_verarbeitet" / entity
        dest_dir.mkdir(parents=True, exist_ok=True)
        for f in (path, path.with_name(path.name + ".txt")):  # Datei + evtl. Sidecar
            if f.exists():
                target = dest_dir / f.name
                if target.exists():
                    target.unlink()
                f.rename(target)

    def _write_outputs(self) -> None:
        period = _latest_period(self._ledger) or date.today()
        active = [i for i in self._ledger if i.status != Status.DUPLIKAT]
        alerts = self.radar.check(active, period)
        payload = write_index(self._ledger, alerts, self.out_dir)
        try:
            DASHBOARD_DATA.parent.mkdir(exist_ok=True)
            DASHBOARD_DATA.write_text(
                json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
        except OSError:
            pass

    @staticmethod
    def _sig(path: Path) -> str:
        st = path.stat()
        return f"{path.name}:{st.st_size}:{int(st.st_mtime)}"

    def _load(self) -> None:
        if self._state_path.exists():
            try:
                self._seen_files = set(json.loads(self._state_path.read_text()))
            except (OSError, ValueError):
                self._seen_files = set()
        if self._ledger_path.exists():
            try:
                data = json.loads(self._ledger_path.read_text())
                self._ledger = [Invoice.from_dict(d) for d in data]
                for inv in self._ledger:
                    self.pipe._seen.add(inv.id)  # Duplikaterkennung über Neustarts
            except (OSError, ValueError):
                self._ledger = []

    def _save(self) -> None:
        self.out_dir.mkdir(parents=True, exist_ok=True)
        self._state_path.write_text(json.dumps(sorted(self._seen_files)), encoding="utf-8")
        self._ledger_path.write_text(
            json.dumps([i.to_dict() for i in self._ledger], ensure_ascii=False, indent=2),
            encoding="utf-8")


def _latest_period(invoices: list[Invoice]) -> date | None:
    dates = [i.invoice_date for i in invoices if i.invoice_date]
    return max(dates) if dates else None
