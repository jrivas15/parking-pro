import { useEffect, useState } from "react";
import { Subscription } from "../types/subscription.type";

const useSubscriptions = () => {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [selected, setSelected] = useState<Subscription | null>(null);

  const handleDelete = (s: Subscription) => {
    setSelected(s);
    setOpenConfirm(true);
  };

  const handleUpdate = (s: Subscription) => {
    setSelected(s);
    setOpenForm(true);
  };

  const handleCreate = () => {
    setSelected(null);
    setOpenForm(true);
  };

  useEffect(() => {
    if (!openForm) setSelected(null);
  }, [openForm]);

  return {
    openConfirm, setOpenConfirm,
    openForm, setOpenForm,
    selected,
    handleDelete, handleUpdate, handleCreate,
  };
};

export default useSubscriptions;
