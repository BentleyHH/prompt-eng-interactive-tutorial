import Anthropic from "@anthropic-ai/sdk";
import { db, schema } from "./db.js";
import { eq } from "drizzle-orm";

// invokeLLM-Helper: nutzt die Claude API wenn ANTHROPIC_API_KEY gesetzt ist,
// sonst einen deterministischen, regelbasierten Fallback — die App bleibt
// dadurch auch ohne API-Key voll bedienbar.

const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-opus-4-8";

export const hasLLM = () => Boolean(process.env.ANTHROPIC_API_KEY);

export type SuggestionResult = {
  analysis: { participants: number | null; duration: string; focus: string[]; budget: number | null };
  suggestedItems: { catalogItemId: number; quantity: number; unit: string; reasoning: string }[];
  trainerCount: number;
  timeline: string;
  totalPrice: number;
  budgetFit: string;
  proposalTextDe: string;
  proposalTextEn: string;
  source: "llm" | "fallback";
};

function getCatalogJson() {
  const categories = db.select().from(schema.catalogCategories).all();
  const items = db.select().from(schema.catalogItems).where(eq(schema.catalogItems.isActive, true)).all();
  return items.map((i) => ({
    id: i.id,
    category: categories.find((c) => c.id === i.categoryId)?.name ?? "",
    name: i.name,
    description: i.description,
    unit: i.unit,
    sellPrice: i.sellPrice,
    duration: i.duration,
    trainersRequired: i.trainersRequired,
    maxParticipants: i.maxParticipants,
    location: i.location,
    availableMonths: i.availableMonths || "alle",
    tags: i.tags,
  }));
}

const suggestionSchema = {
  type: "object",
  properties: {
    analysis: {
      type: "object",
      properties: {
        participants: { type: ["integer", "null"] },
        duration: { type: "string" },
        focus: { type: "array", items: { type: "string" } },
        budget: { type: ["number", "null"] },
      },
      required: ["participants", "duration", "focus", "budget"],
      additionalProperties: false,
    },
    suggestedItems: {
      type: "array",
      items: {
        type: "object",
        properties: {
          catalogItemId: { type: "integer" },
          quantity: { type: "number" },
          unit: { type: "string" },
          reasoning: { type: "string" },
        },
        required: ["catalogItemId", "quantity", "unit", "reasoning"],
        additionalProperties: false,
      },
    },
    trainerCount: { type: "integer" },
    timeline: { type: "string" },
    totalPrice: { type: "number" },
    budgetFit: { type: "string" },
    proposalTextDe: { type: "string" },
    proposalTextEn: { type: "string" },
  },
  required: [
    "analysis",
    "suggestedItems",
    "trainerCount",
    "timeline",
    "totalPrice",
    "budgetFit",
    "proposalTextDe",
    "proposalTextEn",
  ],
  additionalProperties: false,
} as const;

async function suggestViaLLM(prompt: string): Promise<SuggestionResult> {
  const client = new Anthropic();
  const catalog = getCatalogJson();

  const system = `Du bist ein Angebots-Konfigurator für ETAF DVI (Disaster Victim Identification Training).

MODULKATALOG:
${JSON.stringify(catalog, null, 1)}

Aufgabe:
1. Analysiere die Anforderung (Teilnehmerzahl, Dauer, Fokusthemen, Budget, Ort)
2. Wähle passende Module aus dem Katalog (nur existierende catalogItemId verwenden)
3. Bestimme Mengen und Dauer pro Modul (Einheit "Tag" → quantity = Anzahl Tage, "Nacht" → Anzahl Nächte)
4. Berechne den Trainer-Bedarf (Summe trainersRequired aller ausgewählten Trainings-Module)
5. Schlage passende Hotels/Locations vor (Kapazität >= Teilnehmerzahl, Verfügbarkeitsmonate beachten)
6. Erstelle einen Zeitplan-Vorschlag
7. Kalkuliere den Gesamtpreis (Summe quantity × sellPrice) und vergleiche mit dem Budget
8. Schreibe professionelle Angebots-Einleitungstexte (proposalTextDe deutsch, proposalTextEn englisch, je 1-2 Absätze)`;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 8000,
    system,
    messages: [{ role: "user", content: `KUNDENANFORDERUNG:\n${prompt}` }],
    output_config: { format: { type: "json_schema", schema: suggestionSchema } },
  });

  if (response.stop_reason === "refusal") {
    throw new Error("Die KI hat die Anfrage abgelehnt. Bitte Anforderung umformulieren.");
  }
  const text = response.content.find((b) => b.type === "text");
  if (!text || text.type !== "text") throw new Error("Keine Antwort von der KI erhalten.");
  const parsed = JSON.parse(text.text) as Omit<SuggestionResult, "source">;
  // Nur existierende Katalog-IDs durchlassen
  const validIds = new Set(catalog.map((c) => c.id));
  parsed.suggestedItems = parsed.suggestedItems.filter((s) => validIds.has(s.catalogItemId));
  return { ...parsed, source: "llm" };
}

