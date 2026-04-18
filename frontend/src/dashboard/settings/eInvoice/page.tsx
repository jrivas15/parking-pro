import CustomInput from "@/components/forms/CustomInput";
import BackBtn from "@/components/shared/BackBtn";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { KeyRound, Pencil, Server } from "lucide-react";
import { FormProvider } from "react-hook-form";
import useEInvoiceConfig from "./hooks/useEInvoiceConfig";
import PageLayout from "@/layouts/PageLayout";

const EInvoiceSettingsPage = () => {
  const { form, mode, handleEdit, handleCancel, onSubmit } = useEInvoiceConfig();

  return (
    <PageLayout>
      <header className="flex justify-between items-center">
        <div className="flex">
          <BackBtn />
          <div>
            <h1 className="text-2xl font-bold">Facturación electrónica</h1>
            <span className="text-sm text-muted-foreground">
              Configura la conexión con el servicio de facturación electrónica
            </span>
          </div>
        </div>
      </header>
      <Separator className="my-2" />

      <FormProvider {...form}>
        <form
          className="flex flex-col gap-2.5 overflow-y-auto flex-1 min-h-0 pb-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <Card className="max-w-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="text-primary" /> Conexión API
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <CustomInput
                formName="endpoint"
                label="Endpoint"
                disabled={mode === "view"}
              />
              <CustomInput
                formName="api_key"
                label="API Key"
                disabled={mode === "view"}
                type={mode === "view" ? "password" : "text"}
              />
            </CardContent>
          </Card>

          <menu className="flex justify-between max-w-xl">
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
                <KeyRound className="mr-2 h-4 w-4" />
                Guardar
              </Button>
            </div>
          </menu>
        </form>
      </FormProvider>
    </PageLayout>
  );
};

export default EInvoiceSettingsPage;
