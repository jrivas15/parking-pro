import apiService from "services/api.service";
import { VehicleFormData } from "../schemas/vehicle.schema";
import { Vehicle } from "../types/vehicle.type";

export const getVehicles = async (): Promise<Vehicle[]> => {
  const response = await apiService.get("/vehicles/");
  return response.data;
};

export const newVehicle = async (data: VehicleFormData): Promise<Vehicle> => {
  const response = await apiService.post("/vehicles/", data);
  return response.data;
};

export const updateVehicle = async (id: number, data: VehicleFormData): Promise<Vehicle> => {
  const response = await apiService.put(`/vehicles/${id}/`, data);
  return response.data;
};

export const deleteVehicle = async (id: number): Promise<void> => {
  const response = await apiService.delete(`/vehicles/${id}/`);
  return response.data;
};
