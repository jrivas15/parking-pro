import MenuOption from "@/components/shared/MenuOption";
import { Users } from "lucide-react";

const ClientsPage = () => {
  return (
    <section className="grid grid-rows-[auto_1fr] h-full py-2 px-10 w-full">
      <h1 className="text-white text-center text-2xl">Clientes</h1>
      <div className="mt-20 w-full grid grid-cols-6 grid-rows-5 gap-8">
        <MenuOption
          route="/clients/clientes"
          text="Clientes"
          icon={<Users className="size-11" />}
        />
      </div>
    </section>
  );
};

export default ClientsPage;