// Regelbasierter Fallback: Keyword-Matching gegen Tags + einfache Heuristiken
function suggestViaRules(prompt: string): SuggestionResult {
  const lower = prompt.toLowerCase();
  const catalog = getCatalogJson();

  const participants = (() => {
    const m = lower.match(/(\d+)\s*(teilnehmer|personen|polizisten|officers?|people|pers)/);
    return m ? parseInt(m[1], 10) : null;
  })();
  const weeks = lower.match(/(\d+)\s*(wochen?|weeks?)/);
  const days = lower.match(/(\d+)\s*(tage?n?|days?)/);
  const trainingDays = weeks ? parseInt(weeks[1], 10) * 5 : days ? parseInt(days[1], 10) : 5;
  const budget = (() => {
    const m = lower.replace(/[.,](?=\d{3})/g, "").match(/(\d{4,9})\s*(€|eur|euro)/);
    return m ? parseInt(m[1], 10) : null;
  })();

  const focusMap: Record<string, string[]> = {
    "body recovery": ["body", "recovery"],
    fingerprint: ["fingerprint", "dna"],
    odontology: ["odontology", "dental"],
    csi: ["csi", "tatort", "crime"],
    atlas: ["atlas", "software"],
    command: ["command", "einsatzleitung"],
    "family liaison": ["family", "liaison"],
  };
  const focus = Object.keys(focusMap).filter((k) => focusMap[k].some((kw) => lower.includes(kw)));

  const matches = (item: (typeof catalog)[number], keywords: string[]) => {
    const haystack = `${item.name} ${item.tags ?? ""}`.toLowerCase();
    return keywords.some((kw) => haystack.includes(kw));
  };

  const suggested: SuggestionResult["suggestedItems"] = [];
  const trainingItems = catalog.filter((c) => c.category === "Training Module");
  const focusKeywords = focus.flatMap((f) => focusMap[f]);
  const picked = focusKeywords.length
    ? trainingItems.filter((t) => matches(t, focusKeywords))
    : trainingItems.slice(1, 4); // ohne Pauschal-Programm: ein paar Kernmodule
  const perModuleDays = Math.max(1, Math.floor(trainingDays / Math.max(picked.length, 1)));
  for (const t of picked) {
    suggested.push({
      catalogItemId: t.id,
      quantity: t.unit === "Tag" ? perModuleDays : 1,
      unit: t.unit,
      reasoning: `Passt zum genannten Fokus (${t.name}).`,
    });
  }

  // Prüfung + Theorie ergänzen bei längeren Programmen
  if (trainingDays >= 5) {
    const exam = trainingItems.find((t) => t.tags?.includes("certification"));
    if (exam) suggested.push({ catalogItemId: exam.id, quantity: 1, unit: exam.unit, reasoning: "Abschlussprüfung mit Zertifizierung." });
  }

  // Hotel nach Kapazität
  if (lower.includes("hotel") || lower.includes("unterkunft") || lower.includes("accommodation")) {
    const hotels = catalog
      .filter((c) => c.category === "Hotel & Accommodation" && c.unit === "Nacht")
      .filter((h) => !participants || (h.maxParticipants ?? 0) >= Math.min(participants, 30))
      .sort((a, b) => a.sellPrice - b.sellPrice);
    if (hotels[0]) {
      suggested.push({
        catalogItemId: hotels[0].id,
        quantity: trainingDays + 1,
        unit: "Nacht",
        reasoning: `Kapazität ${hotels[0].maxParticipants} Personen, Nähe ${hotels[0].location}.`,
      });
    }
  }

  // Logistik-Basics bei Trainings vor Ort
  const venue = catalog.find((c) => c.name.startsWith("Training Venue"));
  if (venue) suggested.push({ catalogItemId: venue.id, quantity: trainingDays, unit: venue.unit, reasoning: "Nutzung Trainingsgelände ETAF Weeze." });
  const lunch = catalog.find((c) => c.name.startsWith("Lunch & Coffee"));
  if (lunch) suggested.push({ catalogItemId: lunch.id, quantity: 1, unit: lunch.unit, reasoning: "Verpflegung auf dem Gelände." });

  const byId = new Map(catalog.map((c) => [c.id, c]));
  const totalPrice = suggested.reduce((s, i) => s + (byId.get(i.catalogItemId)?.sellPrice ?? 0) * i.quantity, 0);
  const trainerCount = suggested.reduce((s, i) => {
    const item = byId.get(i.catalogItemId);
    return item?.category === "Training Module" ? s + (item.trainersRequired ?? 0) : s;
  }, 0);

  const budgetFit =
    budget == null
      ? "Kein Budget angegeben."
      : totalPrice <= budget
        ? `Innerhalb des Budgets (${Math.round((totalPrice / budget) * 100)}% von ${budget.toLocaleString("de-DE")} €).`
        : `Über Budget: ${(totalPrice - budget).toLocaleString("de-DE")} € Differenz.`;

  return {
    analysis: { participants, duration: `${trainingDays} Trainingstage`, focus, budget },
    suggestedItems: suggested,
    trainerCount,
    timeline: `${trainingDays} Trainingstage, Module sequenziell; Anreise am Vortag empfohlen.`,
    totalPrice,
    budgetFit,
    proposalTextDe:
      "vielen Dank für Ihr Interesse an einem DVI-Trainingsprogramm der ETAF DVI / DVI-Systems. Auf Basis Ihrer Anforderungen haben wir das nachfolgende Programm zusammengestellt. Alle Module werden von erfahrenen Fachexperten durchgeführt und folgen den Interpol-DVI-Standards.",
    proposalTextEn:
      "thank you for your interest in a DVI training programme by ETAF DVI / DVI-Systems. Based on your requirements we have compiled the following programme. All modules are delivered by experienced subject matter experts and follow Interpol DVI standards.",
    source: "fallback",
  };
}

