import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "../api/http";
import type { Notice, PaginatedResponse } from "../api/types";
import type { NoticeCreateSchema } from "../forms/schemas";

const NOTICES_QUERY_KEY = ["notices"];

export const useNotices = (contractId?: string, filters?: { status?: string }) => {
  return useQuery({
    queryKey: [...NOTICES_QUERY_KEY, contractId, filters],
    queryFn: async () => {
      const params = {
        ...(contractId && { contractId }),
        ...filters,
      };
      const response = await http.get<PaginatedResponse<Notice>>(
        "/notices",
        { params },
      );
      return response.data;
    },
  });
};

export const useNotice = (noticeId: string) => {
  return useQuery({
    queryKey: [...NOTICES_QUERY_KEY, noticeId],
    queryFn: async () => {
      const response = await http.get<Notice>(`/notices/${noticeId}`);
      return response.data;
    },
    enabled: !!noticeId,
  });
};

export const useCreateNotice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: NoticeCreateSchema) => {
      const response = await http.post<Notice>("/notices", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTICES_QUERY_KEY });
    },
  });
};

export const useUpdateNoticeStatus = (noticeId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (status: "pending" | "acknowledged" | "resolved" | "escalated") => {
      const response = await http.patch<Notice>(`/notices/${noticeId}`, {
        status,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTICES_QUERY_KEY });
    },
  });
};
