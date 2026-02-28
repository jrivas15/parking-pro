import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Banknote, Clock, Coins, ImageOff, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Plate from "./Plate";
import { Separator } from "@/components/ui/separator";
import FormSelect from "@/components/forms/FormSelect";
import CustomInput from "@/components/forms/CustomInput";
import { Button } from "@/components/ui/button";
import FormSwitch from "@/components/forms/FormSwitch";
import { Movement, PaymentData } from "../types/movements.type";
import dayjs from "dayjs";
import useTariffQuery from "@/dashboard/settings/tariffs/hooks/useTariffQuery";
import usePaymentMethodsQuery from "@/dashboard/settings/paymentMethods/hooks/usePaymentMethodsQuery";
import { zodResolver } from "@hookform/resolvers/zod";
import { defaultValues, PaymentFormData, paymentSchema } from "../schemas/payment.schema";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  paymentData: PaymentData | null;
  selectedMovement: Movement | null;
}

const PaymentDialog = ({
  open,
  setOpen,
  paymentData,
  selectedMovement,
}: Props) => {
  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues
  });
  const [cashBack, setCashBack] = useState(0);

  const { data: tariffs } = useTariffQuery();
  const { listPaymentMethods: paymentMethods } = usePaymentMethodsQuery();
  const paymentMethodOptions =
    paymentMethods?.map((pm) => ({
      label: pm.name,
      value: pm.id.toString(),
    })) || [];
  const tariffOptions =
    tariffs
      ?.filter((t) => t.vehicleType === selectedMovement?.vehicleType)
      .map((t) => ({ label: t.name, value: t.id.toString() })) || [];


  useEffect(() => {
    if (selectedMovement?.tariff) {
      form.setValue("tariff" as any, selectedMovement.tariff.toString());
    }
  }, [selectedMovement])


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Recibir pago</DialogTitle>
          <DialogDescription>
            Complete el formulario para procesar el pago.
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <form>
            <div className="grid grid-cols-2 gap-5">
              <section className="flex flex-col">
                <Card className="">
                  <CardContent className="grid grid-cols-[auto_1fr] gap-4">
                    <div className="size-25 bg-accent flex items-center justify-center rounded-md">
                      <ImageOff className="text-muted-foreground" />
                    </div>
                    <div className="w-full flex flex-col gap-2 justify-evenly">
                      <div className="flex justify-between">
                        <span>Placa:</span>
                        <Plate plate={selectedMovement?.plate || ""} />
                      </div>
                      <div className="flex justify-between">
                        <span>Entrada:</span>
                        <span>
                          {selectedMovement?.entryTime
                            ? dayjs(selectedMovement.entryTime).format("HH:mm")
                            : "--"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="flex items-center gap-1">
                          <Clock size={20} />
                          Tiempo:
                        </span>
                        <span className="text-primary">
                          {paymentData?.parkingTime || "--"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Separator className="my-4" />
                <div className="flex gap-3 flex-col border border-muted rounded-md p-3 flex-1">
                  <div className="flex justify-between mb-4 items-center w-full ">
                    <div className="flex items-center gap-2">
                      <User size={30} className="text-primary" />
                      <h2>Informacion del cliente</h2>
                    </div>
                    <div>
                      <FormSwitch
                        formName={"isFE"}
                        label="Factura electrónica"
                      />
                    </div>
                  </div>
                  <CustomInput
                    formName="customerName"
                    label={"Nombre o Razón Social"}
                  />
                  <div className="flex gap-3 ">
                    <CustomInput
                      formName="customerTypeDoc"
                      label={"Tipo de Documento"}
                    />
                    <CustomInput formName="customerNDoc" label={"N° Documento"} />
                  </div>
                  <CustomInput formName="customerEmail" label={"Correo electrónico"} />
                </div>
              </section>
              <section className="flex flex-col gap-3">
                <div>
                  <h3 className="text-muted-foreground">Total a pagar</h3>
                  <h1 className="text-5xl font-bold text-primary">
                    ${paymentData?.total ?? "0.00"}
                  </h1>
                </div>
                <Separator className="my-2" />
                <div className="flex flex-col gap-3 border border-muted rounded-md p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Coins size={30} className="text-primary" />
                    <h2>Detalles de pago</h2>
                  </div>
                  <div className="flex gap-3">
                    <FormSelect
                      options={tariffOptions}
                      formName={"tariff"}
                      label={"Tarifa"}
                      placeholder={""}
                    />
                    <FormSelect
                      options={paymentMethodOptions}
                      formName={"paymentMethod"}
                      label={"Metodo de pago"}
                      placeholder={""}
                    />
                  </div>
                  <CustomInput formName="note" label={"Nota"} />
                  <CustomInput formName="discount" label={"Descuento"} />

                  <div className="flex gap-3">
                    <CustomInput formName="amountPaid" label={"Paga con"} autoFocus/>
                    <Button variant="outline" className="self-end">
                      <Banknote className="text-primary" />
                      Dinero exacto
                    </Button>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1">
                      {/* <B size={20} /> */}
                      Devuelta:
                    </span>
                    <span className="text-primary text-2xl">$50.000</span>
                  </div>
                </div>
              </section>
            </div>
            <menu className="mt-10 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Procesar pago</Button>
            </menu>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
