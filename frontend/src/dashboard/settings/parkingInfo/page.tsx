import CustomInput from "@/components/forms/CustomInput";
import FormSwitch from "@/components/forms/FormSwitch";
import FormTextArea from "@/components/forms/FormTextArea";
import BackBtn from "@/components/shared/BackBtn";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Book,
  BookDown,
  Eye,
  Info,
  Pencil,
  Printer,
  Receipt,
} from "lucide-react";

import { FormProvider } from "react-hook-form";

import useParkingInfo from "./hooks/useParkingInfo";
import PageLayout from "@/layouts/PageLayout";
import { useState } from "react";
import TicketPreviewDialog from "./components/TicketPreviewDialog";

const ParkingInfo = () => {
  const { form, mode, handleEdit, handleCancel, onSubmit } = useParkingInfo();
  const [openPreview, setOpenPreview] = useState(false);

  return (
    <PageLayout>
      <header className="flex justify-between items-center">
        <div className="flex">
          <BackBtn />
          <div className="">
            <h1 className="text-2xl font-bold">Información del parqueadero</h1>
            <span className="text-sm text-muted-foreground">
              Gestiona la información básica del parqueadero
            </span>
          </div>
        </div>
      </header>
      <Separator className="my-2" />

      <FormProvider {...form}>
        <form
          className="grid grid-cols-2 gap-2.5 overflow-y-auto flex-1 min-h-0 pb-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="text-primary" /> Información básica
              </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-1.5">
              <CustomInput
                formName="name"
                label={"Nombre"}
                disabled={mode === "view"}
              />
              <CustomInput
                formName="nit"
                label={"NIT"}
                disabled={mode === "view"}
              />
              <CustomInput
                formName="address"
                label={"Dirección"}
                disabled={mode === "view"}
              />
              <CustomInput
                formName="phone"
                label={"Teléfono"}
                disabled={mode === "view"}
              />
              <CustomInput
                formName="email"
                label={"Correo electrónico"}
                disabled={mode === "view"}
              />
              <CustomInput
                formName="additionalInfo"
                label="Información adicional"
                disabled={mode === "view"}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="text-primary" /> Ticket
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col">
              <div className="flex flex-col gap-1">
                <h2 className="mb-2 flex gap-1 font-semibold">
                  <Book className="text-primary gap-1" />
                  Encabezado
                </h2>
                <div className="p-4 flex flex-col gap-2 border rounded-lg">
                  <FormSwitch
                    formName="includeLogo"
                    label="Usar logo"
                    disabled={mode === "view"}
                  />
                  <FormSwitch
                    formName="includeParkingInfo"
                    label="Usar información del parqueadero"
                    disabled={mode === "view"}
                  />
                  <FormSwitch
                    formName="includeFeResolution"
                    label="Usar resolución de facturación electrónica"
                    disabled={mode === "view"}
                  />
                  <FormTextArea
                    formName="ticketHeader"
                    label="Encabezado"
                    disabled={mode === "view"}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="mb-2 mt-3 flex font-semibold">
                  <BookDown className="text-primary" />
                  Pie de página
                </h2>
                <div className="p-4 flex flex-col gap-2 border rounded-lg">
                  <FormSwitch
                    formName="includeQRCode"
                    label="Mostrar código QR"
                    disabled={mode === "view"}
                  />
                  <FormSwitch
                    formName="includeBasicRules"
                    label="Usar reglamento básico"
                    disabled={mode === "view"}
                  />
                  <FormTextArea
                    formName="ticketFooter"
                    label={"Pie de página"}
                    disabled={mode === "view"}
                  />
                </div>
              </div>
              <menu className="grid grid-cols-2 gap-2 mt-2">
                <Button variant="outline" type="button" onClick={() => setOpenPreview(true)}>
                  <Eye /> Previsualizar
                </Button>
                <Button variant="outline" type="button" onClick={() => setOpenPreview(true)}>
                  <Printer /> Imprimir
                </Button>
              </menu>
            </CardContent>
          </Card>
          <TicketPreviewDialog open={openPreview} onOpenChange={setOpenPreview} />
          <menu className="flex justify-between col-span-2 ">
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={mode === "view"}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleEdit}
                disabled={mode !== "view"}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </Button>
            </div>
            <div>
              <Button type="submit" disabled={mode === "view"}>
                Guardar
              </Button>
            </div>
          </menu>
        </form>
      </FormProvider>
    </PageLayout>
  );
};

export default ParkingInfo;
