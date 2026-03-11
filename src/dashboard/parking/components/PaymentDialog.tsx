import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Banknote, Clock, Coins, ImageOff, Search, User } from "lucide-react";
import React from "react";
import { FormProvider } from "react-hook-form";
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
import FormDecimalInput from "@/components/forms/FormDecimalInput";
import { formatNumByCommas } from "@/utils/formatNumber";
import { ConfirmDialog } from "@/components/dialogs/ConfimDialog";
import CustomerSearchDialog from "./CustomerSearchDialog";
import usePaymentForm from "../hooks/usePaymentForm";

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
  const {
    form,
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
  } = usePaymentForm({ open, selectedMovement, setOpen });

  const { data: tariffs } = useTariffQuery();
  const { listPaymentMethods: paymentMethods } = usePaymentMethodsQuery();
  const paymentMethodOptions =
    paymentMethods?.map((pm) => ({
      label: pm.name,
      value: pm.id.toString(),
    })) || [];
    // console.log(selectedMovement)
  const tariffOptions =
    tariffs
      ?.filter((t) => t.vehicleType === selectedMovement?.vehicleType)
      .map((t) => ({ label: t.name, value: t.id.toString() })) || [];


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
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-5">
              <section className="flex flex-col">
                <Card>
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
                    <div className="flex items-center gap-2">
                      <FormSwitch
                        formName={"isEI"}
                        label="Factura electrónica"
                      />
                    </div>
                  </div>
                  <FormSelect
                    options={[
                      { label: "Natural", value: "NATURAL" },
                      { label: "Jurídica", value: "JURIDICA" },
                    ]}
                    formName="customerType"
                    label="Tipo de cliente"
                    placeholder="Seleccione el tipo de cliente"
                    disabled={!isIE}
                  />
                  <div className="flex gap-3 items-end">
                    <CustomInput
                      formName="customerName"
                      label={"Nombre o Razón Social"}
                      disabled={!isIE}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() => setOpenCustomerSearch(true)}
                      disabled={!isIE}
                    >
                      <Search size={25} />
                    </Button>
                  </div>
                  <div className="flex gap-3 ">
                    <FormSelect
                      options={[
                        { label: "CC", value: "CC" },
                        { label: "NIT", value: "NIT" },
                      ]}
                      placeholder="Seleccionar doc"
                      formName="customerTypeDoc"
                      label={"Tipo de Documento"}
                      disabled={!isIE}
                    />
                    <CustomInput
                      formName="customerNDoc"
                      label={"N° Documento"}
                      disabled={!isIE}
                    />
                  </div>
                  <CustomInput
                    formName="customerEmail"
                    label={"Correo electrónico"}
                    disabled={!isIE}
                  />
                </div>
              </section>
              <section className="flex flex-col gap-3">
                <div>
                  <h3 className="text-muted-foreground">Total a pagar</h3>
                  <h1 className="text-5xl font-bold text-primary">
                    ${formatNumByCommas(total ?? 0)}
                  </h1>
                </div>
                <Separator className="my-2" />
                <div className="flex flex-col gap-3 border border-muted rounded-md p-3 flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Coins size={30} className="text-primary" />
                    <h2>Detalles de pago</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
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
                  <FormDecimalInput formName="discount" label={"Descuento"} />

                  <div className="flex gap-3">
                    <FormDecimalInput
                      formName="amountPaid"
                      label={"Paga con"}
                      autoFocus
                      fxEnterKeyDown={handleExactAmount}
                    />
                    <Button
                      variant="outline"
                      className="self-end"
                      type="button"
                      onClick={handleExactAmount}
                    >
                      <Banknote className="text-primary" />
                      Dinero exacto
                    </Button>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1">Devuelta:</span>
                    <span
                      className={`text-3xl ${cashBack < 0 ? "text-red-500" : "text-green-500"}`}
                    >
                      ${formatNumByCommas(cashBack)}
                    </span>
                  </div>
                </div>
              </section>
            </div>
            <menu className="mt-10 flex justify-between gap-2">
              <div>
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleClearCustomer}
                  disabled={!isIE}
                >
                  Limpiar
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={() => setOpenConfirmDialog(true)}
                >
                  Procesar pago
                </Button>
              </div>
            </menu>
          </form>
        </FormProvider>
      </DialogContent>
      <ConfirmDialog
        title={"Procesar pago"}
        description={"¿Estás seguro de que deseas procesar el pago?"}
        fx={form.handleSubmit(onSubmit)}
        open={openConfirmDialog}
        setOpen={setOpenConfirmDialog}
      />
      <CustomerSearchDialog
        open={openCustomerSearch}
        setOpen={setOpenCustomerSearch}
        onSelectCustomer={handleSelectCustomer}
      />
    </Dialog>
  );
};

export default PaymentDialog;
