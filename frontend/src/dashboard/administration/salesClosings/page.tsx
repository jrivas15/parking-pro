import PageLayout from "@/layouts/PageLayout";
import BackBtn from "@/components/shared/BackBtn";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Lock, Banknote, TrendingDown, ChevronRight, Car, CreditCard, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import useSalesClosings from "./hooks/useSalesClosings";
import { formatMoney } from "@/dashboard/tools/balance/hooks/useBalance";
import VehicleIcon from "@/components/shared/VehicleIcon";
import Plate from "@/dashboard/parking/components/Plate";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MONTHS = [
    { value: 1, label: "Enero" }, { value: 2, label: "Febrero" }, { value: 3, label: "Marzo" },
    { value: 4, label: "Abril" }, { value: 5, label: "Mayo" }, { value: 6, label: "Junio" },
    { value: 7, label: "Julio" }, { value: 8, label: "Agosto" }, { value: 9, label: "Septiembre" },
    { value: 10, label: "Octubre" }, { value: 11, label: "Noviembre" }, { value: 12, label: "Diciembre" },
];

const SalesClosingsPage = () => {
    const { filters, setFilters, handleApply, currentYear, closings, isLoading, byPaymentMethod, selected, handleSelect, reportSales, isLoadingSales } = useSalesClosings();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

    const totalIncome = closings.reduce((s, c) => s + Number(c.total), 0);
    const totalExpenses = closings.reduce((s, c) => s + Number(c.expenses), 0);

    return (
        <PageLayout>
            <header className="flex items-center">
                <BackBtn />
                <div>
                    <h1 className="text-2xl font-bold">Cierres de venta</h1>
                    <span className="text-sm text-muted-foreground">
                        Historial de todos los cierres de caja realizados
                    </span>
                </div>
            </header>

            <Separator />

            {/* Filters */}
            <div className="flex gap-3 items-end shrink-0">
                <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground uppercase tracking-widest">Año</span>
                    <Select value={String(filters.year ?? "")} onValueChange={(v) => setFilters(f => ({ ...f, year: Number(v) }))}>
                        <SelectTrigger className="w-28 h-9">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {years.map((y) => (
                                <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground uppercase tracking-widest">Mes</span>
                    <Select value={String(filters.month ?? "")} onValueChange={(v) => setFilters(f => ({ ...f, month: Number(v) }))}>
                        <SelectTrigger className="w-36 h-9">
                            <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0">Todos</SelectItem>
                            {MONTHS.map((m) => (
                                <SelectItem key={m.value} value={String(m.value)}>{m.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Button onClick={handleApply} className="h-9">
                    <Filter size={14} /> Aplicar
                </Button>
            </div>

            {/* Summary cards */}
            <div className="flex gap-3 shrink-0 flex-wrap">
                <Card className="w-32 overflow-hidden">
                    <CardHeader className="pb-1 pt-4 px-4">
                        <CardTitle className="text-xs text-muted-foreground uppercase tracking-widest flex items-center gap-1 truncate">
                            <Lock size={12} className="shrink-0" /> Cierres
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold">{closings.length}</p>
                    </CardContent>
                </Card>
                <Card className="w-44 overflow-hidden border-primary/50 bg-primary/5">
                    <CardHeader className="pb-1 pt-4 px-4">
                        <CardTitle className="text-xs text-muted-foreground uppercase tracking-widest flex items-center gap-1 truncate">
                            <Banknote size={12} className="shrink-0" /> Ingresos
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                        <p className="text-xl font-bold text-primary truncate">{formatMoney(totalIncome)}</p>
                    </CardContent>
                </Card>
                <Card className="w-40 overflow-hidden">
                    <CardHeader className="pb-1 pt-4 px-4">
                        <CardTitle className="text-xs text-muted-foreground uppercase tracking-widest flex items-center gap-1 truncate">
                            <TrendingDown size={12} className="shrink-0" /> Gastos
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                        <p className="text-xl font-bold text-red-500 truncate">{formatMoney(totalExpenses)}</p>
                    </CardContent>
                </Card>
                {byPaymentMethod.map((pm) => (
                    <Card key={pm.paymentMethod__id} className="w-40 overflow-hidden">
                        <CardHeader className="pb-1 pt-4 px-4">
                            <CardTitle className="text-xs text-muted-foreground uppercase tracking-widest flex items-center gap-1 truncate">
                                <CreditCard size={12} className="shrink-0" /> {pm.paymentMethod__name ?? "Sin método"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 pb-4">
                            <p className="text-xl font-bold truncate">{formatMoney(pm.total_income)}</p>
                            <p className="text-xs text-muted-foreground">{pm.total_sales} ventas</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main content: closings list + detail */}
            <div className="flex gap-3 flex-1 min-h-0 overflow-hidden">

                {/* Closings table */}
                <Card className={cn("flex flex-col overflow-hidden transition-all", selected ? "w-1/2" : "flex-1")}>
                    <CardContent className="p-0 overflow-auto flex-1">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-10">#</TableHead>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead>Usuario</TableHead>
                                    <TableHead className="text-right">Base</TableHead>
                                    <TableHead className="text-right">IVA</TableHead>
                                    <TableHead className="text-right">Gastos</TableHead>
                                    <TableHead className="text-right font-bold">Total</TableHead>
                                    <TableHead>Nota</TableHead>
                                    <TableHead className="w-6" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading && (
                                    <TableRow>
                                        <TableCell colSpan={9} className="text-center text-muted-foreground py-10">Cargando...</TableCell>
                                    </TableRow>
                                )}
                                {!isLoading && closings.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={9} className="text-center text-muted-foreground py-10">No hay cierres registrados</TableCell>
                                    </TableRow>
                                )}
                                {closings.map((c) => (
                                    <TableRow
                                        key={c.id}
                                        className={cn("cursor-pointer", selected?.id === c.id && "bg-primary/10")}
                                        onClick={() => handleSelect(c)}
                                    >
                                        <TableCell className="text-muted-foreground">{c.id}</TableCell>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-1.5">
                                                <Lock size={12} className="text-primary" />
                                                {dayjs(c.createdAt).format("DD/MM/YYYY")}
                                            </div>
                                        </TableCell>
                                        <TableCell>{c.username ?? "—"}</TableCell>
                                        <TableCell className="text-right">{formatMoney(Number(c.subtotal))}</TableCell>
                                        <TableCell className="text-right">{formatMoney(Number(c.tax_value))}</TableCell>
                                        <TableCell className="text-right text-red-500">-{formatMoney(Number(c.expenses))}</TableCell>
                                        <TableCell className="text-right font-bold text-primary">{formatMoney(Number(c.total))}</TableCell>
                                        <TableCell className="max-w-32 truncate text-muted-foreground text-xs">
                                            {c.note ? <Badge variant="outline" className="max-w-28 truncate">{c.note}</Badge> : "—"}
                                        </TableCell>
                                        <TableCell>
                                            <ChevronRight size={14} className={cn("text-muted-foreground transition-transform", selected?.id === c.id && "rotate-90 text-primary")} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Sales detail panel */}
                {selected && (
                    <Card className="w-1/2 flex flex-col overflow-hidden">
                        <CardHeader className="py-3 px-4 border-b shrink-0">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Lock size={14} className="text-primary" />
                                Cierre #{selected.id} — {dayjs(selected.createdAt).format("DD/MM/YYYY")}
                                <span className="ml-auto font-bold text-primary">{formatMoney(Number(selected.total))}</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 overflow-auto flex-1">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Placa</TableHead>
                                        <TableHead><Car size={12} /></TableHead>
                                        <TableHead>Salida</TableHead>
                                        <TableHead>Duración</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                        <TableHead>Método</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoadingSales && (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center text-muted-foreground py-8">Cargando...</TableCell>
                                        </TableRow>
                                    )}
                                    {!isLoadingSales && reportSales.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center text-muted-foreground py-8">Sin ventas asociadas</TableCell>
                                        </TableRow>
                                    )}
                                    {reportSales.map((sale) => (
                                        <TableRow key={sale.id}>
                                            <TableCell><Plate plate={sale.movement.plate} /></TableCell>
                                            <TableCell><VehicleIcon type={sale.movement.vehicleType} /></TableCell>
                                            <TableCell className="text-xs">{sale.movement.exitTime ? dayjs(sale.movement.exitTime).format("DD/MM HH:mm") : "—"}</TableCell>
                                            <TableCell className="text-xs">{sale.movement.parkingTime}</TableCell>
                                            <TableCell className="text-right font-semibold">{formatMoney(Number(sale.total))}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{sale.paymentMethod?.name ?? "—"}</Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}
            </div>
        </PageLayout>
    );
};

export default SalesClosingsPage;
