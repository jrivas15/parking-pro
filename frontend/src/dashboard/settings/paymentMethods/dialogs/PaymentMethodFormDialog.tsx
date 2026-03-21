import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import {
  paymentMethodSchema,
  defaultValues,
  PaymentMethodFormData,
} from "../schemas/paymentMethod.schema";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomInput from "@/components/forms/CustomInput";
import FormSwitch from "@/components/forms/FormSwitch";
import usePaymentMethodMutation from "../hooks/usePaymentMethodMutation";
import { useEffect } from "react";
import { PaymentMethod } from "../types/paymentMethod.type";

interface PaymentMethodFormDialogProps {
  initialData?: PaymentMethod | null;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const PaymentMethodFormDialog = ({
  initialData,
  open,
  setOpen,
}: PaymentMethodFormDialogProps) => {
  const { newPaymentMethodMutation, updatePaymentMethodMutation } =
    usePaymentMethodMutation();
  const form = useForm<PaymentMethodFormData>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          isActive: initialData.isActive,
          codeEI: initialData.codeEI ?? "",
        }
      : defaultValues,
  });

  const onSubmit = async (data: PaymentMethodFormData) => {
    console.log(data)
    if (!initialData) {
      newPaymentMethodMutation.mutate(data);
    } else {
      updatePaymentMethodMutation.mutate({ id: initialData.id, data });
    }
  };

  useEffect(() => {
    if (
      newPaymentMethodMutation.isSuccess ||
      updatePaymentMethodMutation.isSuccess
    ) {
      setOpen(false);
    }
  }, [newPaymentMethodMutation.isSuccess, updatePaymentMethodMutation.isSuccess]);

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        isActive: initialData.isActive,
        codeEI: initialData.codeEI ?? "",
      });
    } else {
      form.reset(defaultValues);
    }
  }, [initialData]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus /> Nuevo método de pago
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Editar método de pago" : "Nuevo método de pago"}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? "Actualiza la información del método de pago."
              : "Completa el formulario para crear un nuevo método de pago."}
          </DialogDescription>
          <FormProvider {...form}>
            <form
              className="flex flex-col gap-3"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <CustomInput formName="name" label="Nombre" />
              <CustomInput formName="codeEI" label="Código EI" />
              <FormSwitch formName="isActive" label="Activo" />
              <menu className="flex justify-end gap-3">
                <DialogClose asChild>
                  <Button variant="outline">Cancelar</Button>
                </DialogClose>
                <Button type="submit">Guardar</Button>
              </menu>
            </form>
          </FormProvider>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentMethodFormDialog;
