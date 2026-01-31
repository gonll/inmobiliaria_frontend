import React from "react";
import { StatusBadge } from "../components/StatusBadge";
import type { ConflictCase } from "../../api/types";

export const ConflictPreventionPage: React.FC = () => {
  // Mock data with AI analysis
  const cases: ConflictCase[] = [
    {
      id: "1",
      contractId: "1",
      title: "Patrón de retraso en pagos detectado",
      description: "El inquilino ha mostrado un patrón de retrasos en los últimos 3 meses.",
      severity: "high",
      status: "detected",
      aiAnalysis:
        "Basado en el análisis de datos, este inquilino tiene un 75% de probabilidad de incumplimiento futuro. Se recomienda iniciar una comunicación preventiva inmediata.",
      recommendedActions: [
        "Enviar recordatorio de pago amistoso",
        "Ofrecer plan de pago flexible",
        "Documentar todas las comunicaciones",
        "Considerar garantía adicional",
      ],
      createdAt: "2025-01-15",
    },
    {
      id: "2",
      contractId: "1",
      title: "Aumento de consumo de servicios inusual",
      description: "El consumo de agua y electricidad ha aumentado significativamente.",
      severity: "medium",
      status: "in_mediation",
      aiAnalysis:
        "El aumento detectado podría indicar subarrendamiento no autorizado. Se aconseja inspección discreta.",
      recommendedActions: [
        "Solicitar lectura de contadores",
        "Revisar contrato para cláusulas de subarrendamiento",
        "Evaluar necesidad de inspección",
      ],
      createdAt: "2025-01-10",
    },
    {
      id: "3",
      contractId: "1",
      title: "Solicitud de reparación no atendida",
      description: "El inquilino reportó daños que no han sido reparados en 30 días.",
      severity: "medium",
      status: "escalated",
      aiAnalysis:
        "Retraso en mantenimiento puede originar reclamaciones. Se recomienda acción inmediata.",
      recommendedActions: [
        "Programar inspección urgente",
        "Contactar contratista de emergencia",
        "Documentar fotografías de daños",
      ],
      createdAt: "2025-01-05",
    },
  ];

  const severityColor: Record<string, string> = {
    low: "text-blue-400",
    medium: "text-amber-400",
    high: "text-red-400",
  };

  const severityBg: Record<string, string> = {
    low: "bg-blue-500/10 border-blue-500/30",
    medium: "bg-amber-500/10 border-amber-500/30",
    high: "bg-red-500/10 border-red-500/30",
  };

  return (
    <div className="max-w-4xl space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-50">
          Prevención de conflictos
        </h1>
        <p className="text-sm text-slate-400">
          Análisis impulsado por IA para detectar y prevenir disputas
        </p>
      </div>

      {/* AI Overview Card */}
      <div className="card space-y-3 border-brand-600/30 bg-brand-600/5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-semibold text-slate-50">Análisis de IA</h2>
            <p className="text-xs text-slate-400">
              Sistema de monitoreo preventivo en tiempo real
            </p>
          </div>
          <span className="rounded-full bg-green-500/20 px-2.5 py-1 text-xs font-medium text-green-400">
            Activo
          </span>
        </div>
        <p className="text-sm text-slate-300">
          El sistema analiza patrones en tu cartera para identificar riesgos potenciales antes de que se conviertan en conflictos legales. Todos los casos detectados aparecen a continuación con análisis y recomendaciones.
        </p>
      </div>

      {/* Risk Summary */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="card">
          <p className="text-[11px] uppercase tracking-widest text-slate-400">
            Alto riesgo
          </p>
          <p className="mt-2 text-3xl font-semibold text-red-400">
            {cases.filter((c) => c.severity === "high").length}
          </p>
          <p className="mt-1 text-xs text-slate-500">Requieren acción inmediata</p>
        </div>
        <div className="card">
          <p className="text-[11px] uppercase tracking-widest text-slate-400">
            Riesgo medio
          </p>
          <p className="mt-2 text-3xl font-semibold text-amber-400">
            {cases.filter((c) => c.severity === "medium").length}
          </p>
          <p className="mt-1 text-xs text-slate-500">Monitoreo recomendado</p>
        </div>
        <div className="card">
          <p className="text-[11px] uppercase tracking-widest text-slate-400">
            Bajo riesgo
          </p>
          <p className="mt-2 text-3xl font-semibold text-blue-400">
            {cases.filter((c) => c.severity === "low").length}
          </p>
          <p className="mt-1 text-xs text-slate-500">Monitoreo pasivo</p>
        </div>
      </div>

      {/* Cases List */}
      <div className="space-y-3">
        <h2 className="font-semibold text-slate-50">Casos detectados</h2>
        <div className="space-y-2">
          {cases.map((caseItem) => (
            <div
              key={caseItem.id}
              className={`card border ${severityBg[caseItem.severity]} space-y-3`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className={`font-semibold ${severityColor[caseItem.severity]}`}>
                    {caseItem.title}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {caseItem.description}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <StatusBadge status={caseItem.status} />
                  <span
                    className={`text-xs font-semibold uppercase tracking-widest ${severityColor[caseItem.severity]}`}
                  >
                    {caseItem.severity === "high"
                      ? "Crítico"
                      : caseItem.severity === "medium"
                        ? "Medio"
                        : "Bajo"}
                  </span>
                </div>
              </div>

              {/* AI Analysis */}
              {caseItem.aiAnalysis && (
                <div className="space-y-2 border-t border-slate-700/50 pt-3">
                  <p className="text-xs font-semibold text-slate-300">
                    Análisis de IA:
                  </p>
                  <p className="text-sm text-slate-400">
                    {caseItem.aiAnalysis}
                  </p>
                </div>
              )}

              {/* Recommended Actions */}
              {caseItem.recommendedActions && caseItem.recommendedActions.length > 0 && (
                <div className="space-y-2 border-t border-slate-700/50 pt-3">
                  <p className="text-xs font-semibold text-slate-300">
                    Acciones recomendadas:
                  </p>
                  <ul className="space-y-1.5">
                    {caseItem.recommendedActions.map((action, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-sm text-slate-400"
                      >
                        <span className="mt-0.5 text-xs">✓</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 border-t border-slate-700/50 pt-3">
                <button className="flex-1 rounded bg-blue-500/20 px-3 py-1.5 text-xs font-medium text-blue-400 hover:bg-blue-500/30">
                  Tomar acción
                </button>
                <button className="flex-1 rounded bg-slate-700/50 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700">
                  Marcar resuelto
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Settings Card */}
      <div className="card space-y-3 border-slate-700">
        <h3 className="font-semibold text-slate-50">Configuración de análisis</h3>
        <p className="text-sm text-slate-400">
          Personaliza qué tipos de patrones deseas monitorear
        </p>
        <div className="space-y-2">
          {[
            { label: "Patrones de pago", enabled: true },
            { label: "Solicitudes de mantenimiento", enabled: true },
            { label: "Cambios de consumo de servicios", enabled: false },
            { label: "Cambios demográficos de inquilinos", enabled: false },
          ].map((setting) => (
            <label key={setting.label} className="flex items-center gap-2">
              <input
                type="checkbox"
                defaultChecked={setting.enabled}
                className="rounded border-slate-600 text-brand-600"
              />
              <span className="text-sm text-slate-300">{setting.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
