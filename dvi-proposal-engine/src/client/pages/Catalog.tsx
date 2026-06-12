import { useState } from "react";
import { trpc } from "../trpc";
import { PageTitle, Modal, Money } from "../components/ui";

const MONTHS = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];

type ItemForm = {
  id?: number;
  categoryId: number;
  name: string;
  description: string;
  descriptionEn: string;
  unit: string;
  sellPrice: number;
  buyPrice: number;
  duration: string;
  trainersRequired: number;
  maxParticipants: number | null;
  location: string;
  availableMonths: string;
  tags: string;
  isActive: boolean;
};

export default function Catalog() {
  const utils = trpc.useUtils();
  const { data: categories } = trpc.catalog.categories.useQuery();
  const { data: items } = trpc.catalog.items.useQuery({ includeInactive: true });

  const invalidate = () => {
    utils.catalog.items.invalidate();
    utils.catalog.categories.invalidate();
  };
  const createItem = trpc.catalog.createItem.useMutation({ onSuccess: invalidate });
  const updateItem = trpc.catalog.updateItem.useMutation({ onSuccess: invalidate });
  const deleteItem = trpc.catalog.deleteItem.useMutation({ onSuccess: invalidate });
  const createCategory = trpc.catalog.createCategory.useMutation({ onSuccess: invalidate });

  const [modal, setModal] = useState<ItemForm | null>(null);
  const [newCat, setNewCat] = useState("");

  const openNew = (categoryId: number) =>
    setModal({
      categoryId,
      name: "",
      description: "",
      descriptionEn: "",
      unit: "Tag",
      sellPrice: 0,
      buyPrice: 0,
      duration: "",
      trainersRequired: 0,
      maxParticipants: null,
      location: "",
      availableMonths: "",
      tags: "",
      isActive: true,
    });

  const margin = (sell: number, buy: number) => (sell > 0 ? (((sell - buy) / sell) * 100).toFixed(0) : "0");

  return (
    <div>
      <PageTitle>Modulkatalog</PageTitle>

      {categories?.map((cat) => {
        const catItems = items?.filter((i) => i.categoryId === cat.id) ?? [];
        return (
          <section key={cat.id} className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="display text-lg font-semibold text-cyan">{cat.name}</h2>
              <button className="btn-ghost text-xs px-2 py-1" onClick={() => openNew(cat.id)}>
                + Modul
              </button>
            </div>
            <div className="card overflow-x-auto">
              <table className="w-full text-sm min-w-[640px]">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-white/30 border-b border-white/10">
                    <th className="p-3">Modul</th>
                    <th className="p-3">Einheit</th>
                    <th className="p-3 text-right">VK</th>
                    <th className="p-3 text-right">EK</th>
                    <th className="p-3 text-right">Marge</th>
                    <th className="p-3 text-center">Trainer</th>
                    <th className="p-3 text-center">Max. TN</th>
                    <th className="p-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {catItems.map((i) => (
                    <tr key={i.id} className={i.isActive ? "" : "opacity-40"}>
                      <td className="p-3">
                        <div className="text-white">{i.name}</div>
                        <div className="text-xs text-white/40 max-w-xs truncate">{i.description}</div>
                      </td>
                      <td className="p-3 text-white/60">{i.unit}</td>
                      <td className="p-3 text-right">
                        <Money value={i.sellPrice} className="text-white" />
                      </td>
                      <td className="p-3 text-right">
                        <Money value={i.buyPrice} className="text-white/50" />
                      </td>
                      <td className="p-3 text-right mono text-success">{margin(i.sellPrice, i.buyPrice)} %</td>
                      <td className="p-3 text-center mono text-white/60">{i.trainersRequired || "—"}</td>
                      <td className="p-3 text-center mono text-white/60">{i.maxParticipants ?? "—"}</td>
                      <td className="p-3 text-right whitespace-nowrap">
                        <button
                          className="btn-ghost text-xs px-2 py-1 mr-1"
                          onClick={() =>
                            setModal({
                              id: i.id,
                              categoryId: i.categoryId,
                              name: i.name,
                              description: i.description ?? "",
                              descriptionEn: i.descriptionEn ?? "",
                              unit: i.unit,
                              sellPrice: i.sellPrice,
                              buyPrice: i.buyPrice,
                              duration: i.duration ?? "",
                              trainersRequired: i.trainersRequired,
                              maxParticipants: i.maxParticipants,
                              location: i.location ?? "",
                              availableMonths: i.availableMonths ?? "",
                              tags: i.tags ?? "",
                              isActive: i.isActive,
                            })
                          }
                        >
                          ✎
                        </button>
                        <button
                          className="btn-danger text-xs px-2 py-1"
                          onClick={() => {
                            if (confirm(`"${i.name}" löschen?`)) deleteItem.mutate({ id: i.id });
                          }}
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}

      <div className="card p-4 flex gap-2 max-w-md">
        <input
          className="input"
          placeholder="Neue Kategorie …"
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
        />
        <button
          className="btn-primary shrink-0"
          disabled={!newCat.trim()}
          onClick={() => {
            createCategory.mutate({ name: newCat.trim(), sortOrder: categories?.length ?? 0 });
            setNewCat("");
          }}
        >
          Anlegen
        </button>
      </div>

      {modal && (
        <Modal title={modal.id ? "Modul bearbeiten" : "Neues Modul"} onClose={() => setModal(null)}>
          <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
            <div>
              <label className="label">Name *</label>
              <input className="input" value={modal.name} onChange={(e) => setModal({ ...modal, name: e.target.value })} />
            </div>
            <div>
              <label className="label">Beschreibung (DE)</label>
              <textarea className="input" rows={2} value={modal.description} onChange={(e) => setModal({ ...modal, description: e.target.value })} />
            </div>
            <div>
              <label className="label">Beschreibung (EN)</label>
              <textarea className="input" rows={2} value={modal.descriptionEn} onChange={(e) => setModal({ ...modal, descriptionEn: e.target.value })} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="label">Einheit</label>
                <select className="input" value={modal.unit} onChange={(e) => setModal({ ...modal, unit: e.target.value })}>
                  {["Tag", "Woche", "Stück", "pauschal", "Nacht", "Person/Nacht"].map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">VK-Preis €</label>
                <input type="number" className="input" value={modal.sellPrice} onChange={(e) => setModal({ ...modal, sellPrice: Number(e.target.value) })} />
              </div>
              <div>
                <label className="label">EK-Preis €</label>
                <input type="number" className="input" value={modal.buyPrice} onChange={(e) => setModal({ ...modal, buyPrice: Number(e.target.value) })} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="label">Trainer</label>
                <input type="number" className="input" value={modal.trainersRequired} onChange={(e) => setModal({ ...modal, trainersRequired: Number(e.target.value) })} />
              </div>
              <div>
                <label className="label">Max. TN</label>
                <input
                  type="number"
                  className="input"
                  value={modal.maxParticipants ?? ""}
                  onChange={(e) => setModal({ ...modal, maxParticipants: e.target.value ? Number(e.target.value) : null })}
                />
              </div>
              <div>
                <label className="label">Ort</label>
                <input className="input" value={modal.location} onChange={(e) => setModal({ ...modal, location: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="label">Verfügbare Monate (leer = alle)</label>
              <div className="flex flex-wrap gap-1">
                {MONTHS.map((m, idx) => {
                  const monthNum = String(idx + 1);
                  const list = modal.availableMonths ? modal.availableMonths.split(",").filter(Boolean) : [];
                  const active = list.includes(monthNum);
                  return (
                    <button
                      key={m}
                      type="button"
                      className={`rounded px-2 py-1 text-xs mono border ${
                        active ? "border-cyan/60 text-cyan bg-cyan/10" : "border-white/10 text-white/40"
                      }`}
                      onClick={() => {
                        const next = active ? list.filter((x) => x !== monthNum) : [...list, monthNum];
                        setModal({ ...modal, availableMonths: next.sort((a, b) => Number(a) - Number(b)).join(",") });
                      }}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="label">Tags (KI-Suche, komma-separiert)</label>
              <input className="input" value={modal.tags} onChange={(e) => setModal({ ...modal, tags: e.target.value })} placeholder="fingerprint,forensic,pm" />
            </div>
            <label className="flex items-center gap-2 text-sm text-white/70">
              <input type="checkbox" checked={modal.isActive} onChange={(e) => setModal({ ...modal, isActive: e.target.checked })} />
              Aktiv
            </label>
            <button
              className="btn-primary w-full justify-center"
              disabled={!modal.name.trim()}
              onClick={() => {
                const { id: itemId, ...data } = modal;
                if (itemId) updateItem.mutate({ id: itemId, ...data });
                else createItem.mutate(data);
                setModal(null);
              }}
            >
              Speichern
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
