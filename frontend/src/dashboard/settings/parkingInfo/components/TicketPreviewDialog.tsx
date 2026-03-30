import { useWatch } from "react-hook-form";
import { Printer } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import dayjs from "dayjs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { buildEntryTicketData } from "@/utils/buildEntryTicketData";
import type { ParkingInfoFormType } from "../schemas/parkingInfo.schema";
import type { Movement } from "@/dashboard/parking/types/movements.type";

// Movimiento de muestra para previsualización
const MOCK_MOVEMENT: Movement = {
  nTicket: 90034,
  plate: "YYY333",
  entryTime: new Date(),
  vehicleType: "C",
  parkingTime: "",
  updatedAt: new Date(),
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TicketPreviewDialog = ({ open, onOpenChange }: Props) => {
  const info = useWatch<ParkingInfoFormType>() as ParkingInfoFormType;

  const handlePrint = async (preview = false) => {
    const data = buildEntryTicketData(MOCK_MOVEMENT, info);
    await window.electronAPI?.printTicket(data, {
      printerName: info.printerName || undefined,
      paperWidth: info.paperWidth ?? "80",
      preview,
    });
  };

  const entryDate = dayjs(MOCK_MOVEMENT.entryTime);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Printer className="size-4" /> Vista previa — Ticket de ingreso
          </DialogTitle>
        </DialogHeader>

        <div className="rounded-md border bg-muted/30 p-4 font-mono text-xs leading-relaxed overflow-y-auto max-h-[65vh]">
          {/* Nombre grande */}
          {info?.name && (
            <p className="text-center font-black text-base mb-0.5">{info.name}</p>
          )}

          {/* Info del parqueadero */}
          {info?.includeParkingInfo && (
            <>
              {info?.nit && <p className="text-center">NIT: {info.nit}</p>}
              {info?.address && <p className="text-center">DIRECCION: {info.address}</p>}
              {info?.phone && <p className="text-center">Telefono: {info.phone}</p>}
            </>
          )}

          {/* Ticket header */}
          {info?.ticketHeader && (
            <p className="text-center text-muted-foreground whitespace-pre-line mt-1">
              {info.ticketHeader}
            </p>
          )}

          <hr className="border-dashed my-2" />

          {/* Fecha / hora */}
          <p className="text-center font-bold text-sm">
            FECHA: {entryDate.format("DD-MM-YYYY")}&nbsp;&nbsp;HORA: {entryDate.format("HH:mm:ss")}
          </p>

          {/* Número de recibo */}
          <p className="text-center font-black text-base mt-1">
            RECIBO No: {MOCK_MOVEMENT.nTicket.toLocaleString("es-CO")}
          </p>

          <hr className="border-dashed my-2" />

          {/* QR con la placa */}
          {info?.includeQRCode && (
            <div className="flex justify-center my-2">
              <QRCodeSVG value={MOCK_MOVEMENT.plate} size={80} />
            </div>
          )}

          {/* Placa */}
          <p className="text-center font-black text-base tracking-widest">
            {MOCK_MOVEMENT.plate}
          </p>

          <hr className="border-dashed my-2" />

          {/* Reglamento / footer */}
          {info?.includeBasicRules && info?.ticketFooter && (
            <>
              <p className="text-center font-bold mb-1">REGLAMENTO</p>
              <p className="text-justify text-[10px] leading-tight">{info.ticketFooter}</p>
              <hr className="border-dashed my-2" />
            </>
          )}
          {!info?.includeBasicRules && info?.ticketFooter && (
            <p className="text-center text-muted-foreground whitespace-pre-line">
              {info.ticketFooter}
            </p>
          )}
        </div>

        <Separator />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
          <Button onClick={() => handlePrint(false)}>
            <Printer size={14} /> Imprimir
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TicketPreviewDialog;
