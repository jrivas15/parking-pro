import { Printer } from "lucide-react";
import dayjs from "dayjs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SaleReceipt } from "../types/sale.type";
import useParkingInfoQuery from "@/dashboard/settings/parkingInfo/hooks/useParkingInfoQuery";
import { buildTicketData } from "@/utils/buildTicketData";
import { usePrinterPreferences } from "@/hooks/usePrinterPreferences";

interface Props {
  sale: SaleReceipt | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const fmt = (dateStr: string) => dayjs(dateStr).format("DD/MM/YY HH:mm");
const money = (n: number) =>
  "$" + Number(n).toLocaleString("es-CO", { minimumFractionDigits: 0 });

const ParkingPrintDialog = ({ sale, open, onOpenChange }: Props) => {
  const { parkingInfoQuery } = useParkingInfoQuery();
  const info = parkingInfoQuery.data;
  const { prefs } = usePrinterPreferences();

  const handlePrint = async (preview = false) => {
    if (!sale || !info) return;
    const data = buildTicketData(sale, info);
    await window.electronAPI?.printTicket(data, {
      printerName: prefs.printerName || undefined,
      paperWidth: prefs.paperWidth,
      preview,
    });
  };

  if (!sale) return null;

  const mov = sale.movement;
  const cashBack = Number(sale.amountPaid) - Number(sale.total);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Printer className="size-4" /> Vista previa del ticket
          </DialogTitle>
        </DialogHeader>

        <div className="rounded-md border bg-muted/30 p-4 font-mono text-xs">
          {info?.name && (
            <p className="text-center text-sm font-bold mb-0.5">{info.name}</p>
          )}
          {info?.address && (
            <p className="text-center text-muted-foreground text-xs">{info.address}</p>
          )}
          {info?.ticketHeader && (
            <p className="text-center text-muted-foreground text-xs mb-2">{info.ticketHeader}</p>
          )}
          <hr className="border-dashed my-2" />

          <div className="flex flex-col gap-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ticket #</span>
              <span className="font-medium">{mov?.nTicket ?? "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Placa</span>
              <span className="font-semibold tracking-widest">{mov?.plate ?? "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Entrada</span>
              <span>{mov?.entryTime ? fmt(mov.entryTime) : "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Salida</span>
              <span>{mov?.exitTime ? fmt(mov.exitTime) : "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tiempo</span>
              <span>{mov?.parkingTime ?? "—"}</span>
            </div>
            {mov?.tariff?.name && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tarifa</span>
                <span>{mov.tariff.name}</span>
              </div>
            )}
          </div>

          <hr className="border-dashed my-2" />

          <div className="flex flex-col gap-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Método</span>
              <span>{sale.paymentMethod?.name ?? "—"}</span>
            </div>
            {Number(sale.discount) > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Descuento</span>
                <span>{money(Number(sale.discount))}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold">
              <span>TOTAL</span>
              <span>{money(Number(sale.total))}</span>
            </div>
            {cashBack > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Vuelto</span>
                <span>{money(cashBack)}</span>
              </div>
            )}
          </div>

          <hr className="border-dashed my-2" />

          {info?.ticketFooter && (
            <p className="text-center text-muted-foreground text-xs">{info.ticketFooter}</p>
          )}
          <p className="text-center text-muted-foreground text-xs mt-1">¡Gracias!</p>
        </div>

        <Separator />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
          <Button variant="outline" onClick={() => handlePrint(true)}>
            <Printer size={14} /> Vista previa
          </Button>
          <Button onClick={() => handlePrint(false)}>
            <Printer size={14} /> Imprimir
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ParkingPrintDialog;
