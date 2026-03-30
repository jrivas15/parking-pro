import apiService from "services/api.service";
import {PaymentFormData} from "../schemas/payment.schema";
import { SaleReceipt } from "../types/sale.type";


export const newSale = async (data: PaymentFormData): Promise<SaleReceipt> => {
    const response = await apiService.post("/sales/checkout/", data);
    return response.data;
}

export const getRecentSales = async (): Promise<SaleReceipt[]> => {
    const response = await apiService.get("/sales/recent_sales/");
    return response.data;
}
