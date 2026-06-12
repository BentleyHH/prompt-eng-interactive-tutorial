import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { trpc } from "../trpc";
import { PageTitle, Money } from "../components/ui";

export default function ProposalNew() {
  const navigate = useNavigate();
  const { data: customers } = trpc.customers.list.useQuery({});
  const { data: aiStatus } = trpc.ai.status.useQuery();
  const [customerId, setCustomerId] = useState<number | "">("");
  const { data: customer } = trpc.customers.get.useQuery(
    { id: Number(customerId) },
    { enabled: customerId !== "" },
  );
  const [contactId, setContactId] = useState<number | "">("");
  const [title, setTitle] = useState("");
  const [mode, setMode] = useState<"ai" | "manual">("ai");
  const [prompt, setPrompt] = useState("");

  const suggest = trpc.ai.suggest.useMutation();
  const createProposal = trpc.proposals.create.useMutation();
  const applySuggestion = trpc.ai.applySuggestion.useMutation();
  const { data: catalogItems } = trpc.catalog.items.useQuery({});

  const suggestion = suggest.data;
  const itemName = (id: number) => catalogItems?.find((c) => c.id === id)?.name ?? `#${id}`;

  const [busy, setBusy] = useState(false);

  const createAndGo = async (applyAi: boolean) => {
    if (customerId === "") return;
    setBusy(true);
    try {
      const proposal = await createProposal.mutateAsync({
        customerId: Number(customerId),
        contactId: contactId === "" ? null : Number(contactId),
        title: title || (applyAi ? "DVI Training Programme" : ""),
      });
      if (applyAi && suggestion) {
        await applySuggestion.mutateAsync({
          proposalId: proposal.id,
          items: suggestion.suggestedItems.map((s) => ({
            catalogItemId: s.catalogItemId,
            quantity: s.quantity,
            unit: s.unit,
          })),
          introTextDe: suggestion.proposalTextDe,
        });
      }
      navigate(`/proposals/${proposal.id}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <PageTitle>Neues Angebot</PageTitle>

      <div className="card p-5 max-w-2xl space-y-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="label">Kunde *</label>
            <select
              className="input"
              value={customerId}
              onChange={(e) => {
                setCustomerId(e.target.value ? Number(e.target.value) : "");
                setContactId("");
              }}
            >
              <option value="">— wählen —</option>
              {customers?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Ansprechpartner</label>
            <select
              className="input"
              value={contactId}
              onChange={(e) => setContactId(e.target.value ? Number(e.target.value) : "")}
              disabled={!customer || customer.contacts.length === 0}
            >
              <option value="">— optional —</option>
              {customer?.contacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.firstName} {c.lastName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="label">Titel</label>
          <input
            className="input"
            placeholder='z.B. "Course Programme: Forensic Identification of Military Personnel"'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <button
            className={`btn text-sm border flex-1 justify-center ${mode === "ai" ? "border-cyan/60 text-cyan bg-cyan/10" : "border-white/10 text-white/50"}`}
            onClick={() => setMode("ai")}
          >
            ✦ KI-Modus
          </button>
          <button
            className={`btn text-sm border flex-1 justify-center ${mode === "manual" ? "border-cyan/60 text-cyan bg-cyan/10" : "border-white/10 text-white/50"}`}
            onClick={() => setMode("manual")}
          >
            ▤ Manuell
          </button>
        </div>

        {mode === "ai" && (
          <>
            {!aiStatus?.llmAvailable && (
              <div className="text-xs text-warning border border-warning/30 rounded-md p-2">
                Kein ANTHROPIC_API_KEY gesetzt — der Vorschlag nutzt den regelbasierten Fallback statt der KI.
              </div>
            )}
            <div>
              <label className="label">Bedarf beschreiben</label>
              <textarea
                className="input"
                rows={4}
                placeholder='z.B. "30 Polizisten aus Saudi-Arabien, 2 Wochen intensiv, Fokus auf Body Recovery und Fingerprint. Hotel für 25 Personen in Weeze-Nähe. Budget ca. 200.000 €."'
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
            <button
              className="btn-primary w-full justify-center"
              disabled={prompt.trim().length < 5 || suggest.isPending}
              onClick={() => suggest.mutate({ prompt })}
            >
              {suggest.isPending ? "Analysiere …" : "✦ Vorschlag generieren"}
            </button>
            {suggest.error && <div className="text-sm text-danger">{suggest.error.message}</div>}

            {suggestion && (
              <div className="border border-cyan/20 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="display font-semibold text-cyan">KI-Vorschlag</h3>
                  <span className="mono text-[10px] text-white/30 uppercase">
                    Quelle: {suggestion.source === "llm" ? "Claude" : "Regelwerk"}
                  </span>
                </div>
                <div className="text-xs text-white/60 grid grid-cols-2 gap-2">
                  <div>Teilnehmer: <span className="mono text-white">{suggestion.analysis.participants ?? "—"}</span></div>
                  <div>Dauer: <span className="mono text-white">{suggestion.analysis.duration}</span></div>
                  <div>Trainer-Bedarf: <span className="mono text-white">{suggestion.trainerCount}</span></div>
                  <div>
                    Budget:{" "}
                    <span className="mono text-white">
                      {suggestion.analysis.budget ? suggestion.analysis.budget.toLocaleString("de-DE") + " €" : "—"}
                    </span>
                  </div>
                </div>
                <ul className="text-sm space-y-1">
                  {suggestion.suggestedItems.map((s, i) => (
                    <li key={i} className="flex justify-between gap-2">
                      <span className="text-white/80">
                        {s.quantity}× {itemName(s.catalogItemId)}{" "}
                        <span className="text-white/30 text-xs">({s.unit})</span>
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between border-t border-white/10 pt-2 text-sm">
                  <span className="text-white/60">Kalkulierter Gesamtpreis</span>
                  <Money value={suggestion.totalPrice} className="text-cyan font-semibold" />
                </div>
                <div className="text-xs text-white/50">{suggestion.budgetFit}</div>
                <div className="text-xs text-white/50">{suggestion.timeline}</div>
                <button
                  className="btn-primary w-full justify-center"
                  disabled={customerId === "" || busy}
                  onClick={() => createAndGo(true)}
                >
                  {customerId === "" ? "Erst Kunde wählen" : "Angebot mit diesen Positionen anlegen →"}
                </button>
              </div>
            )}
          </>
        )}

        {mode === "manual" && (
          <button
            className="btn-primary w-full justify-center"
            disabled={customerId === "" || busy}
            onClick={() => createAndGo(false)}
          >
            {customerId === "" ? "Erst Kunde wählen" : "Leeres Angebot anlegen →"}
          </button>
        )}
      </div>
    </div>
  );
}
