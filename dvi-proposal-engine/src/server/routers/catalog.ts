import { z } from "zod";
import { eq } from "drizzle-orm";
import { router, publicProcedure } from "../trpc.js";
import { db, schema } from "../db.js";

const itemInput = z.object({
  categoryId: z.number(),
  name: z.string().min(1),
  description: z.string().nullish(),
  descriptionEn: z.string().nullish(),
  unit: z.string().default("pauschal"),
  sellPrice: z.number().default(0),
  buyPrice: z.number().default(0),
  duration: z.string().nullish(),
  trainersRequired: z.number().int().default(0),
  maxParticipants: z.number().int().nullish(),
  location: z.string().nullish(),
  availableMonths: z.string().nullish(),
  imageUrl: z.string().nullish(),
  tags: z.string().nullish(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const catalogRouter = router({
  categories: publicProcedure.query(() =>
    db.select().from(schema.catalogCategories).orderBy(schema.catalogCategories.sortOrder).all(),
  ),

  items: publicProcedure
    .input(z.object({ categoryId: z.number().optional(), includeInactive: z.boolean().optional() }).optional())
    .query(({ input }) => {
      let rows = db
        .select()
        .from(schema.catalogItems)
        .orderBy(schema.catalogItems.categoryId, schema.catalogItems.sortOrder)
        .all();
      if (input?.categoryId) rows = rows.filter((r) => r.categoryId === input.categoryId);
      if (!input?.includeInactive) rows = rows.filter((r) => r.isActive);
      return rows;
    }),

  createCategory: publicProcedure
    .input(z.object({ name: z.string().min(1), sortOrder: z.number().int().default(0) }))
    .mutation(({ input }) => {
      const row = db.insert(schema.catalogCategories).values(input).returning()
        .get();
      return row;
    }),

  updateCategory: publicProcedure
    .input(z.object({ id: z.number(), name: z.string().min(1) }))
    .mutation(({ input }) => {
      const row = db
        .update(schema.catalogCategories)
        .set({ name: input.name })
        .where(eq(schema.catalogCategories.id, input.id))
        .returning()
        .get();
      return row;
    }),

  deleteCategory: publicProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => {
    db.delete(schema.catalogCategories).where(eq(schema.catalogCategories.id, input.id)).run();
    return { ok: true };
  }),

  createItem: publicProcedure.input(itemInput).mutation(({ input }) => {
    const row = db.insert(schema.catalogItems).values(input).returning()
        .get();
    return row;
  }),

  updateItem: publicProcedure
    .input(itemInput.partial().extend({ id: z.number() }))
    .mutation(({ input }) => {
      const { id, ...data } = input;
      const row = db
        .update(schema.catalogItems)
        .set({ ...data, updatedAt: new Date().toISOString() })
        .where(eq(schema.catalogItems.id, id))
        .returning()
        .get();
      return row;
    }),

  deleteItem: publicProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => {
    db.delete(schema.catalogItems).where(eq(schema.catalogItems.id, input.id)).run();
    return { ok: true };
  }),
});
