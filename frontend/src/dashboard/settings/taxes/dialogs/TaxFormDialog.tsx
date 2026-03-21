import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { defaultValues, taxSchema, TaxFormData } from "../schemas/tax.schema";
import CustomInput from "@/components/forms/CustomInput";
import FormSwitch from "@/components/forms/FormSwitch";
import FormDecimalInput from "@/components/forms/FormDecimalInput";
import useTaxMutation from "../hooks/useTaxMutation";
import { useEffect } from "react";
import { Tax } from "../types/tax.type";

interface TaxFormDialogProps {
  initialData?: Tax | null;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const TaxFormDialog = ({ initialData, open, setOpen }: TaxFormDialogProps) => {
  const { newTaxMutation, updateTaxMutation } = useTaxMutation();

  const form = useForm<TaxFormData>({
    resolver: zodResolver(taxSchema),
    defaultValues: initialData
      ? { name: initialData.name, percent: initialData.percent, isActive: initialData.isActive, codeEI: initialData.codeEI ?? "" }
      : defaultValues,
  });

  const onSubmit = (data: TaxFormData) => {
    if (!initialData) {
      newTaxMutation.mutate(data);
    } else {
      updateTaxMutation.mutate({ id: initialData.id, data });
    }
  };

  useEffect(() => {
    if (newTaxMutation.isSuccess || updateTaxMutation.isSuccess) {
      setOpen(false);
    }
  }, [newTaxMutation.isSuccess, updateTaxMutation.isSuccess]);

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        percent: initialData.percent,
        isActive: initialData.isActive,
        codeEI: initialData.codeEI ?? "",
      });
    } else {
      form.reset(defaultValues);
    }
  }, [initialData]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{initialData ? "Editar impuesto" : "Nuevo impuesto"}</DialogTitle>
          <DialogDescription>
            {initialData ? "Actualiza los datos del impuesto." : "Completa los campos para crear un nuevo impuesto."}
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <CustomInput formName="name" label="Nombre" />
            <FormDecimalInput formName="percent" label="Porcentaje (%)" />
            <CustomInput formName="codeEI" label="Código IE (opcional)" />
            <FormSwitch formName="isActive" label="Activo" />
            <div className="flex justify-end gap-2 mt-2">
              <DialogClose asChild>
                <Button variant="outline" type="button">Cancelar</Button>
              </DialogClose>
              <Button type="submit" disabled={newTaxMutation.isPending || updateTaxMutation.isPending}>
                {initialData ? "Actualizar" : "Crear"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default TaxFormDialog;
