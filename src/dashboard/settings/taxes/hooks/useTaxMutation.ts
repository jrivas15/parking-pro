import { useMutation, useQueryClient } from "@tanstack/react-query";
import { newTax, updateTax, deleteTax } from "../services/taxes.service";
import { TaxFormData } from "../schemas/tax.schema";
import { sileo } from "sileo";

const useTaxMutation = () => {
    const queryClient = useQueryClient();

    const newTaxMutation = useMutation({
        mutationFn: newTax,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["taxes"] });
            sileo.success({ title: "Impuesto creado", description: "El impuesto fue creado correctamente." });
        },
        onError: () => {
            sileo.error({ title: "Error", description: "No se pudo crear el impuesto." });
        },
    });

    const updateTaxMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: TaxFormData }) => updateTax(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["taxes"] });
            sileo.success({ title: "Impuesto actualizado", description: "El impuesto fue actualizado correctamente." });
        },
        onError: () => {
            sileo.error({ title: "Error", description: "No se pudo actualizar el impuesto." });
        },
    });

    const deleteTaxMutation = useMutation({
        mutationFn: deleteTax,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["taxes"] });
            sileo.success({ title: "Impuesto eliminado", description: "El impuesto fue eliminado correctamente." });
        },
        onError: () => {
            sileo.error({ title: "Error", description: "No se pudo eliminar el impuesto." });
        },
    });

    return { newTaxMutation, updateTaxMutation, deleteTaxMutation };
};

export default useTaxMutation;
