import apiService from "services/api.service";
import type { RangeReport, ReportByUser, ReportByPaymentMethod } from "../types/report.type";

export const getRangeReport = async (startDate: string, endDate: string): Promise<RangeReport> => {
    const response = await apiService.get("/sales-reports/range/", {
        params: { start_date: startDate, end_date: endDate },
    });
    return response.data;
};

export const getReportByUser = async (startDate: string, endDate: string): Promise<ReportByUser[]> => {
    const response = await apiService.get("/sales-reports/by-user/", {
        params: { start_date: startDate, end_date: endDate },
    });
    return response.data;
};

export const getReportByPaymentMethod = async (startDate: string, endDate: string): Promise<ReportByPaymentMethod[]> => {
    const response = await apiService.get("/sales-reports/by-payment-method/", {
        params: { start_date: startDate, end_date: endDate },
    });
    return response.data;
};
