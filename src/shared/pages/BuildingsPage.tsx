import React, { useState, useMemo } from "react";
import { useBuildings, useCreateBuilding } from "../../hooks/useBuildings";
import { buildingCreateSchema, type BuildingCreateSchema } from "../../api/buildings";
import type { Property } from "../../api/types";

export const BuildingsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<BuildingCreateSchema>>({
    type: "apartment",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const { data, isLoading, error } = useBuildings();
  const { mutate: createBuilding, isPending: isCreating } = useCreateBuilding();

  // Filter buildings by search query
  const filteredBuildings = useMemo(() => {
    if (!data?.data) return [];
    return data.data.filter((building) => {
      const query = searchQuery.toLowerCase();
      return (
        building.name.toLowerCase().includes(query) ||
        building.address.toLowerCase().includes(query) ||
        building.city.toLowerCase().includes(query)
      );
    });
  }, [data?.data, searchQuery]);

  const handleCreateBuilding = (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    try {
      const validated = buildingCreateSchema.parse(formData);
      createBuilding(validated, {
        onSuccess: () => {
          setIsModalOpen(false);
          setFormData({ type: "apartment" });
        },
      });
    } catch (err: any) {
      const errors: Record<string, string> = {};
      if (err.errors) {
        err.errors.forEach((e: any) => {
          const field = e.path[0];
          errors[field] = e.message;
        });
      }
      setFormErrors(errors);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-50">Edificios</h1>
          <p className="mt-1 text-sm text-slate-400">
            Gestiona tu cartera de propiedades
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
        >
          Crear
        </button>
      </div>

      {/* Search Bar */}
      <div>
        <input
          type="text"
          placeholder="Buscar por nombre, dirección o ciudad..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-legal-border bg-slate-800/50 px-3 py-2 text-sm text-slate-50 placeholder-slate-500 focus:border-legal-accent focus:outline-none transition-colors"
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex h-96 items-center justify-center">
          <p className="text-slate-400">Cargando edificios...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
          <p className="text-sm text-red-400">
            Error al cargar edificios: {error instanceof Error ? error.message : "Error desconocido"}
          </p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredBuildings.length === 0 && (
        <div className="flex h-96 flex-col items-center justify-center rounded-lg border border-dashed border-legal-border">
          <p className="text-slate-400">
            {searchQuery ? "No se encontraron edificios" : "No tienes edificios aún"}
          </p>
          {!searchQuery && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 text-sm text-brand-600 hover:text-brand-700 transition-colors"
            >
              Crea tu primer edificio
            </button>
          )}
        </div>
      )}

      {/* Buildings Grid */}
      {!isLoading && filteredBuildings.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBuildings.map((building) => (
            <BuildingCard key={building.id} building={building} />
          ))}
        </div>
      )}

      {/* Create Building Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-slate-900 p-6 border border-legal-border">
            <h2 className="text-xl font-semibold text-slate-50">Crear nuevo edificio</h2>
            <p className="mt-1 text-sm text-slate-400">
              Rellena los datos del edificio
            </p>

            <form onSubmit={handleCreateBuilding} className="mt-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-300">
                  Nombre
                </label>
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className={`mt-1 w-full rounded-lg border bg-slate-800 px-3 py-2 text-sm text-slate-50 focus:outline-none transition-colors ${
                    formErrors.name
                      ? "border-red-500/50 focus:border-red-500"
                      : "border-legal-border focus:border-legal-accent"
                  }`}
                />
                {formErrors.name && (
                  <p className="mt-1 text-xs text-red-400">{formErrors.name}</p>
                )}
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-slate-300">
                  Tipo
                </label>
                <select
                  value={formData.type || "apartment"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as BuildingCreateSchema["type"],
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-legal-border bg-slate-800 px-3 py-2 text-sm text-slate-50 focus:border-legal-accent focus:outline-none transition-colors"
                >
                  <option value="apartment">Apartamento</option>
                  <option value="house">Casa</option>
                  <option value="commercial">Comercial</option>
                  <option value="land">Terreno</option>
                </select>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-slate-300">
                  Dirección
                </label>
                <input
                  type="text"
                  value={formData.address || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className={`mt-1 w-full rounded-lg border bg-slate-800 px-3 py-2 text-sm text-slate-50 focus:outline-none transition-colors ${
                    formErrors.address
                      ? "border-red-500/50 focus:border-red-500"
                      : "border-legal-border focus:border-legal-accent"
                  }`}
                />
                {formErrors.address && (
                  <p className="mt-1 text-xs text-red-400">{formErrors.address}</p>
                )}
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-slate-300">
                  Ciudad
                </label>
                <input
                  type="text"
                  value={formData.city || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  className={`mt-1 w-full rounded-lg border bg-slate-800 px-3 py-2 text-sm text-slate-50 focus:outline-none transition-colors ${
                    formErrors.city
                      ? "border-red-500/50 focus:border-red-500"
                      : "border-legal-border focus:border-legal-accent"
                  }`}
                />
                {formErrors.city && (
                  <p className="mt-1 text-xs text-red-400">{formErrors.city}</p>
                )}
              </div>

              {/* Zip Code */}
              <div>
                <label className="block text-sm font-medium text-slate-300">
                  Código Postal
                </label>
                <input
                  type="text"
                  value={formData.zipCode || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, zipCode: e.target.value })
                  }
                  className={`mt-1 w-full rounded-lg border bg-slate-800 px-3 py-2 text-sm text-slate-50 focus:outline-none transition-colors ${
                    formErrors.zipCode
                      ? "border-red-500/50 focus:border-red-500"
                      : "border-legal-border focus:border-legal-accent"
                  }`}
                />
                {formErrors.zipCode && (
                  <p className="mt-1 text-xs text-red-400">{formErrors.zipCode}</p>
                )}
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block text-sm font-medium text-slate-300">
                  Dormitorios
                </label>
                <input
                  type="number"
                  value={formData.bedrooms || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bedrooms: e.target.value ? parseInt(e.target.value) : undefined,
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-legal-border bg-slate-800 px-3 py-2 text-sm text-slate-50 focus:border-legal-accent focus:outline-none transition-colors"
                />
              </div>

              {/* Bathrooms */}
              <div>
                <label className="block text-sm font-medium text-slate-300">
                  Baños
                </label>
                <input
                  type="number"
                  value={formData.bathrooms || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bathrooms: e.target.value ? parseInt(e.target.value) : undefined,
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-legal-border bg-slate-800 px-3 py-2 text-sm text-slate-50 focus:border-legal-accent focus:outline-none transition-colors"
                />
              </div>

              {/* Square Meters */}
              <div>
                <label className="block text-sm font-medium text-slate-300">
                  Metros Cuadrados
                </label>
                <input
                  type="number"
                  value={formData.squareMeters || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      squareMeters: e.target.value ? parseInt(e.target.value) : undefined,
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-legal-border bg-slate-800 px-3 py-2 text-sm text-slate-50 focus:border-legal-accent focus:outline-none transition-colors"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setFormData({ type: "apartment" });
                    setFormErrors({});
                  }}
                  className="flex-1 rounded-lg border border-legal-border bg-slate-800 px-4 py-2 text-sm font-medium text-slate-50 hover:bg-slate-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isCreating ? "Creando..." : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

interface BuildingCardProps {
  building: Property;
}

const BuildingCard: React.FC<BuildingCardProps> = ({ building }) => {
  const typeLabels: Record<string, string> = {
    apartment: "Apartamento",
    house: "Casa",
    commercial: "Comercial",
    land: "Terreno",
  };

  return (
    <div className="card group cursor-pointer transition-all hover:border-legal-accent/50">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-50 group-hover:text-legal-accent transition-colors">
            {building.name}
          </h3>
          <p className="mt-1 text-xs text-slate-400 line-clamp-1">
            {building.address}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="inline-block rounded-full bg-slate-700/50 px-2 py-1 text-[11px] font-medium text-slate-300">
              {typeLabels[building.type]}
            </span>
            <span className="inline-block rounded-full bg-slate-700/50 px-2 py-1 text-[11px] font-medium text-slate-300">
              {building.city}
            </span>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      {(building.bedrooms || building.bathrooms || building.squareMeters) && (
        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-legal-border pt-4">
          {building.bedrooms !== undefined && (
            <div className="text-center">
              <p className="text-xs text-slate-400">Dormitorios</p>
              <p className="text-sm font-semibold text-slate-50">
                {building.bedrooms}
              </p>
            </div>
          )}
          {building.bathrooms !== undefined && (
            <div className="text-center">
              <p className="text-xs text-slate-400">Baños</p>
              <p className="text-sm font-semibold text-slate-50">
                {building.bathrooms}
              </p>
            </div>
          )}
          {building.squareMeters !== undefined && (
            <div className="text-center">
              <p className="text-xs text-slate-400">m²</p>
              <p className="text-sm font-semibold text-slate-50">
                {building.squareMeters}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
