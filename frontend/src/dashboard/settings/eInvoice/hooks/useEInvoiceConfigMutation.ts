import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EInvoiceConfigFormType } from "../schemas/eInvoice.schema";
import { updateEInvoiceConfig } from "../services/eInvoice.service";
import { sileo } from "sileo";

const useEInvoiceConfigMutation = () => {
    const queryClient = useQueryClient();

    const eInvoiceConfigMutation = useMutation({
        mutationFn: (data: EInvoiceConfigFormType) => updateEInvoiceConfig(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['eInvoiceConfig'] });
            sileo.success({ title: "Actualización", description: "Configuración de facturación electrónica actualizada exitosamente" });
        },
        onError: () => {
            sileo.error({ title: "Actualización", description: "Error al actualizar la configuración de facturación electrónica" });
        },
    });

    return { eInvoiceConfigMutation };
};

export default useEInvoiceConfigMutation;
