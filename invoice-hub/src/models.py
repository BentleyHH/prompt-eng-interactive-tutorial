"""Datenmodelle für den Rechnungs-Hub.

Eine `Invoice` ist die zentrale Wahrheit, die durch die gesamte Pipeline
fließt: Ingestion -> Extraktion -> Klassifikation -> Abgleich -> Ablage.
Jede Stufe reichert das Objekt an und setzt den `status` weiter.
"""

from __future__ import annotations

import hashlib
from dataclasses import dataclass, field, asdict
from datetime import date, datetime
from enum import Enum
from typing import Optional


class Direction(str, Enum):
    """Rechnungsrichtung aus Sicht der eigenen Einheit."""

    EINGANG = "eingang"  # wir bekommen eine Rechnung (Verbindlichkeit)
    AUSGANG = "ausgang"  # wir stellen eine Rechnung (Forderung)
    UNBEKANNT = "unbekannt"


class Status(str, Enum):
    """Lebenszyklus einer Rechnung in der Pipeline."""

    EMPFANGEN = "empfangen"        # aus dem Postfach gezogen
    EXTRAHIERT = "extrahiert"      # Metadaten ausgelesen
    KLASSIFIZIERT = "klassifiziert"  # Firma/Richtung/Kategorie gesetzt
    ABGELEGT = "abgelegt"          # auf OneDrive archiviert
    PRUEFEN = "pruefen"            # niedrige Konfidenz -> manuelle Prüfung
    DUPLIKAT = "duplikat"          # bereits vorhanden


@dataclass
class Money:
    """Betrag mit Währung. Alle Beträge in Dezimal-Euro als float gehalten
    (für echte Buchhaltung würde man auf Decimal wechseln)."""

    amount: float
    currency: str = "EUR"

    def __str__(self) -> str:
        return f"{self.amount:,.2f} {self.currency}"


@dataclass
class Invoice:
    """Zentrales Rechnungsobjekt."""

    # --- Herkunft ---
    entity: str                      # z. B. "Firma A", "Firma B", "Privat"
    mailbox: str                     # Quell-Postfach
    message_id: str                  # E-Mail-Message-ID
    received_at: datetime            # Zeitpunkt des Eingangs im Postfach
    source_filename: str             # Original-Dateiname des Anhangs

    # --- Extrahierte Rechnungsdaten ---
    vendor: str = ""                 # Rechnungssteller
    counterparty: str = ""           # Rechnungsempfänger
    invoice_number: str = ""
    invoice_date: Optional[date] = None
    due_date: Optional[date] = None
    net: Optional[float] = None
    vat: Optional[float] = None
    gross: Optional[float] = None
    currency: str = "EUR"
    iban: str = ""
    vat_id: str = ""                 # USt-IdNr. des Lieferanten

    # --- Klassifikation ---
    direction: Direction = Direction.UNBEKANNT
    category: str = ""               # z. B. "Telekommunikation", "Miete"
    skr_account: str = ""            # SKR03/04-Kontovorschlag

    # --- Verarbeitung ---
    status: Status = Status.EMPFANGEN
    confidence: float = 0.0          # 0..1 Konfidenz der Extraktion
    is_einvoice: bool = False        # ZUGFeRD/XRechnung strukturiert gelesen
    storage_path: str = ""           # Zielpfad auf OneDrive
    notes: str = ""

    # intern
    id: str = ""

    def __post_init__(self) -> None:
        if not self.id:
            self.id = self.fingerprint()

    def fingerprint(self) -> str:
        """Stabile ID zur Duplikaterkennung: gleiche Rechnung == gleiche ID.

        Basiert auf Lieferant + Rechnungsnummer + Brutto. Fällt bei fehlender
        Rechnungsnummer auf Datei + Postfach zurück.
        """
        key = "|".join(
            str(x).lower().strip()
            for x in (
                self.vendor or self.source_filename,
                self.invoice_number or self.message_id,
                self.gross if self.gross is not None else "",
            )
        )
        return hashlib.sha1(key.encode("utf-8")).hexdigest()[:16]

    def target_filename(self) -> str:
        """Einheitlicher Dateiname: YYYY-MM-DD_Lieferant_Rechnungsnr_Brutto.pdf"""
        d = self.invoice_date.isoformat() if self.invoice_date else "0000-00-00"
        vendor = _slug(self.vendor or "Unbekannt")
        num = _slug(self.invoice_number or self.id)
        gross = f"{self.gross:.2f}" if self.gross is not None else "0.00"
        ext = self.source_filename.rsplit(".", 1)[-1] if "." in self.source_filename else "pdf"
        return f"{d}_{vendor}_{num}_{gross}.{ext}"

    def to_dict(self) -> dict:
        d = asdict(self)
        d["direction"] = self.direction.value
        d["status"] = self.status.value
        d["invoice_date"] = self.invoice_date.isoformat() if self.invoice_date else None
        d["due_date"] = self.due_date.isoformat() if self.due_date else None
        d["received_at"] = self.received_at.isoformat() if self.received_at else None
        return d

    @classmethod
    def from_dict(cls, d: dict) -> "Invoice":
        """Rekonstruiert eine Invoice aus einem gespeicherten Ledger-Eintrag."""
        def _d(v):
            return datetime.strptime(v[:10], "%Y-%m-%d").date() if v else None
        def _dt(v):
            return datetime.fromisoformat(v) if v else None
        inv = cls(
            entity=d.get("entity", ""), mailbox=d.get("mailbox", ""),
            message_id=d.get("message_id", ""), received_at=_dt(d.get("received_at")),
            source_filename=d.get("source_filename", ""),
        )
        for f in ("vendor", "counterparty", "invoice_number", "currency", "iban",
                  "vat_id", "category", "skr_account", "storage_path", "notes"):
            setattr(inv, f, d.get(f, "") or "")
        for f in ("net", "vat", "gross", "confidence"):
            setattr(inv, f, d.get(f))
        inv.invoice_date = _d(d.get("invoice_date"))
        inv.due_date = _d(d.get("due_date"))
        inv.is_einvoice = bool(d.get("is_einvoice", False))
        inv.direction = Direction(d.get("direction", "unbekannt"))
        inv.status = Status(d.get("status", "empfangen"))
        inv.id = d.get("id") or inv.fingerprint()
        return inv


def _slug(text: str) -> str:
    """Dateisystem-sicherer Bezeichner."""
    keep = []
    for ch in text.strip():
        if ch.isalnum():
            keep.append(ch)
        elif ch in " -_.":
            keep.append("-")
    slug = "".join(keep).strip("-")
    while "--" in slug:
        slug = slug.replace("--", "-")
    return slug[:40] or "x"


@dataclass
class RawDocument:
    """Rohes eingehendes Dokument aus einem Postfach, vor der Extraktion."""

    mailbox: str
    entity: str
    message_id: str
    received_at: datetime
    filename: str
    content_type: str            # z. B. application/pdf, application/xml
    data: bytes = b""            # Roh-Bytes des Anhangs
    text: str = ""               # extrahierter/gelieferter Textinhalt
    embedded_xml: str = ""       # ZUGFeRD/XRechnung XML, falls vorhanden
    email_subject: str = ""
    email_from: str = ""
