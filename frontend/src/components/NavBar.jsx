import { NavLink } from "react-router-dom";
import { useState } from "react";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/select", label: "Material Selection" },
  { to: "/materials", label: "Materials" },
  { to: "/compare", label: "Compare" },
  { to: "/cost", label: "Cost Estimator" },
  { to: "/what-if", label: "What-If" },
  { to: "/about", label: "About" },
];

export default function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur border-b border-line">
      <div className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2 font-display font-semibold text-lg">
          <span className="w-7 h-7 rounded-sm2 bg-teal text-white grid place-items-center font-mono text-xs">PS</span>
          PolySelect
        </NavLink>

        <nav className="hidden lg:flex items-center gap-1">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `px-3 py-2 rounded-sm2 text-sm font-medium transition-colors ${
                  isActive ? "bg-teal text-white" : "text-inkfaint hover:text-ink hover:bg-white"
                }`
              }
              end={l.to === "/"}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <button
          className="lg:hidden p-2 border border-line rounded-sm2"
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="font-mono text-xs">{open ? "CLOSE" : "MENU"}</span>
        </button>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-line bg-paper px-5 py-3 flex flex-col gap-1">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `px-3 py-2.5 rounded-sm2 text-sm font-medium ${
                  isActive ? "bg-teal text-white" : "text-inkfaint hover:bg-white"
                }`
              }
              end={l.to === "/"}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
