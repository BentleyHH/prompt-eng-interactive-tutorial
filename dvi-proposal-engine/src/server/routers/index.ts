import { router } from "../trpc.js";
import { customersRouter } from "./customers.js";
import { catalogRouter } from "./catalog.js";
import { proposalsRouter } from "./proposals.js";
import { settingsRouter } from "./settings.js";
import { aiRouter } from "./ai.js";

export const appRouter = router({
  customers: customersRouter,
  catalog: catalogRouter,
  proposals: proposalsRouter,
  settings: settingsRouter,
  ai: aiRouter,
});

export type AppRouter = typeof appRouter;
