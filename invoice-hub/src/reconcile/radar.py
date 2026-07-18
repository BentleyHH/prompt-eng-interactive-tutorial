"""Fehlende-Rechnung-Radar — die proaktive Kern-Idee des Hubs.

GetMyInvoices & Co. sind überwiegend reaktiv: sie sammeln, was reinkommt.
Der Radar dreht das um. Für jede in der Config hinterlegte wiederkehrende
Rechnung (Telekom monatlich, Strom, Hosting, ...) prüft er, ob im
betrachteten Zeitraum tatsächlich eine passende Rechnung eingegangen ist —
und meldet, wenn nicht.

So fällt eine ausbleibende Telekom-Rechnung sofort auf, statt erst beim
Jahresabschluss, wenn die Betriebsausgabe fehlt.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date

from ..config import Config
from ..models import Invoice


@dataclass
class RadarAlert:
    entity: str
    vendor: str
    period: str          # z. B. "2026-07"
    expected_gross: float
    message: str

    def to_dict(self) -> dict:
        return {
            "entity": self.entity,
            "vendor": self.vendor,
            "period": self.period,
            "expected_gross": self.expected_gross,
            "message": self.message,
        }


class MissingInvoiceRadar:
    def __init__(self, config: Config):
        self.config = config

    def check(self, invoices: list[Invoice], period: date) -> list[RadarAlert]:
        """Prüft für den Monat von `period`, welche erwarteten Rechnungen fehlen."""
        year, month = period.year, period.month
        alerts: list[RadarAlert] = []

        for exp in self.config.recurring:
            if exp.cadence != "monatlich":
                continue  # weitere Kadenzen (quartalsweise, jährlich) leicht ergänzbar
            found = any(
                self._matches(inv, exp, year, month) for inv in invoices
            )
            if not found:
                alerts.append(RadarAlert(
                    entity=exp.entity,
                    vendor=exp.vendor,
                    period=f"{year:04d}-{month:02d}",
                    expected_gross=exp.typical_gross,
                    message=(
                        f"{exp.vendor}-Rechnung für {month:02d}/{year} fehlt "
                        f"(erwartet ~{exp.typical_gross:.2f} € um den "
                        f"{exp.expected_day}.)."
                    ),
                ))
        return alerts

    @staticmethod
    def _matches(inv: Invoice, exp, year: int, month: int) -> bool:
        if inv.entity != exp.entity:
            return False
        if exp.vendor.lower() not in (inv.vendor or "").lower():
            return False
        ref = inv.invoice_date or (inv.received_at.date() if inv.received_at else None)
        if not ref:
            return False
        return ref.year == year and ref.month == month
