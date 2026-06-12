import express from "express";
import cors from "cors";
import path from "node:path";
import fs from "node:fs";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./routers/index.js";
import { seedIfEmpty } from "./seed.js";
import { generateProposalPdf } from "./pdf.js";

seedIfEmpty();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.use("/trpc", createExpressMiddleware({ router: appRouter }));

// PDF-Export (Download / Inline-Vorschau)
app.get("/api/proposals/:id/pdf", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).send("Ungültige ID");
  try {
    const pdf = await generateProposalPdf(id);
    if (!pdf) return res.status(404).send("Angebot nicht gefunden");
    res.setHeader("Content-Type", "application/pdf");
    const disposition = req.query.download === "1" ? "attachment" : "inline";
    res.setHeader("Content-Disposition", `${disposition}; filename="Angebot-${id}.pdf"`);
    res.send(pdf);
  } catch (err) {
    console.error("PDF-Fehler:", err);
    res.status(500).send("PDF-Generierung fehlgeschlagen");
  }
});

app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Produktiv: gebauten Client ausliefern
const clientDir = path.join(process.cwd(), "dist", "client");
if (fs.existsSync(clientDir)) {
  app.use(express.static(clientDir));
  app.get("*", (_req, res) => res.sendFile(path.join(clientDir, "index.html")));
}

const port = Number(process.env.PORT ?? 3001);
app.listen(port, () => {
  console.log(`DVI Proposal Engine Server läuft auf http://localhost:${port}`);
});

export type { AppRouter } from "./routers/index.js";
