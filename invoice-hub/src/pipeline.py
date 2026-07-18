"""Orchestrierung der gesamten Rechnungs-Pipeline.

    Postfach  ->  Extraktion  ->  Klassifikation  ->  Duplikat-Check
              ->  Ablage (OneDrive)  ->  Radar  ->  Index/Export

Läuft komplett im Dry-Run ohne Zugänge (SampleSource + LocalArchive + Mock),
oder produktiv mit Gmail + Claude + Microsoft Graph, sobald die .env gefüllt
ist. Die Logik ist in beiden Fällen identisch.
"""

from __future__ import annotations

from datetime import date, datetime
from pathlib import Path

from .classify.classifier import Classifier
from .config import Config, Secrets, load_config, load_secrets
from .extract.claude_extractor import ClaudeExtractor
from .ingest.gmail_source import build_sources
from .models import Invoice, Status
from .reconcile.radar import MissingInvoiceRadar
from .storage.index import write_index
from .storage.onedrive import build_archive

OUT_DIR = Path(__file__).resolve().parent.parent / "out"


class Pipeline:
    def __init__(self, config: Config, secrets: Secrets, dry_run: bool = True,
                 out_dir: Path = OUT_DIR):
        self.config = config
        self.secrets = secrets
        self.dry_run = dry_run
        self.out_dir = out_dir
        self.extractor = ClaudeExtractor(config, secrets, dry_run)
        self.classifier = Classifier(config)
        self.radar = MissingInvoiceRadar(config)
        self.archive = build_archive(config, secrets, dry_run, out_dir)
        self._seen: set[str] = set()

    def run(self, since: datetime | None = None, period: date | None = None) -> dict:
        sources = build_sources(self.config, self.secrets, self.dry_run)
        invoices: list[Invoice] = []

        for source in sources:
            for doc in source.fetch(since=since):
                inv = self.extractor.extract(doc)
                inv = self.classifier.classify(inv)

                if inv.id in self._seen:
                    inv.status = Status.DUPLIKAT
                    inv.notes = "Duplikat — bereits verarbeitet."
                else:
                    self._seen.add(inv.id)
                    self.archive.store(inv, doc.data)
                invoices.append(inv)

        ref_period = period or _latest_period(invoices) or date.today()
        alerts = self.radar.check(
            [i for i in invoices if i.status != Status.DUPLIKAT], ref_period
        )
        return write_index(invoices, alerts, self.out_dir)


def _latest_period(invoices: list[Invoice]) -> date | None:
    dates = [i.invoice_date for i in invoices if i.invoice_date]
    return max(dates) if dates else None


def run_pipeline(dry_run: bool = True) -> dict:
    config = load_config()
    secrets = load_secrets()
    return Pipeline(config, secrets, dry_run=dry_run).run()
