import { useState } from "react";
import PageLayout from "@/layouts/PageLayout";
import BackBtn from "@/components/shared/BackBtn";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Eye, Search, WifiOff } from "lucide-react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import useEInvoicesQuery from "./hooks/useEInvoicesQuery";
import { EInvoiceFilters, EInvoiceStatus } from "./types/eInvoice.type";
import { formatNumByCommas } from "@/utils/formatNumber";
import EInvoiceDetailDialog from "./components/EInvoiceDetailDialog";

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

const PER_PAGE = 15;

const EInvoicesPage = () => {
    const [search, setSearch] = useState("");
    const [appliedSearch, setAppliedSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<EInvoiceStatus | "">("");
    const [page, setPage] = useState(1);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const filters: EInvoiceFilters = {
        page,
        per_page: PER_PAGE,
        status: statusFilter,
        search: appliedSearch,
    };

    const navigate = useNavigate();
    const { eInvoicesQuery } = useEInvoicesQuery(filters);
    const data = eInvoicesQuery.data;

    const isUnavailable = eInvoicesQuery.isError;

    const handleSearch = () => {
        setPage(1);
        setAppliedSearch(search);
    };

    const handleStatusChange = (val: string) => {
        setPage(1);
        setStatusFilter(val === "all" ? "" : val as EInvoiceStatus);
    };

    return (
        <PageLayout>
            <header className="flex items-center">
                <BackBtn />
                <div>
                    <h1 className="text-2xl font-bold">F. Electrónica</h1>
                    <span className="text-sm text-muted-foreground">
                        Facturas electrónicas enviadas
                    </span>
                </div>
            </header>

            <Separator />

            {isUnavailable ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
                    <WifiOff size={48} className="text-muted-foreground" />
                    <div>
                        <p className="text-lg font-semibold">Servicio no disponible</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            No se pudo conectar con la API de facturación electrónica.<br />
                            Verifica que el servicio esté activo y la configuración sea correcta.
                        </p>
                    </div>
                    <Button variant="outline" onClick={() => navigate("/settings/fe")}>
                        Ir a configuración
                    </Button>
                </div>
            ) : (
                <>
                    {/* Filters */}
                    <div className="flex gap-3 items-end">
                        <div className="flex gap-2 flex-1 max-w-sm">
                            <Input
                                placeholder="Buscar por número..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            />
                            <Button variant="outline" size="icon" onClick={handleSearch}>
                                <Search size={16} />
                            </Button>
                        </div>
                        <Select value={statusFilter || "all"} onValueChange={handleStatusChange}>
                            <SelectTrigger className="w-44">
                                <SelectValue placeholder="Estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los estados</SelectItem>
                                <SelectItem value="pending">Pendiente</SelectItem>
                                <SelectItem value="processing">Procesando</SelectItem>
                                <SelectItem value="sent">Enviada</SelectItem>
                                <SelectItem value="accepted">Aceptada</SelectItem>
                                <SelectItem value="rejected">Rechazada</SelectItem>
                                <SelectItem value="error">Error</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Table */}
                    <div className="flex-1 min-h-0 overflow-auto border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>N° Factura</TableHead>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {eInvoicesQuery.isLoading && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                                            Cargando...
                                        </TableCell>
                                    </TableRow>
                                )}
                                {data?.results.length === 0 && !eInvoicesQuery.isLoading && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                                            Sin resultados
                                        </TableCell>
                                    </TableRow>
                                )}
                                {data?.results.map((invoice) => (
                                    <TableRow key={invoice.id}>
                                        <TableCell className="font-mono font-medium">{invoice.fullNumber}</TableCell>
                                        <TableCell className="text-muted-foreground">{invoice.customerName ?? "—"}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={STATUS_VARIANTS[invoice.status]}
                                                className={invoice.status === "accepted" ? "border-green-500 text-green-500" : ""}
                                            >
                                                {STATUS_LABELS[invoice.status]}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            ${formatNumByCommas(parseFloat(invoice.total))}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {dayjs(invoice.createdAt).format("DD/MM/YYYY HH:mm")}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setSelectedId(invoice.id)}
                                            >
                                                <Eye size={16} />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {data && data.pages > 1 && (
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                                {data.total} factura{data.total !== 1 ? "s" : ""} · página {data.page} de {data.pages}
                            </span>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    disabled={page <= 1}
                                    onClick={() => setPage((p) => p - 1)}
                                >
                                    <ChevronLeft size={16} />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    disabled={page >= data.pages}
                                    onClick={() => setPage((p) => p + 1)}
                                >
                                    <ChevronRight size={16} />
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            )}
            <EInvoiceDetailDialog invoiceId={selectedId} onClose={() => setSelectedId(null)} />
        </PageLayout>
    );
};

export default EInvoicesPage;
