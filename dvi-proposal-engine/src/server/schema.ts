import { sqliteTable, integer, text, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// Hinweis: Das Spec-Schema ist für MySQL/Drizzle ausgelegt. Diese SQLite-Variante
// behält alle Feldnamen bei, damit ein späterer Wechsel auf MySQL mechanisch ist.

const timestamps = {
  createdAt: text("createdAt").default(sql`(datetime('now'))`).notNull(),
  updatedAt: text("updatedAt").default(sql`(datetime('now'))`).notNull(),
};

export const customers = sqliteTable("customers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull().default(1),
  name: text("name").notNull(),
  country: text("country"),
  city: text("city"),
  address: text("address"),
  website: text("website"),
  notes: text("notes"),
  ...timestamps,
});

export const contacts = sqliteTable("contacts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  customerId: integer("customerId").notNull(),
  firstName: text("firstName").notNull().default(""),
  lastName: text("lastName").notNull().default(""),
  role: text("role"),
  email: text("email"),
  phone: text("phone"),
  mobile: text("mobile"),
  isPrimary: integer("isPrimary", { mode: "boolean" }).notNull().default(false),
  notes: text("notes"),
  ...timestamps,
});

export const catalogCategories = sqliteTable("catalog_categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull().default(1),
  name: text("name").notNull(),
  sortOrder: integer("sortOrder").notNull().default(0),
});

export const catalogItems = sqliteTable("catalog_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull().default(1),
  categoryId: integer("categoryId").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  descriptionEn: text("descriptionEn"),
  unit: text("unit").notNull().default("pauschal"),
  sellPrice: real("sellPrice").notNull().default(0),
  buyPrice: real("buyPrice").notNull().default(0),
  duration: text("duration"),
  trainersRequired: integer("trainersRequired").notNull().default(0),
  maxParticipants: integer("maxParticipants"),
  location: text("location"),
  availableMonths: text("availableMonths"), // komma-separiert, leer = alle
  imageUrl: text("imageUrl"),
  tags: text("tags"),
  isActive: integer("isActive", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sortOrder").notNull().default(0),
  ...timestamps,
});

export const proposals = sqliteTable("proposals", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull().default(1),
  customerId: integer("customerId").notNull(),
  contactId: integer("contactId"),
  proposalNumber: text("proposalNumber").notNull(),
  title: text("title").notNull().default(""),
  status: text("status", {
    enum: ["draft", "sent", "accepted", "rejected", "expired"],
  })
    .notNull()
    .default("draft"),
  date: text("date").notNull(),
  validUntil: text("validUntil"),
  currency: text("currency").notNull().default("EUR"),
  vatRate: real("vatRate").notNull().default(0),
  vatNote: text("vatNote").default("VAT 0% – Reverse Charge (§13b UStG)"),
  introText: text("introText"),
  closingText: text("closingText"),
  totalNet: real("totalNet").notNull().default(0),
  notes: text("notes"),
  ...timestamps,
});

export const proposalItems = sqliteTable("proposal_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  proposalId: integer("proposalId").notNull(),
  catalogItemId: integer("catalogItemId"),
  position: integer("position").notNull().default(1),
  description: text("description").notNull().default(""),
  quantity: real("quantity").notNull().default(1),
  unit: text("unit").notNull().default("pauschal"),
  unitPrice: real("unitPrice").notNull().default(0),
  discount: real("discount").notNull().default(0),
  totalPrice: real("totalPrice").notNull().default(0),
  buyPrice: real("buyPrice").notNull().default(0),
  notes: text("notes"),
  sortOrder: integer("sortOrder").notNull().default(0),
});

export const proposalPaymentTerms = sqliteTable("proposal_payment_terms", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  proposalId: integer("proposalId").notNull(),
  installment: integer("installment").notNull().default(1),
  percentage: real("percentage").notNull().default(0),
  description: text("description").notNull().default(""),
  dueDescription: text("dueDescription"),
  sortOrder: integer("sortOrder").notNull().default(0),
});

export const settings = sqliteTable("settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull().default(1),
  companyName: text("companyName").notNull().default("DVI-Systems / ETAF DVI"),
  companyAddress: text("companyAddress").default(""),
  companyEmail: text("companyEmail").default(""),
  companyPhone: text("companyPhone").default(""),
  vatId: text("vatId").default(""),
  bankDetails: text("bankDetails").default(""),
  logoUrl: text("logoUrl"), // Data-URL (PNG/JPEG) für PDF-Header
  proposalPrefix: text("proposalPrefix").notNull().default("AG"),
});
