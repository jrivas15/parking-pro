import PageLayout from "@/layouts/PageLayout";
import BackBtn from "@/components/shared/BackBtn";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar as CalendarIcon, Filter, TrendingUp, Banknote, Receipt, Percent, User, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import useReports from "./hooks/useReports";
import { formatMoney } from "@/dashboard/tools/balance/hooks/useBalance";

const ReportsPage = () => {
    const { dateRange, setDateRange, appliedRange, handleApply, isLoading, summary, byUser, byPaymentMethod } = useReports();

    return (
        <PageLayout>
            <header className="flex items-center">
                <BackBtn />
                <div>
                    <h1 className="text-2xl font-bold">Reportes</h1>
                    <span className="text-sm text-muted-foreground">
                        {dayjs(appliedRange.from).format("DD MMM YYYY")} — {dayjs(appliedRange.to).format("DD MMM YYYY")}
                    </span>
                </div>
            </header>

            <Separator />

            {/* Filters */}
            <div className="flex gap-3 items-end">
                <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground uppercase tracking-widest">Rango de fechas</span>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn("w-72 h-9 justify-start text-left font-normal", !dateRange && "text-muted-foreground")}
                            >
                                <CalendarIcon size={14} className="mr-2 text-muted-foreground" />
                                {dateRange?.from ? (
                                    dateRange.to ? (
                                        <>{dayjs(dateRange.from).format("DD MMM")} — {dayjs(dateRange.to).format("DD MMM, YYYY")}</>
                                    ) : dayjs(dateRange.from).format("DD MMM, YYYY")
                                ) : (
                                    <span>Seleccionar rango</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="range" selected={dateRange} onSelect={setDateRange} numberOfMonths={2} />
                        </PopoverContent>
                    </Popover>
                </div>
                <Button onClick={handleApply} disabled={isLoading || !dateRange?.from} className="h-9">
                    <Filter size={14} /> Generar reporte
                </Button>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-5 gap-3">
                <Card>
                    <CardHeader className="pb-1 pt-4 px-4">
                        <CardTitle className="text-xs text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                            <Receipt size={12} /> Ventas
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold">{summary?.total_sales ?? 0}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-1 pt-4 px-4">
                        <CardTitle className="text-xs text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                            <Banknote size={12} /> Base
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold">{formatMoney(summary?.total_subtotal ?? 0)}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-1 pt-4 px-4">
                        <CardTitle className="text-xs text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                            <Percent size={12} /> IVA
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold">{formatMoney(summary?.total_tax ?? 0)}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-1 pt-4 px-4">
                        <CardTitle className="text-xs text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                            <TrendingUp size={12} /> Descuentos
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-red-500">-{formatMoney(summary?.total_discount ?? 0)}</p>
                    </CardContent>
                </Card>
                <Card className="border-primary/50 bg-primary/5">
                    <CardHeader className="pb-1 pt-4 px-4">
                        <CardTitle className="text-xs text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                            <Banknote size={12} /> Total
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-primary">{formatMoney(summary?.total_income ?? 0)}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Breakdowns */}
            <div className="grid grid-cols-2 gap-4 flex-1 min-h-0 overflow-auto">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <User size={16} className="text-primary" /> Por usuario
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Usuario</TableHead>
                                    <TableHead className="text-right">Ventas</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {byUser.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center text-muted-foreground">Sin datos</TableCell>
                                    </TableRow>
                                )}
                                {byUser.map((row) => (
                                    <TableRow key={row.user__id}>
                                        <TableCell className="font-medium">{row.user__username}</TableCell>
                                        <TableCell className="text-right">{row.total_sales}</TableCell>
                                        <TableCell className="text-right font-semibold">{formatMoney(row.total_income)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <CreditCard size={16} className="text-primary" /> Por método de pago
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Método</TableHead>
                                    <TableHead className="text-right">Ventas</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {byPaymentMethod.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center text-muted-foreground">Sin datos</TableCell>
                                    </TableRow>
                                )}
                                {byPaymentMethod.map((row) => (
                                    <TableRow key={row.paymentMethod__id}>
                                        <TableCell className="font-medium">{row.paymentMethod__name ?? "Sin método"}</TableCell>
                                        <TableCell className="text-right">{row.total_sales}</TableCell>
                                        <TableCell className="text-right font-semibold">{formatMoney(row.total_income)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </PageLayout>
    );
};

export default ReportsPage;
