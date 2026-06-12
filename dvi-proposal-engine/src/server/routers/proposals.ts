import { z } from "zod";
import { desc, eq } from "drizzle-orm";
import { router, publicProcedure } from "../trpc.js";
import { db, schema, sqlite } from "../db.js";

export function nextProposalNumber(date = new Date()): string {
  const prefixRow = db.select().from(schema.settings).get();
  const prefix = prefixRow?.proposalPrefix ?? "AG";
  const yymmdd = date.toISOString().slice(2, 10).replace(/-/g, "");
  const base = `${prefix}${yymmdd}`;
  const row = sqlite
    .prepare("SELECT COUNT(*) AS c FROM proposals WHERE proposalNumber LIKE ?")
    .get(`${base}-%`) as { c: number };
  return `${base}-${row.c + 1}`;
}

export function recomputeTotals(proposalId: number) {
  const items = db
    .select()
    .from(schema.proposalItems)
    .where(eq(schema.proposalItems.proposalId, proposalId))
    .all();
  const totalNet = items.reduce((sum, i) => sum + i.totalPrice, 0);
  db.update(schema.proposals)
    .set({ totalNet, updatedAt: new Date().toISOString() })
    .where(eq(schema.proposals.id, proposalId))
    .run();
  return totalNet;
}

const lineTotal = (quantity: number, unitPrice: number, discount: number) =>
  Math.round(quantity * unitPrice * (1 - discount / 100) * 100) / 100;

const itemInput = z.object({
  proposalId: z.number(),
  catalogItemId: z.number().nullish(),
  description: z.string().default(""),
  quantity: z.number().default(1),
  unit: z.string().default("pauschal"),
  unitPrice: z.number().default(0),
  discount: z.number().default(0),
  buyPrice: z.number().default(0),
  notes: z.string().nullish(),
});

const PAYMENT_TEMPLATES: Record<string, number[]> = {
  "50/35/15": [50, 35, 15],
  "50/50": [50, 50],
  "30/30/30/10": [30, 30, 30, 10],
};

