import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sileo } from "sileo";
import { deletePaymentMethod, newPaymentMethod, updatePaymentMethod } from "../services/paymentMethods.service";
import { PaymentMethodFormData } from "../schemas/paymentMethod.schema";

const usePaymentMethodMutation = () => {
    const queryClient = useQueryClient();

    const newPaymentMethodMutation = useMutation({
        mutationFn: newPaymentMethod,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
            sileo.success({ title: "Métodos de pago", description: "Método de pago creado exitosamente" });
        },
        onError: () => {
            sileo.error({ title: "Métodos de pago", description: "Error al crear el método de pago" });
        },
    });

    const updatePaymentMethodMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: PaymentMethodFormData }) => updatePaymentMethod(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
            sileo.success({ title: "Métodos de pago", description: "Método de pago actualizado exitosamente" });
        },
        onError: () => {
            sileo.error({ title: "Métodos de pago", description: "Error al actualizar el método de pago" });
        },
    });

    const deletePaymentMethodMutation = useMutation({
        mutationFn: deletePaymentMethod,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
            sileo.success({ title: "Métodos de pago", description: "Método de pago eliminado exitosamente" });
        },
        onError: () => {
            sileo.error({ title: "Métodos de pago", description: "Error al eliminar el método de pago" });
        },
    });

    return {
        newPaymentMethodMutation,
        updatePaymentMethodMutation,
        deletePaymentMethodMutation,
    };
};

export default usePaymentMethodMutation;
