"""Konfiguration laden (Einheiten, Postfächer, Ablage-Regeln, Radar)."""

from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional

try:
    import yaml
except ImportError:  # pragma: no cover
    yaml = None


CONFIG_PATH = Path(__file__).resolve().parent.parent / "config" / "entities.yaml"


@dataclass
class Entity:
    name: str
    mailbox: str
    vat_id: str = ""
    onedrive_root: str = ""
    skr: str = ""


@dataclass
class RecurringExpectation:
    entity: str
    vendor: str
    cadence: str
    expected_day: int
    typical_gross: float


@dataclass
class InboxConfig:
    """Auto-Import-Einstellungen für den Ordner-/OneDrive-Watcher."""
    onedrive_folder: str = ""     # Ordner in OneDrive, den die Handy-App befüllt
    poll_interval: int = 30       # Sekunden zwischen zwei Scans
    move_processed: bool = True   # Original nach Verarbeitung wegräumen


@dataclass
class Config:
    entities: list[Entity] = field(default_factory=list)
    path_template: str = "{direction}/{year}/Q{quarter}/{month}"
    recurring: list[RecurringExpectation] = field(default_factory=list)
    categories: dict = field(default_factory=dict)
    inbox: InboxConfig = field(default_factory=InboxConfig)

    def entity_for_mailbox(self, mailbox: str) -> Optional[Entity]:
        for e in self.entities:
            if e.mailbox.lower() == mailbox.lower():
                return e
        return None

    def entity_by_name(self, name: str) -> Optional[Entity]:
        for e in self.entities:
            if e.name == name:
                return e
        return None


def load_config(path: Path = CONFIG_PATH) -> Config:
    if yaml is None:
        raise RuntimeError(
            "PyYAML nicht installiert. Bitte `pip install -r requirements.txt`."
        )
    with open(path, "r", encoding="utf-8") as fh:
        raw = yaml.safe_load(fh) or {}

    entities = [Entity(**e) for e in raw.get("entities", [])]
    recurring = [RecurringExpectation(**r) for r in raw.get("recurring", [])]
    storage = raw.get("storage", {})
    inbox_raw = raw.get("inbox", {}) or {}
    return Config(
        entities=entities,
        path_template=storage.get("path_template", "{direction}/{year}/Q{quarter}/{month}"),
        recurring=recurring,
        categories=raw.get("categories", {}),
        inbox=InboxConfig(
            onedrive_folder=inbox_raw.get("onedrive_folder", ""),
            poll_interval=int(inbox_raw.get("poll_interval", 30)),
            move_processed=bool(inbox_raw.get("move_processed", True)),
        ),
    )


# --- Zugangsdaten aus Umgebung (nie im Code/Repo) ---

@dataclass
class Secrets:
    anthropic_api_key: str = ""
    gmail_credentials_json: str = ""     # Pfad zur OAuth-Client-Datei
    gmail_token_json: str = ""           # Pfad zum gespeicherten Token
    ms_client_id: str = ""
    ms_client_secret: str = ""
    ms_tenant_id: str = ""
    onedrive_drive_id: str = ""


def load_secrets() -> Secrets:
    return Secrets(
        anthropic_api_key=os.getenv("ANTHROPIC_API_KEY", ""),
        gmail_credentials_json=os.getenv("GMAIL_CREDENTIALS_JSON", ""),
        gmail_token_json=os.getenv("GMAIL_TOKEN_JSON", ""),
        ms_client_id=os.getenv("MS_CLIENT_ID", ""),
        ms_client_secret=os.getenv("MS_CLIENT_SECRET", ""),
        ms_tenant_id=os.getenv("MS_TENANT_ID", ""),
        onedrive_drive_id=os.getenv("ONEDRIVE_DRIVE_ID", ""),
    )
