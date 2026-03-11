import MenuOption from "@/components/shared/MenuOption";
import { CalendarDays, Crown, ShieldOff, History, Handshake, Car } from "lucide-react";

const VehiclesPage = () => {
  return (
    <section className="grid grid-rows-[auto_1fr] h-full py-2 px-10 w-full">
      <h1 className="text-white text-center text-2xl">Vehículos</h1>
      <div className="mt-20 w-full grid grid-cols-6 grid-rows-5 gap-8">
        <MenuOption          route="/vehicles/vehiculos"
          text="Vehículos"
          icon={<Car className="size-11" />}
        />
        <MenuOption          route="/vehicles/mensualidades"
          text="Mensualidades"
          icon={<CalendarDays className="size-11" />}
        />
        <MenuOption
          route="/vehicles/vip"
          text="VIP"
          icon={<Crown className="size-11" />}
        />
        <MenuOption
          route="/vehicles/vetadas"
          text="Vetadas"
          icon={<ShieldOff className="size-11" />}
        />
        <MenuOption
          route="/vehicles/historial"
          text="Historial de placas"
          icon={<History className="size-11" />}
        />
        <MenuOption
          route="/vehicles/convenios"
          text="Convenios"
          icon={<Handshake className="size-11" />}
        />
      </div>
    </section>
  );
};

export default VehiclesPage;
