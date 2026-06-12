import type { ReactNode } from "react";

export function PageTitle({ children, actions }: { children: ReactNode; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <h1 className="display text-2xl font-bold text-white">{children}</h1>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}

export function Money({ value, currency = "EUR", className = "" }: { value: number; currency?: string; className?: string }) {
  return (
    <span className={`mono ${className}`}>
      {value.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{" "}
      {currency === "EUR" ? "€" : currency}
    </span>
  );
}

export const statusMeta: Record<string, { label: string; cls: string }> = {
  draft: { label: "Entwurf", cls: "text-white/60 border-white/20" },
  sent: { label: "Versendet", cls: "text-cyan border-cyan/40" },
  accepted: { label: "Angenommen", cls: "text-success border-success/40" },
  rejected: { label: "Abgelehnt", cls: "text-danger border-danger/40" },
  expired: { label: "Abgelaufen", cls: "text-warning border-warning/40" },
};

export function StatusBadge({ status }: { status: string }) {
  const meta = statusMeta[status] ?? statusMeta.draft;
  return (
    <span className={`inline-block rounded-full border px-2 py-0.5 text-[11px] mono ${meta.cls}`}>
      {meta.label}
    </span>
  );
}

export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center bg-black/70 p-4 overflow-y-auto" onClick={onClose}>
      <div className="card w-full max-w-lg p-6 my-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="display text-lg font-semibold text-white">{title}</h2>
          <button className="text-white/40 hover:text-white text-xl leading-none cursor-pointer" onClick={onClose}>
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="card p-10 text-center text-white/40 text-sm">{children}</div>;
}
