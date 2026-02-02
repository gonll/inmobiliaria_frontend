import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "../api/http";
import type { Tenant, PaginatedResponse } from "../api/types";
import type { TenantCreateSchema } from "../forms/schemas";

const TENANTS_QUERY_KEY = ["tenants"];

export const useTenants = (filters?: { search?: string }) => {
  return useQuery({
    queryKey: [...TENANTS_QUERY_KEY, filters],
    queryFn: async () => {
      const params = filters || {};
      const response = await http.get<PaginatedResponse<Tenant>>(
        "/tenants",
        { params },
      );
      return response.data;
    },
  });
};

export const useTenant = (tenantId: string) => {
  return useQuery({
    queryKey: [...TENANTS_QUERY_KEY, tenantId],
    queryFn: async () => {
      const response = await http.get<Tenant>(`/tenants/${tenantId}`);
      return response.data;
    },
    enabled: !!tenantId,
  });
};

export const useCreateTenant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: TenantCreateSchema) => {
      const response = await http.post<Tenant>("/tenants", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TENANTS_QUERY_KEY });
    },
  });
};

export const useUpdateTenant = (tenantId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<TenantCreateSchema>) => {
      const response = await http.patch<Tenant>(`/tenants/${tenantId}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TENANTS_QUERY_KEY });
    },
  });
};
