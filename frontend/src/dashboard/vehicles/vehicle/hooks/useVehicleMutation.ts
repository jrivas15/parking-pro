import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sileo } from "sileo";
import { VehicleFormData } from "../schemas/vehicle.schema";
import { Vehicle } from "../types/vehicle.type";

const useVehicleMutation = () => {
  const queryClient = useQueryClient();

  // ─── Helpers para manipular test data ──────────────────────────────────────
  const getList = (): Vehicle[] =>
    queryClient.getQueryData<Vehicle[]>(["vehicles"]) ?? [];

  const newVehicleMutation = useMutation({
    mutationFn: async (data: VehicleFormData): Promise<Vehicle> => {
      // TODO: reemplazar con newVehicle(data) cuando esté el API
      const list = getList();
      const next: Vehicle = { ...data, id: Date.now() };
      queryClient.setQueryData<Vehicle[]>(["vehicles"], [...list, next]);
      return next;
    },
    onSuccess: () => {
      sileo.success({ title: "Vehículos", description: "Vehículo registrado exitosamente" });
    },
    onError: () => {
      sileo.error({ title: "Vehículos", description: "Error al registrar el vehículo" });
    },
  });

  const updateVehicleMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: VehicleFormData }): Promise<Vehicle> => {
      // TODO: reemplazar con updateVehicle(id, data) cuando esté el API
      const list = getList();
      const updated: Vehicle = { ...data, id };
      queryClient.setQueryData<Vehicle[]>(
        ["vehicles"],
        list.map((v) => (v.id === id ? updated : v)),
      );
      return updated;
    },
    onSuccess: () => {
      sileo.success({ title: "Vehículos", description: "Vehículo actualizado exitosamente" });
    },
    onError: () => {
      sileo.error({ title: "Vehículos", description: "Error al actualizar el vehículo" });
    },
  });

  const deleteVehicleMutation = useMutation({
    mutationFn: async (id: number): Promise<void> => {
      // TODO: reemplazar con deleteVehicle(id) cuando esté el API
      const list = getList();
      queryClient.setQueryData<Vehicle[]>(
        ["vehicles"],
        list.filter((v) => v.id !== id),
      );
    },
    onSuccess: () => {
      sileo.success({ title: "Vehículos", description: "Vehículo eliminado exitosamente" });
    },
    onError: () => {
      sileo.error({ title: "Vehículos", description: "Error al eliminar el vehículo" });
    },
  });

  return { newVehicleMutation, updateVehicleMutation, deleteVehicleMutation };
};

export default useVehicleMutation;
