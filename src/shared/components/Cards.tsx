import React from "react";
import { Link } from "@tanstack/react-router";
import type { Contract, Property } from "../../api/types";
import { StatusBadge } from "./StatusBadge";

interface PropertyCardProps {
  property: Property;
  onSelect?: (property: Property) => void;
  contractCount?: number;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onSelect,
  contractCount = 0,
}) => {
  return (
    <div
      className="card cursor-pointer transition-all hover:border-legal-accent/50 hover:bg-legal-surfaceElevated"
      onClick={() => onSelect?.(property)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="font-semibold text-slate-50">{property.name}</h3>
          <p className="text-xs text-slate-400">{property.address}</p>
          <p className="mt-2 text-xs text-slate-500">
            {property.zipCode} {property.city}
          </p>
          {property.bedrooms !== undefined && property.bathrooms !== undefined && (
            <p className="mt-1 text-[11px] text-slate-500">
              {property.bedrooms} dorm. • {property.bathrooms} baño
            </p>
          )}
        </div>
        <div className="rounded-lg bg-slate-900/50 px-2.5 py-1.5 text-center">
          <p className="text-xs font-semibold text-slate-50">{contractCount}</p>
          <p className="text-[10px] uppercase tracking-widest text-slate-400">
            Contratos
          </p>
        </div>
      </div>
    </div>
  );
};

interface ContractCardProps {
  contract: Contract;
}

export const ContractCard: React.FC<ContractCardProps> = ({ contract }) => {
  const daysUntilExpiry = Math.ceil(
    (new Date(contract.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
  );
  const isExpiringSoon = daysUntilExpiry > 0 && daysUntilExpiry <= 30;

  return (
    <Link
      to={`/contracts/$contractId`}
      params={{ contractId: contract.id }}
      className="card transition-all hover:border-legal-accent/50 hover:bg-legal-surfaceElevated"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-50">{contract.tenant.fullName}</h3>
            <StatusBadge status={contract.status} />
          </div>
          <p className="text-xs text-slate-400">{contract.property.name}</p>
          <p className="text-xs font-medium text-slate-300">
            €{contract.monthlyRent.toFixed(2)}/mes
          </p>
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span>
              Fin:{" "}
              {new Date(contract.endDate).toLocaleDateString("es-ES", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            {isExpiringSoon && (
              <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-amber-300">
                {daysUntilExpiry} días
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
