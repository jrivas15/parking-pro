
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  defaultValues,
  PaymentFormData,
  paymentSchema,
} from "../schemas/payment.schema";
import React, { useEffect, useState } from "react";
import { Movement, PaymentData } from "../types/movements.type";
import { PaymentMethod } from "@/dashboard/settings/paymentMethods/types/paymentMethod.type";
import useMovementQuery from "./useMovementQuery";
import { useQueryClient } from "@tanstack/react-query";
import { newSale } from "../services/sales.service";
import { SaleReceipt } from "../types/sale.type";
import { sileo } from "sileo";
import { sendEInvoice } from "@/dashboard/settings/eInvoice/services/eInvoice.service";

interface UsePaymentFormProps {
  open: boolean;
  selectedMovement: Movement | null;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSaleCompleted?: (sale: SaleReceipt) => void;
  paymentMethods?: PaymentMethod[];
}

const usePaymentForm = ({ open, selectedMovement, setOpen, onSaleCompleted, paymentMethods }: UsePaymentFormProps) => {
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

  useEffect(() => {
    if (selectedMovement) form.setValue("nTicket", selectedMovement.nTicket);
  }, [form, selectedMovement]);

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

  const baseTotal = paymentData?.total ?? 0;
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
    const sale = await newSale(data);
    if (sale) {
      setOpen(false);
      sileo.success({ title: "Venta Exitosa", description: "Pago registrado exitosamente" });
      queryClient.invalidateQueries({ queryKey: ['movements'] });
      queryClient.invalidateQueries({ queryKey: ['recent-sales'] });
      onSaleCompleted?.(sale);

      if (data.isEI) {
        try {
          const selectedPaymentMethod = paymentMethods?.find(
            (pm) => pm.id.toString() === data.paymentMethod
          );
          await sendEInvoice({
            customerName: data.customerName,
            customerNDoc: data.customerNDoc,
            customerTypeDoc: data.customerTypeDoc,
            customerEmail: data.customerEmail,
            customerAddress: data.customerAddress,
            customerCityCode: data.customerCityCode,
            subtotal: sale.subtotal,
            discounts: sale.discount,
            taxes: sale.taxValue,
            taxPercent: sale.taxPercent,
            total: sale.total,
            paymentMeansCode: selectedPaymentMethod?.codeEI ?? "10",
            externalReference: sale.id,
          });
          sileo.success({ title: "Factura electrónica", description: "Factura enviada exitosamente" });
        } catch {
          sileo.error({ title: "Factura electrónica", description: "Error al enviar la factura electrónica" });
        }
      }
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
    address?: string;
    cityCode?: string;
  }) => {
    form.setValue("isEI", true);
    form.setValue("customerType", customer.type);
    form.setValue("customerName", customer.name);
    form.setValue("customerTypeDoc", customer.typeDoc as "CC" | "NIT");
    form.setValue("customerNDoc", customer.nDoc);
    form.setValue("customerEmail", customer.email);
    form.setValue("customerAddress", customer.address ?? "");
    form.setValue("customerCityCode", customer.cityCode ?? "");
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
