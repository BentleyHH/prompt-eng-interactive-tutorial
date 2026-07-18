"""Ablage auf OneDrive über die Microsoft Graph API.

Zielstruktur (aus config.path_template), relativ zum onedrive_root der Einheit:

    /Buchhaltung/Firma A/Eingang/2026/Q3/07-Juli/
        2026-07-05_Telekom-Deutschland_R-12345_89.90.pdf

Zwei Betriebsarten:
  * GraphOneDrive  -> echter Upload via Microsoft Graph
  * LocalArchive   -> legt dieselbe Struktur unter out/onedrive/ ab (Dry-Run),
                      damit man das Ergebnis lokal sofort sieht.
"""

from __future__ import annotations

from datetime import date
from pathlib import Path
from typing import Protocol

from ..config import Config, Entity, Secrets
from ..models import Invoice, Status

MONTHS_DE = [
    "", "01-Januar", "02-Februar", "03-März", "04-April", "05-Mai", "06-Juni",
    "07-Juli", "08-August", "09-September", "10-Oktober", "11-November", "12-Dezember",
]

DIRECTION_DE = {"eingang": "Eingang", "ausgang": "Ausgang", "unbekannt": "Ungeklaert"}


def target_path(config: Config, entity: Entity, inv: Invoice) -> str:
    """Berechnet den vollständigen Zielpfad (ohne Dateiname)."""
    ref = inv.invoice_date or (inv.received_at.date() if inv.received_at else date.today())
    quarter = (ref.month - 1) // 3 + 1
    rel = config.path_template.format(
        direction=DIRECTION_DE.get(inv.direction.value, "Ungeklaert"),
        year=ref.year,
        quarter=quarter,
        month=MONTHS_DE[ref.month],
    )
    root = entity.onedrive_root.rstrip("/")
    return f"{root}/{rel}"


class Archive(Protocol):
    def store(self, inv: Invoice, data: bytes) -> str:
        ...


class LocalArchive:
    """Dry-Run-Ablage: spiegelt die OneDrive-Struktur lokal unter out/onedrive/."""

    def __init__(self, config: Config, base: Path):
        self.config = config
        self.base = base

    def store(self, inv: Invoice, data: bytes) -> str:
        entity = self.config.entity_by_name(inv.entity)
        if entity is None:
            entity = Entity(name=inv.entity, mailbox="", onedrive_root=f"/Buchhaltung/{inv.entity}")
        folder = target_path(self.config, entity, inv)
        full_dir = self.base / folder.lstrip("/")
        full_dir.mkdir(parents=True, exist_ok=True)
        dest = full_dir / inv.target_filename()
        dest.write_bytes(data or inv.target_filename().encode("utf-8"))
        inv.storage_path = f"{folder}/{inv.target_filename()}"
        inv.status = Status.ABGELEGT
        return inv.storage_path


class GraphOneDrive:  # pragma: no cover - benötigt echte Zugänge
    """Echter Upload via Microsoft Graph.

    Einrichtung:
      1. App-Registrierung im Entra-Portal (Azure AD)
      2. API-Berechtigung: Files.ReadWrite.All (App oder delegiert)
      3. Client-Secret erzeugen; Werte in .env:
         MS_CLIENT_ID, MS_CLIENT_SECRET, MS_TENANT_ID, ONEDRIVE_DRIVE_ID
      4. `pip install msal requests`
    """

    GRAPH = "https://graph.microsoft.com/v1.0"

    def __init__(self, config: Config, secrets: Secrets):
        self.config = config
        self.secrets = secrets
        self._token = None

    def _access_token(self) -> str:
        import msal
        app = msal.ConfidentialClientApplication(
            self.secrets.ms_client_id,
            authority=f"https://login.microsoftonline.com/{self.secrets.ms_tenant_id}",
            client_credential=self.secrets.ms_client_secret,
        )
        result = app.acquire_token_for_client(
            scopes=["https://graph.microsoft.com/.default"]
        )
        if "access_token" not in result:
            raise RuntimeError(f"Graph-Auth fehlgeschlagen: {result.get('error_description')}")
        return result["access_token"]

    def store(self, inv: Invoice, data: bytes) -> str:
        import requests
        if self._token is None:
            self._token = self._access_token()
        entity = self.config.entity_by_name(inv.entity)
        folder = target_path(self.config, entity, inv)
        item_path = f"{folder}/{inv.target_filename()}".lstrip("/")
        drive = self.secrets.onedrive_drive_id
        url = f"{self.GRAPH}/drives/{drive}/root:/{item_path}:/content"
        resp = requests.put(
            url,
            headers={"Authorization": f"Bearer {self._token}",
                     "Content-Type": "application/octet-stream"},
            data=data,
            timeout=60,
        )
        resp.raise_for_status()
        inv.storage_path = f"/{item_path}"
        inv.status = Status.ABGELEGT
        return inv.storage_path


def build_archive(config: Config, secrets: Secrets, dry_run: bool, out_dir: Path) -> Archive:
    if dry_run or not secrets.ms_client_id:
        return LocalArchive(config, out_dir / "onedrive")
    return GraphOneDrive(config, secrets)
