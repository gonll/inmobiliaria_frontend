import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useForm } from "react-hook-form";
import { FormField } from "./components/FormField";

export const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();

  const onSubmitProfile = async (data: unknown) => {
    console.log("Profile updated:", data);
    // TODO: API call
    setEditMode(false);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-50">Configuración</h1>
        <p className="text-sm text-slate-400">
          Gestiona tu perfil y preferencias de la plataforma
        </p>
      </div>

      {/* Profile Section */}
      <div className="card space-y-4">
        <h2 className="font-semibold text-slate-50">Perfil de usuario</h2>
        {!editMode ? (
          <div className="space-y-4">
            <div>
              <p className="text-xs text-slate-400">Nombre completo</p>
              <p className="mt-1 text-sm font-medium text-slate-50">
                {user?.fullName}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Correo electrónico</p>
              <p className="mt-1 text-sm font-medium text-slate-50">
                {user?.email}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Rol predeterminado</p>
              <p className="mt-1 inline-block rounded-full bg-blue-500/20 px-2.5 py-0.5 text-xs font-medium text-blue-400">
                {user?.defaultRole === "landlord"
                  ? "Propietario"
                  : user?.defaultRole === "admin"
                    ? "Administrador"
                    : "Legal"}
              </p>
            </div>
            <button
              onClick={() => setEditMode(true)}
              className="rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-sm font-medium text-slate-100 hover:bg-slate-800"
            >
              Editar perfil
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-4">
            <FormField label="Nombre completo">
              <input
                type="text"
                defaultValue={user?.fullName}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-500"
                {...register("fullName")}
              />
            </FormField>
            <FormField label="Correo electrónico">
              <input
                type="email"
                defaultValue={user?.email}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-500"
                {...register("email")}
              />
            </FormField>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Guardando..." : "Guardar cambios"}
              </button>
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="flex-1 rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-sm font-medium text-slate-100 hover:bg-slate-800"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Security Section */}
      <div className="card space-y-4">
        <h2 className="font-semibold text-slate-50">Seguridad</h2>
        <div className="space-y-3">
          <button className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-left text-sm font-medium text-slate-100 hover:bg-slate-800">
            Cambiar contraseña
          </button>
          <button className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-left text-sm font-medium text-slate-100 hover:bg-slate-800">
            Autenticación de dos factores
          </button>
          <button className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-left text-sm font-medium text-slate-100 hover:bg-slate-800">
            Dispositivos conectados
          </button>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="card space-y-4">
        <h2 className="font-semibold text-slate-50">Notificaciones</h2>
        <div className="space-y-3">
          {[
            {
              label: "Pagos vencidos",
              description: "Recibe alertas de pagos atrasados",
              enabled: true,
            },
            {
              label: "Vencimiento de contratos",
              description: "Notificaciones 30 días antes de vencimiento",
              enabled: true,
            },
            {
              label: "Mantenimiento",
              description: "Solicitudes de reparación y mantenimiento",
              enabled: false,
            },
            {
              label: "Actualizaciones de plataforma",
              description: "Nuevas funciones y mejoras",
              enabled: true,
            },
          ].map((notification) => (
            <label
              key={notification.label}
              className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-900/50 p-3 hover:bg-slate-800"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-50">
                  {notification.label}
                </p>
                <p className="text-xs text-slate-400">
                  {notification.description}
                </p>
              </div>
              <input
                type="checkbox"
                defaultChecked={notification.enabled}
                className="rounded border-slate-600"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Data & Privacy Section */}
      <div className="card space-y-4">
        <h2 className="font-semibold text-slate-50">Datos y privacidad</h2>
        <div className="space-y-3">
          <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-3">
            <p className="text-sm font-medium text-slate-50">
              Descargar mis datos
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Obtén una copia de todos tus datos en formato CSV
            </p>
            <button className="mt-2 text-sm font-medium text-brand-400 hover:text-brand-300">
              Descargar
            </button>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-3">
            <p className="text-sm font-medium text-slate-50">
              Auditoría de accesos
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Registro de quién accedió a qué datos y cuándo
            </p>
            <button className="mt-2 text-sm font-medium text-brand-400 hover:text-brand-300">
              Ver auditoría
            </button>
          </div>
        </div>
      </div>

      {/* Integrations Section */}
      <div className="card space-y-4">
        <h2 className="font-semibold text-slate-50">Integraciones</h2>
        <p className="text-sm text-slate-400">
          Conecta servicios externos para ampliar la funcionalidad
        </p>
        <div className="space-y-2">
          {[
            { name: "Google Drive", connected: false },
            { name: "Zapier", connected: true },
            { name: "Slack", connected: false },
          ].map((integration) => (
            <div
              key={integration.name}
              className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-900/50 p-3"
            >
              <p className="text-sm font-medium text-slate-50">
                {integration.name}
              </p>
              <button
                className={`rounded px-3 py-1.5 text-xs font-medium ${
                  integration.connected
                    ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                    : "bg-brand-600/20 text-brand-400 hover:bg-brand-600/30"
                }`}
              >
                {integration.connected ? "Desconectar" : "Conectar"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Support Section */}
      <div className="card space-y-4">
        <h2 className="font-semibold text-slate-50">Ayuda y soporte</h2>
        <div className="space-y-2">
          <a
            href="#"
            className="block rounded-lg border border-slate-700 bg-slate-900/50 p-3 hover:bg-slate-800"
          >
            <p className="text-sm font-medium text-slate-50">Centro de ayuda</p>
            <p className="text-xs text-slate-400">Preguntas frecuentes y guías</p>
          </a>
          <a
            href="#"
            className="block rounded-lg border border-slate-700 bg-slate-900/50 p-3 hover:bg-slate-800"
          >
            <p className="text-sm font-medium text-slate-50">
              Contactar soporte
            </p>
            <p className="text-xs text-slate-400">Equipo de soporte disponible</p>
          </a>
          <a
            href="#"
            className="block rounded-lg border border-slate-700 bg-slate-900/50 p-3 hover:bg-slate-800"
          >
            <p className="text-sm font-medium text-slate-50">
              Términos de servicio
            </p>
            <p className="text-xs text-slate-400">
              Condiciones legales de uso
            </p>
          </a>
        </div>
      </div>

      {/* Logout */}
      <div className="space-y-2">
        <button
          onClick={logout}
          className="w-full rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/20"
        >
          Cerrar sesión en todos los dispositivos
        </button>
        <p className="text-xs text-slate-500">
          Se cerrará tu sesión en todos los navegadores y dispositivos.
        </p>
      </div>
    </div>
  );
};
