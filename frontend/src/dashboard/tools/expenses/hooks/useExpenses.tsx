import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { Expense } from "../types/expenses.type";
import useExpensesQuery from "./useExpensesQuery";
import useExpensesMutation from "./useExpensesMutation";
import usePaymentMethodsQuery from "@/dashboard/settings/paymentMethods/hooks/usePaymentMethodsQuery";
import useParkingInfoQuery from "@/dashboard/settings/parkingInfo/hooks/useParkingInfoQuery";
import { usePrinterPreferences } from "@/hooks/usePrinterPreferences";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Printer, Trash2 } from "lucide-react";

export const formatMoney = (value: number) => '$' + value.toLocaleString('es-CO');

const toExpenseItem = (e: Expense): ExpenseItem => ({
    id: e.id,
    description: e.description,
    value: e.value,
    paymentMethod: e.paymentMethod?.name ?? null,
    expenseType: e.expenseType ?? null,
});

const useExpenses = () => {
    const { expensesQuery } = useExpensesQuery();
    const mutation = useExpensesMutation();
    const { listPaymentMethods: paymentMethods } = usePaymentMethodsQuery();
    const { parkingInfoQuery } = useParkingInfoQuery();
    const { prefs } = usePrinterPreferences();

    const [openFormDialog, setOpenFormDialog] = useState(false);

    const expenses = expensesQuery.data || [];
    const isLoading = expensesQuery.isLoading;
    const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.value), 0);

    const getPrintInfo = () => {
        const info = parkingInfoQuery.data;
        if (!info) return null;
        return { ...info, printerName: prefs.printerName, paperWidth: prefs.paperWidth };
    };

    const printExpense = (expense: Expense) => {
        const info = getPrintInfo();
        if (!info) return;
        window.electronAPI?.printExpense({ expense: toExpenseItem(expense), info });
    };

    const printSummary = () => {
        const info = getPrintInfo();
        if (!info) return;
        window.electronAPI?.printExpensesSummary({
            expenses: expenses.map(toExpenseItem),
            total: totalExpenses,
            info,
        });
    };

    const columns: ColumnDef<Expense>[] = [
        {
            accessorKey: "id",
            header: "ID",
        },
        {
            accessorKey: "description",
            header: "Descripción",
        },
        {
            accessorKey: "expenseType",
            header: "Tipo",
            cell: (info) => {
                const type = info.getValue() as string | null;
                return type ? <Badge variant="secondary">{type}</Badge> : <span className="text-muted-foreground">—</span>;
            },
        },
        {
            accessorKey: "value",
            header: "Valor",
            cell: (info) => formatMoney(info.getValue() as number),
        },
        {
            accessorKey: "paymentMethod.name",
            header: "Método de pago",
            cell: (info) => {
                const name = info.getValue() as string;
                return name ? <Badge variant="outline">{name}</Badge> : <span className="text-muted-foreground">—</span>;
            },
        },
        {
            header: "Acciones",
            cell: (info) => {
                const expense = info.row.original;
                return (
                    <div className="flex gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => printExpense(expense)}
                        >
                            <Printer size={14} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => mutation.handleDeleteExpense(expense.id)}
                            disabled={mutation.isDeleting}
                        >
                            <Trash2 size={14} />
                        </Button>
                    </div>
                );
            },
        },
    ];

    return {
        columns,
        expenses,
        isLoading,
        totalExpenses,
        paymentMethods,
        openFormDialog,
        setOpenFormDialog,
        printSummary,
        ...mutation,
    };
};

export default useExpenses;
