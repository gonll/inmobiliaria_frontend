import React from "react";
import { useAuth } from "../../auth/AuthContext";

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  // Mock data for demonstration
  const properties = [
    {
      id: "1",
      name: "Apartamento Centro",
      address: "Calle Principal 123",
      city: "Madrid",
      zipCode: "28001",
      type: "apartment" as const,
      bedrooms: 2,
      bathrooms: 1,
      createdAt: new Date().toISOString(),
    },
  ];

  const overdueDue = 2;
  const activeContracts = 5;
  const pendingNotices = 3;

  return (
    <div className="max-w-4xl space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-50">
          Bienvenido, {user?.fullName}
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Gestión integral de tu cartera inmobiliaria
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Properties */}
        <div className="card">
          <p className="text-[11px] uppercase tracking-widest text-slate-400">
            Propiedades
          </p>
          <p className="mt-2 text-3xl font-semibold text-slate-50">
            {properties.length}
          </p>
          <p className="mt-1 text-xs text-slate-500">Activas en cartera</p>
        </div>

        {/* Active Contracts */}
        <div className="card">
          <p className="text-[11px] uppercase tracking-widest text-slate-400">
            Contratos
          </p>
          <p className="mt-2 text-3xl font-semibold text-slate-50">
            {activeContracts}
          </p>
          <p className="mt-1 text-xs text-slate-500">En vigor</p>
        </div>

        {/* Overdue */}
        <div className="card">
          <p className="text-[11px] uppercase tracking-widest text-slate-400">
            Pagos vencidos
          </p>
          <p className="mt-2 text-3xl font-semibold text-red-400">
            {overdueDue}
          </p>
          <p className="mt-1 text-xs text-slate-500">Requieren acción</p>
        </div>

        {/* Alerts */}
        <div className="card">
          <p className="text-[11px] uppercase tracking-widest text-slate-400">
            Avisos
          </p>
          <p className="mt-2 text-3xl font-semibold text-amber-300">
            {pendingNotices}
          </p>
          <p className="mt-1 text-xs text-slate-500">Pendientes</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-200">Acciones rápidas</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          <button className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700">
            Nuevo contrato
          </button>
          <button className="rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-100 hover:bg-slate-700">
            Registrar pago
          </button>
          <button className="rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-100 hover:bg-slate-700">
            Nueva propiedad
          </button>
          <button className="rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-100 hover:bg-slate-700">
            Enviar aviso
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-200">Actividad reciente</h2>
        <div className="space-y-2">
          {[
            {
              icon: "📄",
              title: "Contrato firmado",
              description: "Juan García - Apartamento Centro",
              time: "Hace 2 horas",
            },
            {
              icon: "💰",
              title: "Pago recibido",
              description: "€1,200 de María López",
              time: "Hace 5 horas",
            },
            {
              icon: "⚠️",
              title: "Pago vencido",
              description: "Carlos Pérez - €800 desde hace 15 días",
              time: "Ayer",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="card flex items-center gap-3 py-3"
            >
              <span className="text-lg">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-50">{item.title}</p>
                <p className="text-xs text-slate-400 line-clamp-1">
                  {item.description}
                </p>
              </div>
              <span className="text-[11px] text-slate-500 whitespace-nowrap">
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Education Cards */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-200">Recursos</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <a
            href="#"
            className="card group transition-all hover:border-legal-accent/50"
          >
            <p className="text-lg">📚</p>
            <h3 className="mt-2 font-medium text-slate-50 group-hover:text-legal-accent">
              Centro de ayuda
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Preguntas frecuentes y documentación
            </p>
          </a>
          <a
            href="#"
            className="card group transition-all hover:border-legal-accent/50"
          >
            <p className="text-lg">⚖️</p>
            <h3 className="mt-2 font-medium text-slate-50 group-hover:text-legal-accent">
              Conformidad legal
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Regulaciones y mejores prácticas
            </p>
          </a>
        </div>
      </div>
    </div>
  );
};
