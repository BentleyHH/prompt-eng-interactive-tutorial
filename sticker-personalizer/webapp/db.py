"""SQLite-Datenhaltung für das Booklet-Dashboard.

Bewusst schlank gehalten (eine Datei-DB, einzelplatztauglich). Die DB-Datei und
die Ausgaben liegen unter ``webapp/data`` und lassen sich 1:1 per FTP sichern.

Tabellen
--------
protocols  Registrierte Master-Booklets inkl. Analyse-Ergebnis und Ampel-Status.
runs       Produktionsläufe (Bereich/Menge, Status, Ausgabepfade).
produced   Ledger jeder erzeugten Unique-Nummer – Grundlage des Doppel-Schutzes.

Eindeutigkeit einer Unique-Nummer = (protocol_id, country, ref). Dieselbe Nummer
darf also für unterschiedliche Protokolle oder Country-Codes erneut vergeben
werden; ein gewollter Nachdruck derselben Nummer wird als zusätzlicher
Ledger-Eintrag mit ``is_reprint=1`` geführt.
"""

from __future__ import annotations

import json
import sqlite3
import threading
from datetime import datetime
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent / "data"
DB_PATH = DATA_DIR / "app.db"
MASTERS_DIR = DATA_DIR / "masters"
OUTPUT_DIR = DATA_DIR / "output"

_LOCK = threading.RLock()

SCHEMA = """
CREATE TABLE IF NOT EXISTS protocols (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    slug        TEXT UNIQUE NOT NULL,
    master_path TEXT NOT NULL,
    team        TEXT,
    country     TEXT,
    src_ref     TEXT,
    ref_width   INTEGER,
    n_image     INTEGER,
    n_vector    INTEGER,
    status      TEXT NOT NULL DEFAULT 'neu',   -- neu | laeuft | fehler | sauber
    error       TEXT,
    created_at  TEXT,
    analyzed_at TEXT
);
CREATE TABLE IF NOT EXISTS runs (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    protocol_id   INTEGER NOT NULL,
    team          TEXT,
    country       TEXT,
    spec          TEXT,
    refs_json     TEXT,
    mode          TEXT,                          -- neu | nachdruck
    count         INTEGER,
    status        TEXT NOT NULL DEFAULT 'laeuft', -- laeuft | fehler | sauber
    progress      INTEGER DEFAULT 0,
    error         TEXT,
    combined_path TEXT,
    zip_path      TEXT,
    created_at    TEXT,
    finished_at   TEXT
);
CREATE TABLE IF NOT EXISTS produced (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    protocol_id INTEGER NOT NULL,
    run_id      INTEGER,
    team        TEXT,
    country     TEXT,
    ref         TEXT,
    is_reprint  INTEGER DEFAULT 0,
    produced_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_produced_key ON produced(protocol_id, country, ref);
"""


def now() -> str:
    return datetime.now().isoformat(timespec="seconds")


def connect() -> sqlite3.Connection:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    MASTERS_DIR.mkdir(parents=True, exist_ok=True)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    con = sqlite3.connect(DB_PATH, check_same_thread=False)
    con.row_factory = sqlite3.Row
    con.execute("PRAGMA journal_mode=WAL;")
    return con


def init_db() -> None:
    with _LOCK, connect() as con:
        con.executescript(SCHEMA)


def _rows(cur) -> list[dict]:
    return [dict(r) for r in cur.fetchall()]


# --- Protokolle ------------------------------------------------------------
def add_protocol(name, slug, master_path) -> int:
    with _LOCK, connect() as con:
        cur = con.execute(
            "INSERT INTO protocols(name,slug,master_path,status,created_at) "
            "VALUES(?,?,?,'neu',?)", (name, slug, str(master_path), now()))
        return cur.lastrowid


def set_protocol_status(pid, status, error=None) -> None:
    with _LOCK, connect() as con:
        con.execute("UPDATE protocols SET status=?, error=? WHERE id=?",
                    (status, error, pid))


