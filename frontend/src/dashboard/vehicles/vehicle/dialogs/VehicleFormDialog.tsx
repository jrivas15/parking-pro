import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Search, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import CustomInput from "@/components/forms/CustomInput";
import FormSelect from "@/components/forms/FormSelect";
import FormTextArea from "@/components/forms/FormTextArea";
import { vehicleSchema, defaultValues, VehicleFormData } from "../schemas/vehicle.schema";
import useVehicleMutation from "../hooks/useVehicleMutation";
import { Vehicle } from "../types/vehicle.type";
import { VEHICLE_TYPES, COLORS } from "@/data/optionData";
import { Customer } from "@/dashboard/customers/customer/types/customer.type";
import CustomerSearchDialog from "./CustomerSearchDialog";

const VehicleTypePicker = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => (
  <div className="flex gap-2">
    {VEHICLE_TYPES.map((t) => (
      <button
        key={t.value}
        type="button"
        onClick={() => onChange(t.value)}
        className={`flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm transition-colors flex-1 justify-center
          ${
            value === t.value
              ? "border-primary bg-primary/10 text-primary font-semibold"
              : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
          }`}
      >
        {t.icon}
        {t.label}
      </button>
    ))}
  </div>
);

interface VehicleFormDialogProps {
  initialData?: Vehicle | null;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const VehicleFormDialog = ({ initialData, open, setOpen }: VehicleFormDialogProps) => {
  const { newVehicleMutation, updateVehicleMutation } = useVehicleMutation();
  const [customerSearchOpen, setCustomerSearchOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const form = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: initialData
      ? {
          plate: initialData.plate,
          vehicleType: initialData.vehicleType,
          brand: initialData.brand ?? "",
          color: initialData.color ?? "",
          isActive: initialData.isActive,
          description: initialData.description ?? "",
          customer: initialData.customer ?? null,
        }
      : defaultValues,
  });

  const vehicleType = form.watch("vehicleType");

  const onSubmit = (data: VehicleFormData) => {
    if (!initialData) {
      newVehicleMutation.mutate(data);
    } else {
      updateVehicleMutation.mutate({ id: initialData.id, data });
    }
  };

  useEffect(() => {
    if (newVehicleMutation.isSuccess || updateVehicleMutation.isSuccess) {
      setOpen(false);
    }
  }, [newVehicleMutation.isSuccess, updateVehicleMutation.isSuccess]);

  useEffect(() => {
    if (initialData) {
      form.reset({
        plate: initialData.plate,
        vehicleType: initialData.vehicleType,
        brand: initialData.brand ?? "",
        color: initialData.color ?? "",
        isActive: initialData.isActive,
        description: initialData.description ?? "",
        customer: initialData.customer ?? null,
      });
      setSelectedCustomer(initialData.customerData
        ? { id: initialData.customer!, name: initialData.customerData.name, documentType: initialData.customerData.documentType, nDoc: initialData.customerData.nDoc, phone: initialData.customerData.phone, address: null, postalCode: null, location: null, email: null, taxID: null }
        : null
      );
    } else {
      form.reset(defaultValues);
      setSelectedCustomer(null);
    }
  }, [initialData]);

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    form.setValue("customer", customer.id, { shouldValidate: true });
  };

  const handleClearCustomer = () => {
    setSelectedCustomer(null);
    form.setValue("customer", null);
  };

  const isPending = newVehicleMutation.isPending || updateVehicleMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus /> Nuevo vehículo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Editar vehículo" : "Registrar vehículo"}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? "Actualiza la información del vehículo."
              : "Completa el formulario para registrar un nuevo vehículo."}
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">

            {/* Tipo */}
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Tipo de vehículo</span>
              <VehicleTypePicker
                value={vehicleType}
                onChange={(v) => form.setValue("vehicleType", v as "C" | "M" | "B", { shouldValidate: true })}
              />
              {form.formState.errors.vehicleType && (
                <p className="text-xs text-destructive">{form.formState.errors.vehicleType.message}</p>
              )}
            </div>

            <Separator />

            {/* Datos del vehículo */}
            <div className="grid grid-cols-2 gap-3">
              <CustomInput formName="plate" label="Placa" uppercase />
              <FormSelect
                formName="color"
                label="Color"
                placeholder="Seleccionar"
                options={COLORS}
              />
              <CustomInput formName="brand" label="Marca" />
            </div>

            <Separator />

            {/* Cliente asociado */}
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Cliente asociado</span>
              <div className="flex gap-2 items-center">
                <div className="flex h-9 flex-1 items-center rounded-md border border-input bg-muted px-3 text-sm">
                  {selectedCustomer ? (
                    <span className="font-medium">
                      {selectedCustomer.name}
                      <span className="text-muted-foreground font-normal ml-2">
                        {selectedCustomer.documentType}: {selectedCustomer.nDoc}
                      </span>
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Sin cliente (opcional)</span>
                  )}
                </div>
                {selectedCustomer && (
                  <Button type="button" variant="ghost" size="icon" onClick={handleClearCustomer}>
                    <X className="size-4" />
                  </Button>
                )}
                <Button type="button" variant="outline" size="icon" onClick={() => setCustomerSearchOpen(true)}>
                  <Search className="size-4" />
                </Button>
              </div>
            </div>

            <FormTextArea
              formName="description"
              label="Descripción"
              placeholder="Observaciones, convenios especiales, etc."
              rows={2}
            />

            <menu className="flex justify-end gap-3 mt-1">
              <DialogClose asChild>
                <Button variant="outline" type="button">Cancelar</Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Guardando..." : "Guardar"}
              </Button>
            </menu>

          </form>
        </FormProvider>
      </DialogContent>

      <CustomerSearchDialog
        open={customerSearchOpen}
        onOpenChange={setCustomerSearchOpen}
        onSelect={handleSelectCustomer}
      />
    </Dialog>
  );
};

export default VehicleFormDialog;
