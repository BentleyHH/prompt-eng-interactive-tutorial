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
    spots       TEXT,                          -- erkannte Sonderfarben (Druckvorstufe)
    ptype       TEXT NOT NULL DEFAULT 'cbrn',  -- cbrn (Referenznummer) | officer (Excel-Personalisierung)
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
    pdfa_path     TEXT,
    ftp_status    TEXT,
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
    seal        TEXT,
    username    TEXT,
    produced_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_produced_key ON produced(protocol_id, country, ref);

CREATE TABLE IF NOT EXISTS users (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    username   TEXT UNIQUE NOT NULL,
    pw_hash    TEXT NOT NULL,
    role       TEXT NOT NULL DEFAULT 'operator',   -- admin | operator
    created_at TEXT
);
CREATE TABLE IF NOT EXISTS audit (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    ts        TEXT,
    username  TEXT,
    action    TEXT,
    detail    TEXT
);
CREATE TABLE IF NOT EXISTS settings (
    key   TEXT PRIMARY KEY,
    value TEXT
);
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
        _migrate(con)


def _migrate(con) -> None:
    """Fehlende Spalten in bestehenden Datenbanken nachrüsten (sanfte Migration)."""
    wanted = {
        "protocols": {"spots": "TEXT", "ptype": "TEXT NOT NULL DEFAULT 'cbrn'", "notes": "TEXT"},
        "runs": {"pdfa_path": "TEXT", "ftp_status": "TEXT"},
        "produced": {"seal": "TEXT", "username": "TEXT"},
    }
    for table, cols in wanted.items():
        have = {r["name"] for r in con.execute(f"PRAGMA table_info({table})")}
        for name, typ in cols.items():
            if name not in have:
                con.execute(f"ALTER TABLE {table} ADD COLUMN {name} {typ}")


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


def set_protocol_analysis(pid, team, country, src_ref, ref_width, n_image, n_vector,
                          spots=None, notes=None) -> None:
    with _LOCK, connect() as con:
        con.execute(
            "UPDATE protocols SET team=?,country=?,src_ref=?,ref_width=?,n_image=?,"
            "n_vector=?,spots=?,notes=?,ptype='cbrn',status='sauber',error=NULL,analyzed_at=? WHERE id=?",
            (team, country, src_ref, ref_width, n_image, n_vector, spots, notes, now(), pid))


def set_protocol_officer(pid, n_roles) -> None:
    """Officer-Booklet (Excel-Personalisierung) als sauber analysiert markieren."""
    with _LOCK, connect() as con:
        con.execute(
            "UPDATE protocols SET ptype='officer', n_image=?, n_vector=0, team=NULL, "
            "src_ref=NULL, spots=NULL, status='sauber', error=NULL, analyzed_at=? WHERE id=?",
            (n_roles, now(), pid))


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


def set_run_file(rid, *, pdfa_path=None, ftp_status=None) -> None:
    with _LOCK, connect() as con:
        if pdfa_path is not None:
            con.execute("UPDATE runs SET pdfa_path=? WHERE id=?", (str(pdfa_path), rid))
        if ftp_status is not None:
            con.execute("UPDATE runs SET ftp_status=? WHERE id=?", (ftp_status, rid))


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


def delete_run(rid) -> None:
    """Lauf entfernen (inkl. zugehöriger Ledger-Einträge); Dateien räumt der Aufrufer."""
    with _LOCK, connect() as con:
        con.execute("DELETE FROM produced WHERE run_id=?", (rid,))
        con.execute("DELETE FROM runs WHERE id=?", (rid,))


def reset_stale_runs() -> int:
    """Beim Start: Läufe, die noch auf 'laeuft' stehen, gibt es nach einem
    Neustart/Absturz nicht mehr (Threads überleben den Prozess nicht). Diese als
    'fehler' markieren, damit sie nicht ewig orange hängen und gelöscht werden
    können. Liefert die Anzahl bereinigter Läufe."""
    with _LOCK, connect() as con:
        cur = con.execute(
            "UPDATE runs SET status='fehler', "
            "error='Abgebrochen (App wurde neu gestartet).' WHERE status='laeuft'")
        return cur.rowcount


