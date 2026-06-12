import { Link } from "react-router-dom";
import { trpc } from "../trpc";
import { PageTitle, Money, StatusBadge } from "../components/ui";

function Stat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="card p-5">
      <div className="text-xs uppercase tracking-wider text-white/40">{label}</div>
      <div className={`mono text-2xl mt-2 ${accent ?? "text-white"}`}>{value}</div>
    </div>
  );
}

export default function Dashboard() {
  const { data, isLoading } = trpc.proposals.dashboard.useQuery();

  return (
    <div>
      <PageTitle
        actions={
          <>
            <Link to="/proposals/new" className="btn-primary">
              + Neues Angebot
            </Link>
            <Link to="/customers" className="btn-ghost">
              + Neuer Kunde
            </Link>
          </>
        }
      >
        Dashboard
      </PageTitle>

      {isLoading || !data ? (
        <div className="text-white/40">Lade …</div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Stat label="Offene Angebote" value={String(data.openCount)} accent="text-cyan" />
            <Stat
              label="Offener Angebotswert"
              value={data.openValue.toLocaleString("de-DE") + " €"}
              accent="text-cyan"
            />
            <Stat
              label="Conversion Rate"
              value={data.conversionRate == null ? "—" : data.conversionRate.toFixed(0) + " %"}
              accent="text-success"
            />
            <Stat label="Kunden" value={String(data.customerCount)} />
          </div>

          <h2 className="display text-lg font-semibold text-white mb-3">Letzte Aktivitäten</h2>
          <div className="card divide-y divide-white/5">
            {data.recent.length === 0 && (
              <div className="p-6 text-white/40 text-sm">Noch keine Angebote. Lege das erste an!</div>
            )}
            {data.recent.map((p) => (
              <Link
                key={p.id}
                to={`/proposals/${p.id}`}
                className="flex items-center justify-between gap-3 p-4 hover:bg-white/5 transition-colors"
              >
                <div className="min-w-0">
                  <div className="mono text-xs text-cyan">{p.proposalNumber}</div>
                  <div className="text-sm text-white truncate">{p.title || "Ohne Titel"}</div>
                  <div className="text-xs text-white/40">{p.customerName}</div>
                </div>
                <div className="text-right shrink-0">
                  <Money value={p.totalNet} currency={p.currency} className="text-sm text-white" />
                  <div className="mt-1">
                    <StatusBadge status={p.status} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
