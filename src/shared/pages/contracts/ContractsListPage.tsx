import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ContractCard } from "../../components/Cards";
import type { Contract } from "../../../api/types";

export const ContractsListPage: React.FC = () => {
  // Mock data
  const [filterStatus] = useState<string | null>(null);

  const contracts: Contract[] = [
    {
      id: "1",
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
    },
  ];

  const displayedContracts = filterStatus
    ? contracts.filter((c) => c.status === filterStatus)
    : contracts;

  return (
    <div className="max-w-4xl space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-50">Contratos</h1>
          <p className="text-sm text-slate-400">
            Gestión de acuerdos de alquiler
          </p>
        </div>
        <Link
          to="/contracts/new"
          className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
        >
          Nuevo contrato
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {["Todos", "Activos", "Borradores", "Firmados", "Vencidos"].map(
          (filter) => (
            <button
              key={filter}
              className="whitespace-nowrap rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-1.5 text-xs font-medium text-slate-300 transition-all hover:border-slate-600 hover:text-slate-50"
            >
              {filter}
            </button>
          ),
        )}
      </div>

      {/* Contract List */}
      <div className="space-y-2">
        {displayedContracts.length === 0 ? (
          <div className="card py-8 text-center">
            <p className="text-sm text-slate-400">
              No hay contratos que mostrar
            </p>
          </div>
        ) : (
          displayedContracts.map((contract) => (
            <ContractCard key={contract.id} contract={contract} />
          ))
        )}
      </div>
    </div>
  );
};
