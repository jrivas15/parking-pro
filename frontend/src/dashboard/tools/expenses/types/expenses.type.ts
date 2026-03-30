import { PaymentMethod } from "@/dashboard/settings/paymentMethods/types/paymentMethod.type";

export interface Expense {
    id: number;
    description: string;
    value: number;
    paymentMethod: PaymentMethod | null;
    saleReport: number | null;
}

export interface ExpenseFormData {
    description: string;
    value: number;
    paymentMethodID: number;
    saleReport?: number | null;
}
