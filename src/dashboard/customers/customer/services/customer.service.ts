import apiService from "services/api.service";
import { CustomerFormData } from "../schemas/customer.schema";
import { Customer } from "../types/customer.type";

export const getCustomers = async (): Promise<Customer[]> => {
  const response = await apiService.get("/clients/");
  return response.data;
};

export const newCustomer = async (data: CustomerFormData): Promise<Customer> => {
  const response = await apiService.post("/clients/", data);
  return response.data;
};

export const updateCustomer = async (id: number, data: CustomerFormData): Promise<Customer> => {
  const response = await apiService.put(`/clients/${id}/`, data);
  return response.data;
};

export const deleteCustomer = async (id: number): Promise<void> => {
  const response = await apiService.delete(`/clients/${id}/`);
  return response.data;
};
