import { useEffect, useState } from "react";
import { PaymentMethod } from "../types/paymentMethod.type";

const usePaymentMethods = () => {
    const [openConfirm, setOpenConfirm] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
    const [openForm, setOpenForm] = useState(false);

    const handleDelete = (paymentMethod: PaymentMethod) => {
        if (!paymentMethod) {
            setSelectedPaymentMethod(null);
        } else {
            setSelectedPaymentMethod(paymentMethod);
        }
        setOpenConfirm(true);
    };

    const handleUpdate = (paymentMethod: PaymentMethod) => {
        if (!paymentMethod) {
            setSelectedPaymentMethod(null);
        } else {
            setSelectedPaymentMethod(paymentMethod);
        }
        setOpenForm(true);
    };

    useEffect(() => {
        if (!openForm) {
            setSelectedPaymentMethod(null);
        }
    }, [openForm]);

    return {
        openConfirm,
        setOpenConfirm,
        selectedPaymentMethod,
        openForm,
        setOpenForm,
        handleDelete,
        handleUpdate,
    };
};

export default usePaymentMethods;
