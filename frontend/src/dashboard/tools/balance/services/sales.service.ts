import apiService from "services/api.service";
import { BalanceData } from "../types/sales.type";
import dayjs from "dayjs";

export interface SalesFilters {
    userID?: number;
    dateFrom?: string;
    dateTo?: string;
    paymentMethodId?: string;
    vehicleType?: string;
    tariffId?: string;
}

const buildParams = (filters: SalesFilters): URLSearchParams => {
    const params = new URLSearchParams();
    if (filters.userID) params.append("userID", filters.userID.toString());
    if (filters.dateFrom) params.append("dateFrom", filters.dateFrom);
    if (filters.dateTo) params.append("dateTo", filters.dateTo);
    if (filters.paymentMethodId && filters.paymentMethodId !== "all") params.append("paymentMethodID", filters.paymentMethodId);
    if (filters.vehicleType && filters.vehicleType !== "all") params.append("vehicleType", filters.vehicleType);
    if (filters.tariffId) params.append("tariffID", filters.tariffId);
    return params;
}

export const getOpenSales = async (filters: SalesFilters): Promise<BalanceData> => {
    const params = buildParams(filters);
    const response = await apiService.get(`/sales/open_sales/?${params.toString()}`);
    return response.data;
}



export const closeSales = async (filters: SalesFilters, note?: string): Promise<void> => {
    const params = buildParams(filters);
    await apiService.post(`/sales/close_sales/?${params.toString()}`, { note: note ?? "" });
}

export const changeSalePaymentMethod = async (saleId: number, paymentMethodId: number): Promise<void> => {
    await apiService.patch(`/sales/${saleId}/`, { paymentMethod: paymentMethodId });
}

export const transferSale = async (saleId: number, userId: number): Promise<void> => {
    await apiService.patch(`/sales/${saleId}/`, { user: userId });
}

