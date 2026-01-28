import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../auth/AuthContext";
import { FormField } from "../components/FormField";

const loginSchema = z.object({
  email: z.string().email("Introduce un correo válido."),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres."),
});

type LoginSchema = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const { loginWithOAuth, loginWithEmailPassword, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginSchema) => {
    await loginWithEmailPassword(values.email, values.password);
  };

  const busy = isLoading || isSubmitting;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col justify-center gap-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-50">
          Acceso seguro a cartera
        </h1>
        <p className="text-sm text-slate-400">
          Plataforma jurídica para gestión de contratos, cobros y prevención de
          conflicto en carteras inmobiliarias profesionales.
        </p>
      </div>

      <div className="space-y-4">
        <button
          type="button"
          onClick={() => loginWithOAuth("google")}
          className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-100 ring-1 ring-slate-700 hover:bg-slate-800"
        >
          Continuar con Google
        </button>
        <button
          type="button"
          onClick={() => loginWithOAuth("microsoft")}
          className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-100 ring-1 ring-slate-700 hover:bg-slate-800"
        >
          Continuar con Microsoft 365
        </button>
        <button
          type="button"
          onClick={() => loginWithOAuth("github")}
          className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-100 ring-1 ring-slate-700 hover:bg-slate-800"
        >
          Continuar con GitHub
        </button>
      </div>

      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-800" />
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-wide">
          <span className="bg-legal-background px-3 text-slate-500">
            o acceso corporativo
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          label="Correo corporativo"
          description="Usa el correo asociado a tu mandato de gestión o poder de representación."
          error={errors.email}
        >
          <input
            type="email"
            autoComplete="email"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-500"
            {...register("email")}
          />
        </FormField>

        <FormField
          label="Contraseña"
          description="No compartas estas credenciales. El acceso queda registrado a efectos de auditoría."
          error={errors.password}
        >
          <input
            type="password"
            autoComplete="current-password"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-500"
            {...register("password")}
          />
        </FormField>

        <button
          type="submit"
          disabled={busy}
          className="mt-2 w-full rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? "Validando credenciales..." : "Entrar en la plataforma"}
        </button>
      </form>

      <p className="text-[11px] leading-snug text-slate-500">
        El acceso y uso de la plataforma implica la aceptación de los términos
        de uso, política de privacidad y confidencialidad. Todas las acciones
        quedan registradas a efectos de trazabilidad y defensa jurídica.
      </p>
    </div>
  );
};

