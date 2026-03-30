import { useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PaymentMethod } from "@/dashboard/settings/paymentMethods/types/paymentMethod.type";
import { ExpenseFormData } from "./types/expenses.type";
import FormDecimalInput from "@/components/forms/FormDecimalInput";

const schema = z.object({
    description: z.string().min(1, "La descripción es obligatoria"),
    value: z.coerce.number().min(1, "El valor debe ser mayor a 0"),
    paymentMethodID: z.coerce.number().min(1, "El método de pago es obligatorio"),
});

type FormData = z.infer<typeof schema>;

interface Props {
    open: boolean;
    setOpen: (v: boolean) => void;
    paymentMethods?: PaymentMethod[];
    onSubmit: (data: ExpenseFormData) => void;
    isCreating: boolean;
    createSuccess: boolean;
}

const ExpenseFormDialog = ({ open, setOpen, paymentMethods, onSubmit, isCreating, createSuccess }: Props) => {
    const form = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const { register, handleSubmit, control, reset, formState: { errors } } = form;

    useEffect(() => {
        if (createSuccess) {
            reset();
            setOpen(false);
        }
    }, [createSuccess]);

    const handleFormSubmit = (data: FormData) => {
        onSubmit({ description: data.description, value: data.value, paymentMethodID: data.paymentMethodID });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Nuevo gasto</DialogTitle>
                </DialogHeader>
                <FormProvider {...form}>
                    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <Label>Descripción</Label>
                            <Input placeholder="Ej: Limpieza, mantenimiento..." {...register("description")} />
                            {errors.description && (
                                <span className="text-xs text-destructive">{errors.description.message}</span>
                            )}
                        </div>
                        <FormDecimalInput formName="value" label="Valor" />
                        <div className="flex flex-col gap-1.5">
                            <Label>Método de pago</Label>
                            <Controller
                                name="paymentMethodID"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value?.toString()}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar método" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {paymentMethods?.map((pm) => (
                                                <SelectItem key={pm.id} value={pm.id.toString()}>
                                                    {pm.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.paymentMethodID && (
                                <span className="text-xs text-destructive">{errors.paymentMethodID.message}</span>
                            )}
                        </div>
                        <DialogFooter className="gap-2">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isCreating}>
                                {isCreating ? "Guardando..." : "Guardar"}
                            </Button>
                        </DialogFooter>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
};

export default ExpenseFormDialog;
