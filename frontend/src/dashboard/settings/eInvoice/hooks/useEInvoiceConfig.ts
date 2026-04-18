import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { defaultValues, EInvoiceConfigFormType, eInvoiceConfigSchema } from "../schemas/eInvoice.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import useEInvoiceConfigMutation from "./useEInvoiceConfigMutation";
import useEInvoiceConfigQuery from "./useEInvoiceConfigQuery";

const useEInvoiceConfig = () => {
    const { eInvoiceConfigQuery } = useEInvoiceConfigQuery();

    const form = useForm<EInvoiceConfigFormType>({
        resolver: zodResolver(eInvoiceConfigSchema),
        defaultValues,
    });

    const [mode, setMode] = useState<"view" | "edit">("view");
    const { eInvoiceConfigMutation } = useEInvoiceConfigMutation();

    const handleEdit = () => setMode("edit");
    const handleCancel = () => {
        setMode("view");
        form.reset(eInvoiceConfigQuery.data);
    };

    const onSubmit = (data: EInvoiceConfigFormType) => eInvoiceConfigMutation.mutate(data);

    useEffect(() => {
        if (eInvoiceConfigMutation.isSuccess) setMode("view");
    }, [eInvoiceConfigMutation.isSuccess]);

    useEffect(() => {
        if (eInvoiceConfigQuery.data) form.reset(eInvoiceConfigQuery.data);
    }, [eInvoiceConfigQuery.data]);

    return { form, mode, handleEdit, handleCancel, onSubmit };
};

export default useEInvoiceConfig;
