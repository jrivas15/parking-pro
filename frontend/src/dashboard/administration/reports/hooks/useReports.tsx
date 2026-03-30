import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DateRange } from "react-day-picker";
import dayjs from "dayjs";
import { getRangeReport, getReportByUser, getReportByPaymentMethod } from "../services/reports.service";

const useReports = () => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: dayjs().startOf("month").toDate(),
        to: new Date(),
    });
    const [appliedRange, setAppliedRange] = useState({
        from: dayjs().startOf("month").format("YYYY-MM-DD"),
        to: dayjs().format("YYYY-MM-DD"),
    });

    const startDate = appliedRange.from;
    const endDate = appliedRange.to;

    const rangeQuery = useQuery({
        queryKey: ["reports", "range", startDate, endDate],
        queryFn: () => getRangeReport(startDate, endDate),
    });

    const byUserQuery = useQuery({
        queryKey: ["reports", "by-user", startDate, endDate],
        queryFn: () => getReportByUser(startDate, endDate),
    });

    const byPaymentMethodQuery = useQuery({
        queryKey: ["reports", "by-payment-method", startDate, endDate],
        queryFn: () => getReportByPaymentMethod(startDate, endDate),
    });

    const handleApply = () => {
        if (!dateRange?.from) return;
        setAppliedRange({
            from: dayjs(dateRange.from).format("YYYY-MM-DD"),
            to: dayjs(dateRange.to ?? dateRange.from).format("YYYY-MM-DD"),
        });
    };

    const isLoading = rangeQuery.isLoading || byUserQuery.isLoading || byPaymentMethodQuery.isLoading;

    return {
        dateRange,
        setDateRange,
        appliedRange,
        handleApply,
        isLoading,
        summary: rangeQuery.data,
        byUser: byUserQuery.data ?? [],
        byPaymentMethod: byPaymentMethodQuery.data ?? [],
    };
};

export default useReports;
