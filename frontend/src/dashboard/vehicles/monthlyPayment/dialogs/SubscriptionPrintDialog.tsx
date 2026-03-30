import { useRef } from "react";
import { Printer } from "lucide-react";
import dayjs from "dayjs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Subscription, SubscriptionPaymentDetail } from "../types/subscription.type";

interface Props {
  subscription: Subscription | null;
  period: SubscriptionPaymentDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const fmt = (n: string | null) =>
  n ? "$" + Number(n).toLocaleString("es-CO", { minimumFractionDigits: 2 }) : "—";

const SubscriptionPrintDialog = ({ subscription, period, open, onOpenChange }: Props) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const content = printRef.current?.innerHTML;
    if (!content) return;
    const win = window.open("", "_blank", "width=400,height=600");
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <title>Recibo Mensualidad</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: monospace; font-size: 12px; padding: 16px; width: 300px; }
            .title { text-align: center; font-size: 14px; font-weight: bold; margin-bottom: 8px; }
            .sub { text-align: center; color: #666; margin-bottom: 12px; }
            hr { border: none; border-top: 1px dashed #999; margin: 8px 0; }
            .row { display: flex; justify-content: space-between; margin: 3px 0; }
            .label { color: #555; }
            .total-row { font-weight: bold; font-size: 13px; margin-top: 4px; }
            .center { text-align: center; margin-top: 12px; color: #888; font-size: 11px; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  if (!subscription || !period) return null;

  const plates = subscription.vehicles_data.map((v) => v.plate).join(", ");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Printer className="size-4" /> Vista previa de impresión
          </DialogTitle>
        </DialogHeader>

        {/* Receipt preview */}
        <div className="rounded-md border bg-muted/30 p-4 font-mono text-xs">
          <div ref={printRef}>
            <p className="title text-center text-sm font-bold mb-1">RECIBO MENSUALIDAD</p>
            <p className="sub text-center text-muted-foreground text-xs mb-3">
              {dayjs(period.createdAt).format("DD/MM/YYYY HH:mm")}
            </p>
            <hr className="border-dashed my-2" />

            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Placa(s)</span>
                <span className="font-medium">{plates}</span>
              </div>
              {subscription.customer_name && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cliente</span>
                  <span>{subscription.customer_name}</span>
                </div>
              )}
              {subscription.card && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tarjeta</span>
                  <span>{subscription.card}</span>
                </div>
              )}
            </div>

            <hr className="border-dashed my-2" />

            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Periodo</span>
                <span>{period.period || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Desde</span>
                <span>{dayjs(period.startDate).format("DD/MM/YYYY")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Hasta</span>
                <span>{dayjs(period.endDate).format("DD/MM/YYYY")}</span>
              </div>
              {period.paymentMethod && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Método de pago</span>
                  <span>{period.paymentMethod.name}</span>
                </div>
              )}
            </div>

            <hr className="border-dashed my-2" />

            <div className="flex justify-between text-sm font-bold">
              <span>TOTAL</span>
              <span>{fmt(period.total)}</span>
            </div>

            <p className="text-center text-muted-foreground text-xs mt-3">¡Gracias!</p>
          </div>
        </div>

        <Separator />

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cerrar</Button>
          <Button className="gap-2" onClick={handlePrint}>
            <Printer size={14} /> Imprimir
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionPrintDialog;
