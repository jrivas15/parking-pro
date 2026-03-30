import { Separator } from "@/components/ui/separator";
import VehicleCountCard from "./components/VehicleCountCard";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Camera,
  Coins,
  Dock,
  ImageOff,
  Pencil,
  Printer,
  Scale,
  Search,
  Volume2,
  Wallet,
} from "lucide-react";
import PlateInput from "./components/PlateInput";
import { DataTable } from "@/components/shared/DataTable";
import PageLayout from "@/layouts/PageLayout";
import useParking from "./hooks/useParking";
import { ParkingTable } from "./components/ParkingTable";
import PaymentDialog from "./components/PaymentDialog";
import { formatNumByCommas } from "@/utils/formatNumber";
import { useNavigate } from "react-router-dom";
import CashCountDialog from "../tools/cashCount/CashCountDialog";
import { Input } from "@/components/ui/input";
import ParkingPrintDialog from "./components/ParkingPrintDialog";
import RecentSalesDialog from "./components/RecentSalesDialog";

const ParkingPage = () => {
  const {
    possiblePaymentData,
    selectedMovement,
    setSelectedMovement,
    plate,
    setPlate,
    movementsFiltered,
    statsVehicles,
    handleNewVehicleEntry,
    openPaymentDialog,
    setOpenPaymentDialog,
    lastExitMovements,
    lastExitsColumns,
    openCashCountDialog,
    setOpenCashCountDialog,
    plateFilter,
    setPlateFilter,
    lastSale,
    openPrintDialog,
    setOpenPrintDialog,
    openRecentSalesDialog,
    setOpenRecentSalesDialog,
    handleSaleCompleted,
  } = useParking();
  const nav = useNavigate()

  return (
    <PageLayout>
      <div className="flex gap-4 flex-1 min-h-0 overflow-y-auto">
        <div className="flex flex-col gap-4 min-h-0 flex-1 p-2 overflow-hidden">
          <PlateInput
            autoFocus
            value={plate}
            onChange={(e) => setPlate(e.target.value.toUpperCase())}
            onKeyDown={(e)=> { if(e.key==='Enter'){
              handleNewVehicleEntry()
              setPlate("")
            }}}
          />
            <section className="flex flex-col gap-2 mx-4 overflow-y-auto flex-1 min-h-0">
            <div className="flex items-center justify-between">
              <h2 className="text-muted-foreground font-semibold">Vehiculos activos</h2>
              <div className="relative">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  value={plateFilter}
                  onChange={(e) => setPlateFilter(e.target.value.toUpperCase())}
                  placeholder="Filtrar placa..."
                  className="h-8 pl-7 pr-3 text-sm rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring w-36"
                />
              </div>
            </div>
            <ParkingTable
              data={movementsFiltered}
              onSelectMovement={setSelectedMovement}
              onDoubleClickMovement={(movement) => {
                setSelectedMovement(movement);
                setOpenPaymentDialog(true);
              }}
            />
            </section>
          <section className="flex flex-col gap-2 h-[30%] shrink-0 overflow-hidden">
            <h2 className="text-muted-foreground font-semibold">
              Ultimas salidas
            </h2>
            <div className="overflow-y-auto flex-1 min-h-0">
              <DataTable columns={lastExitsColumns} data={lastExitMovements ?? []} />
            </div>
          </section>
        </div>
        <div className="bg-sidebar overflow-y-auto p-3 flex flex-col gap-4 rounded-2xl w-80 shrink-0">
          <div
            className=" bg-background text-center p-2 text-primary border border-primary rounded-2xl
          flex flex-col gap-2 shadow-primary shadow-sm"
          >
            <h2 className="text-lg tracking-[0.2em] text-foreground font-semibold">
              Valor a pagar
            </h2>
            <span className="text-5xl font-bold h-13">
              {possiblePaymentData ? (
                <>
                  <span className="text-xl">$</span>
                  {formatNumByCommas(possiblePaymentData.total)}
                </>
              ) : (
                ""
              )}
            </span>
            <span className="text-sm text-muted-foreground h-5">
              {possiblePaymentData?.parkingTime}
            </span>
          </div>
          <div className="h-52 flex items-center justify-center bg-background border border-zinc-800 rounded-2xl shadow-inner mt-2">
            <ImageOff className="text-muted-foreground" />
          </div>
          <div className="flex gap-2 justify-between">
            <VehicleCountCard count={statsVehicles.car} type="Carros" />
            <VehicleCountCard count={statsVehicles.motorbikes} type="Motos" />
          </div>

          <Separator className="mt-2" />
          <Button variant="outline" onClick={() => setOpenRecentSalesDialog(true)}>
            <Dock /> Copia Recibo
          </Button>
          <Button disabled={!possiblePaymentData} onClick={() => {setOpenPaymentDialog(true)}}>
            <Coins />
            Cobrar
          </Button>
          <PaymentDialog
            open={openPaymentDialog}
            setOpen={setOpenPaymentDialog}
            paymentData={possiblePaymentData}
            selectedMovement={selectedMovement}
            onSaleCompleted={handleSaleCompleted}
          />
          <CashCountDialog open={openCashCountDialog} onOpenChange={setOpenCashCountDialog} />
        </div>
      </div>

      <footer className="mx-6 bg-sidebar px-4 py-2 rounded-2xl flex justify-between items-center">
        <menu className="bg-background p-1 rounded-2xl flex gap-2">
          <Button variant="ghost" onClick={() => lastSale && setOpenPrintDialog(true)}>
            <Printer />
          </Button>
          <Button variant="ghost">
            <Volume2 />
          </Button>
        </menu>
        <menu className="flex gap-2">
          <Button variant="outline">
            <Pencil className="text-yellow-800" />
            Corregir placa
          </Button>
          <Button variant="outline" onClick={() => setOpenCashCountDialog(true)}>
            <Wallet className="text-green-600" />
            Arqueo
          </Button>
          <Button variant="outline">
            <Camera className="text-blue-600" />
            R.Fotográfico
          </Button>
          <Button variant="outline" onClick={()=>nav('/tools/balance')}>
            <Scale className="text-purple-800" />
            Balance de caja
          </Button>
          <Button variant="outline">
            <Bell className="text-red-600" />
            Notificar
          </Button>
        </menu>
      </footer>

      <ParkingPrintDialog
        sale={lastSale}
        open={openPrintDialog}
        onOpenChange={setOpenPrintDialog}
      />
      <RecentSalesDialog
        open={openRecentSalesDialog}
        onOpenChange={setOpenRecentSalesDialog}
      />
    </PageLayout>
  );
};

export default ParkingPage;
