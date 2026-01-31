import React from "react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "../../auth/AuthContext";

export const TopNavbar: React.FC = () => {
  const { user } = useAuth();

  // Determine where logo should link to
  const logoLink = user ? "/dashboard" : "/";

  return (
    <header className="sticky top-0 z-20 border-b border-legal-border bg-legal-surfaceElevated/90 px-4 py-3 backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <Link
          to={logoLink}
          className="transition-colors hover:text-legal-accent"
        >
          <p className="text-xs uppercase tracking-widest text-slate-400">
            Inmobiliaria digital
          </p>
          <p className="text-sm font-semibold text-slate-50">
            Panel jurídico
          </p>
        </Link>
      </div>
    </header>
  );
};
