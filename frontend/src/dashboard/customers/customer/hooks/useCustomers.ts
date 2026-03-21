import { useEffect, useState } from "react";
import { Customer } from "../types/customer.type";

const useCustomers = () => {
  const [openConfirm, setOpenConfirm]           = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [openForm, setOpenForm]                 = useState(false);

  const handleDelete = (customer: Customer) => {
    setSelectedCustomer(customer ?? null);
    setOpenConfirm(true);
  };

  const handleUpdate = (customer: Customer) => {
    setSelectedCustomer(customer ?? null);
    setOpenForm(true);
  };

  useEffect(() => {
    if (!openForm) setSelectedCustomer(null);
  }, [openForm]);

  return {
    openConfirm,
    setOpenConfirm,
    selectedCustomer,
    openForm,
    setOpenForm,
    handleDelete,
    handleUpdate,
  };
};

export default useCustomers;
