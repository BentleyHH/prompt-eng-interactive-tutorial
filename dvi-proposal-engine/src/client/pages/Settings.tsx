import { useEffect, useState } from "react";
import { trpc } from "../trpc";
import { PageTitle } from "../components/ui";

export default function Settings() {
  const utils = trpc.useUtils();
  const { data: settings } = trpc.settings.get.useQuery();
  const update = trpc.settings.update.useMutation({
    onSuccess: () => utils.settings.get.invalidate(),
  });

  const [form, setForm] = useState({
    companyName: "",
    companyAddress: "",
    companyEmail: "",
    companyPhone: "",
    vatId: "",
    bankDetails: "",
    proposalPrefix: "AG",
    logoUrl: "" as string | null,
  });

  useEffect(() => {
    if (settings) {
      setForm({
        companyName: settings.companyName,
        companyAddress: settings.companyAddress ?? "",
        companyEmail: settings.companyEmail ?? "",
        companyPhone: settings.companyPhone ?? "",
        vatId: settings.vatId ?? "",
        bankDetails: settings.bankDetails ?? "",
        proposalPrefix: settings.proposalPrefix,
        logoUrl: settings.logoUrl,
      });
    }
  }, [settings?.id]);

  const onLogoUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, logoUrl: reader.result as string }));
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <PageTitle>Einstellungen</PageTitle>
      <div className="card p-5 max-w-2xl space-y-4">
        <div>
          <label className="label">Firmenname</label>
          <input className="input" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
        </div>
        <div>
          <label className="label">Adresse</label>
          <textarea className="input" rows={3} value={form.companyAddress} onChange={(e) => setForm({ ...form, companyAddress: e.target.value })} />
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="label">E-Mail</label>
            <input className="input" value={form.companyEmail} onChange={(e) => setForm({ ...form, companyEmail: e.target.value })} />
          </div>
          <div>
            <label className="label">Telefon</label>
            <input className="input" value={form.companyPhone} onChange={(e) => setForm({ ...form, companyPhone: e.target.value })} />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="label">USt-ID</label>
            <input className="input" value={form.vatId} onChange={(e) => setForm({ ...form, vatId: e.target.value })} />
          </div>
          <div>
            <label className="label">Angebots-Präfix (Nummernkreis)</label>
            <input className="input mono" maxLength={8} value={form.proposalPrefix} onChange={(e) => setForm({ ...form, proposalPrefix: e.target.value })} />
            <div className="text-[11px] text-white/30 mt-1 mono">Format: {form.proposalPrefix || "AG"}JJMMTT-N</div>
          </div>
        </div>
        <div>
          <label className="label">Bankverbindung (Fußzeile PDF)</label>
          <textarea className="input" rows={2} value={form.bankDetails} onChange={(e) => setForm({ ...form, bankDetails: e.target.value })} />
        </div>
        <div>
          <label className="label">Logo (PNG/JPEG, erscheint im PDF oben rechts)</label>
          {form.logoUrl && (
            <div className="mb-2 flex items-center gap-3">
              <img src={form.logoUrl} alt="Logo" className="h-12 rounded bg-white/90 p-1" />
              <button className="btn-danger text-xs px-2 py-1" onClick={() => setForm({ ...form, logoUrl: null })}>
                Entfernen
              </button>
            </div>
          )}
          <input
            type="file"
            accept="image/png,image/jpeg"
            className="text-sm text-white/60"
            onChange={(e) => e.target.files?.[0] && onLogoUpload(e.target.files[0])}
          />
        </div>
        <button className="btn-primary w-full justify-center" disabled={update.isPending} onClick={() => update.mutate(form)}>
          {update.isPending ? "Speichere …" : "Speichern"}
        </button>
        {update.isSuccess && <div className="text-xs text-success text-center">Gespeichert ✓</div>}
      </div>
    </div>
  );
}
