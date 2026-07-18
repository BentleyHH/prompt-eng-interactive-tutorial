"""Kommandozeilen-Einstieg für den Rechnungs-Hub.

Beispiele:
    python -m src.cli run --dry-run          # komplette Pipeline mit Beispielen
    python -m src.cli run                     # produktiv (braucht .env-Zugänge)
    python -m src.cli dashboard --dry-run     # Pipeline + Dashboard-Daten bauen
"""

from __future__ import annotations

import argparse
import json
import shutil
import sys
from pathlib import Path

from .config import load_config, load_secrets
from .pipeline import Pipeline, OUT_DIR

DASHBOARD_DIR = Path(__file__).resolve().parent.parent / "dashboard"


def _run(args) -> dict:
    config = load_config()
    secrets = load_secrets()
    dry = args.dry_run or not secrets.gmail_credentials_json
    if dry and not args.dry_run:
        print("ℹ️  Keine Gmail-Zugänge gefunden — starte automatisch im Dry-Run.", file=sys.stderr)
    pipe = Pipeline(config, secrets, dry_run=dry)
    result = pipe.run()
    return result


def cmd_run(args) -> None:
    result = _run(args)
    s = result["summary"]
    print(f"✓ {s['total_invoices']} Rechnungen verarbeitet, "
          f"Summe Brutto {s['total_gross']:.2f} €, "
          f"{s['needs_review']} zur Prüfung.")
    for a in result["alerts"]:
        print(f"  ⚠️  {a['message']}")
    print(f"→ Index: {OUT_DIR / 'index.json'}")
    print(f"→ Archiv (lokal gespiegelt): {OUT_DIR / 'onedrive'}")


def cmd_import(args) -> None:
    """Einzelne Datei importieren (Papierrechnung-Scan, Quittungsfoto, PDF)."""
    from .ingest.upload_source import read_document

    path = Path(args.file)
    if not path.exists():
        print(f"✗ Datei nicht gefunden: {path}", file=sys.stderr)
        raise SystemExit(1)

    config = load_config()
    secrets = load_secrets()
    dry = args.dry_run or not secrets.anthropic_api_key

    doc = read_document(path, args.entity)
    if doc is None:
        print(f"✗ Nicht unterstütztes Format: {path.suffix}", file=sys.stderr)
        raise SystemExit(1)

    pipe = Pipeline(config, secrets, dry_run=dry)
    inv = pipe.process(doc)

    print(f"✓ Importiert: {inv.vendor or path.name}")
    print(f"  Einheit:   {inv.entity}")
    print(f"  Richtung:  {inv.direction.value}")
    print(f"  Betrag:    {inv.gross if inv.gross is not None else '—'} {inv.currency}")
    print(f"  Konfidenz: {inv.confidence:.0%}  ·  Status: {inv.status.value}")
    if inv.storage_path:
        print(f"  Abgelegt:  {inv.storage_path}")
    if inv.status.value == "pruefen":
        print("  ⚠️  Bitte manuell prüfen (niedrige Konfidenz oder fehlender Betrag).")


def cmd_dashboard(args) -> None:
    result = _run(args)
    DASHBOARD_DIR.mkdir(exist_ok=True)
    # Dashboard liest sample_data.json — mit echten Pipeline-Daten füllen
    (DASHBOARD_DIR / "sample_data.json").write_text(
        json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(f"✓ Dashboard-Daten aktualisiert: {DASHBOARD_DIR / 'sample_data.json'}")
    print(f"→ Öffne dashboard/index.html im Browser.")


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(prog="rechnungs-hub",
                                     description="Zentrale Rechnungsverarbeitung")
    parser.add_argument("--dry-run", action="store_true",
                        help="Ohne echte Zugänge mit Beispielrechnungen laufen")
    sub = parser.add_subparsers(dest="command", required=True)

    p_run = sub.add_parser("run", help="Pipeline ausführen")
    p_run.set_defaults(func=cmd_run)

    p_dash = sub.add_parser("dashboard", help="Pipeline ausführen + Dashboard-Daten schreiben")
    p_dash.set_defaults(func=cmd_dashboard)

    p_imp = sub.add_parser("import", help="Einzelne Datei importieren (PDF/Bild/Scan)")
    p_imp.add_argument("file", help="Pfad zur Rechnung/Quittung (.pdf, .jpg, .png, .txt)")
    p_imp.add_argument("--entity", default="Unbekannt",
                       help="Buchungseinheit, z. B. \"Privat\" oder \"Firma A GmbH\"")
    p_imp.set_defaults(func=cmd_import)

    # --dry-run auch nach dem Subcommand erlauben
    for p in (p_run, p_dash, p_imp):
        p.add_argument("--dry-run", action="store_true", help=argparse.SUPPRESS)

    args = parser.parse_args(argv)
    args.func(args)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
