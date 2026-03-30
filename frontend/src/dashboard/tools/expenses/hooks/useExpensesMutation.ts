import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createExpense, deleteExpense } from "../services/expenses.service";
import { ExpenseFormData } from "../types/expenses.type";
import { sileo } from "sileo";

const useExpensesMutation = () => {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: (data: ExpenseFormData) => createExpense(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["expenses"] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteExpense(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["expenses"] });
        },
    });

    const handleCreateExpense = (data: ExpenseFormData) => {
        sileo.promise(createMutation.mutateAsync(data), {
            loading: { title: "Creando gasto...", description: "Por favor espera" },
            success: { title: "Gasto creado", description: "El gasto fue registrado exitosamente" },
            error: { title: "Error", description: "No se pudo crear el gasto" },
        });
    };

    const handleDeleteExpense = (id: number) => {
        sileo.promise(deleteMutation.mutateAsync(id), {
            loading: { title: "Eliminando...", description: "Por favor espera" },
            success: { title: "Gasto eliminado", description: "El gasto fue eliminado exitosamente" },
            error: { title: "Error", description: "No se pudo eliminar el gasto" },
        });
    };

    return {
        handleCreateExpense,
        handleDeleteExpense,
        isCreating: createMutation.isPending,
        isDeleting: deleteMutation.isPending,
        createSuccess: createMutation.isSuccess,
    };
};

export default useExpensesMutation;
