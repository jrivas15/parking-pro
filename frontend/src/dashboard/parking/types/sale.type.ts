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

export interface SaleReceipt {
    id: number;
    movement: {
        id: number;
        nTicket: number;
        plate: string;
        entryTime: string;
        exitTime: string;
        parkingTime: string;
        vehicleType: string;
        tariff: { id: number; name: string } | null;
    };
    discount: number;
    taxPercent: number;
    subtotal: number;
    taxValue: number;
    total: number;
    amountPaid: number;
    paymentMethod: { id: number; name: string } | null;
    paymentMethod1: { id: number; name: string } | null;
    paymentMethod2: { id: number; name: string } | null;
    item: string | null;
    user: number | null;
    additionalNote: string | null;
    paymentMethodValue1: number | null;
    paymentMethodValue2: number | null;
    customerID: number | null;
    saleReport: number | null;
}
