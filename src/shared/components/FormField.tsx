import React from "react";
import { FieldError } from "react-hook-form";

interface FormFieldProps {
  label: string;
  error?: FieldError;
  description?: string;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  description,
  children,
}) => {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium uppercase tracking-wide text-slate-300">
        {label}
      </label>
      {description && (
        <p className="text-[11px] text-slate-400">{description}</p>
      )}
      {children}
      {error && (
        <p className="text-[11px] font-medium text-red-400">
          {error.message ?? "Campo obligatorio según normativa contractual."}
        </p>
      )}
    </div>
  );
};

