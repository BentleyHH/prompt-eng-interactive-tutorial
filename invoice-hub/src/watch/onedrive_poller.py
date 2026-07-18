"""OneDrive-Inbox-Poller (Microsoft Graph).

Für den vollständig cloudbasierten Handy-Workflow ohne Desktop-Sync:
Die OneDrive-App auf dem Handy legt Fotos/Scans in `<onedrive_folder>/<Einheit>/`.
Dieser Poller lädt neue Dateien per Graph API in die lokale `inbox/<Einheit>/`,
wo der WatchService sie verarbeitet, und räumt das Original auf OneDrive nach
`<onedrive_folder>/_verarbeitet/` weg.

Benötigt dieselben Graph-Zugänge wie die Ablage (siehe storage/onedrive.py).
Ganze Datei ist zugangs-gated und daher pragma: no cover.
"""

from __future__ import annotations  # pragma: no cover

from pathlib import Path

from ..config import Config, Secrets

GRAPH = "https://graph.microsoft.com/v1.0"


class OneDriveInboxPoller:  # pragma: no cover
    def __init__(self, config: Config, secrets: Secrets, local_inbox: Path):
        self.config = config
        self.secrets = secrets
        self.local_inbox = local_inbox
        self._token = None

    def _access_token(self) -> str:
        import msal
        app = msal.ConfidentialClientApplication(
            self.secrets.ms_client_id,
            authority=f"https://login.microsoftonline.com/{self.secrets.ms_tenant_id}",
            client_credential=self.secrets.ms_client_secret,
        )
        result = app.acquire_token_for_client(
            scopes=["https://graph.microsoft.com/.default"])
        if "access_token" not in result:
            raise RuntimeError(f"Graph-Auth fehlgeschlagen: {result.get('error_description')}")
        return result["access_token"]

    def _headers(self) -> dict:
        if self._token is None:
            self._token = self._access_token()
        return {"Authorization": f"Bearer {self._token}"}

    def pull(self) -> int:
        """Lädt neue Dateien aus jedem Einheiten-Unterordner in die lokale inbox/."""
        import requests

        drive = self.secrets.onedrive_drive_id
        base = self.config.inbox.onedrive_folder.strip("/")
        count = 0

        for entity in self.config.entities:
            folder = f"{base}/{entity.name}".strip("/")
            url = f"{GRAPH}/drives/{drive}/root:/{folder}:/children"
            resp = requests.get(url, headers=self._headers(), timeout=30)
            if resp.status_code == 404:
                continue  # Ordner existiert (noch) nicht
            resp.raise_for_status()

            for item in resp.json().get("value", []):
                if "file" not in item:
                    continue
                name = item["name"]
                dl = item.get("@microsoft.graph.downloadUrl")
                if not dl:
                    continue
                dest_dir = self.local_inbox / entity.name
                dest_dir.mkdir(parents=True, exist_ok=True)
                (dest_dir / name).write_bytes(requests.get(dl, timeout=60).content)
                count += 1
                self._move_processed_remote(drive, item["id"], base)
        return count

    def _move_processed_remote(self, drive: str, item_id: str, base: str) -> None:
        """Verschiebt das Original auf OneDrive nach <folder>/_verarbeitet/."""
        import requests
        # Zielordner sicherstellen
        mk = f"{GRAPH}/drives/{drive}/root:/{base}:/children"
        requests.post(mk, headers={**self._headers(), "Content-Type": "application/json"},
                      json={"name": "_verarbeitet", "folder": {},
                            "@microsoft.graph.conflictBehavior": "fail"}, timeout=30)
        parent = f"{GRAPH}/drives/{drive}/root:/{base}/_verarbeitet:"
        pr = requests.get(parent, headers=self._headers(), timeout=30)
        if pr.ok:
            requests.patch(
                f"{GRAPH}/drives/{drive}/items/{item_id}",
                headers={**self._headers(), "Content-Type": "application/json"},
                json={"parentReference": {"id": pr.json()["id"]}}, timeout=30)
