import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, User, Building2, Search } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import CustomInput from "@/components/forms/CustomInput";
import FormSelect from "@/components/forms/FormSelect";
import {
  customerSchema,
  defaultValues,
  CustomerFormData,
} from "../schemas/customer.schema";
import useCustomerMutation from "../hooks/useCustomerMutation";
import { Customer } from "../types/customer.type";
import { CUSTOMER_TYPES } from "@/data/optionData";
import LocationSearchDialog from "./LocationSearchDialog";
import useMunicipiosQuery from "../hooks/useMunicipios";
// ─── Customer type picker ─────────────────────────────────────────────────────

const CustomerTypePicker = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => (
  <div className="flex gap-2">
    {CUSTOMER_TYPES.map((t) => (
      <button
        key={t.value}
        type="button"
        onClick={() => onChange(t.value)}
        className={`flex items-center gap-2 rounded-md border px-4 py-2 text-sm transition-colors flex-1 justify-center
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

// ─── Dialog ───────────────────────────────────────────────────────────────────
interface CustomerFormDialogProps {
  initialData?: Customer | null;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CustomerFormDialog = ({
  initialData,
  open,
  setOpen,
}: CustomerFormDialogProps) => {
  const { newCustomerMutation, updateCustomerMutation } = useCustomerMutation();

  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: initialData ? { ...initialData } : defaultValues,
  });

  const customerType = form.watch("customerType");

  const onSubmit = (data: CustomerFormData) => {
    if (!initialData) {
      newCustomerMutation.mutate(data);
    } else {
      updateCustomerMutation.mutate({ id: initialData.id, data });
    }
  };

  useEffect(() => {
    if (newCustomerMutation.isSuccess || updateCustomerMutation.isSuccess) {
      setOpen(false);
    }
  }, [newCustomerMutation.isSuccess, updateCustomerMutation.isSuccess]);

  useEffect(() => {
    if (initialData) {
      form.reset({ ...initialData });
    } else {
      form.reset(defaultValues);
    }
  }, [initialData]);

  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const { municipios } = useMunicipiosQuery();
  const locationId = form.watch("location");
  const selectedLocation = municipios?.find((m) => m.id === locationId);

  const isPending =
    newCustomerMutation.isPending || updateCustomerMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus /> Nuevo cliente
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Editar cliente" : "Nuevo cliente"}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? "Actualiza la información del cliente."
              : "Completa el formulario para registrar un nuevo cliente."}
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 overflow-y-auto pr-3"
          >
            {/* Tipo */}
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Tipo de persona</span>
              <CustomerTypePicker
                value={customerType}
                onChange={(v) =>
                  form.setValue("customerType", v as "NATURAL" | "JURIDICA", {
                    shouldValidate: true,
                  })
                }
              />
            </div>

            <Separator />

            {/* Identificación */}
            <CustomInput formName="name" label="Nombre o Razón Social" />

            <div className="flex gap-3 items-start">
              <FormSelect
                formName="documentType"
                label="Tipo doc."
                placeholder=""
                options={[
                  { value: "CC", label: "CC" },
                  { value: "NIT", label: "NIT" },
                  { value: "CE", label: "CE" },
                ]}
              />
              <CustomInput formName="nDoc" label="N° Documento" />
            </div>
            <CustomInput
              formName="email"
              label="Correo electrónico"
              type="email"
            />

            <Separator />

            <Accordion type="multiple" className="w-full">
              {/* Datos adicionales */}
              <AccordionItem value="infoAdicional">
                <AccordionTrigger className="text-sm font-medium">
                  Datos adicionales
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 pt-2">
                  <CustomInput formName="address" label="Dirección" />
                  <CustomInput formName="postalCode" label="Código postal" />
                  <div className="flex gap-3 items-end">
                    <div className="flex flex-col gap-1.5 flex-1">
                      <span className="text-sm font-medium">Ubicación</span>
                      <div className="flex h-9 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm cursor-default">
                        {selectedLocation
                          ? `${selectedLocation.municipio} — ${selectedLocation.dpto}`
                          : <span className="text-muted-foreground">Sin seleccionar</span>}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setLocationDialogOpen(true)}
                    >
                      <Search className="size-4" />
                    </Button>
                  </div>
                  <LocationSearchDialog
                    open={locationDialogOpen}
                    onOpenChange={setLocationDialogOpen}
                    onSelect={(city) => {
                      form.setValue("location", city.id, {
                        shouldValidate: true,
                      });
                    }}
                  />
                  <CustomInput formName="phone" label="Teléfono" type="tel" />
                </AccordionContent>
              </AccordionItem>

              {/* Fiscal */}
              <AccordionItem value="fiscal">
                <AccordionTrigger className="text-sm font-medium">
                  Fiscal
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 pt-2">
                  <div className="flex gap-3 items-start">
                    <CustomInput formName="tax" label="Impuesto / Régimen" />
                    <CustomInput formName="taxCode" label="Código fiscal" />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <menu className="flex justify-end gap-3 mt-1">
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Guardando..." : "Guardar"}
              </Button>
            </menu>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerFormDialog;
