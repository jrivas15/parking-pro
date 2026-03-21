import { ColumnDef } from "@tanstack/react-table";
import { Car, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/shared/DataTable";
import PageLayout from "@/layouts/PageLayout";
import BackBtn from "@/components/shared/BackBtn";
import Plate from "@/dashboard/parking/components/Plate";
import VehicleIcon from "@/components/shared/VehicleIcon";
import { ConfirmDialog } from "@/components/dialogs/ConfimDialog";
import VehicleFormDialog from "./dialogs/VehicleFormDialog";
import useVehiclesQuery from "./hooks/useVehiclesQuery";
import useVehicleMutation from "./hooks/useVehicleMutation";
import useVehicles from "./hooks/useVehicles";
import { Vehicle } from "./types/vehicle.type";

const VEHICLE_TYPE_LABEL: Record<string, string> = { C: "Carro", M: "Moto", B: "Bici" };
const COLOR_LABEL: Record<string, string> = {
  blanco: "Blanco", negro: "Negro", gris: "Gris", plata: "Plata",
  rojo: "Rojo", azul: "Azul", verde: "Verde", amarillo: "Amarillo", otro: "Otro",
};

const VehiclesListPage = () => {
  const { listVehicles } = useVehiclesQuery();
  const { deleteVehicleMutation } = useVehicleMutation();
  const {
    openConfirm,
    setOpenConfirm,
    selectedVehicle,
    openForm,
    setOpenForm,
    handleDelete,
    handleUpdate,
  } = useVehicles();

  const columns: ColumnDef<Vehicle>[] = [
    {
      accessorKey: "plate",
      header: "Placa",
      cell: (info) => <Plate plate={info.getValue() as string} />,
    },
    {
      accessorKey: "vehicleType",
      header: "Tipo",
      cell: (info) => (
        <div className="flex items-center gap-2">
          <VehicleIcon type={info.getValue() as string} />
          <span className="text-sm">{VEHICLE_TYPE_LABEL[info.getValue() as string]}</span>
        </div>
      ),
    },
    {
      header: "Vehículo",
      cell: (info) => {
        const { brand, model, year, color } = info.row.original;
        return (
          <div className="flex flex-col text-sm leading-5">
            <span className="font-medium">{brand} {model}</span>
            <span className="text-muted-foreground">{year} · {COLOR_LABEL[color] ?? color}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "ownerName",
      header: "Propietario",
      cell: (info) => {
        const { ownerName, ownerPhone } = info.row.original;
        return (
          <div className="flex flex-col text-sm leading-5">
            <span className="font-medium">{ownerName}</span>
            <span className="text-muted-foreground">{ownerPhone}</span>
          </div>
        );
      },
    },
    {
      header: "Documento",
      cell: (info) => {
        const { docType, ownerDoc } = info.row.original;
        return <span className="text-sm">{docType}: {ownerDoc}</span>;
      },
    },
    {
      id: "actions",
      header: "Acciones",
      cell: (info) => {
        const vehicle = info.row.original;
        return (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleUpdate(vehicle)}>
              <Pencil />
            </Button>
            <Button variant="destructive" size="sm" onClick={() => handleDelete(vehicle)}>
              <Trash />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <PageLayout>
      <header className="flex justify-between items-center">
        <div className="flex items-center">
          <BackBtn />
          <div>
            <div className="flex items-center gap-2">
              <Car className="size-11" />
              <h1 className="text-white text-3xl">Vehículos</h1>
            </div>
            <span className="text-sm text-muted-foreground">
              Administra los vehículos registrados en el sistema
            </span>
          </div>
        </div>
        <VehicleFormDialog
          initialData={selectedVehicle}
          open={openForm}
          setOpen={setOpenForm}
        />
      </header>
      <Separator className="my-2" />
      <div>
        <DataTable columns={columns} data={listVehicles ?? []} />
      </div>
      <ConfirmDialog
        open={openConfirm}
        setOpen={setOpenConfirm}
        fx={() => deleteVehicleMutation.mutate(selectedVehicle!.id)}
        title="Eliminar vehículo"
        description={`¿Estás seguro de que deseas eliminar la placa ${selectedVehicle?.plate}?`}
      />
    </PageLayout>
  );
};

export default VehiclesListPage;

