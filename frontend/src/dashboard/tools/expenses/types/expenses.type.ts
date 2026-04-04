import { PaymentMethod } from "@/dashboard/settings/paymentMethods/types/paymentMethod.type";

export const EXPENSE_TYPES = ['Compra', 'Nómina', 'Pago', 'Otro'] as const;
export type ExpenseType = typeof EXPENSE_TYPES[number];

export interface Expense {
    id: number;
    description: string;
    value: number;
    expenseType: ExpenseType | null;
    paymentMethod: PaymentMethod | null;
    saleReport: number | null;
}

export interface ExpenseFormData {
    description: string;
    value: number;
    expenseType: ExpenseType;
    paymentMethodID: number;
    saleReport?: number | null;
}
