import Database from 'better-sqlite3';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import fs from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, 'data');
fs.mkdirSync(join(DATA_DIR, 'uploads'), { recursive: true });

const db = new Database(join(DATA_DIR, 'panotour.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS tours (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    description TEXT DEFAULT '',
    logo_path   TEXT,                       -- Datei fuer den Nadir-/Logo-Patch
    autorotate  INTEGER DEFAULT 1,          -- Auto-Rotation an/aus
    created_at  TEXT DEFAULT (datetime('now')),
    updated_at  TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS scenes (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    tour_id       INTEGER NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
    name          TEXT NOT NULL,
    image_path    TEXT NOT NULL,            -- equirectangulares 360-Bild
    position      INTEGER DEFAULT 0,        -- Reihenfolge im Rundgang
    default_yaw   REAL DEFAULT 0,           -- Startblick (Radiant)
    default_pitch REAL DEFAULT 0,
    default_zoom  REAL DEFAULT 50,          -- 0..100
    logo_yaw      REAL DEFAULT 0,           -- Position des Logo-Patch
    logo_pitch    REAL DEFAULT -1.5707963,  -- -90 Grad = direkt nach unten (Stativ)
    logo_scale    REAL DEFAULT 22,          -- Groesse des Logos in Grad
    logo_enabled  INTEGER DEFAULT 1,
    created_at    TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS hotspots (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    scene_id        INTEGER NOT NULL REFERENCES scenes(id) ON DELETE CASCADE,
    target_scene_id INTEGER REFERENCES scenes(id) ON DELETE CASCADE,
    label           TEXT DEFAULT '',
    yaw             REAL NOT NULL,
    pitch           REAL NOT NULL
  );

  CREATE TABLE IF NOT EXISTS keyframes (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    scene_id  INTEGER NOT NULL REFERENCES scenes(id) ON DELETE CASCADE,
    position  INTEGER DEFAULT 0,            -- Reihenfolge der Kamerafahrt
    yaw       REAL NOT NULL,
    pitch     REAL NOT NULL,
    zoom      REAL DEFAULT 50,
    duration  INTEGER DEFAULT 2500          -- ms bis zu diesem Punkt
  );
`);

export default db;
