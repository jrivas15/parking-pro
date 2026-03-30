import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Car, Crown, Plus } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Vip } from "../types/vip.type";
import useVipMutation from "../hooks/useVipMutation";
import VehicleSearchDialog from "./VehicleSearchDialog";
import { Vehicle } from "@/dashboard/vehicles/vehicle/types/vehicle.type";

const schema = z.object({
  vehicle:  z.coerce.number().min(1, "Selecciona un vehículo"),
  card:     z.string().optional(),
  isActive: z.boolean(),
  note:     z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  initialData: Vip | null;
  open: boolean;
  setOpen: (open: boolean) => void;
  showTrigger?: boolean;
}

const VipFormDialog = ({ initialData, open, setOpen, showTrigger = false }: Props) => {
  const { newVipMutation, updateVipMutation } = useVipMutation();
  const [vehicleOpen, setVehicleOpen]         = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const isEdit = !!initialData;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { vehicle: 0, card: "", isActive: true, note: "" },
  });

  useEffect(() => {
    if (open) {
      setSelectedVehicle(null);
      form.reset(
        initialData
          ? {
              vehicle:  initialData.vehicle,
              card:     initialData.card ?? "",
              isActive: initialData.isActive,
              note:     initialData.note ?? "",
            }
          : { vehicle: 0, card: "", isActive: true, note: "" }
      );
    }
  }, [open, initialData?.id]);

  const handleVehicleSelect = (v: Vehicle) => {
    setSelectedVehicle(v);
    form.setValue("vehicle", v.id, { shouldValidate: true });
  };

  const onSubmit = (data: FormData) => {
    const payload = {
      vehicle:  data.vehicle,
      card:     data.card || undefined,
      isActive: data.isActive,
      note:     data.note || undefined,
    };
    if (isEdit) {
      updateVipMutation.mutate(
        { id: initialData.id, data: payload },
        { onSuccess: () => setOpen(false) }
      );
    } else {
      newVipMutation.mutate(payload, { onSuccess: () => setOpen(false) });
    }
  };

  const isPending = newVipMutation.isPending || updateVipMutation.isPending;

  return (
    <>
      {showTrigger && (
        <Button onClick={() => setOpen(true)} className="gap-2">
          <Plus size={16} /> Nuevo VIP
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="size-5" />
              {isEdit ? "Editar VIP" : "Registrar VIP"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">

            {/* Vehículo */}
            <div className="flex flex-col gap-1.5">
              <Label>Vehículo</Label>
              {isEdit ? (
                <div className="flex items-center gap-2 h-9 rounded-md border border-input bg-muted px-3 text-sm">
                  <Car className="size-3.5 text-muted-foreground" />
                  <span className="font-mono font-medium">{initialData.vehicle_plate}</span>
                  {initialData.customer_name && (
                    <span className="text-muted-foreground">· {initialData.customer_name}</span>
                  )}
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className={cn("justify-start gap-2", !selectedVehicle && "text-muted-foreground")}
                  onClick={() => setVehicleOpen(true)}
                >
                  <Car className="size-3.5" />
                  {selectedVehicle ? (
                    <>
                      <span className="font-mono font-medium">{selectedVehicle.plate}</span>
                      {selectedVehicle.customerData?.name && (
                        <span className="text-muted-foreground text-xs">· {selectedVehicle.customerData.name}</span>
                      )}
                    </>
                  ) : "Seleccionar vehículo..."}
                </Button>
              )}
              {form.formState.errors.vehicle && (
                <span className="text-xs text-destructive">{form.formState.errors.vehicle.message}</span>
              )}
            </div>

            {/* Tarjeta */}
            <div className="flex flex-col gap-1.5">
              <Label>Tarjeta <span className="text-muted-foreground text-xs">(opcional)</span></Label>
              <Input placeholder="Número de tarjeta" {...form.register("card")} />
            </div>

            {/* Nota */}
            <div className="flex flex-col gap-1.5">
              <Label>Nota <span className="text-muted-foreground text-xs">(opcional)</span></Label>
              <Input placeholder="Observaciones..." {...form.register("note")} />
            </div>

            {/* Activo */}
            <div className="flex items-center justify-between rounded-md border px-3 py-2.5">
              <Label className="cursor-pointer">Activo</Label>
              <Controller name="isActive" control={form.control}
                render={({ field }) => (
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
            </div>

            <div className="flex justify-end gap-3">
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Guardando..." : isEdit ? "Actualizar" : "Registrar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <VehicleSearchDialog
        open={vehicleOpen}
        onOpenChange={setVehicleOpen}
        onSelect={handleVehicleSelect}
      />
    </>
  );
};

export default VipFormDialog;
