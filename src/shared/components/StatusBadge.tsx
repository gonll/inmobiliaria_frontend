import React from "react";

export type StatusType =
  | "paid"
  | "pending"
  | "overdue"
  | "signed"
  | "draft"
  | "active"
  | "expired"
  | "partial"
  | "disputed"
  | "escalated"
  | "resolved"
  | "processing";

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
}

const statusConfig: Record<StatusType, { bg: string; text: string; label: string }> = {
  paid: {
    bg: "bg-green-500/10",
    text: "text-green-400",
    label: "Pagado",
  },
  pending: {
    bg: "bg-slate-500/10",
    text: "text-slate-300",
    label: "Pendiente",
  },
  overdue: {
    bg: "bg-red-500/10",
    text: "text-red-400",
    label: "Vencido",
  },
  signed: {
    bg: "bg-green-500/10",
    text: "text-green-400",
    label: "Firmado",
  },
  draft: {
    bg: "bg-slate-500/10",
    text: "text-slate-300",
    label: "Borrador",
  },
  active: {
    bg: "bg-blue-500/10",
    text: "text-blue-300",
    label: "Activo",
  },
  expired: {
    bg: "bg-slate-500/10",
    text: "text-slate-300",
    label: "Expirado",
  },
  partial: {
    bg: "bg-amber-500/10",
    text: "text-amber-300",
    label: "Parcial",
  },
  disputed: {
    bg: "bg-red-500/10",
    text: "text-red-400",
    label: "Disputado",
  },
  escalated: {
    bg: "bg-orange-500/10",
    text: "text-orange-400",
    label: "Escalado",
  },
  resolved: {
    bg: "bg-green-500/10",
    text: "text-green-400",
    label: "Resuelto",
  },
  processing: {
    bg: "bg-blue-500/10",
    text: "text-blue-300",
    label: "Procesando",
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label }) => {
  const config = statusConfig[status];
  return (
    <span className={`pill ${config.bg} ${config.text}`}>
      {label || config.label}
    </span>
  );
};
