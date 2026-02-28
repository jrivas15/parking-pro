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

const ParkingPage = () => {
  const {
    possiblePaymentData,
    selectedMovement,
    setSelectedMovement,
    plate,
    setPlate,
    movements,
    statsVehicles,
    handleNewVehicleEntry,
    openPaymentDialog,
    setOpenPaymentDialog
  } = useParking();

  return (
    <PageLayout>
      <div className="grid grid-cols-[2fr_1fr] h-full">
        <div className="flex flex-col gap-4">
          <PlateInput
            autoFocus
            value={plate}
            onChange={(e) => setPlate(e.target.value.toUpperCase())}
            onKeyDown={(e)=> { if(e.key==='Enter'){
              handleNewVehicleEntry()
            }}}
          />
            <section className="p-2 flex flex-col gap-2 mx-4 h-[calc(100vh-50%)] overflow-y-scroll">
            <h2 className="text-muted-foreground font-semibold">
              Vehiculos activos
            </h2>
            <ParkingTable
              data={movements || []}
              onSelectMovement={setSelectedMovement}
            />
            </section>
          <section className="p-2 flex flex-col gap-2 mx-4">
            <h2 className="text-muted-foreground font-semibold">
              Ultimas salidas
            </h2>
            <DataTable columns={[]} data={[]} />
          </section>
        </div>
        <div className="bg-sidebar h-full p-4 flex flex-col gap-4 rounded-2xl ">
          <div
            className=" bg-background text-center p-2 text-primary border border-primary rounded-2xl 
          flex flex-col gap-2 shadow-primary shadow-sm"
          >
            <h2 className="text-lg tracking-[0.2em] text-foreground font-semibold">
              Valor a pagar
            </h2>
            <span className="text-5xl font-bold h-13">
              <span className="text-xl">$</span>
              {possiblePaymentData?.total}
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
          <Button variant="outline">
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
          />
        </div>
      </div>

      <footer className="mx-6 bg-sidebar mb-2 px-4 py-2 rounded-2xl flex justify-between items-center">
        <menu className="bg-background p-1 rounded-2xl flex gap-2">
          <Button variant="ghost">
            <Printer />
          </Button>
          <Button variant="ghost">
            <Search />
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
          <Button variant="outline">
            <Wallet className="text-green-600" />
            Arqueo
          </Button>
          <Button variant="outline">
            <Camera className="text-blue-600" />
            R.Fotográfico
          </Button>
          <Button variant="outline">
            <Scale className="text-purple-800" />
            Balance de caja
          </Button>
          <Button variant="outline">
            <Bell className="text-red-600" />
            Notificar
          </Button>
        </menu>
      </footer>
    </PageLayout>
  );
};

export default ParkingPage;
