import apiService from "services/api.service";
import { Expense, ExpenseFormData } from "../types/expenses.type";

export const getExpenses = async (): Promise<Expense[]> => {
    const response = await apiService.get(`/expenses/`);
    return response.data;
};

export const createExpense = async (data: ExpenseFormData): Promise<Expense> => {
    const response = await apiService.post(`/expenses/`, {
        description: data.description,
        value: data.value,
        paymentMethodId: data.paymentMethodID,
        saleReport: data.saleReport ?? null,
    });
    return response.data;
};

export const deleteExpense = async (id: number): Promise<void> => {
    await apiService.delete(`/expenses/${id}/`);
};
