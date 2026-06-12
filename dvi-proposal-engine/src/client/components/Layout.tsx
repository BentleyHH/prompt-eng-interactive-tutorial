import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

const nav = [
  { to: "/", label: "Dashboard", icon: "◧" },
  { to: "/customers", label: "Kunden", icon: "◈" },
  { to: "/catalog", label: "Katalog", icon: "▤" },
  { to: "/proposals", label: "Angebote", icon: "✦" },
  { to: "/settings", label: "Einstellungen", icon: "⚙" },
];

export default function Layout() {
  const [open, setOpen] = useState(false);

  const links = (
    <nav className="flex flex-col gap-1 px-3">
      {nav.map((n) => (
        <NavLink
          key={n.to}
          to={n.to}
          end={n.to === "/"}
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
              isActive
                ? "bg-cyan/10 text-cyan border border-cyan/30"
                : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"
            }`
          }
        >
          <span className="text-base">{n.icon}</span>
          {n.label}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen flex">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-60 flex-col border-r border-white/5 bg-panel/50 py-6 shrink-0 sticky top-0 h-screen">
        <div className="px-6 mb-8">
          <div className="display text-lg font-bold text-white tracking-tight">
            DVI <span className="text-cyan">Proposal</span> Engine
          </div>
          <div className="mono text-[10px] text-white/30 mt-1">ETAF DVI · TACTICAL OPS</div>
        </div>
        {links}
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 inset-x-0 z-40 flex items-center justify-between bg-panel/90 backdrop-blur border-b border-white/10 px-4 py-3">
        <div className="display font-bold text-white">
          DVI <span className="text-cyan">PE</span>
        </div>
        <button className="btn-ghost px-2 py-1" onClick={() => setOpen(!open)} aria-label="Menü">
          ☰
        </button>
      </div>
      {open && (
        <div className="md:hidden fixed inset-0 z-30 bg-navy/95 pt-16" onClick={() => setOpen(false)}>
          {links}
        </div>
      )}

      <main className="flex-1 px-4 md:px-8 py-6 pt-16 md:pt-6 max-w-6xl w-full mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
