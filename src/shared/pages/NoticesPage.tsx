import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { noticeCreateSchema, type NoticeCreateSchema } from "../forms/schemas";
import { FormField } from "./components/FormField";
import { StatusBadge } from "./components/StatusBadge";
import type { Notice } from "../api/types";

export const NoticesPage: React.FC = () => {
  const [showNewNotice, setShowNewNotice] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NoticeCreateSchema>({
    resolver: zodResolver(noticeCreateSchema),
  });

  // Mock data
  const notices: Notice[] = [
    {
      id: "1",
      contractId: "1",
      type: "payment_default",
      title: "Aviso de mora por impago de alquiler",
      description: "El inquilino ha incumplido el pago del alquiler correspondiente al mes de enero de 2025.",
      issueDate: "2025-01-15",
      dueDate: "2025-02-15",
      status: "pending",
      createdAt: "2025-01-15",
      contract: {
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
    },
    {
      id: "2",
      contractId: "1",
      type: "lease_expiration",
      title: "Contrato próximo a vencerse",
      description: "El contrato de alquiler vencerá en 30 días. Se recomienda contactar al inquilino para renovación.",
      issueDate: "2025-05-01",
      status: "acknowledged",
      createdAt: "2025-05-01",
      contract: {
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
    },
  ];

  const onSubmit = async (values: NoticeCreateSchema) => {
    console.log("Notice created:", values);
    // TODO: API call
  };

  const noticeTypeLabels: Record<string, string> = {
    lease_expiration: "Vencimiento de contrato",
    payment_default: "Mora en pago",
    maintenance_request: "Solicitud de mantenimiento",
    contract_violation: "Incumplimiento de contrato",
    rent_increase: "Aumento de alquiler",
  };

  return (
    <div className="max-w-4xl space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-50">
            Avisos y notificaciones
          </h1>
          <p className="text-sm text-slate-400">
            Gestión de pre-acciones legales y comunicaciones
          </p>
        </div>
        <button
          onClick={() => setShowNewNotice(!showNewNotice)}
          className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
        >
          {showNewNotice ? "Cancelar" : "Nuevo aviso"}
        </button>
      </div>

      {/* New Notice Form */}
      {showNewNotice && (
        <div className="card space-y-4">
          <h2 className="font-semibold text-slate-50">Crear nuevo aviso</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField label="Contrato" error={errors.contractId}>
              <select
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-500"
                {...register("contractId")}
              >
                <option value="">Selecciona un contrato...</option>
                <option value="1">Juan García - Apartamento Centro</option>
              </select>
            </FormField>
            <FormField label="Tipo de aviso" error={errors.type}>
              <select
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-500"
                {...register("type")}
              >
                <option value="">Selecciona un tipo...</option>
                <option value="payment_default">Mora en pago</option>
                <option value="lease_expiration">Vencimiento de contrato</option>
                <option value="contract_violation">Incumplimiento de contrato</option>
                <option value="maintenance_request">Solicitud de mantenimiento</option>
                <option value="rent_increase">Aumento de alquiler</option>
              </select>
            </FormField>
            <FormField label="Título" error={errors.title}>
              <input
                type="text"
                placeholder="Título breve del aviso"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-500"
                {...register("title")}
              />
            </FormField>
            <FormField
              label="Descripción"
              error={errors.description}
              description="Proporciona detalles completos del aviso"
            >
              <textarea
                rows={4}
                placeholder="Descripción detallada..."
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-500"
                {...register("description")}
              />
            </FormField>
            <FormField label="Fecha límite (opcional)" error={errors.dueDate}>
              <input
                type="date"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-500"
                {...register("dueDate")}
              />
            </FormField>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Creando..." : "Crear aviso"}
            </button>
          </form>
        </div>
      )}

      {/* Pending Notices */}
      {notices.filter((n) => n.status === "pending").length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-slate-50">Pendientes de respuesta</h2>
          <div className="space-y-2">
            {notices
              .filter((n) => n.status === "pending")
              .map((notice) => (
                <div
                  key={notice.id}
                  className="card border-amber-500/30 bg-amber-500/5"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-slate-50">
                          {notice.title}
                        </h3>
                        <p className="text-xs text-slate-400">
                          {notice.contract.tenant.fullName} •{" "}
                          {noticeTypeLabels[notice.type]}
                        </p>
                      </div>
                      <StatusBadge status="pending" />
                    </div>
                    <p className="text-sm text-slate-300">
                      {notice.description}
                    </p>
                    {notice.dueDate && (
                      <p className="text-xs text-amber-300">
                        Vence:{" "}
                        {new Date(notice.dueDate).toLocaleDateString("es-ES")}
                      </p>
                    )}
                    <div className="flex gap-2 pt-2">
                      <button className="text-xs font-medium text-blue-400 hover:text-blue-300">
                        Marcar como reconocido
                      </button>
                      <button className="text-xs font-medium text-red-400 hover:text-red-300">
                        Escalado
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* All Notices */}
      <div className="space-y-3">
        <h2 className="font-semibold text-slate-50">Todos los avisos</h2>
        <div className="space-y-2">
          {notices.map((notice) => (
            <div key={notice.id} className="card">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-50">{notice.title}</h3>
                  <p className="text-xs text-slate-400">
                    {notice.contract.tenant.fullName} •{" "}
                    {new Date(notice.issueDate).toLocaleDateString("es-ES")}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-300">
                    {notice.description}
                  </p>
                </div>
                <StatusBadge status={notice.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
