"""Manueller Import: PDFs, Scans und Fotos von Quittungen/Papierrechnungen.

Für den Fall „ich kriege per Post eine Rechnung" oder „ich muss eine Quittung
hochladen". Drei Wege führen hier zusammen:

  * Drop-Ordner  ->  inbox/<Einheit>/datei.pdf|jpg|png
  * CLI          ->  python -m src.cli import <datei> --entity "Privat"
  * Dashboard    ->  Drag & Drop (Frontend legt Datei in denselben Ordner)

Charme des Ordner-Wegs: `inbox/` kann ein **OneDrive-synchronisierter Ordner**
sein — dann reicht es, vom Handy ein Foto in `inbox/Privat/` zu legen.

Bilder werden im Produktivbetrieb per Claude Vision gelesen. Im Dry-Run
simuliert eine optionale `.txt`-Sidecar-Datei das OCR-Ergebnis, damit die
Demo ohne Modellaufruf durchläuft:

    inbox/Firma B UG/Papierrechnung.png          <- der Scan/das Foto
    inbox/Firma B UG/Papierrechnung.png.txt      <- simuliertes OCR (nur Dry-Run)
"""

from __future__ import annotations

import mimetypes
from datetime import datetime
from pathlib import Path
from typing import Iterator, Optional

from ..config import Config
from ..models import RawDocument

INBOX_DIR = Path(__file__).resolve().parent.parent.parent / "inbox"

IMAGE_EXT = {".jpg", ".jpeg", ".png", ".webp", ".heic", ".tif", ".tiff", ".gif"}
PDF_EXT = {".pdf"}
TEXT_EXT = {".txt"}
SUPPORTED = IMAGE_EXT | PDF_EXT | TEXT_EXT


class UploadSource:
    """Liest importierte Dateien aus `inbox/<Einheit>/`.

    Die Buchungseinheit ergibt sich aus dem Unterordner (gleiche Philosophie
    wie die getrennten Postfächer). Dateien direkt in `inbox/` ohne Einheit
    landen als „Unbekannt" in der manuellen Prüfung.
    """

    def __init__(self, config: Config, inbox: Path = INBOX_DIR,
                 move_processed: bool = False):
        self.config = config
        self.inbox = inbox
        self.move_processed = move_processed

    def fetch(self, since: datetime | None = None) -> Iterator[RawDocument]:
        if not self.inbox.exists():
            return
        for path in sorted(self.inbox.rglob("*")):
            if not path.is_file():
                continue
            ext = path.suffix.lower()
            if ext not in SUPPORTED:
                continue
            if ext in TEXT_EXT and _is_sidecar(path):
                continue  # gehört zu einem Bild/PDF, wird dort mitgelesen
            if "_verarbeitet" in path.parts:
                continue
            entity = self._entity_for(path)
            doc = read_document(path, entity)
            if doc:
                yield doc
                if self.move_processed:
                    _archive_processed(self.inbox, path)

    def _entity_for(self, path: Path) -> str:
        try:
            rel = path.relative_to(self.inbox)
        except ValueError:
            return "Unbekannt"
        folder = rel.parts[0] if len(rel.parts) > 1 else ""
        if not folder:
            return "Unbekannt"
        # exakter Name, sonst unscharf
        for e in self.config.entities:
            if e.name.lower() == folder.lower():
                return e.name
        for e in self.config.entities:
            if folder.lower() in e.name.lower() or e.name.lower() in folder.lower():
                return e.name
        return folder  # unbekannter Ordner -> so übernehmen, Prüf-Gate greift


def read_document(path: Path, entity: str) -> Optional[RawDocument]:
    """Baut aus einer einzelnen Datei ein RawDocument (auch von der CLI genutzt)."""
    ext = path.suffix.lower()
    if ext not in SUPPORTED:
        return None

    text = ""
    data = b""
    embedded_xml = ""
    content_type = mimetypes.guess_type(path.name)[0] or "application/octet-stream"

    if ext in TEXT_EXT:
        text = path.read_text(encoding="utf-8", errors="replace")
        content_type = "text/plain"
    else:
        data = path.read_bytes()
        # Dry-Run-OCR-Simulation: Sidecar <datei>.txt
        sidecar = path.with_name(path.name + ".txt")
        if sidecar.exists():
            text = sidecar.read_text(encoding="utf-8", errors="replace")
        if ext in PDF_EXT:
            content_type = "application/pdf"
            embedded_xml = _extract_embedded_zugferd(data)

    received = datetime.fromtimestamp(path.stat().st_mtime)
    return RawDocument(
        mailbox=f"upload:{entity}",
        entity=entity,
        message_id=f"upload-{path.stem}",
        received_at=received,
        filename=path.name,
        content_type=content_type,
        data=data,
        text=text,
        embedded_xml=embedded_xml,
        email_subject="Manueller Import",
        email_from="Upload",
    )


def _is_sidecar(txt_path: Path) -> bool:
    """Ist diese .txt eine OCR-Sidecar zu einer Bild/PDF-Datei (foo.png.txt)?"""
    inner = txt_path.with_suffix("")  # foo.png.txt -> foo.png
    return inner.suffix.lower() in (IMAGE_EXT | PDF_EXT) and inner.exists()


def _extract_embedded_zugferd(pdf_bytes: bytes) -> str:  # pragma: no cover
    """Versucht, aus einem PDF/A-3 eine eingebettete ZUGFeRD-XML zu ziehen.

    Optional: nur wenn `pypdf` installiert ist. Ohne die Abhängigkeit wird
    still auf die normale (Claude-)Extraktion zurückgefallen.
    """
    try:
        import io
        from pypdf import PdfReader
    except ImportError:
        return ""
    try:
        reader = PdfReader(io.BytesIO(pdf_bytes))
        names = reader.attachments or {}
        for fname, contents in names.items():
            if fname.lower().endswith(".xml"):
                blob = contents[0] if isinstance(contents, list) else contents
                return blob.decode("utf-8", errors="replace")
    except Exception:
        return ""
    return ""


def _archive_processed(inbox: Path, path: Path) -> None:  # pragma: no cover
    dest_dir = inbox / "_verarbeitet"
    dest_dir.mkdir(exist_ok=True)
    path.rename(dest_dir / path.name)
