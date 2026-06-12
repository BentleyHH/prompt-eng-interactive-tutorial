import { z } from "zod";
import { eq } from "drizzle-orm";
import { router, publicProcedure } from "../trpc.js";
import { db, schema } from "../db.js";

export const settingsRouter = router({
  get: publicProcedure.query(() => db.select().from(schema.settings).get() ?? null),

  update: publicProcedure
    .input(
      z.object({
        companyName: z.string().optional(),
        companyAddress: z.string().nullish().optional(),
        companyEmail: z.string().nullish().optional(),
        companyPhone: z.string().nullish().optional(),
        vatId: z.string().nullish().optional(),
        bankDetails: z.string().nullish().optional(),
        logoUrl: z.string().nullish().optional(),
        proposalPrefix: z.string().min(1).max(8).optional(),
      }),
    )
    .mutation(({ input }) => {
      const existing = db.select().from(schema.settings).get();
      if (!existing) {
        const row = db.insert(schema.settings).values(input).returning()
        .get();
        return row;
      }
      const row = db
        .update(schema.settings)
        .set(input)
        .where(eq(schema.settings.id, existing.id))
        .returning()
        .get();
      return row;
    }),
});
