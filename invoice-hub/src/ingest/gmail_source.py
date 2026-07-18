"""Ingestion aus Gmail-Postfächern.

Zwei Betriebsarten:
  * GmailSource       -> echte Gmail API (google-api-python-client)
  * SampleSource      -> liest Beispielrechnungen aus samples/ (Dry-Run)

Beide liefern `RawDocument`-Objekte. Die Pipeline ist quellen-agnostisch,
sodass später weitere Quellen (IMAP, Portal-RPA, Upload-Ordner) andocken.
"""

from __future__ import annotations

import base64
import json
from datetime import datetime
from pathlib import Path
from typing import Iterator, Protocol

from ..config import Config, Entity, Secrets
from ..models import RawDocument


class DocumentSource(Protocol):
    """Gemeinsame Schnittstelle aller Ingestion-Quellen."""

    def fetch(self, since: datetime | None = None) -> Iterator[RawDocument]:
        ...


# ---------------------------------------------------------------------------
# Dry-Run-Quelle: Beispielrechnungen aus dem Repo
# ---------------------------------------------------------------------------

SAMPLES_DIR = Path(__file__).resolve().parent.parent.parent / "samples"


class SampleSource:
    """Liest `samples/*.json` als simulierte Postfach-Eingänge.

    Jede Beispiel-Datei beschreibt eine E-Mail mit genau einem Rechnungs-
    anhang (Text oder eingebettetes ZUGFeRD-XML). So läuft die komplette
    Pipeline ohne echte Zugänge end-to-end durch.
    """

    def __init__(self, config: Config, samples_dir: Path = SAMPLES_DIR):
        self.config = config
        self.samples_dir = samples_dir

    def fetch(self, since: datetime | None = None) -> Iterator[RawDocument]:
        for path in sorted(self.samples_dir.glob("*.json")):
            payload = json.loads(path.read_text(encoding="utf-8"))
            mailbox = payload["mailbox"]
            entity = self.config.entity_for_mailbox(mailbox)
            yield RawDocument(
                mailbox=mailbox,
                entity=entity.name if entity else "Unbekannt",
                message_id=payload.get("message_id", path.stem),
                received_at=datetime.fromisoformat(payload["received_at"]),
                filename=payload["filename"],
                content_type=payload.get("content_type", "application/pdf"),
                text=payload.get("text", ""),
                embedded_xml=payload.get("embedded_xml", ""),
                email_subject=payload.get("subject", ""),
                email_from=payload.get("from", ""),
            )


# ---------------------------------------------------------------------------
# Echte Gmail-Quelle
# ---------------------------------------------------------------------------

class GmailSource:
    """Holt Rechnungsanhänge über die Gmail API.

    Voraussetzung (einmalige Einrichtung):
      1. Google-Cloud-Projekt + Gmail API aktivieren
      2. OAuth-Client (Desktop) anlegen -> credentials.json
      3. `pip install google-api-python-client google-auth-oauthlib`
      4. Pfade in .env: GMAIL_CREDENTIALS_JSON, GMAIL_TOKEN_JSON

    Für getrennte Postfächer pro Einheit: eine Instanz je Postfach betreiben
    (eigenes Token), oder Domain-weites Delegieren über ein Service-Konto.
    """

    SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"]

    def __init__(self, config: Config, secrets: Secrets, mailbox: str):
        self.config = config
        self.secrets = secrets
        self.mailbox = mailbox
        self._service = None

    def _connect(self):  # pragma: no cover - benötigt echte Zugänge
        from google.oauth2.credentials import Credentials
        from google_auth_oauthlib.flow import InstalledAppFlow
        from google.auth.transport.requests import Request
        from googleapiclient.discovery import build

        creds = None
        token_path = Path(self.secrets.gmail_token_json)
        if token_path.exists():
            creds = Credentials.from_authorized_user_file(str(token_path), self.SCOPES)
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            else:
                flow = InstalledAppFlow.from_client_secrets_file(
                    self.secrets.gmail_credentials_json, self.SCOPES
                )
                creds = flow.run_local_server(port=0)
            token_path.write_text(creds.to_json())
        self._service = build("gmail", "v1", credentials=creds)

    def fetch(self, since: datetime | None = None) -> Iterator[RawDocument]:  # pragma: no cover
        if self._service is None:
            self._connect()
        entity = self.config.entity_for_mailbox(self.mailbox)
        entity_name = entity.name if entity else "Unbekannt"

        query = "has:attachment (invoice OR rechnung OR faktura)"
        if since:
            query += f" after:{int(since.timestamp())}"

        results = self._service.users().messages().list(
            userId="me", q=query, maxResults=50
        ).execute()

        for meta in results.get("messages", []):
            msg = self._service.users().messages().get(
                userId="me", id=meta["id"], format="full"
            ).execute()
            headers = {h["name"].lower(): h["value"] for h in msg["payload"].get("headers", [])}
            received = datetime.fromtimestamp(int(msg["internalDate"]) / 1000)

            for part in self._iter_parts(msg["payload"]):
                filename = part.get("filename", "")
                if not filename:
                    continue
                body = part.get("body", {})
                if "attachmentId" not in body:
                    continue
                att = self._service.users().messages().attachments().get(
                    userId="me", messageId=meta["id"], id=body["attachmentId"]
                ).execute()
                data = base64.urlsafe_b64decode(att["data"])
                yield RawDocument(
                    mailbox=self.mailbox,
                    entity=entity_name,
                    message_id=meta["id"],
                    received_at=received,
                    filename=filename,
                    content_type=part.get("mimeType", "application/octet-stream"),
                    data=data,
                    email_subject=headers.get("subject", ""),
                    email_from=headers.get("from", ""),
                )

    @staticmethod
    def _iter_parts(payload):  # pragma: no cover
        stack = [payload]
        while stack:
            part = stack.pop()
            for sub in part.get("parts", []) or []:
                stack.append(sub)
            yield part


def build_sources(config: Config, secrets: Secrets, dry_run: bool) -> list[DocumentSource]:
    """Baut die passenden Ingestion-Quellen je nach Modus.

    Der manuelle Upload-Ordner (`inbox/`) ist IMMER aktiv — Papierrechnungen
    und Quittungen kann man unabhängig vom Postfach jederzeit einwerfen.
    """
    from .upload_source import UploadSource

    if dry_run or not secrets.gmail_credentials_json:
        sources: list[DocumentSource] = [SampleSource(config)]
    else:
        sources = [GmailSource(config, secrets, e.mailbox) for e in config.entities]
    sources.append(UploadSource(config))
    return sources
