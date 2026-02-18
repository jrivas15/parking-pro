import apiService from "services/api.service";
import { TariffFormData } from "../schema/tariff.schema";
import { Tariff } from "../types/tariff.type";


export const newTariff = async (data: TariffFormData) => {
    const response = await apiService.post<Tariff>("/tariffs/", data);

    return response.data;
}

export const updateTariff = async (id: number, data: TariffFormData) => {
    const response = await apiService.put<Tariff>(`/tariffs/${id}/`, data);
    return response.data;
}

export const deleteTariff = async (id: number) => {
    const response = await apiService.delete<void>(`/tariffs/${id}/`);
    return response.data;
}

export const getTariffs = async () => {
    const response = await apiService.get("/tariffs/");
    return response.data;
}

export const getTariffById = async (id: number) => {
    const response = await apiService.get(`/tariffs/${id}`);
    return response.data;
}