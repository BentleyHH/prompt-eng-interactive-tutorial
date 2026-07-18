"""End-to-End-Tests der Dry-Run-Pipeline (ohne externe Zugänge)."""

import sys
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from src.config import load_config, Secrets
from src.pipeline import Pipeline
from src.extract.zugferd import parse_einvoice_xml
from src.models import Direction, Status


def _run(tmp_path):
    config = load_config()
    pipe = Pipeline(config, Secrets(), dry_run=True, out_dir=tmp_path)
    return pipe.run(period=date(2026, 7, 1))


def test_pipeline_processes_all_samples(tmp_path):
    result = _run(tmp_path)
    # 6 Postfach-Eingänge (inkl. 1 Duplikat) + 2 manuelle Uploads
    assert result["summary"]["total_invoices"] == 8


def test_upload_import_included(tmp_path):
    result = _run(tmp_path)
    vendors = {i["vendor"] for i in result["invoices"]}
    # aus dem Bild-Scan (per OCR-Sidecar) und der Text-Quittung
    assert "Elektro Schmidt GmbH" in vendors     # inbox/Firma B UG/*.png
    assert "OBI Baumarkt GmbH" in vendors         # inbox/Privat/*.txt
    # Bild-Rechnung landet der Einheit aus dem Ordner zugeordnet + als .png abgelegt
    scan = next(i for i in result["invoices"] if i["vendor"] == "Elektro Schmidt GmbH")
    assert scan["entity"] == "Firma B UG"
    assert scan["storage_path"].endswith(".png")


def test_import_read_document_sidecar(tmp_path):
    from src.ingest.upload_source import read_document, _is_sidecar
    img = tmp_path / "Beleg.png"
    img.write_bytes(b"\x89PNG\r\n")
    side = tmp_path / "Beleg.png.txt"
    side.write_text("Lieferant: Test AG\nRechnungsbetrag (brutto): 10,00 EUR\n", encoding="utf-8")
    assert _is_sidecar(side) is True
    doc = read_document(img, "Privat")
    assert doc.content_type == "image/png"
    assert "Test AG" in doc.text          # OCR-Sidecar wurde mitgelesen
    assert doc.data.startswith(b"\x89PNG")


def test_duplicate_is_detected(tmp_path):
    result = _run(tmp_path)
    dups = [i for i in result["invoices"] if i["status"] == "duplikat"]
    assert len(dups) == 1, "Die zweite Telekom-Mail muss als Duplikat erkannt werden."


def test_direction_via_own_vat_id(tmp_path):
    result = _run(tmp_path)
    ausgang = [i for i in result["invoices"] if i["direction"] == "ausgang"]
    # Die Ausgangsrechnung von Firma A (eigene USt-IdNr. DE111111111)
    assert any(i["invoice_number"] == "AR-2026-0042" for i in ausgang)


def test_zugferd_is_parsed_natively(tmp_path):
    result = _run(tmp_path)
    einv = [i for i in result["invoices"] if i["is_einvoice"]]
    assert len(einv) == 1
    assert einv[0]["vendor"] == "Cloud Services AG"
    assert einv[0]["gross"] == 249.90
    assert einv[0]["confidence"] >= 0.99


def test_radar_flags_missing_recurring(tmp_path):
    result = _run(tmp_path)
    vendors = {a["vendor"] for a in result["alerts"]}
    # Vodafone (Firma B) und Stadtwerke (Privat) fehlen in den Beispielen
    assert "Vodafone" in vendors
    assert "Stadtwerke" in vendors
    # Telekom & Hetzner sind vorhanden -> kein Alert
    assert "Telekom Deutschland" not in vendors


def test_storage_paths_are_structured(tmp_path):
    _run(tmp_path)
    # Ablagestruktur muss physisch existieren
    firma_a = tmp_path / "onedrive" / "Buchhaltung" / "Firma A"
    pdfs = list(firma_a.rglob("*.pdf"))
    assert pdfs, "Es müssen abgelegte Dateien unter Firma A existieren."
    # Pfad enthält Quartal
    assert any("Q3" in str(p) for p in pdfs)


def _make_inbox(tmp_path, name="Quittung_Rewe.txt"):
    inbox = tmp_path / "inbox"
    (inbox / "Privat").mkdir(parents=True)
    (inbox / "Privat" / name).write_text(
        "Lieferant: REWE Markt GmbH\nRechnungsnummer: RW-2026-07-77\n"
        "Rechnungsdatum: 16.07.2026\nRechnungsbetrag (brutto): 14,90 EUR\n",
        encoding="utf-8")
    return inbox


def _watcher(tmp_path, inbox):
    from src.watch.service import WatchService
    return WatchService(load_config(), Secrets(), dry_run=True,
                        inbox=inbox, out_dir=tmp_path / "out")


def test_watcher_processes_new_file(tmp_path):
    inbox = _make_inbox(tmp_path)
    svc = _watcher(tmp_path, inbox)
    assert svc.scan_once() == 1
    ledger = (tmp_path / "out" / "ledger.json").read_text()
    assert "REWE Markt GmbH" in ledger


def test_watcher_skips_already_seen_and_moves(tmp_path):
    inbox = _make_inbox(tmp_path)
    svc = _watcher(tmp_path, inbox)
    svc.scan_once()
    assert svc.scan_once() == 0                                   # nichts Neues
    assert not (inbox / "Privat" / "Quittung_Rewe.txt").exists()  # verschoben
    assert (inbox / "_verarbeitet" / "Privat" / "Quittung_Rewe.txt").exists()


def test_watcher_persists_across_restart(tmp_path):
    inbox = _make_inbox(tmp_path)
    _watcher(tmp_path, inbox).scan_once()
    svc2 = _watcher(tmp_path, inbox)          # frische Instanz, lädt Ledger/State
    assert len(svc2._ledger) == 1
    assert svc2.scan_once() == 0              # kein erneutes Verarbeiten


def test_watcher_updates_dashboard_data(tmp_path):
    from src.watch import service as svc_mod
    inbox = _make_inbox(tmp_path)
    svc = _watcher(tmp_path, inbox)
    # Dashboard-Datei in tmp umleiten
    svc_mod.DASHBOARD_DATA = tmp_path / "dash.json"
    svc.scan_once()
    import json
    data = json.loads((tmp_path / "dash.json").read_text())
    assert data["summary"]["total_invoices"] == 1


def test_invoice_roundtrip_from_dict():
    from src.models import Invoice, Direction
    config = load_config()
    inv = Invoice(entity="Privat", mailbox="m", message_id="x",
                  received_at=None, source_filename="a.pdf")
    inv.vendor = "ACME"; inv.gross = 9.99; inv.direction = Direction.EINGANG
    back = Invoice.from_dict(inv.to_dict())
    assert back.vendor == "ACME" and back.gross == 9.99
    assert back.direction == Direction.EINGANG


def test_zugferd_parser_unit():
    xml = (
        '<Invoice><ExchangedDocument><ID>X-1</ID></ExchangedDocument>'
        '<SellerTradeParty><Name>ACME</Name></SellerTradeParty>'
        '<GrandTotalAmount>100.00</GrandTotalAmount></Invoice>'
    )
    data = parse_einvoice_xml(xml)
    assert data["vendor"] == "ACME"
    assert data["gross"] == 100.00
    assert data["invoice_number"] == "X-1"
