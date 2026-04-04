import PageLayout from "@/layouts/PageLayout";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Banknote,
  Calendar as CalendarIcon,
  CreditCard,
  Filter,
  Lock,
  Printer,
  TrendingUp,
  TrendingDown,
  Car,
  User,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import BackBtn from "@/components/shared/BackBtn";
import { DataTable } from "@/components/shared/DataTable";
import useBalance, { formatMoney } from "./hooks/useBalance";
import { ConfirmDialog } from "@/components/dialogs/ConfimDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import SummaryCard from "@/components/shared/SummaryCard";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";

const BalancePage = () => {
  const {
    columns,
    openSales,
    balanceStats,
    isLoading,
    users,
    tariffs,
    paymentMethods,
    profile,
    filters,
    setFilters,
    handleApplyFilters,
    handleResetFilters,
    appliedFilters,
    closeNote,
    setCloseNote,
    openNoteDialog,
    setOpenNoteDialog,
    openCloseSalesDialog,
    setOpenCloseSalesDialog,
    handleCloseSales,
    isClosing,
    // sale actions
    selectedSale,
    openDetailDialog,
    setOpenDetailDialog,
    openChangePaymentDialog,
    setOpenChangePaymentDialog,
    newPaymentMethodId,
    setNewPaymentMethodId,
    handleConfirmChangePayment,
    isChangingPayment,
    openTransferDialog,
    setOpenTransferDialog,
    transferUserId,
    setTransferUserId,
    handleConfirmTransfer,
    isTransferring,
  } = useBalance();

  return (
    <PageLayout>
      <div className="flex flex-col gap-4 flex-1 min-h-0 overflow-hidden">
        <header className="flex justify-between items-center">
          <div className="flex">
            <BackBtn />
            <div className="">
              <h1 className="text-2xl font-bold">Balance de caja</h1>
              <span className="text-sm text-muted-foreground">
                Gestiona el balance de caja del día, revisa ingresos, gastos y
                realiza cierres de caja
              </span>
            </div>
          </div>
        </header>
        <Separator className="my-2" />

        {/* Filters */}
        <div className="flex gap-3 items-center flex-wrap">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground uppercase tracking-widest">
              Usuario
            </span>
            <Select value={filters.user || profile?.id?.toString()} onValueChange={(v) => setFilters(f => ({ ...f, user: v }))}>
              <SelectTrigger className="w-36 h-9">
                <User size={14} className="mr-1 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {users?.map((user) => (
                  <SelectItem key={`u-${user.id}`} value={user.id.toString()}>
                    {user.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground uppercase tracking-widest">
              Rango
            </span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-64 h-9 justify-start text-left font-normal",
                    !filters.dateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon size={14} className="mr-2 text-muted-foreground" />
                  {filters.dateRange?.from ? (
                    filters.dateRange.to ? (
                      <>
                        {dayjs(filters.dateRange.from).format("DD MMM")} —{" "}
                        {dayjs(filters.dateRange.to).format("DD MMM, YYYY")}
                      </>
                    ) : (
                      dayjs(filters.dateRange.from).format("DD MMM, YYYY")
                    )
                  ) : (
                    <span>Seleccionar rango</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={filters.dateRange}
                  onSelect={(v) => setFilters(f => ({ ...f, dateRange: v }))}
                  numberOfMonths={1}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground uppercase tracking-widest">
              Tarifa
            </span>
            <Select value={filters.tariff} onValueChange={(v) => setFilters(f => ({ ...f, tariff: v }))}>
              <SelectTrigger className="w-44 h-9">
                <Banknote size={14} className="mr-1 text-muted-foreground" />
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                {tariffs?.map((tariff) => (
                  <SelectItem key={`t-${tariff.id}`} value={tariff.id.toString()}>
                    {tariff.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground uppercase tracking-widest">
              Medio de pago
            </span>
            <Select value={filters.paymentMethod} onValueChange={(v) => setFilters(f => ({ ...f, paymentMethod: v }))} defaultValue="all">
              <SelectTrigger className="w-44 h-9">
                <CreditCard size={14} className="mr-1 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {paymentMethods?.map((method) => (
                  <SelectItem key={`m-${method.id}`} value={method.id.toString()}>
                    {method.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground uppercase tracking-widest">
              Vehículo
            </span>
            <Select value={filters.vehicleType} onValueChange={(v) => setFilters(f => ({ ...f, vehicleType: v }))} defaultValue="all">
              <SelectTrigger className="w-36 h-9">
                <Car size={14} className="mr-1 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="C">Carros</SelectItem>
                <SelectItem value="M">Motos</SelectItem>
                <SelectItem value="B">Bicicletas</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-3 mt-auto">
            <Button onClick={handleApplyFilters} disabled={isLoading} className="h-9 px-5 bg-primary text-black hover:bg-primary/90 font-semibold">
              <Filter size={14} />
              Aplicar Filtros
            </Button>
            <Button onClick={handleResetFilters} disabled={isLoading} variant="outline" className="h-9 px-5 text-muted-foreground hover:text-foreground">
              Limpiar filtros
            </Button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="flex gap-3">
          <SummaryCard
            label="Número de ventas"
            value={balanceStats?.nSales != null ? `${balanceStats.nSales}` : "—"}
          />
          {balanceStats?.byPaymentMethod.map((method) => {
            const expense = balanceStats.expensesByPaymentMethod?.find(
              (e) => e.paymentMethod__id === method.paymentMethod__id
            );
            const expenseTotal = Number(expense?.total ?? 0);
            const net = Number(method.total) - expenseTotal;
            return (
              <SummaryCard
                key={method.paymentMethod__name}
                label={method.paymentMethod__name}
                value={formatMoney(net)}
                sub={expenseTotal > 0 ? `- ${formatMoney(expenseTotal)} en gastos` : `${method.nSales} ${method.nSales === 1 ? "pago" : "pagos"}`}
                subIcon={expenseTotal > 0 ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
                subColor={expenseTotal > 0 ? "text-red-500" : "text-green-500"}
              />
            );
          })}
          <SummaryCard
            label="Gastos"
            value={balanceStats?.totalExpenses ? formatMoney(Number(balanceStats.totalExpenses)) : "$0"}
            subIcon={<TrendingDown size={12} />}
            subColor="text-red-500"
          />
          <SummaryCard label="Base" value={balanceStats?.totalSubtotal ? formatMoney(balanceStats.totalSubtotal) : "$0"} />
          <SummaryCard label="IVA (19%)" value={balanceStats?.totalTax ? formatMoney(balanceStats.totalTax) : "$0"} />
          <SummaryCard
            label="Total"
            value={balanceStats?.totalSales ? formatMoney(balanceStats.totalSales) : "$0"}
            sub="Neto Final"
            subIcon={<Printer size={12} />}
            subColor="text-black/60"
            highlight
          />
        </div>

        {/* Table */}
        <DataTable columns={columns} data={openSales} />

        {/* Footer actions */}
        <div className="flex items-center justify-end pb-2 shrink-0">
          <Button
            onClick={() => setOpenNoteDialog(true)}
            disabled={isClosing || isLoading || openSales.length === 0}
            className="bg-primary text-black hover:bg-primary/90 font-bold px-6 gap-2"
          >
            <Lock size={16} />
            Cerrar ventas
          </Button>
        </div>
      </div>

      {/* Note dialog */}
      <Dialog open={openNoteDialog} onOpenChange={setOpenNoteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nota de cierre</DialogTitle>
            <DialogDescription>
              Agrega una nota opcional antes de cerrar las ventas.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Escribe una nota..."
            value={closeNote}
            onChange={(e) => setCloseNote(e.target.value)}
            rows={4}
          />
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpenNoteDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                setOpenNoteDialog(false);
                setOpenCloseSalesDialog(true);
              }}
            >
              Continuar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm close dialog */}
      <ConfirmDialog
        open={openCloseSalesDialog}
        setOpen={setOpenCloseSalesDialog}
        title="Cerrar ventas"
        description="¿Estás seguro de que deseas cerrar las ventas? Esta acción no se puede deshacer."
        fx={() => handleCloseSales(appliedFilters, closeNote)}
      />

      {/* Detail dialog */}
      <Dialog open={openDetailDialog} onOpenChange={setOpenDetailDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Detalles de venta #{selectedSale?.id}</DialogTitle>
          </DialogHeader>
          {selectedSale && (
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Placa</span>
                <span className="font-mono font-semibold">{selectedSale.movement.plate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fecha</span>
                <span>{dayjs(selectedSale.movement.exitTime).format("DD/MM/YY HH:mm")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duración</span>
                <span>{selectedSale.movement.parkingTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatMoney(selectedSale.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">IVA</span>
                <span>{formatMoney(selectedSale.taxValue)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{formatMoney(selectedSale.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Método de pago</span>
                <Badge variant="outline">{selectedSale.paymentMethod?.name ?? "—"}</Badge>
              </div>
              {selectedSale.additionalNote && (
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground">Nota adicional</span>
                  <span className="text-xs bg-muted rounded p-2">{selectedSale.additionalNote}</span>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDetailDialog(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change payment method dialog */}
      <Dialog open={openChangePaymentDialog} onOpenChange={setOpenChangePaymentDialog}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Cambiar medio de pago</DialogTitle>
            <DialogDescription>
              Selecciona el nuevo método de pago para la venta #{selectedSale?.id}
            </DialogDescription>
          </DialogHeader>
          <Select value={newPaymentMethodId} onValueChange={setNewPaymentMethodId}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar método" />
            </SelectTrigger>
            <SelectContent>
              {paymentMethods?.map((pm) => (
                <SelectItem key={pm.id} value={pm.id.toString()}>{pm.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpenChangePaymentDialog(false)}>Cancelar</Button>
            <Button onClick={handleConfirmChangePayment} disabled={isChangingPayment || !newPaymentMethodId}>
              {isChangingPayment ? "Guardando..." : "Confirmar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transfer dialog */}
      <Dialog open={openTransferDialog} onOpenChange={setOpenTransferDialog}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Transferir movimiento</DialogTitle>
            <DialogDescription>
              Asigna la venta #{selectedSale?.id} a otro usuario
            </DialogDescription>
          </DialogHeader>
          <Select value={transferUserId} onValueChange={setTransferUserId}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar usuario" />
            </SelectTrigger>
            <SelectContent>
              {users?.map((u) => (
                <SelectItem key={u.id} value={u.id.toString()}>{u.fullName}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpenTransferDialog(false)}>Cancelar</Button>
            <Button onClick={handleConfirmTransfer} disabled={isTransferring || !transferUserId}>
              {isTransferring ? "Transfiriendo..." : "Transferir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default BalancePage;
