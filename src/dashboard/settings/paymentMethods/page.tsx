import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ColumnDef } from "@tanstack/react-table";
import { Banknote, Pencil, Trash } from "lucide-react";
import { PaymentMethod } from "./types/paymentMethod.type";
import { Badge } from "@/components/ui/badge";
import PaymentMethodFormDialog from "./dialogs/PaymentMethodFormDialog";
import usePaymentMethodsQuery from "./hooks/usePaymentMethodsQuery";
import { ConfirmDialog } from "@/components/dialogs/ConfimDialog";
import usePaymentMethodMutation from "./hooks/usePaymentMethodMutation";
import usePaymentMethods from "./hooks/usePaymentMethods";
import PageLayout from "@/layouts/PageLayout";
import BackBtn from "@/components/shared/BackBtn";

const PaymentMethodsPage = () => {
  const { listPaymentMethods: paymentMethods } = usePaymentMethodsQuery();
  const { deletePaymentMethodMutation } = usePaymentMethodMutation();
  const {
    openConfirm,
    setOpenConfirm,
    selectedPaymentMethod,
    handleDelete,
    handleUpdate,
    openForm,
    setOpenForm,
  } = usePaymentMethods();

  const columns: ColumnDef<PaymentMethod>[] = [
    {
      accessorKey: "name",
      header: "Nombre",
    },
    {
      accessorKey: "codeEI",
      header: "Código IE",
    },
    {
      accessorKey: "isActive",
      header: "Activo",
      cell: ({ row }) =>
        row.original.isActive ? (
          <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
            Sí
          </Badge>
        ) : (
          <Badge variant="destructive">No</Badge>
        ),
    },
    {
      id: "actions",
      header: "Acciones",
      cell: (info) => {
        const paymentMethod = info.row.original;
        return (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleUpdate(paymentMethod)}
            >
              <Pencil />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="ml-2"
              onClick={() => handleDelete(paymentMethod)}
            >
              <Trash />
            </Button>
          </>
        );
      },
    },
  ];

  return (
    <PageLayout>
      <header className="flex justify-between items-center">
        <div className="flex items-center">
          <BackBtn />
          <div>
            <div className="flex items-center gap-2">
              <Banknote className="size-11" />
              <h1 className="text-white text-3xl">Métodos de pago</h1>
            </div>
            <span className="text-sm text-muted-foreground">
              Administra los métodos de pago del sistema
            </span>
          </div>
        </div>
        <PaymentMethodFormDialog
          initialData={selectedPaymentMethod}
          open={openForm}
          setOpen={setOpenForm}
        />
      </header>
      <Separator className="my-2" />
      <div>
        <DataTable columns={columns} data={paymentMethods || []} />
      </div>
      <ConfirmDialog
        open={openConfirm}
        setOpen={setOpenConfirm}
        fx={() => deletePaymentMethodMutation.mutate(selectedPaymentMethod!.id)}
        title="Confirmar"
        description="¿Estás seguro de que deseas eliminar este método de pago?"
      />
    </PageLayout>
  );
};

export default PaymentMethodsPage;
