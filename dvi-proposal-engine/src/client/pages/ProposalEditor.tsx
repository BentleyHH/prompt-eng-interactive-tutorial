import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { trpc } from "../trpc";
import { PageTitle, Money, StatusBadge, Modal } from "../components/ui";

export default function ProposalEditor() {
  const { id } = useParams();
  const proposalId = Number(id);
  const navigate = useNavigate();
  const utils = trpc.useUtils();
  const { data: p } = trpc.proposals.get.useQuery({ id: proposalId });
  const { data: catalogItems } = trpc.catalog.items.useQuery({});
  const { data: categories } = trpc.catalog.categories.useQuery();

  const invalidate = () => utils.proposals.get.invalidate({ id: proposalId });
  const update = trpc.proposals.update.useMutation({ onSuccess: invalidate });
  const remove = trpc.proposals.delete.useMutation({ onSuccess: () => navigate("/proposals") });
  const addItem = trpc.proposals.addItem.useMutation({ onSuccess: invalidate });
  const updateItem = trpc.proposals.updateItem.useMutation({ onSuccess: invalidate });
  const deleteItem = trpc.proposals.deleteItem.useMutation({ onSuccess: invalidate });
  const moveItem = trpc.proposals.moveItem.useMutation({ onSuccess: invalidate });
  const applyTemplate = trpc.proposals.applyPaymentTemplate.useMutation({ onSuccess: invalidate });
  const setTerms = trpc.proposals.setPaymentTerms.useMutation({ onSuccess: invalidate });
  const generateText = trpc.ai.generateText.useMutation();

  const [showPicker, setShowPicker] = useState(false);
  const [pickerCat, setPickerCat] = useState<number | "">("");
  const [intro, setIntro] = useState("");
  const [closing, setClosing] = useState("");
  const [title, setTitle] = useState("");
  const [textLang, setTextLang] = useState<"de" | "en" | "both">("de");

  useEffect(() => {
    if (p) {
      setIntro(p.introText ?? "");
      setClosing(p.closingText ?? "");
      setTitle(p.title);
    }
  }, [p?.id, p?.updatedAt]);

  if (!p) return <div className="text-white/40">Lade …</div>;

  const totalBuy = p.items.reduce((s, i) => s + i.buyPrice * i.quantity, 0);
  const profit = p.totalNet - totalBuy;
  const marginPct = p.totalNet > 0 ? (profit / p.totalNet) * 100 : 0;
  const vatAmount = p.totalNet * (p.vatRate / 100);

  const saveTexts = () =>
    update.mutate({ id: proposalId, title, introText: intro, closingText: closing });

  const genText = async (kind: "intro" | "closing") => {
    const res = await generateText.mutateAsync({ proposalId, kind, language: textLang });
    if (kind === "intro") setIntro(res.text);
    else setClosing(res.text);
  };

  return (
    <div>
      <PageTitle
        actions={
          <>
            <a className="btn-ghost" href={`/api/proposals/${proposalId}/pdf`} target="_blank" rel="noreferrer">
              PDF-Vorschau
            </a>
            <a className="btn-primary" href={`/api/proposals/${proposalId}/pdf?download=1`}>
              PDF ↓
            </a>
            <button
              className="btn-danger"
              onClick={() => {
                if (confirm("Angebot wirklich löschen?")) remove.mutate({ id: proposalId });
              }}
            >
              Löschen
            </button>
          </>
        }
      >
        <span className="mono text-cyan text-xl mr-3">{p.proposalNumber}</span>
      </PageTitle>

      {/* Kopf */}
      <div className="card p-5 mb-6 grid gap-4 md:grid-cols-4">
        <div className="md:col-span-2">
          <label className="label">Titel</label>
          <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} onBlur={saveTexts} />
          <div className="text-xs text-white/40 mt-2">
            Kunde: <span className="text-white/70">{p.customer?.name}</span>
            {p.contact && (
              <>
                {" "}· Ansprechpartner: <span className="text-white/70">{p.contact.firstName} {p.contact.lastName}</span>
              </>
            )}
          </div>
        </div>
        <div>
          <label className="label">Status</label>
          <select
            className="input"
            value={p.status}
            onChange={(e) => update.mutate({ id: proposalId, status: e.target.value as never })}
          >
            <option value="draft">Entwurf</option>
            <option value="sent">Versendet</option>
            <option value="accepted">Angenommen</option>
            <option value="rejected">Abgelehnt</option>
            <option value="expired">Abgelaufen</option>
          </select>
          <div className="mt-2">
            <StatusBadge status={p.status} />
          </div>
        </div>
        <div>
          <label className="label">MwSt. %</label>
          <select
            className="input"
            value={p.vatRate}
            onChange={(e) => {
              const vatRate = Number(e.target.value);
              update.mutate({
                id: proposalId,
                vatRate,
                vatNote: vatRate === 0 ? "VAT 0% – Reverse Charge (§13b UStG)" : `MwSt. ${vatRate}%`,
              });
            }}
          >
            <option value={0}>0 % (Reverse Charge)</option>
            <option value={19}>19 % (Deutschland)</option>
          </select>
          <label className="label mt-3">Gültig bis</label>
          <input
            type="date"
            className="input"
            value={p.validUntil ?? ""}
            onChange={(e) => update.mutate({ id: proposalId, validUntil: e.target.value })}
          />
        </div>
      </div>

      {/* Positionen */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="display text-lg font-semibold text-white">Positionen</h2>
        <div className="flex gap-2">
          <button className="btn-primary text-xs" onClick={() => setShowPicker(true)}>
            + Aus Katalog
          </button>
          <button
            className="btn-ghost text-xs"
            onClick={() =>
              addItem.mutate({ proposalId, description: "Freitext-Position", quantity: 1, unit: "pauschal", unitPrice: 0, discount: 0, buyPrice: 0 })
            }
          >
            + Freitext
          </button>
        </div>
      </div>

      <div className="card overflow-x-auto mb-2">
        <table className="w-full text-sm min-w-[760px]">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-white/30 border-b border-white/10">
              <th className="p-2 w-8">Pos</th>
              <th className="p-2">Beschreibung</th>
              <th className="p-2 w-20 text-right">Menge</th>
              <th className="p-2 w-24">Einheit</th>
              <th className="p-2 w-28 text-right">Einzelpreis</th>
              <th className="p-2 w-20 text-right">Rabatt %</th>
              <th className="p-2 w-28 text-right">Gesamt</th>
              <th className="p-2 w-24"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {p.items.length === 0 && (
              <tr>
                <td colSpan={8} className="p-6 text-center text-white/40">
                  Noch keine Positionen — füge Module aus dem Katalog hinzu.
                </td>
              </tr>
            )}
            {p.items.map((item, idx) => (
              <tr key={item.id}>
                <td className="p-2 mono text-white/40">{item.position}</td>
                <td className="p-2">
                  <textarea
                    className="input text-xs"
                    rows={2}
                    defaultValue={item.description}
                    onBlur={(e) => {
                      if (e.target.value !== item.description)
                        updateItem.mutate({ id: item.id, description: e.target.value });
                    }}
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    className="input text-right mono"
                    defaultValue={item.quantity}
                    onBlur={(e) => {
                      const v = Number(e.target.value);
                      if (v !== item.quantity) updateItem.mutate({ id: item.id, quantity: v });
                    }}
                  />
                </td>
                <td className="p-2">
                  <input
                    className="input text-xs"
                    defaultValue={item.unit}
                    onBlur={(e) => {
                      if (e.target.value !== item.unit) updateItem.mutate({ id: item.id, unit: e.target.value });
                    }}
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    className="input text-right mono"
                    defaultValue={item.unitPrice}
                    onBlur={(e) => {
                      const v = Number(e.target.value);
                      if (v !== item.unitPrice) updateItem.mutate({ id: item.id, unitPrice: v });
                    }}
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    className="input text-right mono"
                    defaultValue={item.discount}
                    onBlur={(e) => {
                      const v = Number(e.target.value);
                      if (v !== item.discount) updateItem.mutate({ id: item.id, discount: v });
                    }}
                  />
                </td>
                <td className="p-2 text-right">
                  <Money value={item.totalPrice} currency={p.currency} className="text-white" />
                </td>
                <td className="p-2 whitespace-nowrap text-right">
                  <button className="btn-ghost text-xs px-1.5 py-1" disabled={idx === 0} onClick={() => moveItem.mutate({ id: item.id, direction: "up" })}>
                    ↑
                  </button>
                  <button
                    className="btn-ghost text-xs px-1.5 py-1"
                    disabled={idx === p.items.length - 1}
                    onClick={() => moveItem.mutate({ id: item.id, direction: "down" })}
                  >
                    ↓
                  </button>
                  <button className="btn-danger text-xs px-1.5 py-1" onClick={() => deleteItem.mutate({ id: item.id })}>
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summen + Kalkulation */}
      <div className="grid gap-4 md:grid-cols-2 mb-8">
        <div className="card p-4 text-sm space-y-1">
          <div className="text-xs uppercase tracking-wider text-white/40 mb-2">Interne Kalkulation</div>
          <div className="flex justify-between">
            <span className="text-white/50">Einkauf (EK)</span>
            <Money value={totalBuy} currency={p.currency} className="text-white/70" />
          </div>
          <div className="flex justify-between">
            <span className="text-white/50">Gewinn</span>
            <Money value={profit} currency={p.currency} className={profit >= 0 ? "text-success" : "text-danger"} />
          </div>
          <div className="flex justify-between">
            <span className="text-white/50">Marge</span>
            <span className={`mono ${marginPct >= 0 ? "text-success" : "text-danger"}`}>{marginPct.toFixed(1)} %</span>
          </div>
        </div>
        <div className="card p-4 text-sm space-y-1">
          <div className="flex justify-between">
            <span className="text-white/50">Zwischensumme (netto)</span>
            <Money value={p.totalNet} currency={p.currency} className="text-white" />
          </div>
          <div className="flex justify-between">
            <span className="text-white/50">MwSt. {p.vatRate} %</span>
            <Money value={vatAmount} currency={p.currency} className="text-white/70" />
          </div>
          <div className="flex justify-between border-t border-white/10 pt-2 mt-2">
            <span className="text-white font-semibold">Gesamtsumme</span>
            <Money value={p.totalNet + vatAmount} currency={p.currency} className="text-cyan text-base font-semibold" />
          </div>
          <div className="text-[11px] text-white/30">{p.vatNote}</div>
        </div>
      </div>

      {/* Texte */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="display text-lg font-semibold text-white">Angebotstexte</h2>
        <select className="input w-auto text-xs" value={textLang} onChange={(e) => setTextLang(e.target.value as never)}>
          <option value="de">Deutsch</option>
          <option value="en">English</option>
          <option value="both">Beides</option>
        </select>
      </div>
      <div className="grid gap-4 md:grid-cols-2 mb-8">
        {(
          [
            ["intro", "Einleitungstext", intro, setIntro],
            ["closing", "Abschlusstext", closing, setClosing],
          ] as const
        ).map(([kind, label, value, setter]) => (
          <div key={kind} className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="label mb-0">{label}</label>
              <button
                className="btn-ghost text-xs px-2 py-1"
                disabled={generateText.isPending}
                onClick={() => genText(kind)}
              >
                {generateText.isPending ? "…" : "✦ KI-Text"}
              </button>
            </div>
            <textarea className="input" rows={6} value={value} onChange={(e) => setter(e.target.value)} onBlur={saveTexts} />
          </div>
        ))}
      </div>

      {/* Zahlungsbedingungen */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="display text-lg font-semibold text-white">Zahlungsbedingungen</h2>
        <div className="flex gap-2">
          {(["50/35/15", "50/50", "30/30/30/10"] as const).map((t) => (
            <button key={t} className="btn-ghost text-xs mono" onClick={() => applyTemplate.mutate({ proposalId, template: t })}>
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="card p-4 mb-8">
        {p.paymentTerms.length === 0 && (
          <div className="text-sm text-white/40">Keine Raten definiert — Template wählen oder Rate hinzufügen.</div>
        )}
        <div className="space-y-2">
          {p.paymentTerms.map((t, i) => (
            <div key={t.id} className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-1 mono text-white/40 text-sm">{t.installment}.</div>
              <input
                type="number"
                className="input col-span-2 text-right mono"
                defaultValue={t.percentage}
                onBlur={(e) => {
                  const terms = p.paymentTerms.map((x, j) =>
                    j === i ? { ...x, percentage: Number(e.target.value) } : x,
                  );
                  setTerms.mutate({ proposalId, terms });
                }}
              />
              <input
                className="input col-span-4 text-xs"
                defaultValue={t.description}
                onBlur={(e) => {
                  const terms = p.paymentTerms.map((x, j) => (j === i ? { ...x, description: e.target.value } : x));
                  setTerms.mutate({ proposalId, terms });
                }}
              />
              <input
                className="input col-span-4 text-xs"
                placeholder="Fälligkeit, z.B. 'Must be credited by June 15, 2026'"
                defaultValue={t.dueDescription ?? ""}
                onBlur={(e) => {
                  const terms = p.paymentTerms.map((x, j) => (j === i ? { ...x, dueDescription: e.target.value } : x));
                  setTerms.mutate({ proposalId, terms });
                }}
              />
              <button
                className="btn-danger text-xs px-2 py-1 col-span-1"
                onClick={() => {
                  const terms = p.paymentTerms
                    .filter((_, j) => j !== i)
                    .map((x, j) => ({ ...x, installment: j + 1 }));
                  setTerms.mutate({ proposalId, terms });
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button
          className="btn-ghost text-xs mt-3"
          onClick={() => {
            const terms = [
              ...p.paymentTerms,
              { installment: p.paymentTerms.length + 1, percentage: 0, description: `Installment ${p.paymentTerms.length + 1}`, dueDescription: "" },
            ];
            setTerms.mutate({ proposalId, terms });
          }}
        >
          + Rate hinzufügen
        </button>
        {p.paymentTerms.length > 0 && (
          <div className="text-xs mono mt-2 text-white/40">
            Summe: {p.paymentTerms.reduce((s, t) => s + t.percentage, 0)} %{" "}
            {p.paymentTerms.reduce((s, t) => s + t.percentage, 0) !== 100 && (
              <span className="text-warning">≠ 100 %</span>
            )}
          </div>
        )}
      </div>

      {/* Interne Notizen */}
      <div className="card p-4 mb-8">
        <label className="label">Interne Notizen (nicht im PDF)</label>
        <textarea
          className="input"
          rows={3}
          defaultValue={p.notes ?? ""}
          onBlur={(e) => update.mutate({ id: proposalId, notes: e.target.value })}
        />
      </div>

      {/* Katalog-Picker */}
      {showPicker && (
        <Modal title="Modul aus Katalog hinzufügen" onClose={() => setShowPicker(false)}>
          <select className="input mb-3" value={pickerCat} onChange={(e) => setPickerCat(e.target.value ? Number(e.target.value) : "")}>
            <option value="">Alle Kategorien</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-1">
            {catalogItems
              ?.filter((i) => pickerCat === "" || i.categoryId === pickerCat)
              .map((i) => (
                <button
                  key={i.id}
                  className="w-full text-left rounded-lg border border-white/10 p-3 hover:border-cyan/40 cursor-pointer"
                  onClick={() => {
                    addItem.mutate({
                      proposalId,
                      catalogItemId: i.id,
                      description: i.name + (i.description ? ` – ${i.description}` : ""),
                      quantity: 1,
                      unit: i.unit,
                      unitPrice: i.sellPrice,
                      buyPrice: i.buyPrice,
                      discount: 0,
                    });
                    setShowPicker(false);
                  }}
                >
                  <div className="flex justify-between gap-2">
                    <span className="text-sm text-white">{i.name}</span>
                    <Money value={i.sellPrice} className="text-cyan text-sm shrink-0" />
                  </div>
                  <div className="text-xs text-white/40">
                    {i.unit}
                    {i.trainersRequired ? ` · ${i.trainersRequired} Trainer` : ""}
                    {i.location ? ` · ${i.location}` : ""}
                  </div>
                </button>
              ))}
          </div>
        </Modal>
      )}
    </div>
  );
}
