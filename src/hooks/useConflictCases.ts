import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "../api/http";
import type { ConflictCase, PaginatedResponse } from "../api/types";

const CONFLICT_CASES_QUERY_KEY = ["conflict-cases"];

export const useConflictCases = (filters?: {
  severity?: string;
  status?: string;
}) => {
  return useQuery({
    queryKey: [...CONFLICT_CASES_QUERY_KEY, filters],
    queryFn: async () => {
      const params = filters || {};
      const response = await http.get<PaginatedResponse<ConflictCase>>(
        "/conflicts",
        { params },
      );
      return response.data;
    },
  });
};

export const useConflictCase = (caseId: string) => {
  return useQuery({
    queryKey: [...CONFLICT_CASES_QUERY_KEY, caseId],
    queryFn: async () => {
      const response = await http.get<ConflictCase>(`/conflicts/${caseId}`);
      return response.data;
    },
    enabled: !!caseId,
  });
};

export const useResolveConflictCase = (caseId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (action: "resolve" | "escalate") => {
      const response = await http.patch<ConflictCase>(`/conflicts/${caseId}`, {
        action,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONFLICT_CASES_QUERY_KEY });
    },
  });
};

/**
 * Hook to request AI analysis/mediation for a contract
 * The backend would trigger AI analysis and create a ConflictCase if issues are detected
 */
export const useRequestAIAnalysis = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (contractId: string) => {
      const response = await http.post<ConflictCase>(
        `/conflicts/analyze/${contractId}`,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONFLICT_CASES_QUERY_KEY });
    },
  });
};
