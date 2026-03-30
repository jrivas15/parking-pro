import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sileo } from "sileo";
import { VehicleFormData } from "../schemas/vehicle.schema";
import { newVehicle, updateVehicle, deleteVehicle } from "../services/vehicles.service";

const useVehicleMutation = () => {
  const queryClient = useQueryClient();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["vehicles"] });

  const newVehicleMutation = useMutation({
    mutationFn: (data: VehicleFormData) => newVehicle(data),
    onSuccess: () => {
      invalidate();
      sileo.success({ title: "Vehículos", description: "Vehículo registrado exitosamente" });
    },
    onError: () => {
      sileo.error({ title: "Vehículos", description: "Error al registrar el vehículo" });
    },
  });

  const updateVehicleMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: VehicleFormData }) => updateVehicle(id, data),
    onSuccess: () => {
      invalidate();
      sileo.success({ title: "Vehículos", description: "Vehículo actualizado exitosamente" });
    },
    onError: () => {
      sileo.error({ title: "Vehículos", description: "Error al actualizar el vehículo" });
    },
  });

  const deleteVehicleMutation = useMutation({
    mutationFn: (id: number) => deleteVehicle(id),
    onSuccess: () => {
      invalidate();
      sileo.success({ title: "Vehículos", description: "Vehículo eliminado exitosamente" });
    },
    onError: () => {
      sileo.error({ title: "Vehículos", description: "Error al eliminar el vehículo" });
    },
  });

  return { newVehicleMutation, updateVehicleMutation, deleteVehicleMutation };
};

export default useVehicleMutation;
