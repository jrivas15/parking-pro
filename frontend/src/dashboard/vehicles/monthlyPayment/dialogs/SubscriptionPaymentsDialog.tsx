import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarIcon, CalendarPlus, CheckCircle2, CircleDollarSign,
  Clock, Pencil, Printer, Trash2, X,
} from "lucide-react";
import dayjs from "dayjs";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Subscription, SubscriptionPaymentDetail } from "../types/subscription.type";
import useSubscriptionPaymentsQuery from "../hooks/useSubscriptionPaymentsQuery";
import useSubscriptionPeriodMutation from "../hooks/useSubscriptionPeriodMutation";
import SubscriptionPaymentDialog from "./SubscriptionPaymentDialog";
import SubscriptionPrintDialog from "./SubscriptionPrintDialog";

// ─── Date field ───────────────────────────────────────────────────────────────
const DateField = ({
  label, value, onChange, error,
}: { label: string; value: string; onChange: (v: string) => void; error?: string }) => {
  const [open, setOpen] = useState(false);
  const selected = value ? dayjs(value).toDate() : undefined;
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs">{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button type="button" variant="outline" size="sm"
            className={cn("justify-start text-left font-normal", !value && "text-muted-foreground")}>
            <CalendarIcon className="mr-2 size-3.5" />
            {value ? dayjs(value).format("DD/MM/YYYY") : "Seleccionar"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={selected} captionLayout="dropdown" defaultMonth={selected}
            onSelect={(date) => { if (date) { onChange(dayjs(date).format("YYYY-MM-DD")); setOpen(false); } }}
          />
        </PopoverContent>
      </Popover>
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
};

// ─── Edit dates inline form ───────────────────────────────────────────────────
const editSchema = z.object({
  startDate: z.string().min(1),
  endDate:   z.string().min(1),
  period:    z.string().optional(),
});
type EditForm = z.infer<typeof editSchema>;

const EditDatesForm = ({
  payment,
  onSave,
  onCancel,
  isPending,
}: {
  payment: SubscriptionPaymentDetail;
  onSave: (data: EditForm) => void;
  onCancel: () => void;
  isPending: boolean;
}) => {
  const form = useForm<EditForm>({
    resolver: zodResolver(editSchema),
    defaultValues: { startDate: payment.startDate, endDate: payment.endDate, period: payment.period },
  });
  return (
    <form onSubmit={form.handleSubmit(onSave)} className="flex flex-col gap-3 rounded-md border border-primary/30 bg-muted/30 p-3 mt-1">
      <div className="grid grid-cols-2 gap-3">
        <Controller name="startDate" control={form.control}
          render={({ field }) => (
            <DateField label="Fecha inicio" value={field.value} onChange={field.onChange}
              error={form.formState.errors.startDate?.message} />
          )}
        />
        <Controller name="endDate" control={form.control}
          render={({ field }) => (
            <DateField label="Fecha fin" value={field.value} onChange={field.onChange}
              error={form.formState.errors.endDate?.message} />
          )}
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label className="text-xs">Descripción</Label>
        <Input className="h-8 text-sm" {...form.register("period")} />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? "Guardando..." : "Guardar"}
        </Button>
      </div>
    </form>
  );
};

