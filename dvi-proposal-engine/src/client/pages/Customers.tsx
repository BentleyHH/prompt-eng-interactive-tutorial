import { useState } from "react";
import { Link } from "react-router-dom";
import { trpc } from "../trpc";
import { PageTitle, Modal, Empty } from "../components/ui";

export default function Customers() {
  const [search, setSearch] = useState("");
  const [showNew, setShowNew] = useState(false);
  const utils = trpc.useUtils();
  const { data: customers } = trpc.customers.list.useQuery({ search });
  const create = trpc.customers.create.useMutation({
    onSuccess: () => {
      utils.customers.list.invalidate();
      setShowNew(false);
    },
  });

  const [form, setForm] = useState({ name: "", country: "", city: "" });

  return (
    <div>
      <PageTitle
        actions={
          <button className="btn-primary" onClick={() => setShowNew(true)}>
            + Neuer Kunde
          </button>
        }
      >
        Kunden
      </PageTitle>

      <input
        className="input mb-4 max-w-md"
        placeholder="Suchen (Name, Land, Stadt) …"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {customers && customers.length === 0 ? (
        <Empty>Keine Kunden gefunden.</Empty>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {customers?.map((c) => (
            <Link key={c.id} to={`/customers/${c.id}`} className="card p-5 hover:border-cyan/40 transition-colors">
              <div className="display font-semibold text-white">{c.name}</div>
              <div className="text-sm text-white/50 mt-1">
                {[c.city, c.country].filter(Boolean).join(", ") || "—"}
              </div>
              {c.notes && <div className="text-xs text-white/30 mt-2 line-clamp-2">{c.notes}</div>}
            </Link>
          ))}
        </div>
      )}

      {showNew && (
        <Modal title="Neuer Kunde" onClose={() => setShowNew(false)}>
          <div className="space-y-3">
            <div>
              <label className="label">Organisation *</label>
              <input
                className="input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="z.B. Abu Dhabi Police"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Land</label>
                <input className="input" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
              </div>
              <div>
                <label className="label">Stadt</label>
                <input className="input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              </div>
            </div>
            <button
              className="btn-primary w-full justify-center"
              disabled={!form.name.trim() || create.isPending}
              onClick={() => create.mutate(form)}
            >
              Anlegen
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
