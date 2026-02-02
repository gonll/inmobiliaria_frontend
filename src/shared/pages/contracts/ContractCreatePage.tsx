import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contractCreateSchema, type ContractCreateSchema } from "../../../forms/schemas";
import { FormField } from "../../components/FormField";

type Step = 1 | 2 | 3 | 4;

export const ContractCreatePage: React.FC = () => {
  const [step, setStep] = useState<Step>(1);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<ContractCreateSchema>({
    resolver: zodResolver(contractCreateSchema),
  });

  const watchedValues = watch();

  const onSubmit = async (values: ContractCreateSchema) => {
    console.log("Contract created:", values);
    // TODO: API call to create contract
  };

  const steps = [
    { number: 1, title: "Propiedad" },
    { number: 2, title: "Inquilino" },
    { number: 3, title: "Términos" },
    { number: 4, title: "Confirmación" },
  ];

  const canAdvance =
    step === 1 && watchedValues.propertyId
      ? true
      : step === 2 && watchedValues.tenantId
        ? true
        : step === 3 &&
          watchedValues.startDate &&
          watchedValues.endDate &&
          watchedValues.monthlyRent &&
          watchedValues.depositAmount
          ? true
          : false;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-50">Crear nuevo contrato</h1>
        <p className="text-sm text-slate-400">
          Proceso guiado para crear un acuerdo de alquiler
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          {steps.map((s, idx) => (
            <div key={s.number} className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                  step >= s.number
                    ? "bg-brand-600 text-white"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {s.number}
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`h-1 w-8 ${
                    step > s.number ? "bg-brand-600" : "bg-slate-800"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-slate-200">
            Paso {step} de 4: {steps[step - 1].title}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Step 1: Property */}
        {step === 1 && (
          <div className="space-y-4">
            <FormField label="Seleccionar propiedad" error={errors.propertyId}>
              <select
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-500"
                {...register("propertyId")}
              >
                <option value="">Elige una propiedad...</option>
                <option value="1">Apartamento Centro - Madrid</option>
                <option value="2">Casa Suburbios - Barcelona</option>
              </select>
            </FormField>
          </div>
        )}

        {/* Step 2: Tenant */}
        {step === 2 && (
          <div className="space-y-4">
            <FormField label="Seleccionar inquilino" error={errors.tenantId}>
              <select
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-500"
                {...register("tenantId")}
              >
                <option value="">Elige un inquilino...</option>
                <option value="1">Juan García López</option>
                <option value="2">María López García</option>
              </select>
            </FormField>
            <button
              type="button"
              className="w-full rounded-lg border border-brand-600 bg-brand-600/10 px-4 py-2.5 text-sm font-medium text-brand-400 hover:bg-brand-600/20"
            >
              Crear nuevo inquilino
            </button>
          </div>
        )}

        {/* Step 3: Terms */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Fecha de inicio" error={errors.startDate}>
                <input
                  type="date"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-500"
                  {...register("startDate")}
                />
              </FormField>
              <FormField label="Fecha de finalización" error={errors.endDate}>
                <input
                  type="date"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-500"
                  {...register("endDate")}
                />
              </FormField>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Alquiler mensual (€)" error={errors.monthlyRent}>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-500"
                  {...register("monthlyRent")}
                />
              </FormField>
              <FormField label="Caución (€)" error={errors.depositAmount}>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-500"
                  {...register("depositAmount")}
                />
              </FormField>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="card space-y-3">
              <h3 className="font-semibold text-slate-50">Resumen del contrato</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Propiedad:</span>
                  <span className="text-slate-50">Apartamento Centro</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Inquilino:</span>
                  <span className="text-slate-50">Juan García López</span>
                </div>
                <div className="flex justify-between border-t border-slate-700 pt-2">
                  <span className="text-slate-400">Alquiler mensual:</span>
                  <span className="font-medium text-slate-50">
                    €{watchedValues.monthlyRent?.toFixed(2) || "0.00"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Caución:</span>
                  <span className="font-medium text-slate-50">
                    €{watchedValues.depositAmount?.toFixed(2) || "0.00"}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Al crear este contrato, confirmas que la información es correcta y
              completa, y que tienes autoridad legal para vincularte a este acuerdo.
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => setStep((prev) => Math.max(1, prev - 1) as Step)}
            disabled={step === 1}
            className="flex-1 rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-sm font-medium text-slate-100 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Atrás
          </button>
          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => Math.min(4, prev + 1) as Step)}
              disabled={!canAdvance}
              className="flex-1 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Siguiente
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Creando..." : "Crear contrato"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