def set_protocol_analysis(pid, team, country, src_ref, ref_width, n_image, n_vector) -> None:
    with _LOCK, connect() as con:
        con.execute(
            "UPDATE protocols SET team=?,country=?,src_ref=?,ref_width=?,n_image=?,"
            "n_vector=?,status='sauber',error=NULL,analyzed_at=? WHERE id=?",
            (team, country, src_ref, ref_width, n_image, n_vector, now(), pid))


def list_protocols() -> list[dict]:
    with _LOCK, connect() as con:
        return _rows(con.execute("SELECT * FROM protocols ORDER BY name"))


def get_protocol(pid) -> dict | None:
    with _LOCK, connect() as con:
        r = con.execute("SELECT * FROM protocols WHERE id=?", (pid,)).fetchone()
        return dict(r) if r else None


def slug_exists(slug) -> bool:
    with _LOCK, connect() as con:
        return con.execute("SELECT 1 FROM protocols WHERE slug=?", (slug,)).fetchone() is not None


# --- Läufe -----------------------------------------------------------------
def add_run(protocol_id, team, country, spec, refs, mode) -> int:
    with _LOCK, connect() as con:
        cur = con.execute(
            "INSERT INTO runs(protocol_id,team,country,spec,refs_json,mode,count,"
            "status,progress,created_at) VALUES(?,?,?,?,?,?,?,'laeuft',0,?)",
            (protocol_id, team, country, spec, json.dumps(refs), mode, len(refs), now()))
        return cur.lastrowid


def set_run_progress(rid, progress) -> None:
    with _LOCK, connect() as con:
        con.execute("UPDATE runs SET progress=? WHERE id=?", (progress, rid))


def finish_run(rid, status, error=None, combined_path=None, zip_path=None) -> None:
    with _LOCK, connect() as con:
        con.execute(
            "UPDATE runs SET status=?, error=?, combined_path=?, zip_path=?, "
            "finished_at=? WHERE id=?",
            (status, error, str(combined_path) if combined_path else None,
             str(zip_path) if zip_path else None, now(), rid))


def list_runs(protocol_id=None, limit=100) -> list[dict]:
    with _LOCK, connect() as con:
        if protocol_id:
            return _rows(con.execute(
                "SELECT * FROM runs WHERE protocol_id=? ORDER BY id DESC LIMIT ?",
                (protocol_id, limit)))
        return _rows(con.execute("SELECT * FROM runs ORDER BY id DESC LIMIT ?", (limit,)))


def get_run(rid) -> dict | None:
    with _LOCK, connect() as con:
        r = con.execute("SELECT * FROM runs WHERE id=?", (rid,)).fetchone()
        return dict(r) if r else None


# --- Ledger (produzierte Nummern) -----------------------------------------
def record_produced(protocol_id, run_id, team, country, refs, reprints: set | None = None) -> None:
    reprints = reprints or set()
    ts = now()
    with _LOCK, connect() as con:
        con.executemany(
            "INSERT INTO produced(protocol_id,run_id,team,country,ref,is_reprint,produced_at) "
            "VALUES(?,?,?,?,?,?,?)",
            [(protocol_id, run_id, team, country, r, 1 if r in reprints else 0, ts)
             for r in refs])


def produced_refs(protocol_id, country) -> set[str]:
    """Menge aller je erzeugten Nummern für (Protokoll, Country)."""
    with _LOCK, connect() as con:
        rows = con.execute(
            "SELECT DISTINCT ref FROM produced WHERE protocol_id=? AND country=?",
            (protocol_id, country)).fetchall()
        return {r["ref"] for r in rows}


def produced_list(protocol_id=None, country=None, limit=5000) -> list[dict]:
    q = "SELECT * FROM produced WHERE 1=1"
    args = []
    if protocol_id:
        q += " AND protocol_id=?"; args.append(protocol_id)
    if country:
        q += " AND country=?"; args.append(country)
    q += " ORDER BY ref LIMIT ?"; args.append(limit)
    with _LOCK, connect() as con:
        return _rows(con.execute(q, args))
