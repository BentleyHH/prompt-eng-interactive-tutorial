"""Rechnungsindex + Exporte für Dashboard und Steuerberater.

Schreibt:
  * out/index.json      -> Datenquelle des Dashboards
  * out/index.csv       -> flache Tabelle (Excel/Steuerberater)
  * out/datev.csv       -> vereinfachter DATEV-artiger Buchungsstapel-Export
"""

from __future__ import annotations

import csv
import json
from pathlib import Path

from ..models import Invoice
from ..reconcile.radar import RadarAlert


CSV_FIELDS = [
    "id", "entity", "direction", "vendor", "counterparty", "invoice_number",
    "invoice_date", "due_date", "net", "vat", "gross", "currency",
    "category", "skr_account", "status", "confidence", "is_einvoice",
    "storage_path",
]


def write_index(invoices: list[Invoice], alerts: list[RadarAlert], out_dir: Path) -> dict:
    out_dir.mkdir(parents=True, exist_ok=True)
    records = [inv.to_dict() for inv in invoices]

    payload = {
        "generated_at": None,  # bewusst None: Determinismus in Tests/Dry-Run
        "summary": _summary(invoices),
        "invoices": records,
        "alerts": [a.to_dict() for a in alerts],
    }
    (out_dir / "index.json").write_text(
        json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    with open(out_dir / "index.csv", "w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(fh, fieldnames=CSV_FIELDS, extrasaction="ignore")
        writer.writeheader()
        for rec in records:
            writer.writerow(rec)

    _write_datev(invoices, out_dir / "datev.csv")
    return payload


def _summary(invoices: list[Invoice]) -> dict:
    by_entity: dict[str, dict] = {}
    total_gross = 0.0
    for inv in invoices:
        e = by_entity.setdefault(inv.entity, {"count": 0, "gross": 0.0, "eingang": 0, "ausgang": 0})
        e["count"] += 1
        if inv.gross:
            e["gross"] += inv.gross
            total_gross += inv.gross
        e[inv.direction.value] = e.get(inv.direction.value, 0) + 1
    return {
        "total_invoices": len(invoices),
        "total_gross": round(total_gross, 2),
        "by_entity": by_entity,
        "needs_review": sum(1 for i in invoices if i.status.value == "pruefen"),
    }


def _write_datev(invoices: list[Invoice], path: Path) -> None:
    """Stark vereinfachter Buchungsstapel (nur Demonstration der Export-Idee)."""
    fields = ["Umsatz", "SollHaben", "Konto", "Gegenkonto", "Belegdatum",
              "Belegfeld1", "Buchungstext", "USt"]
    with open(path, "w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(fh, fieldnames=fields, delimiter=";")
        writer.writeheader()
        for inv in invoices:
            if inv.gross is None:
                continue
            writer.writerow({
                "Umsatz": f"{inv.gross:.2f}".replace(".", ","),
                "SollHaben": "S" if inv.direction.value == "eingang" else "H",
                "Konto": inv.skr_account or "",
                "Gegenkonto": "",
                "Belegdatum": inv.invoice_date.strftime("%d.%m.%Y") if inv.invoice_date else "",
                "Belegfeld1": inv.invoice_number,
                "Buchungstext": f"{inv.vendor} {inv.category}".strip(),
                "USt": f"{inv.vat:.2f}".replace(".", ",") if inv.vat else "",
            })
