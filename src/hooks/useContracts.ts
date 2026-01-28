import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "../api/http";
import type { Contract, PaginatedResponse } from "../api/types";
import type { ContractCreateSchema } from "../forms/schemas";

const CONTRACTS_QUERY_KEY = ["contracts"];

export const useContracts = (propertyId?: string) => {
  return useQuery({
    queryKey: [...CONTRACTS_QUERY_KEY, propertyId],
    queryFn: async () => {
      const params = propertyId ? { propertyId } : {};
      const response = await http.get<PaginatedResponse<Contract>>(
        "/contracts",
        { params },
      );
      return response.data;
    },
  });
};

export const useContract = (contractId: string) => {
  return useQuery({
    queryKey: [...CONTRACTS_QUERY_KEY, contractId],
    queryFn: async () => {
      const response = await http.get<Contract>(`/contracts/${contractId}`);
      return response.data;
    },
    enabled: !!contractId,
  });
};

export const useCreateContract = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ContractCreateSchema) => {
      const response = await http.post<Contract>("/contracts", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONTRACTS_QUERY_KEY });
    },
  });
};

export const useUpdateContract = (contractId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<ContractCreateSchema>) => {
      const response = await http.patch<Contract>(
        `/contracts/${contractId}`,
        data,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONTRACTS_QUERY_KEY });
    },
  });
};
