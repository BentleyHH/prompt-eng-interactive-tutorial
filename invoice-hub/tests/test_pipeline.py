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
    # 6 Beispiel-Eingänge (inkl. 1 Duplikat)
    assert result["summary"]["total_invoices"] == 6


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
