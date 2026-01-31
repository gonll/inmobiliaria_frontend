import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "../api/http";
import type { Payment, PaginatedResponse } from "../api/types";
import type { PaymentCreateSchema } from "../forms/schemas";

const PAYMENTS_QUERY_KEY = ["payments"];

export const usePayments = (contractId?: string, filters?: { status?: string }) => {
  return useQuery({
    queryKey: [...PAYMENTS_QUERY_KEY, contractId, filters],
    queryFn: async () => {
      const params = {
        ...(contractId && { contractId }),
        ...filters,
      };
      const response = await http.get<PaginatedResponse<Payment>>(
        "/payments",
        { params },
      );
      return response.data;
    },
  });
};

export const usePayment = (paymentId: string) => {
  return useQuery({
    queryKey: [...PAYMENTS_QUERY_KEY, paymentId],
    queryFn: async () => {
      const response = await http.get<Payment>(`/payments/${paymentId}`);
      return response.data;
    },
    enabled: !!paymentId,
  });
};

export const useRegisterPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: PaymentCreateSchema) => {
      const response = await http.post<Payment>("/payments", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAYMENTS_QUERY_KEY });
    },
  });
};

export const useUpdatePaymentStatus = (paymentId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (status: "paid" | "pending" | "cancelled") => {
      const response = await http.patch<Payment>(`/payments/${paymentId}`, {
        status,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAYMENTS_QUERY_KEY });
    },
  });
};
