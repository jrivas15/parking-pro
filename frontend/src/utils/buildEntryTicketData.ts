import dayjs from "dayjs";
import type { Movement } from "@/dashboard/parking/types/movements.type";
import type { ParkingInfoFormType } from "@/dashboard/settings/parkingInfo/schemas/parkingInfo.schema";

export const buildEntryTicketData = (movement: Movement, info: ParkingInfoFormType) => {
  const entryDate = dayjs(movement.entryTime);
  const lines: Record<string, unknown>[] = [];

  const center = (value: string, extra?: Record<string, unknown>) => ({
    type: "text",
    value,
    style: { textAlign: "center", ...extra },
  });
  const bold = (value: string, fontSize = "18px") => ({
    type: "text",
    value,
    style: { textAlign: "center", fontWeight: "700", fontSize },
  });
  const sep = () => ({
    type: "text",
    value: "--------------------------------",
    style: { textAlign: "center" },
  });

  // ── Nombre grande ──
  lines.push(bold(info.name, "22px"));

  // ── Info del parqueadero ──
  if (info.includeParkingInfo) {
    if (info.nit) lines.push(center(`NIT: ${info.nit}`));
    if (info.address) lines.push(center(`DIRECCION: ${info.address}`));
    if (info.phone) lines.push(center(`Telefono: ${info.phone}`));
  }

  // ── Ticket header (multi-línea) ──
  if (info.ticketHeader) {
    for (const line of info.ticketHeader.split("\n")) {
      if (line.trim()) lines.push(center(line.trim()));
    }
  }

  lines.push(sep());

  // ── Fecha y hora de entrada ──
  lines.push(bold(`FECHA: ${entryDate.format("DD-MM-YYYY")}  HORA: ${entryDate.format("HH:mm:ss")}`, "14px"));

  // ── Número de recibo ──
  lines.push(bold(`RECIBO No: ${movement.nTicket.toLocaleString("es-CO")}`, "18px"));

  lines.push(sep());

  // ── QR con la placa ──
  if (info.includeQRCode) {
    lines.push({
      type: "qrCode",
      value: movement.plate,
      height: 80,
      width: 80,
      position: "center",
      style: { textAlign: "center" },
    });
  }

  // ── Placa grande ──
  lines.push(bold(movement.plate, "22px"));

  lines.push(sep());

  // ── Reglamento / pie de página ──
  if (info.includeBasicRules && info.ticketFooter) {
    lines.push(bold("REGLAMENTO", "13px"));
    lines.push({
      type: "text",
      value: info.ticketFooter,
      style: { textAlign: "justify", fontSize: "10px" },
    });
    lines.push(sep());
  } else if (info.ticketFooter) {
    lines.push({
      type: "text",
      value: info.ticketFooter,
      style: { textAlign: "center" },
    });
  }

  return lines;
};
