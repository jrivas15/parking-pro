import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sileo } from "sileo";
import { closeSales } from "../services/sales.service";
import { SalesFilters } from "../services/sales.service";
import useUsers from "@/dashboard/settings/users/hooks/useUsersQuery";

const useCloseSalesMutation = () => {
    const queryClient = useQueryClient();
    const { profile } = useUsers();

    const closeSalesMutation = useMutation({
        mutationFn: ({ filters, note }: { filters: SalesFilters; note?: string }) =>
            closeSales(filters, note),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sales"] });
        },
    });

    const handleCloseSales = (filters: SalesFilters, note?: string) => {
        const resolvedFilters: SalesFilters = {
            ...filters,
            userID: filters.userID ?? profile?.id,
        };
        sileo.promise(closeSalesMutation.mutateAsync({ filters: resolvedFilters, note }), {
            loading: { title: "Cerrando ventas..." },
            success: { title: "Ventas cerradas", description: "Las ventas fueron cerradas exitosamente" },
            error: { title: "Error", description: "Ocurrió un error al cerrar las ventas" },
        });
    };

    return {
        handleCloseSales,
        isClosing: closeSalesMutation.isPending,
    };
};

export default useCloseSalesMutation;
