import { useEffect, useState } from "react";
import { Tax } from "../types/tax.type";

const useTaxes = () => {
    const [openConfirm, setOpenConfirm] = useState(false);
    const [selectedTax, setSelectedTax] = useState<Tax | null>(null);
    const [openForm, setOpenForm] = useState(false);

    const handleDelete = (tax: Tax) => {
        setSelectedTax(tax);
        setOpenConfirm(true);
    };

    const handleUpdate = (tax: Tax) => {
        setSelectedTax(tax);
        setOpenForm(true);
    };

    useEffect(() => {
        if (!openForm) {
            setSelectedTax(null);
        }
    }, [openForm]);

    return {
        openConfirm,
        setOpenConfirm,
        selectedTax,
        openForm,
        setOpenForm,
        handleDelete,
        handleUpdate,
    };
};

export default useTaxes;
