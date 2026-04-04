import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { Printer, FileText } from "lucide-react";
import dayjs from "dayjs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SaleReceipt } from "../types/sale.type";
import useParkingInfoQuery from "@/dashboard/settings/parkingInfo/hooks/useParkingInfoQuery";
import { usePrinterPreferences } from "@/hooks/usePrinterPreferences";
import { buildExitHTML } from "@/main/ticketTemplate";

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
  const [showTicketPreview, setShowTicketPreview] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!sale || !info?.includeQRCode) { setQrDataUrl(undefined); return; }
    QRCode.toDataURL(sale.movement.plate, { width: 100, margin: 1 })
      .then(setQrDataUrl);
  }, [sale?.movement.plate, info?.includeQRCode]);

  const handlePrint = async () => {
    if (!sale || !info) return;
    await window.electronAPI?.print({ type: 'exit', sale, info: { ...info, printerName: prefs.printerName, paperWidth: prefs.paperWidth } });
  };

  if (!sale) return null;

  const mov = sale.movement;
  const cashBack = Number(sale.amountPaid) - Number(sale.total);
  const ticketHTML = info ? buildExitHTML({ type: 'exit', sale, info }, qrDataUrl) : '';

  return (
    <Dialog open={open} onOpenChange={(v) => { setShowTicketPreview(false); onOpenChange(v); }}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Printer className="size-4" /> Recibo de salida
          </DialogTitle>
        </DialogHeader>

        {showTicketPreview ? (
          <div className="flex justify-center overflow-auto max-h-[60vh] bg-muted/30 rounded-md p-4">
            <div className="bg-white shadow-md">
              <iframe
                srcDoc={ticketHTML}
                className="border-0 block"
                style={{ width: prefs.paperWidth === '58' ? '58mm' : '80mm', height: '500px' }}
                title="Vista previa del ticket"
              />
            </div>
          </div>
        ) : (
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

            {!info?.includeBasicRules && info?.ticketFooter && (
              <p className="text-center text-muted-foreground text-xs">{info.ticketFooter}</p>
            )}
            <p className="text-center text-muted-foreground text-xs mt-1">¡Gracias!</p>

            <hr className="border-dashed my-2" />
            <p className="text-center text-muted-foreground" style={{ fontSize: '9px' }}>
              Ambientes Seguros S.A.S &copy; {new Date().getFullYear()}
            </p>
            <p className="text-center text-muted-foreground" style={{ fontSize: '9px' }}>
              www.ambientes-seguros.com
            </p>
          </div>
        )}

        <Separator />

        <div className="flex justify-between gap-2">
          <Button
            variant="outline"
            onClick={() => setShowTicketPreview((v) => !v)}
            disabled={!info}
          >
            <FileText size={14} />
            {showTicketPreview ? "Ver resumen" : "Ver ticket"}
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cerrar
            </Button>
            <Button onClick={() => handlePrint()}>
              <Printer size={14} /> Imprimir
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ParkingPrintDialog;
