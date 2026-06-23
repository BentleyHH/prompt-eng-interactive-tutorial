"""FTP-/FTPS-Upload der Produktionsergebnisse.

Die Zugangsdaten kommen aus den Einstellungen (lokale SQLite-DB). Unterstützt
einfaches FTP und FTP über TLS (FTPS).
"""

from __future__ import annotations

import ftplib
from pathlib import Path


def upload(files: list[str | Path], *, host: str, user: str, password: str,
           directory: str = "", port: int = 21, tls: bool = False) -> list[str]:
    """Lade die angegebenen Dateien hoch. Liefert die Liste der Remote-Pfade."""
    if not host:
        raise RuntimeError("Kein FTP-Host konfiguriert.")
    ftp = ftplib.FTP_TLS() if tls else ftplib.FTP()
    ftp.connect(host, int(port or 21), timeout=30)
    ftp.login(user or "", password or "")
    if tls:
        ftp.prot_p()
    remote = []
    try:
        if directory:
            _ensure_dir(ftp, directory)
        for f in files:
            p = Path(f)
            if not p.exists():
                continue
            with p.open("rb") as fh:
                ftp.storbinary(f"STOR {p.name}", fh)
            remote.append(f"{directory.rstrip('/')}/{p.name}" if directory else p.name)
    finally:
        try:
            ftp.quit()
        except Exception:  # noqa: BLE001
            ftp.close()
    return remote


def _ensure_dir(ftp, directory: str) -> None:
    for part in directory.strip("/").split("/"):
        if not part:
            continue
        try:
            ftp.cwd(part)
        except ftplib.error_perm:
            ftp.mkd(part)
            ftp.cwd(part)


def test_connection(*, host, user, password, port=21, tls=False) -> str:
    ftp = ftplib.FTP_TLS() if tls else ftplib.FTP()
    ftp.connect(host, int(port or 21), timeout=20)
    ftp.login(user or "", password or "")
    if tls:
        ftp.prot_p()
    pwd = ftp.pwd()
    ftp.quit()
    return pwd
