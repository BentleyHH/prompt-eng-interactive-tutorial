import { z } from "zod";
import { desc, eq, like, or } from "drizzle-orm";
import { router, publicProcedure } from "../trpc.js";
import { db, schema } from "../db.js";

const customerInput = z.object({
  name: z.string().min(1),
  country: z.string().nullish(),
  city: z.string().nullish(),
  address: z.string().nullish(),
  website: z.string().nullish(),
  notes: z.string().nullish(),
});

const contactInput = z.object({
  customerId: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.string().nullish(),
  email: z.string().nullish(),
  phone: z.string().nullish(),
  mobile: z.string().nullish(),
  isPrimary: z.boolean().default(false),
  notes: z.string().nullish(),
});

export const customersRouter = router({
  list: publicProcedure
    .input(z.object({ search: z.string().optional() }).optional())
    .query(({ input }) => {
      const search = input?.search?.trim();
      if (search) {
        const pattern = `%${search}%`;
        return db
          .select()
          .from(schema.customers)
          .where(
            or(
              like(schema.customers.name, pattern),
              like(schema.customers.country, pattern),
              like(schema.customers.city, pattern),
            ),
          )
          .orderBy(schema.customers.name)
          .all();
      }
      return db.select().from(schema.customers).orderBy(schema.customers.name).all();
    }),

  get: publicProcedure.input(z.object({ id: z.number() })).query(({ input }) => {
    const customer = db
      .select()
      .from(schema.customers)
      .where(eq(schema.customers.id, input.id))
      .get();
    if (!customer) return null;
    const contacts = db
      .select()
      .from(schema.contacts)
      .where(eq(schema.contacts.customerId, input.id))
      .orderBy(desc(schema.contacts.isPrimary), schema.contacts.lastName)
      .all();
    const proposals = db
      .select()
      .from(schema.proposals)
      .where(eq(schema.proposals.customerId, input.id))
      .orderBy(desc(schema.proposals.date))
      .all();
    return { ...customer, contacts, proposals };
  }),

  create: publicProcedure.input(customerInput).mutation(({ input }) => {
    const row = db.insert(schema.customers).values(input).returning()
        .get();
    return row;
  }),

  update: publicProcedure
    .input(customerInput.partial().extend({ id: z.number() }))
    .mutation(({ input }) => {
      const { id, ...data } = input;
      const row = db
        .update(schema.customers)
        .set({ ...data, updatedAt: new Date().toISOString() })
        .where(eq(schema.customers.id, id))
        .returning()
        .get();
      return row;
    }),

  delete: publicProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => {
    db.delete(schema.customers).where(eq(schema.customers.id, input.id)).run();
    return { ok: true };
  }),

  createContact: publicProcedure.input(contactInput).mutation(({ input }) => {
    const row = db.insert(schema.contacts).values(input).returning()
        .get();
    return row;
  }),

  updateContact: publicProcedure
    .input(contactInput.partial().extend({ id: z.number() }))
    .mutation(({ input }) => {
      const { id, ...data } = input;
      const row = db
        .update(schema.contacts)
        .set({ ...data, updatedAt: new Date().toISOString() })
        .where(eq(schema.contacts.id, id))
        .returning()
        .get();
      return row;
    }),

  deleteContact: publicProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => {
    db.delete(schema.contacts).where(eq(schema.contacts.id, input.id)).run();
    return { ok: true };
  }),
});
