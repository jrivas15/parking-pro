import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, XCircle, Clock, Loader2, Send, User, Receipt } from "lucide-react";
import dayjs from "dayjs";
import { sileo } from "sileo";
import { getEInvoiceDetail, resendEInvoice } from "../services/eInvoice.service";
import { EInvoiceStatus } from "../types/eInvoice.type";
import { formatNumByCommas } from "@/utils/formatNumber";

const STATUS_LABELS: Record<EInvoiceStatus, string> = {
    pending: "Pendiente",
    processing: "Procesando",
    sent: "Enviada",
    accepted: "Aceptada",
    rejected: "Rechazada",
    error: "Error",
};

const STATUS_VARIANTS: Record<EInvoiceStatus, "default" | "secondary" | "destructive" | "outline"> = {
    pending: "outline",
    processing: "secondary",
    sent: "secondary",
    accepted: "outline",
    rejected: "destructive",
    error: "destructive",
};

const DOC_TYPE_LABELS: Record<string, string> = { "13": "CC", "31": "NIT" };

interface Props {
    invoiceId: string | null;
    onClose: () => void;
}

const DetailRow = ({ label, value }: { label: string; value?: string | number | null }) => {
    if (!value && value !== 0) return null;
    return (
        <div className="flex justify-between items-start gap-4 text-sm">
            <span className="text-muted-foreground shrink-0">{label}</span>
            <span className="text-right font-medium">{value}</span>
        </div>
    );
};

const EInvoiceDetailDialog = ({ invoiceId, onClose }: Props) => {
    const [email, setEmail] = useState("");
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        setEmail("");
    }, [invoiceId]);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["eInvoice-detail", invoiceId],
        queryFn: () => getEInvoiceDetail(invoiceId!),
        enabled: !!invoiceId,
        staleTime: 1000 * 30,
    });

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            setEmail("");
            onClose();
        }
    };

    const handleResend = async () => {
        if (!invoiceId) return;
        setIsSending(true);
        try {
            const targetEmail = email.trim() || data?.customer?.email || undefined;
            await resendEInvoice(invoiceId, targetEmail);
            sileo.success({ title: "Factura reenviada", description: "La factura fue enviada al correo del cliente." });
            setEmail("");
        } catch {
            sileo.error({ title: "Error al reenviar", description: "No se pudo reenviar la factura electrónica." });
        } finally {
            setIsSending(false);
        }
    };

    const fmt = (val?: number | string | null) =>
        val != null ? `$${formatNumByCommas(parseFloat(String(val)))}` : null;

    const customerEmail = data?.customer?.email;
    const docTypeLabel = data?.customer?.documentType
        ? (DOC_TYPE_LABELS[data.customer.documentType] ?? data.customer.documentType)
        : null;

    return (
        <Dialog open={!!invoiceId} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Detalle de factura</DialogTitle>
                </DialogHeader>

                {isLoading && (
                    <div className="flex items-center justify-center py-10 gap-2 text-muted-foreground">
                        <Loader2 size={20} className="animate-spin" />
                        Cargando...
                    </div>
                )}

                {isError && (
                    <div className="flex items-center justify-center py-10 gap-2 text-destructive">
                        <XCircle size={20} />
                        No se pudo obtener el detalle.
                    </div>
                )}

                {data && (
                    <div className="flex flex-col gap-4">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <span className="font-mono text-lg font-bold">{data.fullNumber}</span>
                            <Badge
                                variant={STATUS_VARIANTS[data.status]}
                                className={data.status === "accepted" ? "border-green-500 text-green-500" : ""}
                            >
                                {STATUS_LABELS[data.status]}
                            </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock size={14} />
                            {dayjs(data.createdAt).format("DD/MM/YYYY HH:mm")}
                        </div>

                        <Separator />

                        {/* Customer info */}
                        {data.customer && (
                            <>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest">
                                        <User size={13} />
                                        Información del cliente
                                    </div>
                                    <DetailRow label="Nombre" value={data.customer.legalName} />
                                    <DetailRow
                                        label="Documento"
                                        value={
                                            docTypeLabel && data.customer.documentNumber
                                                ? `${docTypeLabel} ${data.customer.documentNumber}`
                                                : data.customer.documentNumber
                                        }
                                    />
                                    <DetailRow label="Correo" value={data.customer.email} />
                                    <DetailRow label="Dirección" value={data.customer.address} />
                                    <DetailRow label="Ciudad" value={data.customer.cityCode} />
                                </div>
                                <Separator />
                            </>
                        )}

                        {/* Financial summary */}
                        {(data.subtotal != null || data.total != null) && (
                            <>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest">
                                        <Receipt size={13} />
                                        Resumen financiero
                                    </div>
                                    <DetailRow label="Subtotal" value={fmt(data.subtotal)} />
                                    <DetailRow label="Descuentos" value={fmt(data.discounts)} />
                                    <DetailRow label="Impuestos" value={fmt(data.taxes)} />
                                    <div className="flex justify-between items-center text-sm font-semibold border-t pt-2 mt-1">
                                        <span>Total</span>
                                        <span className="text-primary">{fmt(data.total)}</span>
                                    </div>
                                </div>
                                <Separator />
                            </>
                        )}

                        {/* CUFE */}
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-muted-foreground uppercase tracking-widest">CUFE</span>
                            {data.cufe ? (
                                <p className="font-mono text-xs break-all bg-muted rounded px-2 py-1.5">{data.cufe}</p>
                            ) : (
                                <span className="text-sm text-muted-foreground">—</span>
                            )}
                        </div>

                        <Separator />

                        {/* DIAN response */}
                        <div className="flex flex-col gap-2">
                            <span className="text-xs text-muted-foreground uppercase tracking-widest">Respuesta DIAN</span>
                            {data.dianResponse ? (
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex items-center gap-2">
                                        {data.dianResponse.code === "00" ? (
                                            <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                                        ) : (
                                            <XCircle size={16} className="text-destructive shrink-0" />
                                        )}
                                        <span className="text-sm font-medium">{data.dianResponse.description}</span>
                                        <span className="text-xs text-muted-foreground ml-auto">Código: {data.dianResponse.code}</span>
                                    </div>
                                    {data.dianResponse.errors?.length > 0 && (
                                        <ul className="text-sm text-destructive list-disc list-inside space-y-0.5 bg-destructive/5 rounded px-3 py-2">
                                            {data.dianResponse.errors?.map((err, i) => (
                                                <li key={i}>{err}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ) : (
                                <span className="text-sm text-muted-foreground">Sin respuesta aún</span>
                            )}
                        </div>

                        {/* Resend — only for accepted invoices */}
                        {data.status === "accepted" && (
                            <>
                                <Separator />
                                <div className="flex flex-col gap-2">
                                    <span className="text-xs text-muted-foreground uppercase tracking-widest">Reenviar factura</span>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder={customerEmail ?? "Correo del cliente"}
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            type="email"
                                        />
                                        <Button
                                            variant="outline"
                                            onClick={handleResend}
                                            disabled={isSending}
                                            className="shrink-0"
                                        >
                                            {isSending ? (
                                                <Loader2 size={16} className="animate-spin" />
                                            ) : (
                                                <Send size={16} />
                                            )}
                                            Reenviar
                                        </Button>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Deja el campo vacío para usar el correo original del cliente.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default EInvoiceDetailDialog;
