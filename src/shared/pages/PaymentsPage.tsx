import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paymentCreateSchema, type PaymentCreateSchema } from "../../forms/schemas";
import { FormField } from "../components/FormField";
import { StatusBadge } from "../components/StatusBadge";
import type { Payment } from "../../api/types";

export const PaymentsPage: React.FC = () => {
  const [showNewPayment, setShowNewPayment] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PaymentCreateSchema>({
    resolver: zodResolver(paymentCreateSchema),
  });

  // Mock data
  const payments: Payment[] = [
    {
      id: "1",
      contractId: "1",
      amount: 1200,
      dueDate: "2024-12-01",
      paidDate: "2024-12-02",
      status: "paid",
      month: 12,
      year: 2024,
      createdAt: "2024-12-02",
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
      amount: 1200,
      dueDate: "2025-01-01",
      status: "overdue",
      month: 1,
      year: 2025,
      createdAt: "2025-01-01",
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

  const onSubmit = async (values: PaymentCreateSchema) => {
    console.log("Payment registered:", values);
    // TODO: API call
  };

  const overdue = payments.filter((p) => p.status === "overdue");
  const pending = payments.filter((p) => p.status === "pending");
  const totalOverdue = overdue.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="max-w-4xl space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-50">Pagos y cobros</h1>
          <p className="text-sm text-slate-400">
            Gestión de alquileres y morosidad
          </p>
        </div>
        <button
          onClick={() => setShowNewPayment(!showNewPayment)}
          className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
        >
          {showNewPayment ? "Cancelar" : "Registrar pago"}
        </button>
      </div>

      {/* KPIs */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="card">
          <p className="text-[11px] uppercase tracking-widest text-slate-400">
            Total adeudado
          </p>
          <p className="mt-2 text-2xl font-semibold text-red-400">
            €{totalOverdue.toFixed(2)}
          </p>
          <p className="mt-1 text-xs text-slate-500">{overdue.length} pagos vencidos</p>
        </div>
        <div className="card">
          <p className="text-[11px] uppercase tracking-widest text-slate-400">
            Pendientes
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-50">
            {pending.length}
          </p>
          <p className="mt-1 text-xs text-slate-500">Por vencer</p>
        </div>
        <div className="card">
          <p className="text-[11px] uppercase tracking-widest text-slate-400">
            Pagado este mes
          </p>
          <p className="mt-2 text-2xl font-semibold text-green-400">
            €{(1200).toFixed(2)}
          </p>
          <p className="mt-1 text-xs text-slate-500">1 de 5 propiedades</p>
        </div>
      </div>

      {/* New Payment Form */}
      {showNewPayment && (
        <div className="card space-y-4">
          <h2 className="font-semibold text-slate-50">Registrar nuevo pago</h2>
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
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Monto (€)" error={errors.amount}>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-500"
                  {...register("amount")}
                />
              </FormField>
              <FormField label="Fecha de pago" error={errors.paidDate}>
                <input
                  type="date"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-500"
                  {...register("paidDate")}
                />
              </FormField>
            </div>
            <FormField label="Notas (opcional)" error={errors.notes}>
              <textarea
                rows={3}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-500"
                {...register("notes")}
              />
            </FormField>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Registrando..." : "Registrar pago"}
            </button>
          </form>
        </div>
      )}

      {/* Overdue Payments */}
      {overdue.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-slate-50">Pagos vencidos</h2>
          <div className="space-y-2">
            {overdue.map((payment) => (
              <div
                key={payment.id}
                className="card border-red-500/30 bg-red-500/5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-50">
                      {payment.contract.tenant.fullName}
                    </p>
                    <p className="text-xs text-slate-400">
                      {payment.contract.property.name} •{" "}
                      {new Date(payment.dueDate).toLocaleDateString("es-ES")}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-red-400">
                      €{payment.amount.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <StatusBadge status="overdue" />
                    <button className="rounded px-2 py-1 text-xs font-medium text-blue-400 hover:bg-blue-500/10">
                      Cobrar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Payments */}
      <div className="space-y-3">
        <h2 className="font-semibold text-slate-50">Todos los pagos</h2>
        <div className="space-y-2">
          {payments.map((payment) => (
            <div key={payment.id} className="card">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-slate-50">
                    {payment.contract.tenant.fullName}
                  </p>
                  <p className="text-xs text-slate-400">
                    {new Date(payment.dueDate).toLocaleDateString("es-ES", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-50">
                    €{payment.amount.toFixed(2)}
                  </p>
                  <StatusBadge status={payment.status} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
