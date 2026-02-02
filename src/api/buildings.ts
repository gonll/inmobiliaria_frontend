import { z } from "zod";
import { http } from "./http";
import type { Property, PaginatedResponse } from "./types";

export const buildingCreateSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  address: z.string().min(5, "Introduce una dirección válida"),
  zipCode: z.string().min(3, "Código postal inválido"),
  city: z.string().min(2, "Ciudad inválida"),
  type: z.enum(["apartment", "house", "commercial", "land"]),
  bedrooms: z.coerce.number().min(0).optional(),
  bathrooms: z.coerce.number().min(0).optional(),
  squareMeters: z.coerce.number().min(1, "Metros cuadrados inválidos").optional(),
});

export type BuildingCreateSchema = z.infer<typeof buildingCreateSchema>;

export const buildingsApi = {
  async getBuildings(): Promise<PaginatedResponse<Property>> {
    const response = await http.get<PaginatedResponse<Property>>(
      "/buildings",
    );
    return response.data;
  },

  async getBuilding(buildingId: string): Promise<Property> {
    const response = await http.get<Property>(`/buildings/${buildingId}`);
    return response.data;
  },

  async createBuilding(data: BuildingCreateSchema): Promise<Property> {
    const response = await http.post<Property>("/buildings", data);
    return response.data;
  },

  async updateBuilding(
    buildingId: string,
    data: Partial<BuildingCreateSchema>,
  ): Promise<Property> {
    const response = await http.patch<Property>(
      `/buildings/${buildingId}`,
      data,
    );
    return response.data;
  },

  async deleteBuilding(buildingId: string): Promise<void> {
    await http.delete(`/buildings/${buildingId}`);
  },
};