# --- Ledger (produzierte Nummern) -----------------------------------------
def record_produced(protocol_id, run_id, team, country, refs, reprints: set | None = None,
                    seals: dict | None = None, username: str | None = None) -> None:
    reprints = reprints or set()
    seals = seals or {}
    ts = now()
    with _LOCK, connect() as con:
        con.executemany(
            "INSERT INTO produced(protocol_id,run_id,team,country,ref,is_reprint,seal,"
            "username,produced_at) VALUES(?,?,?,?,?,?,?,?,?)",
            [(protocol_id, run_id, team, country, r, 1 if r in reprints else 0,
              seals.get(r), username, ts) for r in refs])


def produced_refs(protocol_id, country) -> set[str]:
    """Menge aller je erzeugten Nummern für (Protokoll, Country)."""
    with _LOCK, connect() as con:
        rows = con.execute(
            "SELECT DISTINCT ref FROM produced WHERE protocol_id=? AND country=?",
            (protocol_id, country)).fetchall()
        return {r["ref"] for r in rows}


def produced_list(protocol_id=None, country=None, limit=20000) -> list[dict]:
    q = "SELECT * FROM produced WHERE 1=1"
    args = []
    if protocol_id:
        q += " AND protocol_id=?"; args.append(protocol_id)
    if country:
        q += " AND country=?"; args.append(country)
    q += " ORDER BY ref LIMIT ?"; args.append(limit)
    with _LOCK, connect() as con:
        return _rows(con.execute(q, args))


# --- Einstellungen ---------------------------------------------------------
def get_setting(key, default=None):
    with _LOCK, connect() as con:
        r = con.execute("SELECT value FROM settings WHERE key=?", (key,)).fetchone()
        return r["value"] if r else default


def set_setting(key, value) -> None:
    with _LOCK, connect() as con:
        con.execute("INSERT INTO settings(key,value) VALUES(?,?) "
                    "ON CONFLICT(key) DO UPDATE SET value=excluded.value", (key, str(value)))


def all_settings() -> dict:
    with _LOCK, connect() as con:
        return {r["key"]: r["value"] for r in con.execute("SELECT key,value FROM settings")}


def ensure_secret() -> str:
    import secrets
    s = get_setting("secret_key")
    if not s:
        s = secrets.token_hex(32)
        set_setting("secret_key", s)
    return s


# --- Benutzer --------------------------------------------------------------
def create_user(username, pw_hash, role="operator") -> int:
    with _LOCK, connect() as con:
        cur = con.execute("INSERT INTO users(username,pw_hash,role,created_at) VALUES(?,?,?,?)",
                          (username, pw_hash, role, now()))
        return cur.lastrowid


def get_user(username) -> dict | None:
    with _LOCK, connect() as con:
        r = con.execute("SELECT * FROM users WHERE username=?", (username,)).fetchone()
        return dict(r) if r else None


def list_users() -> list[dict]:
    with _LOCK, connect() as con:
        return _rows(con.execute("SELECT id,username,role,created_at FROM users ORDER BY username"))


def count_users() -> int:
    with _LOCK, connect() as con:
        return con.execute("SELECT COUNT(*) c FROM users").fetchone()["c"]


# --- Audit-Log -------------------------------------------------------------
def log_audit(username, action, detail="") -> None:
    with _LOCK, connect() as con:
        con.execute("INSERT INTO audit(ts,username,action,detail) VALUES(?,?,?,?)",
                    (now(), username, action, detail))


def list_audit(limit=300) -> list[dict]:
    with _LOCK, connect() as con:
        return _rows(con.execute("SELECT * FROM audit ORDER BY id DESC LIMIT ?", (limit,)))
