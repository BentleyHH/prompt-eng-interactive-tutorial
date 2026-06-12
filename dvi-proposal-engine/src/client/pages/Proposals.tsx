import { useState } from "react";
import { Link } from "react-router-dom";
import { trpc } from "../trpc";
import { PageTitle, Money, StatusBadge, statusMeta, Empty } from "../components/ui";

export default function Proposals() {
  const [status, setStatus] = useState<string>("");
  const { data: proposals } = trpc.proposals.list.useQuery(status ? { status } : undefined);

  return (
    <div>
      <PageTitle
        actions={
          <Link to="/proposals/new" className="btn-primary">
            + Neues Angebot
          </Link>
        }
      >
        Angebote
      </PageTitle>

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          className={`btn text-xs border ${status === "" ? "border-cyan/60 text-cyan" : "border-white/10 text-white/50"}`}
          onClick={() => setStatus("")}
        >
          Alle
        </button>
        {Object.entries(statusMeta).map(([key, meta]) => (
          <button
            key={key}
            className={`btn text-xs border ${status === key ? "border-cyan/60 text-cyan" : "border-white/10 text-white/50"}`}
            onClick={() => setStatus(key)}
          >
            {meta.label}
          </button>
        ))}
      </div>

      {proposals && proposals.length === 0 ? (
        <Empty>Keine Angebote mit diesem Status.</Empty>
      ) : (
        <div className="card divide-y divide-white/5">
          {proposals?.map((p) => (
            <Link key={p.id} to={`/proposals/${p.id}`} className="flex items-center justify-between gap-3 p-4 hover:bg-white/5">
              <div className="min-w-0">
                <div className="mono text-xs text-cyan">{p.proposalNumber}</div>
                <div className="text-sm text-white truncate">{p.title || "Ohne Titel"}</div>
                <div className="text-xs text-white/40">
                  {p.customerName} · {p.date}
                </div>
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
      )}
    </div>
  );
}
