import { ColumnDef } from "@tanstack/react-table";
import { Users, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/DataTable";
import PageLayout from "@/layouts/PageLayout";
import BackBtn from "@/components/shared/BackBtn";
import { ConfirmDialog } from "@/components/dialogs/ConfimDialog";
import CustomerFormDialog from "./dialogs/CustomerFormDialog";
import useCustomersQuery from "./hooks/useCustomersQuery";
import useCustomerMutation from "./hooks/useCustomerMutation";
import useCustomers from "./hooks/useCustomers";
import { Customer } from "./types/customer.type";

const CustomersListPage = () => {
  const { listCustomers } = useCustomersQuery();
  const { deleteCustomerMutation } = useCustomerMutation();
  const {
    openConfirm,
    setOpenConfirm,
    selectedCustomer,
    openForm,
    setOpenForm,
    handleDelete,
    handleUpdate,
  } = useCustomers();

  const columns: ColumnDef<Customer>[] = [
    {
      header: "Cliente",
      cell: (info) => {
        const { name, personType } = info.row.original;
        return (
          <div className="flex flex-col text-sm leading-5">
            <span className="font-medium">{name}</span>
            <Badge
              variant="outline"
              className={`w-fit mt-0.5 text-xs ${
                personType === "JURIDICA"
                  ? "border-blue-500/30 bg-blue-500/10 text-blue-400"
                  : "border-green-500/30 bg-green-500/10 text-green-500"
              }`}
            >
              {personType === "JURIDICA" ? "Jurídica" : "Natural"}
            </Badge>
          </div>
        );
      },
    },
    {
      header: "Documento",
      cell: (info) => {
        const { documentType, nDoc } = info.row.original;
        return <span className="text-sm text-muted-foreground">{documentType}: {nDoc}</span>;
      },
    },
    {
      accessorKey: "phone",
      header: "Teléfono",
      cell: (info) => <span className="text-sm text-muted-foreground">{(info.getValue() as string) || "—"}</span>,
    },
    {
      accessorKey: "email",
      header: "Correo",
      cell: (info) => <span className="text-sm text-muted-foreground">{(info.getValue() as string) || "—"}</span>,
    },
    {
      accessorKey: "address",
      header: "Dirección",
      cell: (info) => (
        <span className="text-xs text-muted-foreground italic truncate max-w-36 block">
          {(info.getValue() as string) || "—"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Acciones",
      cell: (info) => {
        const customer = info.row.original;
        return (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleUpdate(customer)}>
              <Pencil />
            </Button>
            <Button variant="destructive" size="sm" onClick={() => handleDelete(customer)}>
              <Trash />
            </Button>
          </div>
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
              <Users className="size-11" />
              <h1 className="text-white text-3xl">Clientes</h1>
            </div>
            <span className="text-sm text-muted-foreground">
              Administra los clientes registrados en el sistema
            </span>
          </div>
        </div>
        <CustomerFormDialog
          initialData={selectedCustomer}
          open={openForm}
          setOpen={setOpenForm}
        />
      </header>
      <Separator className="my-2" />
      <DataTable columns={columns} data={listCustomers ?? []} />
      <ConfirmDialog
        open={openConfirm}
        setOpen={setOpenConfirm}
        fx={() => deleteCustomerMutation.mutate(selectedCustomer!.id)}
        title="Eliminar cliente"
        description={`¿Estás seguro de que deseas eliminar a ${selectedCustomer?.name}?`}
      />
    </PageLayout>
  );
};

export default CustomersListPage;
