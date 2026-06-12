import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { trpc } from "../trpc";
import { PageTitle, Modal, Money, StatusBadge } from "../components/ui";

type ContactForm = {
  id?: number;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  phone: string;
  mobile: string;
  isPrimary: boolean;
};

const emptyContact: ContactForm = {
  firstName: "",
  lastName: "",
  role: "",
  email: "",
  phone: "",
  mobile: "",
  isPrimary: false,
};

export default function CustomerDetail() {
  const { id } = useParams();
  const customerId = Number(id);
  const navigate = useNavigate();
  const utils = trpc.useUtils();
  const { data: customer } = trpc.customers.get.useQuery({ id: customerId });

  const invalidate = () => utils.customers.get.invalidate({ id: customerId });
  const update = trpc.customers.update.useMutation({ onSuccess: invalidate });
  const remove = trpc.customers.delete.useMutation({ onSuccess: () => navigate("/customers") });
  const createContact = trpc.customers.createContact.useMutation({ onSuccess: invalidate });
  const updateContact = trpc.customers.updateContact.useMutation({ onSuccess: invalidate });
  const deleteContact = trpc.customers.deleteContact.useMutation({ onSuccess: invalidate });

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", country: "", city: "", address: "", website: "", notes: "" });
  const [contactModal, setContactModal] = useState<ContactForm | null>(null);

  if (!customer) return <div className="text-white/40">Lade …</div>;

  const startEdit = () => {
    setForm({
      name: customer.name,
      country: customer.country ?? "",
      city: customer.city ?? "",
      address: customer.address ?? "",
      website: customer.website ?? "",
      notes: customer.notes ?? "",
    });
    setEditing(true);
  };

  return (
    <div>
      <PageTitle
        actions={
          <>
            <button className="btn-ghost" onClick={startEdit}>
              Bearbeiten
            </button>
            <button
              className="btn-danger"
              onClick={() => {
                if (confirm(`Kunde "${customer.name}" wirklich löschen?`)) remove.mutate({ id: customerId });
              }}
            >
              Löschen
            </button>
          </>
        }
      >
        {customer.name}
      </PageTitle>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="display font-semibold text-white mb-3">Stammdaten</h2>
          <dl className="text-sm space-y-2">
            {(
              [
                ["Land", customer.country],
                ["Stadt", customer.city],
                ["Adresse", customer.address],
                ["Website", customer.website],
                ["Notizen", customer.notes],
              ] as const
            ).map(([k, v]) => (
              <div key={k} className="flex gap-3">
                <dt className="w-20 text-white/40 shrink-0">{k}</dt>
                <dd className="text-white/80 whitespace-pre-wrap">{v || "—"}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="display font-semibold text-white">Ansprechpartner</h2>
            <button className="btn-ghost text-xs px-2 py-1" onClick={() => setContactModal(emptyContact)}>
              + Hinzufügen
            </button>
          </div>
          <div className="space-y-2">
            {customer.contacts.length === 0 && <div className="text-sm text-white/40">Noch keine Ansprechpartner.</div>}
            {customer.contacts.map((c) => (
              <div key={c.id} className="flex items-start justify-between gap-2 rounded-lg border border-white/5 p-3">
                <div className="text-sm">
                  <div className="text-white">
                    {c.firstName} {c.lastName}{" "}
                    {c.isPrimary && <span className="text-[10px] mono text-cyan border border-cyan/30 rounded px-1">PRIMÄR</span>}
                  </div>
                  <div className="text-white/50">{c.role || "—"}</div>
                  <div className="text-white/40 text-xs mt-1">
                    {[c.email, c.phone, c.mobile].filter(Boolean).join(" · ") || "—"}
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    className="btn-ghost text-xs px-2 py-1"
                    onClick={() =>
                      setContactModal({
                        id: c.id,
                        firstName: c.firstName,
                        lastName: c.lastName,
                        role: c.role ?? "",
                        email: c.email ?? "",
                        phone: c.phone ?? "",
                        mobile: c.mobile ?? "",
                        isPrimary: c.isPrimary,
                      })
                    }
                  >
                    ✎
                  </button>
                  <button
                    className="btn-danger text-xs px-2 py-1"
                    onClick={() => {
                      if (confirm("Ansprechpartner löschen?")) deleteContact.mutate({ id: c.id });
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <h2 className="display font-semibold text-white mt-8 mb-3">Angebots-Historie</h2>
      <div className="card divide-y divide-white/5">
        {customer.proposals.length === 0 && <div className="p-5 text-sm text-white/40">Noch keine Angebote.</div>}
        {customer.proposals.map((p) => (
          <Link key={p.id} to={`/proposals/${p.id}`} className="flex items-center justify-between p-4 hover:bg-white/5">
            <div>
              <span className="mono text-xs text-cyan mr-3">{p.proposalNumber}</span>
              <span className="text-sm text-white">{p.title || "Ohne Titel"}</span>
            </div>
            <div className="flex items-center gap-3">
              <Money value={p.totalNet} currency={p.currency} className="text-sm" />
              <StatusBadge status={p.status} />
            </div>
          </Link>
        ))}
      </div>

      {editing && (
        <Modal title="Kunde bearbeiten" onClose={() => setEditing(false)}>
          <div className="space-y-3">
            {(
              [
                ["name", "Organisation"],
                ["country", "Land"],
                ["city", "Stadt"],
                ["website", "Website"],
              ] as const
            ).map(([key, label]) => (
              <div key={key}>
                <label className="label">{label}</label>
                <input className="input" value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
              </div>
            ))}
            <div>
              <label className="label">Adresse</label>
              <textarea className="input" rows={2} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
            <div>
              <label className="label">Notizen</label>
              <textarea className="input" rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
            <button
              className="btn-primary w-full justify-center"
              onClick={() => {
                update.mutate({ id: customerId, ...form });
                setEditing(false);
              }}
            >
              Speichern
            </button>
          </div>
        </Modal>
      )}

      {contactModal && (
        <Modal title={contactModal.id ? "Ansprechpartner bearbeiten" : "Neuer Ansprechpartner"} onClose={() => setContactModal(null)}>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Vorname</label>
                <input className="input" value={contactModal.firstName} onChange={(e) => setContactModal({ ...contactModal, firstName: e.target.value })} />
              </div>
              <div>
                <label className="label">Nachname</label>
                <input className="input" value={contactModal.lastName} onChange={(e) => setContactModal({ ...contactModal, lastName: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="label">Rolle</label>
              <input className="input" placeholder="z.B. Head of DVI Unit" value={contactModal.role} onChange={(e) => setContactModal({ ...contactModal, role: e.target.value })} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="label">E-Mail</label>
                <input className="input" value={contactModal.email} onChange={(e) => setContactModal({ ...contactModal, email: e.target.value })} />
              </div>
              <div>
                <label className="label">Telefon</label>
                <input className="input" value={contactModal.phone} onChange={(e) => setContactModal({ ...contactModal, phone: e.target.value })} />
              </div>
              <div>
                <label className="label">Mobil</label>
                <input className="input" value={contactModal.mobile} onChange={(e) => setContactModal({ ...contactModal, mobile: e.target.value })} />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-white/70">
              <input
                type="checkbox"
                checked={contactModal.isPrimary}
                onChange={(e) => setContactModal({ ...contactModal, isPrimary: e.target.checked })}
              />
              Haupt-Ansprechpartner
            </label>
            <button
              className="btn-primary w-full justify-center"
              onClick={() => {
                const { id: cid, ...data } = contactModal;
                if (cid) updateContact.mutate({ id: cid, ...data });
                else createContact.mutate({ customerId, ...data });
                setContactModal(null);
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
