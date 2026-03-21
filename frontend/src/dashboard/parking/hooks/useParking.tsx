import { ColumnDef } from "@tanstack/react-table";
import { use, useEffect, useState } from "react";
import { Movement, PaymentData } from "../types/movements.type";
import useMovementQuery from "./useMovementQuery";
import useMovementMutation from "./useMovementMutation";
import { sileo } from "sileo";
import Plate from "../components/Plate";
import { Bike, Calendar, Car, Info, Motorbike, Printer } from "lucide-react";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import VehicleIcon from "@/components/shared/VehicleIcon";

const lastExitsColumns: ColumnDef<Movement>[] = [
  {
    accessorKey: "plate",
    header: "Placa",
    cell: (info) => {
      const plate = info.getValue() as string;
      return <Plate plate={plate} />;
    },
  },
  {
    accessorKey: "exitTime",
    header: "Fecha de salida",
    cell: (info) => {
      const exitTime = info.getValue() as Date;
      return (
        <span className="flex items-center text-center gap-1">
          <Calendar className="size-3" />
          {dayjs(exitTime).format("DD-MM-YY HH:mm")}
        </span>
      );
    },
  },
  {
    accessorKey: "vehicleType",
    header: "Tipo",
    cell: (info) => {
      const type = info.getValue() as string;
      return <VehicleIcon type={type} />;
    },
  },
  {
    accessorKey: "nTicket",
    header: "N°.Recibo",
  },
  {
    header: "T. de pago",
    cell: (info) => {
      const exitTime = dayjs(info.row.original.exitTime);
      const tnow = dayjs()
      const diff = tnow.diff(exitTime, "minute");
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">
            {diff} {diff === 1 ? "minuto" : "minutos"}
             {" "}
            {diff >= 60 && (
              <>
                ({Math.floor(diff / 60)}{" "}
                {Math.floor(diff / 60) === 1 ? "hora" : "horas"})
              </>
            )}
          </span>
        </div>
      );

    }
  },
  {
    header: "Acciones",
    cell: (info) => {
      const movement = info.row.original;
      return (
          <div className="flex gap-1.5 mx-1">
            <Button variant="outline" size="sm">
              <Info />
            </Button>
            <Button variant="outline" size="sm">
              <Printer />
            </Button>
          </div>
        );
       
  }
  }
  
];

const useParking = () => {
  const [statsVehicles, setStatsVehicles] = useState({
    car: 0,
    motorbikes: 0,
  });
  const [plate, setPlate] = useState<string>("");
  const [selectedMovement, setSelectedMovement] = useState<Movement | null>(
    null,
  );
  const [possiblePaymentData, setPossiblePaymentData] =
    useState<PaymentData | null>(null);

  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  //*querys
  const { movementQuery, movementPaymentQuery, lastExitMovementsQuery } =
    useMovementQuery({
      plate: selectedMovement?.plate,
    });
  const movements = movementQuery.data;
  const lastExitMovements = lastExitMovementsQuery.data;

  const { newMovementMutation } = useMovementMutation();
  const [openCashCountDialog, setOpenCashCountDialog] = useState(false);
  const [plateFilter, setPlateFilter] = useState("")
  const [movementsFiltered, setMovementsFiltered] = useState<Movement[]>([])


  useEffect(() => {
    if (selectedMovement) {

      // console.log('selected mov', selectedMovement)

      if (movementPaymentQuery.data) {
        setPossiblePaymentData(movementPaymentQuery.data);
        setPlate(selectedMovement.plate);
      } 
      else {
        setPossiblePaymentData(null);
        setPlate("");
      }
    } else {
      setPossiblePaymentData(null);
      setPlate("");
    }
  }, [selectedMovement, movementPaymentQuery.data]);

  useEffect(() => {
    if (movements) {
      setMovementsFiltered(filterMovements(movements, plateFilter));
      const carCount = movements.filter((m) => m.vehicleType === "C").length;
      const motorbikesCount = movements.filter(
        (m) => m.vehicleType === "M",
      ).length;
      setStatsVehicles({
        car: carCount,
        motorbikes: motorbikesCount,
      });
    }
  }, [movements]);

  useEffect(() => {
    setMovementsFiltered(filterMovements(movements || [], plateFilter));
  }, [plateFilter]);

  const filterMovements = (movements: Movement[], filter: string) => {
    if(filter.length === 0) return movements;
    return movements.filter(m => m.plate.includes(filter) || m.nTicket.toString().includes(filter))
  }


  const handleNewVehicleEntry = () =>
    newMovementMutation.mutate(
      { plate },
      {
        onError: (error) => {
          const dataResponse = error?.response?.data as Movement[];
          if (error?.response?.status === 409) {
            // console.log(error.response.data);
            if (dataResponse.length === 1) {
              // console.log(dataResponse[0])
              setSelectedMovement(dataResponse[0]);
              setPlate(dataResponse[0].plate);
            }
            setOpenPaymentDialog(true);
          } else if (error.response.status === 404) {
            sileo.error({
              title: "Movimiento",
              description: "Movimiento no encontrado.",
            });
          }
        },
      },
    );

    // useEffect(() => {console.log(plate)},[plate])

  return {
    plate,
    setPlate,
    selectedMovement,
    setSelectedMovement,
    possiblePaymentData,
    openPaymentDialog,
    setOpenPaymentDialog,
    movementsFiltered,
    statsVehicles,
    handleNewVehicleEntry,
    lastExitMovements,
    lastExitsColumns,
    openCashCountDialog,
    setOpenCashCountDialog,
    plateFilter,
    setPlateFilter
  };
};

export default useParking;
