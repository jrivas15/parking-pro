export interface Sale {
    id: number;
    movement: number;
    discount: number;
    taxPercent: number;
    subtotal: number;
    taxValue: number;
    total: number;
    amountPaid: number;
    paymentMethod: number | null;
    paymentMethod1: number | null;
    paymentMethod2: number | null;
    item: string | null;
    user: number | null;
    additionalNote: string | null;
    paymentMethodValue1: number | null;
    paymentMethodValue2: number | null;
    customerID: number | null;
    saleReport: number | null;
}