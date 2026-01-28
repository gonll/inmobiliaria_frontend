import React from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useAuth } from "../../auth/AuthContext";

const NAV_ITEMS = [
  { to: "/", label: "Resumen", icon: "🏠" },
  { to: "/contracts", label: "Contratos", icon: "📄" },
  { to: "/payments", label: "Pagos", icon: "💶" },
  { to: "/notices", label: "Avisos", icon: "⚖️" },
  { to: "/settings", label: "Perfil", icon: "👤" },
];

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, logout } = useAuth();
  const routerState = useRouterState();

  const activePath = routerState.location.pathname;

  return (
    <div className="app-shell">
      <header className="sticky top-0 z-20 border-b border-legal-border bg-legal-surfaceElevated/90 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <Link
            to="/"
            className="transition-colors hover:text-legal-accent"
          >
            <p className="text-xs uppercase tracking-widest text-slate-400">
              Inmobiliaria digital
            </p>
            <p className="text-sm font-semibold text-slate-50">
              Panel jurídico
            </p>
          </Link>
          {user && (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-medium text-slate-100 line-clamp-1">
                  {user.fullName}
                </p>
                <p className="text-[10px] uppercase tracking-wide text-slate-400">
                  {user.defaultRole}
                </p>
              </div>
              <button
                type="button"
                onClick={logout}
                className="rounded-full border border-slate-600 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-slate-200 hover:border-slate-400"
              >
                Cerrar
              </button>
            </div>
          )}
        </div>
      </header>
      <main className="app-content px-4 py-4">{children}</main>
      {user && (
        <nav className="bottom-nav">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.to === "/"
                ? activePath === "/"
                : activePath.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center justify-center gap-0.5 ${
                  isActive ? "text-brand-300" : "text-slate-400"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-[10px] font-medium uppercase tracking-wide">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
};