export async function suggestProposal(prompt: string): Promise<SuggestionResult> {
  if (hasLLM()) {
    try {
      return await suggestViaLLM(prompt);
    } catch (err) {
      console.error("LLM-Vorschlag fehlgeschlagen, Fallback aktiv:", err);
      return suggestViaRules(prompt);
    }
  }
  return suggestViaRules(prompt);
}

export async function generateProposalText(opts: {
  kind: "intro" | "closing";
  language: "de" | "en" | "both";
  customerName: string;
  title: string;
  itemSummary: string;
}): Promise<string> {
  const fallbackDe =
    opts.kind === "intro"
      ? `vielen Dank für Ihr Interesse an unserem Trainingsprogramm „${opts.title}“. Gerne unterbreiten wir Ihnen das folgende Angebot, das individuell auf die Anforderungen von ${opts.customerName} zugeschnitten ist.`
      : `wir freuen uns auf die Zusammenarbeit mit ${opts.customerName} und stehen für Rückfragen jederzeit zur Verfügung. Dieses Angebot ist freibleibend; Termine werden nach Auftragsbestätigung gemeinsam festgelegt.`;
  const fallbackEn =
    opts.kind === "intro"
      ? `thank you for your interest in our training programme "${opts.title}". We are pleased to submit the following proposal, tailored to the requirements of ${opts.customerName}.`
      : `we look forward to working with ${opts.customerName} and remain at your disposal for any questions. This proposal is non-binding; dates will be agreed upon order confirmation.`;

  if (!hasLLM()) {
    if (opts.language === "de") return fallbackDe;
    if (opts.language === "en") return fallbackEn;
    return `${fallbackDe}\n\n---\n\n${fallbackEn}`;
  }

  const client = new Anthropic();
  const langInstruction =
    opts.language === "de"
      ? "auf Deutsch"
      : opts.language === "en"
        ? "in English"
        : "zuerst auf Deutsch, dann (durch '---' getrennt) in English";
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 2000,
    system:
      "Du schreibst professionelle Angebotstexte für ETAF DVI / DVI-Systems (Disaster Victim Identification Trainings für staatliche Behörden). Ton: professionell, präzise, respektvoll. Keine Anrede-Zeile und keine Grußformel — nur den Fließtext (1-2 Absätze).",
    messages: [
      {
        role: "user",
        content: `Schreibe einen ${opts.kind === "intro" ? "Einleitungstext" : "Abschlusstext"} ${langInstruction} für folgendes Angebot:\nKunde: ${opts.customerName}\nTitel: ${opts.title}\nPositionen: ${opts.itemSummary}`,
      },
    ],
  });
  if (response.stop_reason === "refusal") {
    return opts.language === "en" ? fallbackEn : fallbackDe;
  }
  const text = response.content.find((b) => b.type === "text");
  return text && text.type === "text" ? text.text.trim() : fallbackDe;
}
