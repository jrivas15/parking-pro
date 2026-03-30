export interface RangeReport {
    total_sales: number;
    total_income: number;
    total_tax: number;
    total_subtotal: number;
    total_discount: number;
    start_date: string;
    end_date: string;
}

export interface ReportByUser {
    user__id: number;
    user__username: string;
    total_sales: number;
    total_income: number;
}

export interface ReportByPaymentMethod {
    paymentMethod__id: number;
    paymentMethod__name: string;
    total_sales: number;
    total_income: number;
}
