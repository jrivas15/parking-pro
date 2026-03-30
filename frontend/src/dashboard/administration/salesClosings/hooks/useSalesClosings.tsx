import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSalesClosings, getSalesByReport, getClosedByPaymentMethod, ClosingFilters } from "../services/salesClosings.service";
import type { SalesClosing } from "../types/salesClosing.type";
import dayjs from "dayjs";

const useSalesClosings = () => {
    const currentYear = dayjs().year();
    const currentMonth = dayjs().month() + 1;

    const [filters, setFilters] = useState<ClosingFilters>({ year: currentYear, month: currentMonth });
    const [applied, setApplied] = useState<ClosingFilters>({ year: currentYear, month: currentMonth });
    const [selected, setSelected] = useState<SalesClosing | null>(null);

    const closingsQuery = useQuery({
        queryKey: ["sales-closings", applied],
        queryFn: () => getSalesClosings(applied),
    });

    const byPaymentMethodQuery = useQuery({
        queryKey: ["sales-closings-by-payment-method", applied],
        queryFn: () => getClosedByPaymentMethod(applied),
    });

    const salesQuery = useQuery({
        queryKey: ["sales-by-report", selected?.id],
        queryFn: () => getSalesByReport(selected!.id),
        enabled: !!selected,
    });

    const handleApply = () => {
        setApplied({
            year: filters.year,
            month: filters.month ? filters.month : undefined,
        });
        setSelected(null);
    };

    const handleSelect = (closing: SalesClosing) => {
        setSelected((prev) => (prev?.id === closing.id ? null : closing));
    };

    return {
        filters,
        setFilters,
        handleApply,
        currentYear,
        closings: closingsQuery.data ?? [],
        isLoading: closingsQuery.isLoading,
        byPaymentMethod: byPaymentMethodQuery.data ?? [],
        selected,
        handleSelect,
        reportSales: salesQuery.data ?? [],
        isLoadingSales: salesQuery.isLoading,
    };
};

export default useSalesClosings;
