import { initTRPC } from "@trpc/server";

// Single-User-Modus: Auth (Manus OAuth im Original-Spec) steht in dieser
// Umgebung nicht zur Verfügung; alle Daten gehören userId 1.
const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;
