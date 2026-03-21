import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InfoCard from "./components/InfoCard";
import PageLayout from "@/layouts/PageLayout";
import useHomeQuery from "./hooks/useHomeQuery";
import RecentExitsTable from "./components/RecentExitsTable";
import ActiveVehiclesList from "./components/ActiveVehiclesList";
import VehiclesByHourChart from "./components/VehiclesByHourChart";
import { formatMoney } from "@/dashboard/tools/balance/hooks/useBalance";
import {
  Car,
  Banknote,
  ReceiptText,
  LogOut,
  RefreshCw,
} from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/es";

dayjs.locale("es");

const HomePage = () => {
  const { activeMovementsQuery, lastExitsQuery, todaySalesQuery } = useHomeQuery();

  const activeCount = activeMovementsQuery.data?.length ?? 0;
  const totalSales = todaySalesQuery.data?.stats.totalSales ?? 0;
  const nSales = todaySalesQuery.data?.stats.nSales ?? 0;
  const recentExitsCount = lastExitsQuery.data?.length ?? 0;
  const isFetching =
    activeMovementsQuery.isFetching ||
    lastExitsQuery.isFetching ||
    todaySalesQuery.isFetching;

  const byPaymentMethod = todaySalesQuery.data?.stats.byPaymentMethod ?? [];

  return (
    <PageLayout>
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-bold leading-tight">Panel principal</h1>
          <p className="text-xs text-muted-foreground capitalize mt-0.5">
            {dayjs().format("dddd, D [de] MMMM [de] YYYY")}
          </p>
        </div>
        {isFetching && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <RefreshCw size={12} className="animate-spin" />
            Actualizando…
          </div>
        )}
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-4 gap-3 shrink-0">
        <InfoCard
          title="Vehículos activos"
          value={String(activeCount)}
          additionalInfo="En el parqueadero ahora"
          icon={<Car size={18} />}
          iconBg="bg-blue-500/10"
          iconColor="text-blue-500"
        />
        <InfoCard
          title="Ingresos del día"
          value={formatMoney(totalSales)}
          additionalInfo={`${nSales} ${nSales === 1 ? "venta" : "ventas"} registradas`}
          trendValue={nSales > 0 ? `+${nSales} ventas` : undefined}
          trendColor="text-green-500"
          icon={<Banknote size={18} />}
          iconBg="bg-green-500/10"
          iconColor="text-green-500"
        />
        <InfoCard
          title="Ventas hoy"
          value={String(nSales)}
          additionalInfo={
            todaySalesQuery.data?.stats.totalDiscount
              ? `Desc: ${formatMoney(todaySalesQuery.data.stats.totalDiscount)}`
              : "Sin descuentos"
          }
          trendValue={
            todaySalesQuery.data?.stats.totalTax
              ? `IVA ${formatMoney(todaySalesQuery.data.stats.totalTax)}`
              : undefined
          }
          trendColor="text-purple-500"
          icon={<ReceiptText size={18} />}
          iconBg="bg-purple-500/10"
          iconColor="text-purple-500"
        />
        <InfoCard
          title="Salidas recientes"
          value={String(recentExitsCount)}
          additionalInfo="Últimos vehículos salidos"
          icon={<LogOut size={18} />}
          iconBg="bg-orange-500/10"
          iconColor="text-orange-500"
        />
      </div>

      {/* Payment method breakdown */}
      {byPaymentMethod.length > 0 && (
        <div className="flex gap-2 shrink-0">
          {byPaymentMethod.map((pm) => (
            <div
              key={pm.paymentMethod__id}
              className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2"
            >
              <span className="text-xs text-muted-foreground font-medium">
                {pm.paymentMethod__name}
              </span>
              <span className="text-sm font-bold">{formatMoney(pm.total)}</span>
              <span className="text-[10px] text-muted-foreground bg-muted rounded px-1">
                {pm.nSales} pago{pm.nSales !== 1 ? "s" : ""}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Main content */}
      <div className="grid grid-cols-[2fr_1fr] gap-3 flex-1 min-h-0 overflow-hidden">

        {/* Left column: chart + exits table */}
        <div className="flex flex-col gap-3 min-h-0 overflow-hidden">
          {/* Chart */}
          <Card className="flex flex-col shrink-0" style={{ height: "240px" }}>
            <CardHeader className="pb-1 pt-3 px-5 shrink-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">Entradas por hora</CardTitle>
                <span className="text-[10px] text-muted-foreground">hoy</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0 px-3 pb-3">
              <VehiclesByHourChart
                activeMovements={activeMovementsQuery.data}
                lastExits={lastExitsQuery.data}
                isLoading={activeMovementsQuery.isLoading || lastExitsQuery.isLoading}
              />
            </CardContent>
          </Card>

          {/* Exits table */}
          <Card className="flex flex-col flex-1 overflow-hidden">
            <CardHeader className="shrink-0 border-b border-border/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">Últimas salidas</CardTitle>
                {lastExitsQuery.data && (
                  <span className="text-xs text-muted-foreground">
                    {lastExitsQuery.data.length} registros
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0 px-5 pt-2 pb-4">
              <RecentExitsTable
                data={lastExitsQuery.data}
                isLoading={lastExitsQuery.isLoading}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right column: active vehicles */}
        <Card className="flex flex-col overflow-hidden">
          <CardHeader className="shrink-0 border-b border-border/50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Activos ahora</CardTitle>
              {activeMovementsQuery.data && (
                <span className="text-xs font-bold text-blue-500">
                  {activeMovementsQuery.data.length}
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0 px-3 pt-1 pb-4">
            <ActiveVehiclesList
              data={activeMovementsQuery.data}
              isLoading={activeMovementsQuery.isLoading}
            />
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default HomePage;
