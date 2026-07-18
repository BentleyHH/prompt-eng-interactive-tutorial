"""Rechnungsextraktion mit Claude (Anthropic API).

Strategie (state of the art):
  1. Ist ein ZUGFeRD/XRechnung-XML vorhanden -> direkt strukturiert lesen
     (kein Modellaufruf, 100 % genau, kostenlos).
  2. Sonst: PDF/Text an Claude geben und strukturiert per Tool-Use auslesen.
     Claude bewältigt beliebige Layouts — kein starres Template je Lieferant.

Im Dry-Run (kein API-Key) liefert ein deterministischer Mock-Parser Werte
aus dem mitgelieferten Text, damit die Pipeline vollständig durchläuft.
"""

from __future__ import annotations

import json
import re
from datetime import date, datetime
from typing import Optional

from ..config import Config, Secrets
from ..models import Invoice, RawDocument, Status
from .zugferd import parse_einvoice_xml, _parse_date, _to_float


# JSON-Schema für Claudes strukturierte Ausgabe (Tool-Use / structured output).
EXTRACTION_SCHEMA = {
    "type": "object",
    "properties": {
        "vendor": {"type": "string", "description": "Rechnungssteller / Lieferant"},
        "counterparty": {"type": "string", "description": "Rechnungsempfänger"},
        "invoice_number": {"type": "string"},
        "invoice_date": {"type": "string", "description": "ISO 8601 YYYY-MM-DD"},
        "due_date": {"type": "string", "description": "ISO 8601 oder leer"},
        "net": {"type": "number"},
        "vat": {"type": "number"},
        "gross": {"type": "number"},
        "currency": {"type": "string"},
        "iban": {"type": "string"},
        "vat_id": {"type": "string", "description": "USt-IdNr. des Lieferanten"},
        "confidence": {"type": "number", "description": "0..1 Selbsteinschätzung"},
    },
    "required": ["vendor", "gross", "confidence"],
}

SYSTEM_PROMPT = (
    "Du bist ein präziser Extraktor für deutsche Geschäftsrechnungen. "
    "Lies ausschließlich, was im Dokument steht. Rate keine Werte; wenn ein "
    "Feld fehlt, lass es leer. Beträge als Zahl (Punkt als Dezimaltrenner). "
    "Datum als ISO 8601. Gib deine Konfidenz ehrlich an."
)


