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
