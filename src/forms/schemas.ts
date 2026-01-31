import { z } from "zod";

/* Contract Schemas */

export const contractCreateSchema = z.object({
  propertyId: z.string().min(1, "Selecciona una propiedad"),
  tenantId: z.string().min(1, "Selecciona un inquilino"),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Fecha de inicio inválida",
  }),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Fecha de fin inválida",
  }),
  monthlyRent: z.coerce
    .number()
    .min(0.01, "El alquiler debe ser mayor a 0")
    .max(999999, "Monto inválido"),
  depositAmount: z.coerce
    .number()
    .min(0, "El depósito no puede ser negativo")
    .max(999999, "Monto inválido"),
}).refine((data) => new Date(data.endDate) > new Date(data.startDate), {
  message: "La fecha de fin debe ser posterior a la fecha de inicio",
  path: ["endDate"],
});

export type ContractCreateSchema = z.infer<typeof contractCreateSchema>;

/* Tenant Schemas */

export const tenantCreateSchema = z.object({
  fullName: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.string().email("Introduce un correo válido"),
  phone: z.string().min(9, "Introduce un número de teléfono válido"),
  nationalId: z.string().min(5, "Introduce un ID válido"),
  dateOfBirth: z.string().optional(),
  address: z.string().min(5, "Introduce una dirección válida"),
});

export type TenantCreateSchema = z.infer<typeof tenantCreateSchema>;

/* Property Schemas */

export const propertyCreateSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  address: z.string().min(5, "Introduce una dirección válida"),
  zipCode: z.string().min(3, "Código postal inválido"),
  city: z.string().min(2, "Ciudad inválida"),
  type: z.enum(["apartment", "house", "commercial", "land"]),
  bedrooms: z.coerce.number().min(0).optional(),
  bathrooms: z.coerce.number().min(0).optional(),
  squareMeters: z.coerce.number().min(1, "Metros cuadrados inválidos").optional(),
});

export type PropertyCreateSchema = z.infer<typeof propertyCreateSchema>;

/* Payment Schemas */

export const paymentCreateSchema = z.object({
  contractId: z.string().min(1, "Selecciona un contrato"),
  amount: z.coerce
    .number()
    .min(0.01, "El monto debe ser mayor a 0")
    .max(999999, "Monto inválido"),
  paidDate: z.string().optional(),
  notes: z.string().max(500, "Las notas no pueden exceder 500 caracteres").optional(),
});

export type PaymentCreateSchema = z.infer<typeof paymentCreateSchema>;

/* Notice Schemas */

export const noticeCreateSchema = z.object({
  contractId: z.string().min(1, "Selecciona un contrato"),
  type: z.enum(["lease_expiration", "payment_default", "maintenance_request", "contract_violation", "rent_increase"]),
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  description: z.string().min(10, "Descripción insuficiente (mínimo 10 caracteres)"),
  dueDate: z.string().optional(),
});

export type NoticeCreateSchema = z.infer<typeof noticeCreateSchema>;