export const proposalsRouter = router({
  list: publicProcedure
    .input(z.object({ status: z.string().optional() }).optional())
    .query(({ input }) => {
      let rows = db
        .select({
          proposal: schema.proposals,
          customerName: schema.customers.name,
        })
        .from(schema.proposals)
        .leftJoin(schema.customers, eq(schema.proposals.customerId, schema.customers.id))
        .orderBy(desc(schema.proposals.createdAt))
        .all();
      if (input?.status) rows = rows.filter((r) => r.proposal.status === input.status);
      return rows.map((r) => ({ ...r.proposal, customerName: r.customerName ?? "—" }));
    }),

  get: publicProcedure.input(z.object({ id: z.number() })).query(({ input }) => {
    const proposal = db.select().from(schema.proposals).where(eq(schema.proposals.id, input.id)).get();
    if (!proposal) return null;
    const items = db
      .select()
      .from(schema.proposalItems)
      .where(eq(schema.proposalItems.proposalId, input.id))
      .orderBy(schema.proposalItems.sortOrder)
      .all();
    const paymentTerms = db
      .select()
      .from(schema.proposalPaymentTerms)
      .where(eq(schema.proposalPaymentTerms.proposalId, input.id))
      .orderBy(schema.proposalPaymentTerms.sortOrder)
      .all();
    const customer = db
      .select()
      .from(schema.customers)
      .where(eq(schema.customers.id, proposal.customerId))
      .get();
    const contact = proposal.contactId
      ? db.select().from(schema.contacts).where(eq(schema.contacts.id, proposal.contactId)).get()
      : null;
    return { ...proposal, items, paymentTerms, customer, contact };
  }),

  create: publicProcedure
    .input(
      z.object({
        customerId: z.number(),
        contactId: z.number().nullish(),
        title: z.string().default(""),
        currency: z.string().default("EUR"),
        vatRate: z.number().default(0),
      }),
    )
    .mutation(({ input }) => {
      const now = new Date();
      const validUntil = new Date(now.getTime() + 30 * 24 * 3600 * 1000);
      const row = db
        .insert(schema.proposals)
        .values({
          ...input,
          proposalNumber: nextProposalNumber(now),
          date: now.toISOString().slice(0, 10),
          validUntil: validUntil.toISOString().slice(0, 10),
          vatNote:
            input.vatRate === 0 ? "VAT 0% – Reverse Charge (§13b UStG)" : `MwSt. ${input.vatRate}%`,
        })
        .returning()
        .get();
      return row;
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        customerId: z.number().optional(),
        contactId: z.number().nullish().optional(),
        title: z.string().optional(),
        status: z.enum(["draft", "sent", "accepted", "rejected", "expired"]).optional(),
        date: z.string().optional(),
        validUntil: z.string().nullish().optional(),
        currency: z.string().optional(),
        vatRate: z.number().optional(),
        vatNote: z.string().nullish().optional(),
        introText: z.string().nullish().optional(),
        closingText: z.string().nullish().optional(),
        notes: z.string().nullish().optional(),
      }),
    )
    .mutation(({ input }) => {
      const { id, ...data } = input;
      const row = db
        .update(schema.proposals)
        .set({ ...data, updatedAt: new Date().toISOString() })
        .where(eq(schema.proposals.id, id))
        .returning()
        .get();
      return row;
    }),

  delete: publicProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => {
    db.delete(schema.proposals).where(eq(schema.proposals.id, input.id)).run();
    return { ok: true };
  }),

  addItem: publicProcedure.input(itemInput).mutation(({ input }) => {
    const existing = db
      .select()
      .from(schema.proposalItems)
      .where(eq(schema.proposalItems.proposalId, input.proposalId))
      .all();
    const sortOrder = existing.length;
    const row = db
      .insert(schema.proposalItems)
      .values({
        ...input,
        position: sortOrder + 1,
        sortOrder,
        totalPrice: lineTotal(input.quantity, input.unitPrice, input.discount),
      })
      .returning()
        .get();
    recomputeTotals(input.proposalId);
    return row;
  }),

  updateItem: publicProcedure
    .input(itemInput.partial().extend({ id: z.number() }))
    .mutation(({ input }) => {
      const { id, ...data } = input;
      const current = db.select().from(schema.proposalItems).where(eq(schema.proposalItems.id, id)).get();
      if (!current) throw new Error("Position nicht gefunden");
      const merged = { ...current, ...data };
      const row = db
        .update(schema.proposalItems)
        .set({ ...data, totalPrice: lineTotal(merged.quantity, merged.unitPrice, merged.discount) })
        .where(eq(schema.proposalItems.id, id))
        .returning()
        .get();
      recomputeTotals(current.proposalId);
      return row;
    }),

  deleteItem: publicProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => {
    const current = db
      .select()
      .from(schema.proposalItems)
      .where(eq(schema.proposalItems.id, input.id))
      .get();
    db.delete(schema.proposalItems).where(eq(schema.proposalItems.id, input.id)).run();
    if (current) {
      // Positionen neu durchnummerieren
      const rest = db
        .select()
        .from(schema.proposalItems)
        .where(eq(schema.proposalItems.proposalId, current.proposalId))
        .orderBy(schema.proposalItems.sortOrder)
        .all();
      rest.forEach((r, i) => {
        db.update(schema.proposalItems)
          .set({ sortOrder: i, position: i + 1 })
          .where(eq(schema.proposalItems.id, r.id))
          .run();
      });
      recomputeTotals(current.proposalId);
    }
    return { ok: true };
  }),

  moveItem: publicProcedure
    .input(z.object({ id: z.number(), direction: z.enum(["up", "down"]) }))
    .mutation(({ input }) => {
      const current = db
        .select()
        .from(schema.proposalItems)
        .where(eq(schema.proposalItems.id, input.id))
        .get();
      if (!current) return { ok: false };
      const all = db
        .select()
        .from(schema.proposalItems)
        .where(eq(schema.proposalItems.proposalId, current.proposalId))
        .orderBy(schema.proposalItems.sortOrder)
        .all();
      const idx = all.findIndex((i) => i.id === input.id);
      const swapWith = input.direction === "up" ? idx - 1 : idx + 1;
      if (swapWith < 0 || swapWith >= all.length) return { ok: false };
      [all[idx], all[swapWith]] = [all[swapWith], all[idx]];
      all.forEach((r, i) => {
        db.update(schema.proposalItems)
          .set({ sortOrder: i, position: i + 1 })
          .where(eq(schema.proposalItems.id, r.id))
          .run();
      });
      return { ok: true };
    }),

  setPaymentTerms: publicProcedure
    .input(
      z.object({
        proposalId: z.number(),
        terms: z.array(
          z.object({
            installment: z.number().int(),
            percentage: z.number(),
            description: z.string(),
            dueDescription: z.string().nullish(),
          }),
        ),
      }),
    )
    .mutation(({ input }) => {
      db.delete(schema.proposalPaymentTerms)
        .where(eq(schema.proposalPaymentTerms.proposalId, input.proposalId))
        .run();
      input.terms.forEach((t, i) => {
        db.insert(schema.proposalPaymentTerms)
          .values({ ...t, proposalId: input.proposalId, sortOrder: i })
          .run();
      });
      return { ok: true };
    }),

  applyPaymentTemplate: publicProcedure
    .input(z.object({ proposalId: z.number(), template: z.enum(["50/35/15", "50/50", "30/30/30/10"]) }))
    .mutation(({ input }) => {
      const percentages = PAYMENT_TEMPLATES[input.template];
      db.delete(schema.proposalPaymentTerms)
        .where(eq(schema.proposalPaymentTerms.proposalId, input.proposalId))
        .run();
      percentages.forEach((p, i) => {
        const description =
          i === 0
            ? "Down Payment – due immediately upon signing"
            : i === percentages.length - 1
              ? "Final Payment – due upon completion"
              : `Installment ${i + 1}`;
        db.insert(schema.proposalPaymentTerms)
          .values({ proposalId: input.proposalId, installment: i + 1, percentage: p, description, sortOrder: i })
          .run();
      });
      return { ok: true };
    }),

  dashboard: publicProcedure.query(() => {
    const all = db.select().from(schema.proposals).all();
    const open = all.filter((p) => p.status === "draft" || p.status === "sent");
    const accepted = all.filter((p) => p.status === "accepted");
    const decided = all.filter((p) => ["accepted", "rejected", "expired"].includes(p.status));
    const recent = db
      .select({ proposal: schema.proposals, customerName: schema.customers.name })
      .from(schema.proposals)
      .leftJoin(schema.customers, eq(schema.proposals.customerId, schema.customers.id))
      .orderBy(desc(schema.proposals.updatedAt))
      .limit(8)
      .all()
      .map((r) => ({ ...r.proposal, customerName: r.customerName ?? "—" }));
    return {
      openCount: open.length,
      openValue: open.reduce((s, p) => s + p.totalNet, 0),
      totalValue: all.reduce((s, p) => s + p.totalNet, 0),
      acceptedValue: accepted.reduce((s, p) => s + p.totalNet, 0),
      conversionRate: decided.length > 0 ? (accepted.length / decided.length) * 100 : null,
      customerCount: db.select().from(schema.customers).all().length,
      recent,
    };
  }),
});
