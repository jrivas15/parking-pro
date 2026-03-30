import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, CircleDollarSign } from "lucide-react";
import dayjs from "dayjs";
import {
  Dialog, DialogClose, DialogContent, DialogDescription,
  DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Subscription, SubscriptionPaymentDetail } from "../types/subscription.type";
import useSubscriptionPeriodMutation from "../hooks/useSubscriptionPeriodMutation";
import usePaymentMethodsQuery from "@/dashboard/settings/paymentMethods/hooks/usePaymentMethodsQuery";

const schema = z.object({
  paymentMethodId: z.coerce.number().min(1, "Selecciona un método de pago"),
  total:           z.coerce.number().min(0),
  amountPaid:      z.coerce.number().min(0),
  note:            z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const fmt = (n: number) =>
  "$" + n.toLocaleString("es-CO", { minimumFractionDigits: 2 });

interface Props {
  subscription: Subscription | null;
  period: SubscriptionPaymentDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SubscriptionPaymentDialog = ({ subscription, period, open, onOpenChange }: Props) => {
  const { payPeriodMutation } = useSubscriptionPeriodMutation(subscription?.id ?? null);
  const { listPaymentMethods } = usePaymentMethodsQuery();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { paymentMethodId: 0, total: 0, amountPaid: 0, note: "" },
  });

  const total     = form.watch("total");
  const amountPaid = form.watch("amountPaid");
  const change    = amountPaid - total;

  // Reset form whenever the dialog opens with a new period
  useEffect(() => {
    if (open && subscription) {
      form.reset({
        paymentMethodId: 0,
        total:      Number(subscription.total),
        amountPaid: Number(subscription.total),
        note:       "",
      });
    }
  }, [open, period?.id]);

  const onSubmit = (data: FormData) => {
    if (!period) return;
    payPeriodMutation.mutate(
      { paymentId: period.id, data: { paymentMethodId: data.paymentMethodId, total: data.total, amountPaid: data.amountPaid, note: data.note || undefined } },
      { onSuccess: () => onOpenChange(false) }
    );
  };

  const plates = subscription?.vehicles_data.map((v) => v.plate).join(", ") ?? "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CircleDollarSign className="size-5" />
            Registrar pago
          </DialogTitle>
          <DialogDescription>
            <span className="font-mono font-medium">{plates}</span>
            {period?.period && <span className="text-muted-foreground"> · {period.period}</span>}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">

          {/* Periodo — solo lectura */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Desde", value: period?.startDate },
              { label: "Hasta", value: period?.endDate },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col gap-1.5">
                <Label className="text-xs text-muted-foreground">{label}</Label>
                <div className="flex items-center gap-2 h-9 rounded-md border border-input bg-muted px-3 text-sm">
                  <CalendarIcon className="size-3.5 text-muted-foreground shrink-0" />
                  {value ? dayjs(value).format("DD/MM/YYYY") : "—"}
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Método de pago */}
          <div className="flex flex-col gap-1.5">
            <Label>Método de pago</Label>
            <Controller name="paymentMethodId" control={form.control}
              render={({ field }) => (
                <Select
                  value={field.value ? String(field.value) : ""}
                  onValueChange={(v) => field.onChange(Number(v))}
                >
                  <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                  <SelectContent>
                    {listPaymentMethods?.filter((pm) => pm.isActive).map((pm) => (
                      <SelectItem key={pm.id} value={String(pm.id)}>{pm.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {form.formState.errors.paymentMethodId && (
              <span className="text-xs text-destructive">{form.formState.errors.paymentMethodId.message}</span>
            )}
          </div>

          {/* Valores */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Total</Label>
              <Input type="number" step="0.01" {...form.register("total")} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Monto recibido</Label>
              <Input type="number" step="0.01" {...form.register("amountPaid")} />
            </div>
          </div>

          {change > 0 && (
            <div className="flex items-center justify-between rounded-md bg-muted px-3 py-2 text-sm">
              <span className="text-muted-foreground">Cambio</span>
              <span className="font-semibold text-green-500">{fmt(change)}</span>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label>Nota <span className="text-muted-foreground text-xs">(opcional)</span></Label>
            <Input placeholder="Opcional" {...form.register("note")} />
          </div>

          <div className="flex justify-end gap-3">
            <DialogClose asChild>
              <Button variant="outline" type="button">Cancelar</Button>
            </DialogClose>
            <Button type="submit" disabled={payPeriodMutation.isPending}>
              {payPeriodMutation.isPending ? "Guardando..." : "Confirmar pago"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionPaymentDialog;
