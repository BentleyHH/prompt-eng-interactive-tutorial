"""ZUGFeRD / XRechnung: strukturierte E-Rechnungen direkt aus XML lesen.

Seit der E-Rechnungspflicht im deutschen B2B (2025 ff.) kommen Rechnungen
zunehmend als strukturierte Datei — ZUGFeRD (PDF/A-3 mit eingebettetem XML)
oder XRechnung (reines XML). Dann ist KEIN OCR nötig: die Werte stehen
maschinenlesbar im Cross-Industry-Invoice-XML (UN/CEFACT CII).

Dieser Parser liest die wichtigsten Felder ohne externe Abhängigkeit über
den Standard-XML-Parser. Namensräume werden ignoriert (local-name-Matching),
damit sowohl CII- als auch UBL-Varianten funktionieren.
"""

from __future__ import annotations

import re
import xml.etree.ElementTree as ET
from datetime import date, datetime
from typing import Optional


def _local(tag: str) -> str:
    return tag.rsplit("}", 1)[-1] if "}" in tag else tag


def _find_text(root: ET.Element, *local_names: str) -> Optional[str]:
    """Erstes Element, dessen local-name in local_names liegt -> Text."""
    wanted = {n.lower() for n in local_names}
    for el in root.iter():
        if _local(el.tag).lower() in wanted and el.text and el.text.strip():
            return el.text.strip()
    return None


def _parse_date(raw: Optional[str]) -> Optional[date]:
    if not raw:
        return None
    raw = raw.strip()
    # ZUGFeRD nutzt oft Format 102: YYYYMMDD
    m = re.fullmatch(r"(\d{4})(\d{2})(\d{2})", raw)
    if m:
        return date(int(m.group(1)), int(m.group(2)), int(m.group(3)))
    for fmt in ("%Y-%m-%d", "%d.%m.%Y", "%Y/%m/%d"):
        try:
            return datetime.strptime(raw, fmt).date()
        except ValueError:
            continue
    return None


def _to_float(raw: Optional[str]) -> Optional[float]:
    if raw is None:
        return None
    raw = raw.strip().replace(" ", "")
    # deutsche Notation 1.234,56 -> 1234.56
    if "," in raw and "." in raw:
        raw = raw.replace(".", "").replace(",", ".")
    elif "," in raw:
        raw = raw.replace(",", ".")
    try:
        return float(raw)
    except ValueError:
        return None


def parse_einvoice_xml(xml_text: str) -> Optional[dict]:
    """Parst ZUGFeRD/XRechnung-XML zu einem flachen Feld-Dict.

    Rückgabe None, wenn der Text kein verwertbares XML ist.
    """
    if not xml_text or "<" not in xml_text:
        return None
    try:
        root = ET.fromstring(xml_text)
    except ET.ParseError:
        return None

    seller = _find_text(root, "SellerTradeParty", "Name") or _seller_name(root)
    buyer = _buyer_name(root)

    data = {
        "vendor": seller or "",
        "counterparty": buyer or "",
        "invoice_number": _find_text(root, "ID", "PaymentReference") or "",
        "invoice_date": _parse_date(_find_text(root, "IssueDateTime", "DateTimeString", "IssueDate")),
        "net": _to_float(_find_text(root, "TaxBasisTotalAmount", "LineTotalAmount")),
        "vat": _to_float(_find_text(root, "TaxTotalAmount")),
        "gross": _to_float(_find_text(root, "GrandTotalAmount", "DuePayableAmount", "PayableAmount")),
        "currency": _find_text(root, "InvoiceCurrencyCode", "DocumentCurrencyCode") or "EUR",
        "iban": _find_text(root, "IBANID", "IBAN") or "",
        "vat_id": _seller_vat_id(root),
        "is_einvoice": True,
        "confidence": 0.99,  # strukturierte Quelle -> hohe Konfidenz
    }
    # Invoice-Number robust: nimm die erste ID im ExchangedDocument-Kontext
    inv_no = _document_id(root)
    if inv_no:
        data["invoice_number"] = inv_no
    return data


# --- gezieltere Extraktoren für saubere Felder ---

def _named_party(root: ET.Element, party_local: str) -> Optional[str]:
    for el in root.iter():
        if _local(el.tag).lower() == party_local.lower():
            name = _find_text(el, "Name")
            if name:
                return name
    return None


def _seller_name(root: ET.Element) -> Optional[str]:
    return _named_party(root, "SellerTradeParty") or _named_party(root, "AccountingSupplierParty")


def _buyer_name(root: ET.Element) -> Optional[str]:
    return _named_party(root, "BuyerTradeParty") or _named_party(root, "AccountingCustomerParty")


def _seller_vat_id(root: ET.Element) -> str:
    for el in root.iter():
        if _local(el.tag).lower() in ("sellertradeparty", "accountingsupplierparty"):
            for sub in el.iter():
                if _local(sub.tag).lower() == "id" and sub.text and sub.text.strip().upper().startswith("DE"):
                    return sub.text.strip()
    return ""


def _document_id(root: ET.Element) -> Optional[str]:
    for el in root.iter():
        if _local(el.tag).lower() in ("exchangeddocument", "invoice"):
            _id = _find_text(el, "ID")
            if _id:
                return _id
    return None
