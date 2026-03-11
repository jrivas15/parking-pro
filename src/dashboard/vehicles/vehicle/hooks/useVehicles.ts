import { useEffect, useState } from "react";
import { Vehicle } from "../types/vehicle.type";

const useVehicles = () => {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [openForm, setOpenForm] = useState(false);

  const handleDelete = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle ?? null);
    setOpenConfirm(true);
  };

  const handleUpdate = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle ?? null);
    setOpenForm(true);
  };

  const handleCreate = () => {
    setSelectedVehicle(null);
    setOpenForm(true);
  };

  useEffect(() => {
    if (!openForm) setSelectedVehicle(null);
  }, [openForm]);

  return {
    openConfirm,
    setOpenConfirm,
    selectedVehicle,
    openForm,
    setOpenForm,
    handleDelete,
    handleUpdate,
    handleCreate,
  };
};

export default useVehicles;
