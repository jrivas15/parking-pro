import { useEffect, useState } from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Plus, Search, X } from "lucide-react";
import dayjs from "dayjs";
import {
  Dialog, DialogClose, DialogContent, DialogDescription,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import FormDecimalInput from "@/components/forms/FormDecimalInput";
import { Subscription, SubscriptionFormData, SubscriptionVehicle } from "../types/subscription.type";
import useSubscriptionMutation from "../hooks/useSubscriptionMutation";
import VehicleSearchDialog from "./VehicleSearchDialog";

const schema = z.object({
  vehicles:  z.array(z.number()).min(1, "Selecciona al menos un vehículo"),
  startDate: z.string().min(1, "La fecha de inicio es requerida"),
  endDate:   z.string().optional(),
  total:     z.number().min(0),
  card:      z.string().optional(),
  note:      z.string().optional(),
  state:     z.enum(["active", "expired", "cancelled", "pending"]),
});

type FormData = z.infer<typeof schema>;

// ─── Date picker field ────────────────────────────────────────────────────────
interface DateFieldProps {
  label: string;
  value: string | undefined;
  onChange: (iso: string) => void;
  error?: string;
}

const DateField = ({ label, value, onChange, error }: DateFieldProps) => {
  const [open, setOpen] = useState(false);
  const selected = value ? dayjs(value).toDate() : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 size-4" />
            {value ? dayjs(value).format("DD/MM/YYYY") : "Seleccionar fecha"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={(date) => {
              if (date) {
                onChange(dayjs(date).format("YYYY-MM-DD"));
                setOpen(false);
              }
            }}
            captionLayout="dropdown"
            defaultMonth={selected}
          />
        </PopoverContent>
      </Popover>
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
};

// ─── Dialog ───────────────────────────────────────────────────────────────────
interface Props {
  initialData?: Subscription | null;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  showTrigger?: boolean;
}

const SubscriptionFormDialog = ({ initialData, open, setOpen, showTrigger = true }: Props) => {
  const { newSubscriptionMutation, updateSubscriptionMutation } = useSubscriptionMutation();
  const [vehicleSearchOpen, setVehicleSearchOpen] = useState(false);
  const [selectedVehicles, setSelectedVehicles] = useState<SubscriptionVehicle[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      vehicles: [], startDate: "", endDate: "", total: 0, card: "", note: "", state: "pending",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        vehicles:  initialData.vehicles,
        startDate: initialData.startDate,
        endDate:   initialData.endDate ?? "",
        total:     Number(initialData.total),
        card:      initialData.card ?? "",
        note:      initialData.note ?? "",
        state:     initialData.state,
      });
      setSelectedVehicles(initialData.vehicles_data);
    } else {
      form.reset({ vehicles: [], startDate: "", endDate: "", total: 0, card: "", note: "", state: "pending" });
      setSelectedVehicles([]);
    }
  }, [initialData, open]);

  useEffect(() => {
    if (newSubscriptionMutation.isSuccess || updateSubscriptionMutation.isSuccess) {
      setOpen(false);
    }
  }, [newSubscriptionMutation.isSuccess, updateSubscriptionMutation.isSuccess]);

  const handleAddVehicle = (vehicle: SubscriptionVehicle) => {
    if (selectedVehicles.some((v) => v.id === vehicle.id)) return;
    const updated = [...selectedVehicles, vehicle];
    setSelectedVehicles(updated);
    form.setValue("vehicles", updated.map((v) => v.id), { shouldValidate: true });
  };

  const handleRemoveVehicle = (id: number) => {
    const updated = selectedVehicles.filter((v) => v.id !== id);
    setSelectedVehicles(updated);
    form.setValue("vehicles", updated.map((v) => v.id), { shouldValidate: true });
  };

  const onSubmit = (data: FormData) => {
    const payload: SubscriptionFormData = {
      vehicles:  data.vehicles,
      startDate: data.startDate,
      endDate:   data.endDate || undefined,
      total:     data.total,
      card:      data.card || undefined,
      note:      data.note || undefined,
      state:     data.state,
    };
    if (!initialData) {
      newSubscriptionMutation.mutate(payload);
    } else {
      updateSubscriptionMutation.mutate({ id: initialData.id, data: payload });
    }
  };

  const isPending = newSubscriptionMutation.isPending || updateSubscriptionMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {showTrigger && (
        <DialogTrigger asChild>
          <Button className="gap-2">
            <Plus size={16} /> Nueva mensualidad
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{initialData ? "Editar mensualidad" : "Nueva mensualidad"}</DialogTitle>
          <DialogDescription>
            {initialData ? "Actualiza la información de la suscripción." : "Completa el formulario para registrar una nueva mensualidad."}
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 overflow-y-auto pr-1">

            {/* Vehículos */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label>Vehículos</Label>
                <Button type="button" variant="outline" size="sm" className="gap-1 h-7" onClick={() => setVehicleSearchOpen(true)}>
                  <Search size={12} /> Agregar vehículo
                </Button>
              </div>
              {selectedVehicles.length === 0 ? (
                <div className="flex h-9 items-center rounded-md border border-input bg-muted px-3 text-sm text-muted-foreground">
                  Sin vehículos seleccionados
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selectedVehicles.map((v) => (
                    <Badge key={v.id} variant="outline" className="gap-1 pr-1 font-mono">
                      {v.plate}
                      <button type="button" onClick={() => handleRemoveVehicle(v.id)} className="ml-1 hover:text-destructive">
                        <X size={10} />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              {form.formState.errors.vehicles && (
                <span className="text-xs text-destructive">{form.formState.errors.vehicles.message}</span>
              )}
            </div>

            <Separator />

            {/* Periodo */}
            <div className="grid grid-cols-2 gap-3">
              <Controller
                name="startDate"
                control={form.control}
                render={({ field }) => (
                  <DateField
                    label="Fecha inicio"
                    value={field.value}
                    onChange={field.onChange}
                    error={form.formState.errors.startDate?.message}
                  />
                )}
              />
              <Controller
                name="endDate"
                control={form.control}
                render={({ field }) => (
                  <DateField
                    label="Fecha fin (opcional)"
                    value={field.value}
                    onChange={field.onChange}
                    error={form.formState.errors.endDate?.message}
                  />
                )}
              />
            </div>

            <FormDecimalInput formName="total" label="Total" />

            <div className={initialData ? "grid grid-cols-2 gap-3" : ""}>
              <div className="flex flex-col gap-1.5">
                <Label>Tarjeta</Label>
                <Input placeholder="Opcional" {...form.register("card")} />
              </div>
              {initialData && (
                <div className="flex flex-col gap-1.5">
                  <Label>Estado</Label>
                  <Controller
                    name="state"
                    control={form.control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Activo</SelectItem>
                          <SelectItem value="pending">Pendiente</SelectItem>
                          <SelectItem value="expired">Vencido</SelectItem>
                          <SelectItem value="cancelled">Cancelado</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Nota</Label>
              <Input placeholder="Opcional" {...form.register("note")} />
            </div>

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

      <VehicleSearchDialog
        open={vehicleSearchOpen}
        onOpenChange={setVehicleSearchOpen}
        onSelect={handleAddVehicle}
        excludeIds={selectedVehicles.map((v) => v.id)}
        currentSubscriptionId={initialData?.id}
      />
    </Dialog>
  );
};

export default SubscriptionFormDialog;
