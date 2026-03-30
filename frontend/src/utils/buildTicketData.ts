import dayjs from "dayjs";
import { SaleReceipt } from "@/dashboard/parking/types/sale.type";
import { ParkingInfoFormType } from "@/dashboard/settings/parkingInfo/schemas/parkingInfo.schema";

const fmt = (dateStr: string) => dayjs(dateStr).format("DD/MM/YY HH:mm");
const money = (n: number) => "$" + Number(n).toLocaleString("es-CO", { minimumFractionDigits: 0 });

export const buildTicketData = (sale: SaleReceipt, info: ParkingInfoFormType) => {
    const lines: { type: string; value: string; style?: Record<string, string> }[] = [];

    const center = (value: string) => ({ type: "text", value, style: { textAlign: "center" } });
    const bold = (value: string) => ({ type: "text", value, style: { fontWeight: "700" } });
    const sep = () => ({ type: "text", value: "--------------------------------" });

    if (info.name) lines.push(center(info.name));
    if (info.address) lines.push(center(info.address));
    if (info.phone) lines.push(center(info.phone));
    if (info.ticketHeader) lines.push(center(info.ticketHeader));
    lines.push(sep());

    lines.push({ type: "text", value: `Ticket #${sale.movement?.nTicket ?? "—"}` });
    lines.push({ type: "text", value: `Placa: ${sale.movement?.plate ?? "—"}` });
    lines.push({ type: "text", value: `Entrada: ${sale.movement?.entryTime ? fmt(sale.movement.entryTime) : "—"}` });
    lines.push({ type: "text", value: `Salida: ${sale.movement?.exitTime ? fmt(sale.movement.exitTime) : "—"}` });
    lines.push({ type: "text", value: `Tiempo: ${sale.movement?.parkingTime ?? "—"}` });
    if (sale.movement?.tariff?.name) {
        lines.push({ type: "text", value: `Tarifa: ${sale.movement.tariff.name}` });
    }

    lines.push(sep());

    const paymentMethodName = sale.paymentMethod?.name ?? "—";
    lines.push({ type: "text", value: `Método: ${paymentMethodName}` });
    if (sale.discount && Number(sale.discount) > 0) {
        lines.push({ type: "text", value: `Descuento: ${money(Number(sale.discount))}` });
    }
    lines.push(bold(`Total: ${money(Number(sale.total))}`));
    const cashBack = Number(sale.amountPaid) - Number(sale.total);
    if (cashBack > 0) {
        lines.push({ type: "text", value: `Vuelto: ${money(cashBack)}` });
    }

    lines.push(sep());

    if (info.ticketFooter) lines.push(center(info.ticketFooter));
    lines.push(center("¡Gracias!"));

    return lines;
};
