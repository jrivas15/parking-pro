import apiService from "services/api.service";
import { TaxFormData } from "../schemas/tax.schema";
import { Tax } from "../types/tax.type";

export const getTaxes = async (): Promise<Tax[]> => {
    const response = await apiService.get("/taxes/");
    return response.data;
};

export const newTax = async (data: TaxFormData): Promise<Tax> => {
    const response = await apiService.post("/taxes/", data);
    return response.data;
};

export const updateTax = async (id: number, data: TaxFormData): Promise<Tax> => {
    const response = await apiService.put(`/taxes/${id}/`, data);
    return response.data;
};

export const deleteTax = async (id: number) => {
    const response = await apiService.delete(`/taxes/${id}/`);
    return response.data;
};