// ─── Main dialog ─────────────────────────────────────────────────────────────
interface Props {
  subscription: Subscription | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const fmt = (n: string | null) =>
  n ? "$" + Number(n).toLocaleString("es-CO", { minimumFractionDigits: 2 }) : "—";

const SubscriptionPaymentsDialog = ({ subscription, open, onOpenChange }: Props) => {
  const [editingId, setEditingId]     = useState<number | null>(null);
  const [payTarget, setPayTarget]     = useState<SubscriptionPaymentDetail | null>(null);
  const [printTarget, setPrintTarget] = useState<SubscriptionPaymentDetail | null>(null);
  const [openPay, setOpenPay]         = useState(false);
  const [openPrint, setOpenPrint]     = useState(false);

  const { payments, isLoading } = useSubscriptionPaymentsQuery(open ? (subscription?.id ?? null) : null);
  const { advanceMutation, updateDatesMutation, payPeriodMutation, deletePeriodMutation } =
    useSubscriptionPeriodMutation(subscription?.id ?? null);

  const handlePay = (p: SubscriptionPaymentDetail) => { setPayTarget(p); setOpenPay(true); };
  const handlePrint = (p: SubscriptionPaymentDetail) => { setPrintTarget(p); setOpenPrint(true); };

  const handleSaveDates = (paymentId: number, data: EditForm) => {
    updateDatesMutation.mutate(
      { paymentId, data },
      { onSuccess: () => setEditingId(null) }
    );
  };

  const plates = subscription?.vehicles_data.map((v) => v.plate).join(", ") ?? "";

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
          <DialogHeader>
            <div className="flex items-center justify-between pr-6">
              <div>
                <DialogTitle>Pagos de mensualidad</DialogTitle>
                <DialogDescription className="mt-0.5">
                  <span className="font-mono font-medium">{plates}</span>
                  {subscription?.customer_name && (
                    <span className="text-muted-foreground"> · {subscription.customer_name}</span>
                  )}
                </DialogDescription>
              </div>
              <Button
                variant="outline" size="sm" className="gap-1.5 shrink-0"
                onClick={() => advanceMutation.mutate()}
                disabled={advanceMutation.isPending}
              >
                <CalendarPlus size={13} />
                Adelantar mensualidad
              </Button>
            </div>
          </DialogHeader>

          <div className="flex flex-col gap-2 overflow-y-auto flex-1 min-h-0 pr-1">
            {isLoading ? (
              <p className="text-sm text-muted-foreground text-center py-8">Cargando...</p>
            ) : !payments?.length ? (
              <div className="flex flex-col items-center gap-2 py-10 text-muted-foreground">
                <Clock className="size-8 opacity-40" />
                <p className="text-sm">Sin periodos registrados</p>
              </div>
            ) : (
              payments.map((p) => (
                <div key={p.id} className="rounded-md border">
                  <div className="flex items-center gap-3 px-3 py-2.5">
                    {/* Info */}
                    <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">{p.period || "Sin descripción"}</span>
                        {p.isPaid ? (
                          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30 text-xs shrink-0">
                            <CheckCircle2 className="size-3 mr-1" /> Pagado
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-orange-500/10 text-orange-400 border-orange-400/30 text-xs shrink-0">
                            <Clock className="size-3 mr-1" /> Pendiente
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {dayjs(p.startDate).format("DD/MM/YYYY")} → {dayjs(p.endDate).format("DD/MM/YYYY")}
                      </span>
                      {p.isPaid && (
                        <span className="text-xs text-muted-foreground">
                          {fmt(p.total)} · {p.paymentMethod?.name}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      {!p.isPaid && (
                        <Button size="sm" className="gap-1 h-7 px-2 text-xs" onClick={() => handlePay(p)}>
                          <CircleDollarSign size={12} /> Pagar
                        </Button>
                      )}
                      {p.isPaid && (
                        <Button variant="outline" size="icon" className="size-7" title="Imprimir recibo" onClick={() => handlePrint(p)}>
                          <Printer size={13} />
                        </Button>
                      )}
                      {!p.isPaid && (
                        <Button variant="outline" size="icon" className="size-7" title="Editar fechas"
                          onClick={() => setEditingId(editingId === p.id ? null : p.id)}>
                          {editingId === p.id ? <X size={13} /> : <Pencil size={13} />}
                        </Button>
                      )}
                      <Button
                        variant="outline" size="icon"
                        className="size-7 text-destructive hover:text-destructive"
                        title="Eliminar periodo"
                        disabled={deletePeriodMutation.isPending}
                        onClick={() => deletePeriodMutation.mutate(p.id)}
                      >
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </div>

                  {/* Inline edit */}
                  {editingId === p.id && (
                    <div className="px-3 pb-3">
                      <Separator className="mb-3" />
                      <EditDatesForm
                        payment={p}
                        onSave={(data) => handleSaveDates(p.id, data)}
                        onCancel={() => setEditingId(null)}
                        isPending={updateDatesMutation.isPending}
                      />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      <SubscriptionPaymentDialog
        subscription={subscription}
        period={payTarget}
        open={openPay}
        onOpenChange={setOpenPay}
      />

      <SubscriptionPrintDialog
        subscription={subscription}
        period={printTarget}
        open={openPrint}
        onOpenChange={setOpenPrint}
      />
    </>
  );
};

export default SubscriptionPaymentsDialog;
