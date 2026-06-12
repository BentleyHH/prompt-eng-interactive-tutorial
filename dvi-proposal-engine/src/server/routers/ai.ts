import { z } from "zod";
import { eq } from "drizzle-orm";
import { router, publicProcedure } from "../trpc.js";
import { db, schema } from "../db.js";
import { suggestProposal, generateProposalText, hasLLM } from "../ai.js";
import { recomputeTotals } from "./proposals.js";

export const aiRouter = router({
  status: publicProcedure.query(() => ({ llmAvailable: hasLLM() })),

  suggest: publicProcedure
    .input(z.object({ prompt: z.string().min(5) }))
    .mutation(async ({ input }) => suggestProposal(input.prompt)),

  // Übernimmt einen KI-Vorschlag als Positionen in ein bestehendes Angebot
  applySuggestion: publicProcedure
    .input(
      z.object({
        proposalId: z.number(),
        items: z.array(
          z.object({ catalogItemId: z.number(), quantity: z.number(), unit: z.string() }),
        ),
        introTextDe: z.string().optional(),
      }),
    )
    .mutation(({ input }) => {
      const existing = db
        .select()
        .from(schema.proposalItems)
        .where(eq(schema.proposalItems.proposalId, input.proposalId))
        .all();
      let sortOrder = existing.length;
      for (const s of input.items) {
        const item = db
          .select()
          .from(schema.catalogItems)
          .where(eq(schema.catalogItems.id, s.catalogItemId))
          .get();
        if (!item) continue;
        const totalPrice = Math.round(s.quantity * item.sellPrice * 100) / 100;
        db.insert(schema.proposalItems)
          .values({
            proposalId: input.proposalId,
            catalogItemId: item.id,
            description: item.name + (item.description ? ` – ${item.description}` : ""),
            quantity: s.quantity,
            unit: s.unit || item.unit,
            unitPrice: item.sellPrice,
            buyPrice: item.buyPrice,
            discount: 0,
            totalPrice,
            position: sortOrder + 1,
            sortOrder,
          })
          .run();
        sortOrder++;
      }
      if (input.introTextDe) {
        db.update(schema.proposals)
          .set({ introText: input.introTextDe })
          .where(eq(schema.proposals.id, input.proposalId))
          .run();
      }
      recomputeTotals(input.proposalId);
      return { ok: true };
    }),

  generateText: publicProcedure
    .input(
      z.object({
        proposalId: z.number(),
        kind: z.enum(["intro", "closing"]),
        language: z.enum(["de", "en", "both"]).default("de"),
      }),
    )
    .mutation(async ({ input }) => {
      const proposal = db
        .select()
        .from(schema.proposals)
        .where(eq(schema.proposals.id, input.proposalId))
        .get();
      if (!proposal) throw new Error("Angebot nicht gefunden");
      const customer = db
        .select()
        .from(schema.customers)
        .where(eq(schema.customers.id, proposal.customerId))
        .get();
      const items = db
        .select()
        .from(schema.proposalItems)
        .where(eq(schema.proposalItems.proposalId, input.proposalId))
        .all();
      const text = await generateProposalText({
        kind: input.kind,
        language: input.language,
        customerName: customer?.name ?? "den Kunden",
        title: proposal.title || "DVI Training Programme",
        itemSummary: items.map((i) => `${i.quantity}× ${i.description.split("–")[0].trim()}`).join(", ") || "—",
      });
      return { text };
    }),
});
