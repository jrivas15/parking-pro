import apiService from "services/api.service";
import { PaymentMethodFormData } from "../schemas/paymentMethod.schema";
import { PaymentMethod } from "../types/paymentMethod.type";

export const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
    const response = await apiService.get("/payment-methods/");
    return response.data;
};

export const newPaymentMethod = async (data: PaymentMethodFormData): Promise<PaymentMethod> => {
    const response = await apiService.post("/payment-methods/", data);
    return response.data;
};

export const updatePaymentMethod = async (id: number, data: PaymentMethodFormData) => {
    const response = await apiService.put(`/payment-methods/${id}/`, data);
    return response.data;
};

export const deletePaymentMethod = async (id: number) => {
    const response = await apiService.delete(`/payment-methods/${id}/`);
    return response.data;
};
