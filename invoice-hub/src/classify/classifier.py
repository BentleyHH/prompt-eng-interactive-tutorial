"""Klassifikation: Eingang/Ausgang, Kategorie und SKR-Konto bestimmen.

Die Buchungseinheit (Firma A/B/Privat) steht bereits fest — sie kommt aus
dem Postfach. Hier geht es um die drei verbleibenden Fragen:

  * Richtung: Ist DIESE Einheit der Rechnungssteller (Ausgang) oder der
    Empfänger (Eingang)? Erkannt über die eigene USt-IdNr.
  * Kategorie + SKR-Konto: aus der Config-Zuordnung (Lieferant -> Kategorie),
    sonst per Heuristik; später optional per Claude verfeinerbar.
  * Konfidenz-Gate: unsichere Rechnungen werden zur Prüfung markiert.
"""

from __future__ import annotations

from ..config import Config
from ..models import Direction, Invoice, Status

CONFIDENCE_THRESHOLD = 0.6


class Classifier:
    def __init__(self, config: Config):
        self.config = config

    def classify(self, inv: Invoice) -> Invoice:
        entity = self.config.entity_by_name(inv.entity)

        # --- Richtung über eigene USt-IdNr. ---
        own_vat = (entity.vat_id if entity else "").upper().strip()
        if own_vat:
            if inv.vat_id and inv.vat_id.upper().strip() == own_vat:
                # unsere USt-IdNr. steht als Rechnungssteller -> wir stellen aus
                inv.direction = Direction.AUSGANG
            else:
                inv.direction = Direction.EINGANG
        else:
            # Privat: i. d. R. immer Eingang (kein eigener Rechnungsausgang)
            inv.direction = Direction.EINGANG

        # --- Kategorie / SKR ---
        cat = self._category_for(inv.vendor)
        if cat:
            inv.category = cat.get("category", inv.category)
            inv.skr_account = str(cat.get("skr", inv.skr_account))

        # --- Prüf-Gate ---
        if inv.confidence < CONFIDENCE_THRESHOLD or inv.gross is None:
            inv.status = Status.PRUEFEN
            if not inv.notes:
                inv.notes = "Niedrige Konfidenz — bitte manuell prüfen."
        else:
            inv.status = Status.KLASSIFIZIERT
        return inv

    def _category_for(self, vendor: str) -> dict | None:
        if not vendor:
            return None
        cats = self.config.categories or {}
        # exakter Treffer, sonst Teilstring-Match
        if vendor in cats:
            return cats[vendor]
        for name, meta in cats.items():
            if name.lower() in vendor.lower() or vendor.lower() in name.lower():
                return meta
        return None
