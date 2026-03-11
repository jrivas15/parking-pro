
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  defaultValues,
  PaymentFormData,
  paymentSchema,
} from "../schemas/payment.schema";
import React, { useEffect, useState } from "react";
import { Movement, PaymentData } from "../types/movements.type";
import useMovementQuery from "./useMovementQuery";
import { useQueryClient } from "@tanstack/react-query";
import { newSale } from "../services/sales.service";
import { sileo } from "sileo";

interface UsePaymentFormProps {
  open: boolean;
  selectedMovement: Movement | null;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const usePaymentForm = ({ open, selectedMovement, setOpen }: UsePaymentFormProps) => {
  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues,
  });

  const discount = form.watch("discount");
  const amountPaid = form.watch("amountPaid");
  const total = form.watch("total");
  const isIE = form.watch("isEI");
  const tariff = form.watch("tariff");

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openCustomerSearch, setOpenCustomerSearch] = useState(false);
  const [cashBack, setCashBack] = useState(0);
  const { movementPaymentQuery } = useMovementQuery({
    plate: selectedMovement?.plate,
    tariff: tariff ? parseInt(tariff) : undefined,
  });

  const paymentData = movementPaymentQuery.data;

  const queryClient = useQueryClient()
  // Set total from paymentData
  useEffect(() => {
    if (paymentData) {
      form.setValue("total", paymentData.total);
      form.setValue("parkingTime", paymentData.parkingTime);
      // console.log(selectedMovement)
    }
    if (selectedMovement) form.setValue("nTicket", selectedMovement.nTicket);

  }, [ form, selectedMovement]);

  // Calculate cashback
  useEffect(() => {
    if (total) {
      setCashBack(Math.round((amountPaid - total) * 100) / 100);
    }
  }, [amountPaid, total]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      form.reset(defaultValues);
      setCashBack(0);
    } else if (open && selectedMovement) {
      // When dialog opens, set nTicket
      form.setValue("nTicket", selectedMovement.nTicket);
    }
  }, [open, form, selectedMovement]);

  // Cuando llega la data de la query (cubre el caso 409 donde paymentData llega null al abrir)
  useEffect(() => {
    if (paymentData) {
      form.setValue("total", paymentData.total);
      form.setValue("parkingTime", paymentData.parkingTime);
    }
  }, [paymentData, form]);

  // Descuento sobre el total más reciente disponible
  const baseTotal = paymentData?.total ?? paymentData?.total ?? 0;
  useEffect(() => {
    if (discount > 0) {
      form.setValue("total", discount <= baseTotal ? baseTotal - discount : 0);
    }
  }, [discount, baseTotal, form]);

  //* ----LOAD TARIFF
  useEffect(() => {
    if (paymentData?.tariff) {
      form.setValue("tariff", paymentData?.tariff.toString());
    } else if (selectedMovement?.tariff) {
      form.setValue("tariff", selectedMovement.tariff.toString());
    }
  }, [selectedMovement, paymentData]);

  const onSubmit = async (data: PaymentFormData) => {
    // console.log(data);
    const response = await newSale(data);
    if (response) {
      setOpen(false)
      sileo.success({ title: "Venta Exitosa", description: "Pago registrado exitosamente" });
      queryClient.invalidateQueries({ queryKey: ['movements'] })
    } else {
      sileo.error({ title: "Error en la venta", description: "Ocurrió un error al registrar el pago" });
    }
  };

  const handleSelectCustomer = (customer: {
    name: string;
    type: "NATURAL" | "JURIDICA";
    typeDoc: string;
    nDoc: string;
    email: string;
  }) => {
    form.setValue("isEI", true);
    form.setValue("customerType", customer.type);
    form.setValue("customerName", customer.name);
    form.setValue("customerTypeDoc", customer.typeDoc as "CC" | "NIT");
    form.setValue("customerNDoc", customer.nDoc);
    form.setValue("customerEmail", customer.email);
  };

  const handleClearCustomer = () => {
    form.setValue("customerType", defaultValues.customerType);
    form.setValue("customerName", "");
    form.setValue("customerTypeDoc", defaultValues.customerTypeDoc);
    form.setValue("customerNDoc", "");
    form.setValue("customerEmail", "");
  };

  const handleExactAmount = () => {
    form.setValue("amountPaid", total ?? 0, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    setOpenConfirmDialog(true);
  };

  return {
    form,
    discount,
    amountPaid,
    total,
    isIE,
    openConfirmDialog,
    setOpenConfirmDialog,
    openCustomerSearch,
    setOpenCustomerSearch,
    cashBack,
    onSubmit,
    handleSelectCustomer,
    handleClearCustomer,
    handleExactAmount,
  };
};

export default usePaymentForm;
