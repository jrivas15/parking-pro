import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { Movement, PaymentData } from "../types/movements.type";
import useMovementQuery from "./useMovementQuery";
import useMovementMutation from "./useMovementMutation";

const lastExitsColumns: ColumnDef<any>[] = [];

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

  const [openPaymentDialog, setOpenPaymentDialog] = useState(true);
  //*querys
  const { movementQuery } = useMovementQuery({})
  const movements = movementQuery.data
  const { movementPaymentQuery } = useMovementQuery({
    plate: selectedMovement?.plate,
  });
  const { newMovementMutation } = useMovementMutation()

  useEffect(() => {
    if (selectedMovement) {
      if (movementPaymentQuery.data) {
        const total = movementPaymentQuery.data.total;
        console.log(total);
        setPossiblePaymentData(movementPaymentQuery.data);
        setPlate(selectedMovement.plate);
      } else {
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
      const carCount = movements.filter((m) => m.vehicleType === "C").length;
      const motorbikesCount = movements.filter((m) => m.vehicleType === "M").length;
      setStatsVehicles({
        car: carCount,
        motorbikes: motorbikesCount,
      });
    }

  }, [movements]);

  const handleNewVehicleEntry = () => newMovementMutation.mutate({ plate})
  

  return {
    plate,
    setPlate,
    selectedMovement,
    setSelectedMovement,
    possiblePaymentData,
    openPaymentDialog,
    setOpenPaymentDialog,
    movements,
    statsVehicles,
    handleNewVehicleEntry
  };
};

export default useParking;
