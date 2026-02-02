import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { buildingsApi, type BuildingCreateSchema } from "../api/buildings";

const BUILDINGS_QUERY_KEY = ["buildings"];

export const useBuildings = () => {
  return useQuery({
    queryKey: BUILDINGS_QUERY_KEY,
    queryFn: () => buildingsApi.getBuildings(),
  });
};

export const useBuilding = (buildingId: string) => {
  return useQuery({
    queryKey: [...BUILDINGS_QUERY_KEY, buildingId],
    queryFn: () => buildingsApi.getBuilding(buildingId),
    enabled: !!buildingId,
  });
};

export const useCreateBuilding = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BuildingCreateSchema) =>
      buildingsApi.createBuilding(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUILDINGS_QUERY_KEY });
    },
  });
};

export const useUpdateBuilding = (buildingId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<BuildingCreateSchema>) =>
      buildingsApi.updateBuilding(buildingId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUILDINGS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...BUILDINGS_QUERY_KEY, buildingId],
      });
    },
  });
};

export const useDeleteBuilding = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (buildingId: string) =>
      buildingsApi.deleteBuilding(buildingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUILDINGS_QUERY_KEY });
    },
  });
};
