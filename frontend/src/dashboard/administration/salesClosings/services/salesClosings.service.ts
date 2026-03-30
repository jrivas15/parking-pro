import apiService from "services/api.service";
import type { SalesClosing } from "../types/salesClosing.type";
import type { SaleWithMovement } from "@/dashboard/tools/balance/types/sales.type";
import type { ReportByPaymentMethod } from "../../reports/types/report.type";

export interface ClosingFilters { year?: number; month?: number }

export const getSalesClosings = async (filters: ClosingFilters): Promise<SalesClosing[]> => {
    const response = await apiService.get("/sales-reports/", { params: filters });
    return response.data;
};

export const getSalesByReport = async (reportId: number): Promise<SaleWithMovement[]> => {
    const response = await apiService.get("/sales/by_report/", { params: { reportId } });
    return response.data;
};

export const getClosedByPaymentMethod = async (filters: ClosingFilters): Promise<ReportByPaymentMethod[]> => {
    const response = await apiService.get("/sales-reports/closed-by-payment-method/", { params: filters });
    return response.data;
};
