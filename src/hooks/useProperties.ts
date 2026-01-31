import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "../api/http";
import type { Property, PaginatedResponse } from "../api/types";
import type { PropertyCreateSchema } from "../forms/schemas";

const PROPERTIES_QUERY_KEY = ["properties"];

export const useProperties = () => {
  return useQuery({
    queryKey: PROPERTIES_QUERY_KEY,
    queryFn: async () => {
      const response = await http.get<PaginatedResponse<Property>>(
        "/properties",
      );
      return response.data;
    },
  });
};

export const useProperty = (propertyId: string) => {
  return useQuery({
    queryKey: [...PROPERTIES_QUERY_KEY, propertyId],
    queryFn: async () => {
      const response = await http.get<Property>(`/properties/${propertyId}`);
      return response.data;
    },
    enabled: !!propertyId,
  });
};

export const useCreateProperty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: PropertyCreateSchema) => {
      const response = await http.post<Property>("/properties", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROPERTIES_QUERY_KEY });
    },
  });
};

export const useUpdateProperty = (propertyId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<PropertyCreateSchema>) => {
      const response = await http.patch<Property>(
        `/properties/${propertyId}`,
        data,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROPERTIES_QUERY_KEY });
    },
  });
};
