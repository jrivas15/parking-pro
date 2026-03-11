import apiService from "services/api.service";
import {PaymentFormData} from "../schemas/payment.schema";
import { Sale } from "../types/sale.type";


export const newSale = async (data: PaymentFormData):Promise<Sale> => {
    const response = await apiService.post("/sales/checkout/", data);
    return response.data;
}
