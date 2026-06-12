import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import path from "node:path";
import fs from "node:fs";
import * as schema from "./schema.js";

const dataDir = process.env.DATA_DIR ?? path.join(process.cwd(), "data");
fs.mkdirSync(dataDir, { recursive: true });

const sqlite = new Database(path.join(dataDir, "dvi.db"));
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

sqlite.exec(`
CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL DEFAULT 1,
  name TEXT NOT NULL,
  country TEXT, city TEXT, address TEXT, website TEXT, notes TEXT,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customerId INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  firstName TEXT NOT NULL DEFAULT '', lastName TEXT NOT NULL DEFAULT '',
  role TEXT, email TEXT, phone TEXT, mobile TEXT,
  isPrimary INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS catalog_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL DEFAULT 1,
  name TEXT NOT NULL,
  sortOrder INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS catalog_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL DEFAULT 1,
  categoryId INTEGER NOT NULL REFERENCES catalog_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT, descriptionEn TEXT,
  unit TEXT NOT NULL DEFAULT 'pauschal',
  sellPrice REAL NOT NULL DEFAULT 0,
  buyPrice REAL NOT NULL DEFAULT 0,
  duration TEXT,
  trainersRequired INTEGER NOT NULL DEFAULT 0,
  maxParticipants INTEGER,
  location TEXT,
  availableMonths TEXT,
  imageUrl TEXT,
  tags TEXT,
  isActive INTEGER NOT NULL DEFAULT 1,
  sortOrder INTEGER NOT NULL DEFAULT 0,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS proposals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL DEFAULT 1,
  customerId INTEGER NOT NULL REFERENCES customers(id),
  contactId INTEGER,
  proposalNumber TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft',
  date TEXT NOT NULL,
  validUntil TEXT,
  currency TEXT NOT NULL DEFAULT 'EUR',
  vatRate REAL NOT NULL DEFAULT 0,
  vatNote TEXT DEFAULT 'VAT 0% – Reverse Charge (§13b UStG)',
  introText TEXT, closingText TEXT,
  totalNet REAL NOT NULL DEFAULT 0,
  notes TEXT,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS proposal_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  proposalId INTEGER NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  catalogItemId INTEGER,
  position INTEGER NOT NULL DEFAULT 1,
  description TEXT NOT NULL DEFAULT '',
  quantity REAL NOT NULL DEFAULT 1,
  unit TEXT NOT NULL DEFAULT 'pauschal',
  unitPrice REAL NOT NULL DEFAULT 0,
  discount REAL NOT NULL DEFAULT 0,
  totalPrice REAL NOT NULL DEFAULT 0,
  buyPrice REAL NOT NULL DEFAULT 0,
  notes TEXT,
  sortOrder INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS proposal_payment_terms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  proposalId INTEGER NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  installment INTEGER NOT NULL DEFAULT 1,
  percentage REAL NOT NULL DEFAULT 0,
  description TEXT NOT NULL DEFAULT '',
  dueDescription TEXT,
  sortOrder INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL DEFAULT 1,
  companyName TEXT NOT NULL DEFAULT 'DVI-Systems / ETAF DVI',
  companyAddress TEXT DEFAULT '',
  companyEmail TEXT DEFAULT '',
  companyPhone TEXT DEFAULT '',
  vatId TEXT DEFAULT '',
  bankDetails TEXT DEFAULT '',
  logoUrl TEXT,
  proposalPrefix TEXT NOT NULL DEFAULT 'AG'
);
`);

export const db = drizzle(sqlite, { schema });
export { schema, sqlite };
