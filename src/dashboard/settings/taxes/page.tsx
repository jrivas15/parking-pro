import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Plus, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/dialogs/ConfimDialog";
import PageLayout from "@/layouts/PageLayout";
import BackBtn from "@/components/shared/BackBtn";
import { Tax } from "./types/tax.type";
import useTaxesQuery from "./hooks/useTaxesQuery";
import useTaxMutation from "./hooks/useTaxMutation";
import useTaxes from "./hooks/useTaxes";
import TaxFormDialog from "./dialogs/TaxFormDialog";

const TaxesPage = () => {
  const { taxes } = useTaxesQuery();
  const { deleteTaxMutation } = useTaxMutation();
  const {
    openConfirm,
    setOpenConfirm,
    selectedTax,
    openForm,
    setOpenForm,
    handleDelete,
    handleUpdate,
  } = useTaxes();

  const columns: ColumnDef<Tax>[] = [
    {
      accessorKey: "name",
      header: "Nombre",
    },
    {
      accessorKey: "percent",
      header: "Porcentaje",
      cell: ({ row }) => <span>{row.original.percent}%</span>,
    },
    {
      accessorKey: "codeEI",
      header: "Código FE",
      cell: ({ row }) => row.original.codeEI || <span className="text-muted-foreground">—</span>,
    },
    {
      accessorKey: "isActive",
      header: "Activo",
      cell: ({ row }) =>
        row.original.isActive ? (
          <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">Sí</Badge>
        ) : (
          <Badge variant="destructive">No</Badge>
        ),
    },
    {
      id: "actions",
      header: "Acciones",
      cell: (info) => {
        const tax = info.row.original;
        return (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleUpdate(tax)}>
              <Pencil />
            </Button>
            <Button variant="destructive" size="sm" onClick={() => handleDelete(tax)}>
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
        <div className="flex items-center gap-3">
          <BackBtn />
          <h1 className="text-xl font-semibold">Impuestos</h1>
        </div>
        <Button onClick={() => setOpenForm(true)}>
          <Plus />
          Nuevo impuesto
        </Button>
      </header>

      <DataTable columns={columns} data={taxes ?? []} />

      <TaxFormDialog
        open={openForm}
        setOpen={setOpenForm}
        initialData={selectedTax}
      />

      <ConfirmDialog
        title="Eliminar impuesto"
        description={`¿Estás seguro de que deseas eliminar el impuesto "${selectedTax?.name}"?`}
        fx={() => selectedTax && deleteTaxMutation.mutate(selectedTax.id)}
        open={openConfirm}
        setOpen={setOpenConfirm}
      />
    </PageLayout>
  );
};

export default TaxesPage;
