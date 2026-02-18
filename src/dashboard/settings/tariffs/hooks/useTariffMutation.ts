import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteTariff, newTariff, updateTariff } from "../services/tariff.service"
import { TariffFormData } from "../schema/tariff.schema";
import { toast } from "sonner";

const useTariffMutation = () => {
    const queryClient = useQueryClient();

    const newTariffMutation = useMutation({
        mutationFn: newTariff,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tariffs'] });
            toast.success("Tarifa creada exitosamente");
        },
        onError: (error) => {
            toast.error("Error al crear la tarifa");
            console.error(error);
        }
    })

    const updateTariffMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: TariffFormData }) => updateTariff(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tariffs'] });
            toast.success("Tarifa actualizada exitosamente");
        },
        onError: (error) => {
            toast.error("Error al actualizar la tarifa");
            console.error(error);
        }
    })

    const deleteTariffMutation = useMutation({
        mutationFn: deleteTariff,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tariffs'] });
            toast.success("Tarifa eliminada exitosamente");
        },
        onError: (error) => {
            toast.error("Error al eliminar la tarifa");
            console.error(error);
        }
    })

    return { newTariffMutation, updateTariffMutation, deleteTariffMutation }
}

export default useTariffMutation
