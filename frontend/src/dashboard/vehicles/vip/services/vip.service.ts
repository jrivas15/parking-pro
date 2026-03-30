import apiService from "services/api.service";
import { Vip, VipFormData } from "../types/vip.type";

export const getVips = async (): Promise<Vip[]> => {
  const response = await apiService.get("/vip/");
  return response.data;
};

export const newVip = async (data: VipFormData): Promise<Vip> => {
  const response = await apiService.post("/vip/", data);
  return response.data;
};

export const updateVip = async (id: number, data: VipFormData): Promise<Vip> => {
  const response = await apiService.put(`/vip/${id}/`, data);
  return response.data;
};

export const deleteVip = async (id: number): Promise<void> => {
  await apiService.delete(`/vip/${id}/`);
};
