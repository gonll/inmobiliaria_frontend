import React from "react";
import { useParams } from "@tanstack/react-router";
import { StatusBadge } from "../../components/StatusBadge";
import type { Contract, Payment } from "../../../api/types";

export const ContractDetailPage: React.FC = () => {
  const { contractId } = useParams({ from: "/contracts/$contractId" });

  // Mock data
  const contract: Contract = {
    id: contractId,
    propertyId: "1",
    tenantId: "1",
    status: "active",
    startDate: "2023-06-01",
    endDate: "2025-06-01",
    monthlyRent: 1200,
    depositAmount: 2400,
    signedDate: "2023-06-01",
    createdAt: "2023-06-01",
    updatedAt: "2023-06-01",
    property: {
      id: "1",
      name: "Apartamento Centro",
      address: "Calle Principal 123",
      city: "Madrid",
      zipCode: "28001",
      type: "apartment",
      bedrooms: 2,
      bathrooms: 1,
      createdAt: "2023-01-01",
    },
    tenant: {
      id: "1",
      fullName: "Juan García López",
      email: "juan@example.com",
      phone: "600123456",
      nationalId: "12345678A",
      address: "Calle Principal 123",
      createdAt: "2023-06-01",
    },
  };

  const payments: Payment[] = [
    {
      id: "1",
      contractId: contractId,
      amount: 1200,
      dueDate: "2024-12-01",
      paidDate: "2024-12-02",
      status: "paid",
      month: 12,
      year: 2024,
      createdAt: "2024-12-02",
      contract,
    },
    {
      id: "2",
      contractId: contractId,
      amount: 1200,
      dueDate: "2025-01-01",
      status: "overdue",
      month: 1,
      year: 2025,
      createdAt: "2025-01-01",
      contract,
    },
  ];

  const totalOwed = payments
    .filter((p) => p.status === "overdue" || p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-slate-50">
              {contract.tenant.fullName}
            </h1>
            <p className="text-sm text-slate-400">{contract.property.name}</p>
          </div>
          <StatusBadge status={contract.status} />
        </div>
      </div>

      {/* Key Info Grid */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="card">
          <p className="text-[11px] uppercase tracking-widest text-slate-400">
            Alquiler mensual
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-50">
            €{contract.monthlyRent.toFixed(2)}
          </p>
        </div>
        <div className="card">
          <p className="text-[11px] uppercase tracking-widest text-slate-400">
            Caución
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-50">
            €{contract.depositAmount.toFixed(2)}
          </p>
        </div>
        <div className="card">
          <p className="text-[11px] uppercase tracking-widest text-slate-400">
            Duración
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-50">
            {new Date(contract.startDate).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            -{" "}
            {new Date(contract.endDate).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className={`card ${totalOwed > 0 ? "border-red-500/30 bg-red-500/5" : ""}`}>
          <p className="text-[11px] uppercase tracking-widest text-slate-400">
            Adeudado
          </p>
          <p
            className={`mt-2 text-2xl font-semibold ${
              totalOwed > 0 ? "text-red-400" : "text-green-400"
            }`}
          >
            €{totalOwed.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Tenant Info */}
      <div className="card space-y-3">
        <h2 className="font-semibold text-slate-50">Información del inquilino</h2>
        <div className="grid gap-3 sm:grid-cols-2 text-sm">
          <div>
            <p className="text-xs text-slate-400">Correo electrónico</p>
            <p className="text-slate-50">{contract.tenant.email}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Teléfono</p>
            <p className="text-slate-50">{contract.tenant.phone}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">DNI</p>
            <p className="text-slate-50">{contract.tenant.nationalId}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Dirección</p>
            <p className="text-slate-50">{contract.tenant.address}</p>
          </div>
        </div>
      </div>

      {/* Property Info */}
      <div className="card space-y-3">
        <h2 className="font-semibold text-slate-50">Información de la propiedad</h2>
        <div className="grid gap-3 sm:grid-cols-2 text-sm">
          <div>
            <p className="text-xs text-slate-400">Dirección</p>
            <p className="text-slate-50">{contract.property.address}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Ciudad/Código postal</p>
            <p className="text-slate-50">
              {contract.property.city} {contract.property.zipCode}
            </p>
          </div>
          {contract.property.bedrooms && (
            <div>
              <p className="text-xs text-slate-400">Dormitorios</p>
              <p className="text-slate-50">{contract.property.bedrooms}</p>
            </div>
          )}
          {contract.property.bathrooms && (
            <div>
              <p className="text-xs text-slate-400">Baños</p>
              <p className="text-slate-50">{contract.property.bathrooms}</p>
            </div>
          )}
        </div>
      </div>

      {/* Payments */}
      <div className="space-y-3">
        <h2 className="font-semibold text-slate-50">Historial de pagos</h2>
        <div className="space-y-2">
          {payments.map((payment) => (
            <div key={payment.id} className="card flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-50">
                  {new Date(payment.dueDate).toLocaleDateString("es-ES", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p className="text-xs text-slate-400">
                  €{payment.amount.toFixed(2)}
                </p>
              </div>
              <StatusBadge status={payment.status} />
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button className="flex-1 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700">
          Registrar pago
        </button>
        <button className="flex-1 rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-100 hover:bg-slate-700">
          Descargar contrato
        </button>
        <button className="flex-1 rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-sm font-medium text-slate-100 hover:bg-slate-800">
          Más opciones
        </button>
      </div>
    </div>
  );
};
