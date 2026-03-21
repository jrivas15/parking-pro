import { Movement } from "@/dashboard/parking/types/movements.type";
import {PaymentMethod} from "@/dashboard/settings/paymentMethods/types/paymentMethod.type";
export interface SaleWithMovement {
    id: number;
    movement: Movement;
    discount: number;
    taxPercent: number;
    subtotal: number;
    taxValue: number;
    total: number;
    amountPaid: number;
    paymentMethod: PaymentMethod | null;
    paymentMethod1: PaymentMethod | null;
    paymentMethod2: PaymentMethod | null;
    item: string | null;
    user: number | null;
    additionalNote: string | null;
    paymentMethodValue1: number | null;
    paymentMethodValue2: number | null;
    customerID: number | null;
    saleReport: number | null;
}

export interface BalanceData {
    sales: SaleWithMovement[];
    stats: {
        nSales: number;
        totalTax: number;
        totalDiscount: number;
        totalSales: number;
        totalSubtotal: number;
        byPaymentMethod: PaymentMethodSummary[];
        byPaymentMethod1: PaymentMethodSummary[];
        byPaymentMethod2: PaymentMethodSummary[];
    }
}
export interface PaymentMethodSummary {
    nSales: number;
    paymentMethod__id: number;
    paymentMethod__name: string;
    total: number;

}

export interface BalanceFilters {
    userID?: number;
    dateFrom?: string;
    dateTo?: string;
    paymentMethodId?: string;
    vehicleType?: string;
    tariffId?: string;
}