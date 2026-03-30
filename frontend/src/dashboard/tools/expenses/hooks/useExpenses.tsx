import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { Expense } from "../types/expenses.type";
import useExpensesQuery from "./useExpensesQuery";
import useExpensesMutation from "./useExpensesMutation";
import usePaymentMethodsQuery from "@/dashboard/settings/paymentMethods/hooks/usePaymentMethodsQuery";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export const formatMoney = (value: number) => '$' + value.toLocaleString('es-CO');

const useExpenses = () => {
    const { expensesQuery } = useExpensesQuery();
    const mutation = useExpensesMutation();
    const { listPaymentMethods: paymentMethods } = usePaymentMethodsQuery();

    const [openFormDialog, setOpenFormDialog] = useState(false);

    const expenses = expensesQuery.data || [];
    const isLoading = expensesQuery.isLoading;
    const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.value), 0);

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
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => mutation.handleDeleteExpense(expense.id)}
                        disabled={mutation.isDeleting}
                    >
                        <Trash2 size={14} />
                    </Button>
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
        ...mutation,
    };
};

export default useExpenses;
