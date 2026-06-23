"""Integritäts-Siegel je Unique-Nummer.

Ein deterministischer HMAC-SHA256 über die kanonische Referenz
``slug|team|country|ref`` mit einem geheimen Schlüssel (einmalig erzeugt und in
den Einstellungen gespeichert) liefert ein kurzes, fälschungssicheres Siegel mit
Prüfziffer (mod 97). Damit lässt sich später zweifelsfrei prüfen, dass eine
Nummer wirklich aus dieser Produktion stammt – ohne zentrale Online-Abfrage.
"""

from __future__ import annotations

import hashlib
import hmac


def compute(secret: str, slug: str, team: str, country: str, ref: str) -> str:
    msg = f"{slug}|{team}|{country}|{ref}".encode()
    h = hmac.new(secret.encode(), msg, hashlib.sha256).hexdigest()
    token = h[:10].upper()
    check = int(h[:8], 16) % 97
    return f"{token}-{check:02d}"


def verify(secret: str, slug: str, team: str, country: str, ref: str, seal: str) -> bool:
    return hmac.compare_digest(compute(secret, slug, team, country, ref), (seal or "").strip().upper())