class ClaudeExtractor:
    def __init__(self, config: Config, secrets: Secrets, dry_run: bool = False):
        self.config = config
        self.secrets = secrets
        self.dry_run = dry_run or not secrets.anthropic_api_key
        self._client = None

    def extract(self, doc: RawDocument) -> Invoice:
        entity = self.config.entity_for_mailbox(doc.mailbox)
        inv = Invoice(
            entity=doc.entity,
            mailbox=doc.mailbox,
            message_id=doc.message_id,
            received_at=doc.received_at,
            source_filename=doc.filename,
        )

        # 1) Strukturierte E-Rechnung bevorzugen
        fields = None
        if doc.embedded_xml:
            fields = parse_einvoice_xml(doc.embedded_xml)
        elif doc.content_type in ("application/xml", "text/xml") and doc.text:
            fields = parse_einvoice_xml(doc.text)

        # 2) Sonst KI-Extraktion (oder Mock im Dry-Run)
        if fields is None:
            fields = self._mock_extract(doc) if self.dry_run else self._claude_extract(doc)

        _apply_fields(inv, fields)
        inv.status = Status.EXTRAHIERT
        return inv

    # -- echte Claude-Extraktion -------------------------------------------
    def _claude_extract(self, doc: RawDocument) -> dict:  # pragma: no cover
        import anthropic

        if self._client is None:
            self._client = anthropic.Anthropic(api_key=self.secrets.anthropic_api_key)

        content: list = []
        if doc.content_type == "application/pdf" and doc.data:
            import base64
            content.append({
                "type": "document",
                "source": {
                    "type": "base64",
                    "media_type": "application/pdf",
                    "data": base64.standard_b64encode(doc.data).decode(),
                },
            })
        text = doc.text or f"Dateiname: {doc.filename}\nBetreff: {doc.email_subject}"
        content.append({"type": "text", "text": f"Extrahiere die Rechnungsdaten:\n\n{text}"})

        resp = self._client.messages.create(
            model="claude-opus-4-8",
            max_tokens=1024,
            system=SYSTEM_PROMPT,
            tools=[{
                "name": "rechnung_extrahieren",
                "description": "Strukturierte Rechnungsdaten zurückgeben.",
                "input_schema": EXTRACTION_SCHEMA,
            }],
            tool_choice={"type": "tool", "name": "rechnung_extrahieren"},
            messages=[{"role": "user", "content": content}],
        )
        for block in resp.content:
            if getattr(block, "type", None) == "tool_use":
                return dict(block.input)
        return {"vendor": "", "gross": None, "confidence": 0.0}

    # -- deterministischer Dry-Run-Parser ----------------------------------
    def _mock_extract(self, doc: RawDocument) -> dict:
        """Regelbasierte Extraktion aus dem Beispieltext (nur Dry-Run).

        Sucht typische deutsche Rechnungsfelder per Regex. Simuliert, was
        Claude auf dem echten PDF täte — reicht, um die Pipeline zu zeigen.
        """
        t = doc.text or ""

        def grab(pattern: str) -> str:
            m = re.search(pattern, t, re.IGNORECASE)
            return m.group(1).strip() if m else ""

        gross = _to_float(grab(r"(?:Gesamt|Brutto|Rechnungsbetrag|Zahlbetrag)[^\d]*([\d.,]+)"))
        net = _to_float(grab(r"(?:Netto|Zwischensumme)[^\d]*([\d.,]+)"))
        vat = _to_float(grab(r"(?:USt|MwSt|Umsatzsteuer)[^\d\n]*[\d]*\s*%?[^\d]*([\d.,]+)\s*(?:EUR|€)"))
        return {
            "vendor": grab(r"(?:Von|Lieferant|Rechnungssteller)[:\s]+([^\n]+)")
                      or (doc.email_from.split("<")[0].strip() if doc.email_from else ""),
            "counterparty": grab(r"(?:An|Rechnungsempfänger|Kunde)[:\s]+([^\n]+)"),
            "invoice_number": grab(r"Rechnungs?(?:nummer|nr\.?)[:\s]+([A-Za-z0-9\-\/]+)"),
            "invoice_date": _iso(_parse_date(grab(r"(?:Rechnungsdatum|Datum)[:\s]+([\d.\-\/]+)"))),
            "due_date": _iso(_parse_date(grab(r"(?:Fällig(?:keit)?|Zahlbar bis)[:\s]+([\d.\-\/]+)"))),
            "net": net,
            "vat": vat,
            "gross": gross,
            "currency": "EUR",
            "iban": grab(r"IBAN[:\s]+([A-Z]{2}[0-9 ]{15,34})").replace(" ", ""),
            "vat_id": grab(r"(?:USt-?IdNr\.?|VAT)[:\s]+([A-Z]{2}[0-9]+)"),
            "confidence": 0.82 if gross else 0.4,
        }


def _iso(d: Optional[date]) -> str:
    return d.isoformat() if d else ""


def _apply_fields(inv: Invoice, fields: dict) -> None:
    inv.vendor = fields.get("vendor", "") or inv.vendor
    inv.counterparty = fields.get("counterparty", "") or inv.counterparty
    inv.invoice_number = fields.get("invoice_number", "") or inv.invoice_number
    inv.net = _num(fields.get("net"))
    inv.vat = _num(fields.get("vat"))
    inv.gross = _num(fields.get("gross"))
    inv.currency = fields.get("currency") or "EUR"
    inv.iban = fields.get("iban", "") or inv.iban
    inv.vat_id = fields.get("vat_id", "") or inv.vat_id
    inv.is_einvoice = bool(fields.get("is_einvoice", False))
    inv.confidence = float(fields.get("confidence", 0.0) or 0.0)

    id_raw = fields.get("invoice_date")
    inv.invoice_date = _as_date(id_raw)
    inv.due_date = _as_date(fields.get("due_date"))
    # ID neu berechnen, jetzt wo Felder da sind
    inv.id = inv.fingerprint()


def _num(v) -> Optional[float]:
    if v is None or v == "":
        return None
    try:
        return float(v)
    except (TypeError, ValueError):
        return None


def _as_date(v) -> Optional[date]:
    if not v:
        return None
    if isinstance(v, date):
        return v
    try:
        return datetime.strptime(str(v)[:10], "%Y-%m-%d").date()
    except ValueError:
        return _parse_date(str(v))
