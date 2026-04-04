import PageLayout from "@/layouts/PageLayout";
import { Button } from "@/components/ui/button";
import { Plus, Printer, TrendingDown } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import BackBtn from "@/components/shared/BackBtn";
import { DataTable } from "@/components/shared/DataTable";
import SummaryCard from "@/components/shared/SummaryCard";
import useExpenses, { formatMoney } from "./hooks/useExpenses";
import ExpenseFormDialog from "./ExpenseFormDialog";

const ExpensesPage = () => {
    const {
        columns,
        expenses,
        isLoading,
        totalExpenses,
        paymentMethods,
        openFormDialog,
        setOpenFormDialog,
        printSummary,
        handleCreateExpense,
        isCreating,
        createSuccess,
    } = useExpenses();

    return (
        <PageLayout>
            <div className="flex flex-col gap-4 flex-1 min-h-0 overflow-hidden">
                <header className="flex justify-between items-center">
                    <div className="flex">
                        <BackBtn />
                        <div>
                            <h1 className="text-2xl font-bold">Gastos</h1>
                            <span className="text-sm text-muted-foreground">
                                Registra los gastos asociados al reporte de ventas
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={printSummary}
                            disabled={expenses.length === 0}
                        >
                            <Printer size={16} />
                            Imprimir resumen
                        </Button>
                        <Button
                            onClick={() => setOpenFormDialog(true)}
                            className="bg-primary text-black hover:bg-primary/90 font-semibold gap-2"
                        >
                            <Plus size={16} />
                            Nuevo gasto
                        </Button>
                    </div>
                </header>
                <Separator className="my-2" />

                <div className="flex gap-3">
                    <SummaryCard
                        label="Total gastos"
                        value={formatMoney(totalExpenses)}
                        sub={`${expenses.length} ${expenses.length === 1 ? "gasto" : "gastos"}`}
                        subIcon={<TrendingDown size={12} />}
                        subColor="text-red-500"
                    />
                </div>

                <DataTable columns={columns} data={expenses} />
            </div>

            <ExpenseFormDialog
                open={openFormDialog}
                setOpen={setOpenFormDialog}
                paymentMethods={paymentMethods}
                onSubmit={handleCreateExpense}
                isCreating={isCreating}
                createSuccess={createSuccess}
            />
        </PageLayout>
    );
};

export default ExpensesPage;
