import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Crown, Pencil, Trash2, Search, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/shared/DataTable";
import PageLayout from "@/layouts/PageLayout";
import BackBtn from "@/components/shared/BackBtn";
import Plate from "@/dashboard/parking/components/Plate";
import { ConfirmDialog } from "@/components/dialogs/ConfimDialog";
import VipFormDialog from "./dialogs/VipFormDialog";
import useVipQuery from "./hooks/useVipQuery";
import useVipMutation from "./hooks/useVipMutation";
import { Vip } from "./types/vip.type";

const VipPage = () => {
  const { vips, isLoading } = useVipQuery();
  const { deleteVipMutation } = useVipMutation();

  const [search, setSearch]           = useState("");
  const [selected, setSelected]       = useState<Vip | null>(null);
  const [openForm, setOpenForm]       = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  const handleUpdate = (vip: Vip) => { setSelected(vip); setOpenForm(true); };
  const handleDelete = (vip: Vip) => { setSelected(vip); setOpenConfirm(true); };
  const handleCreate = (open: boolean) => { if (open) setSelected(null); setOpenForm(open); };

  const filtered = (vips ?? []).filter((v) =>
    !search ||
    v.vehicle_plate.toUpperCase().includes(search.toUpperCase()) ||
    (v.customer_name ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const columns: ColumnDef<Vip>[] = [
    {
      header: "Placa",
      cell: (info) => <Plate plate={info.row.original.vehicle_plate} />,
    },
    {
      header: "Cliente",
      cell: (info) => (
        <span className="text-sm text-muted-foreground">
          {info.row.original.customer_name ?? "—"}
        </span>
      ),
    },
    {
      accessorKey: "card",
      header: "Tarjeta",
      cell: (info) => (
        <span className="font-mono text-sm">{(info.getValue() as string | null) ?? "—"}</span>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Estado",
      cell: (info) =>
        info.getValue() ? (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
            <CheckCircle2 className="size-3 mr-1" /> Activo
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-muted text-muted-foreground border-border">
            <Clock className="size-3 mr-1" /> Inactivo
          </Badge>
        ),
    },
    {
      accessorKey: "note",
      header: "Nota",
      cell: (info) => (
        <span className="text-xs text-muted-foreground">{(info.getValue() as string | null) ?? "—"}</span>
      ),
    },
    {
      id: "actions",
      header: "Acciones",
      cell: (info) => {
        const vip = info.row.original;
        return (
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="size-8" onClick={() => handleUpdate(vip)}>
              <Pencil size={13} />
            </Button>
            <Button
              variant="outline" size="icon"
              className="size-8 text-destructive hover:text-destructive"
              onClick={() => handleDelete(vip)}
            >
              <Trash2 size={13} />
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
              <Crown className="size-9" />
              <h1 className="text-white text-3xl">VIP</h1>
            </div>
            <span className="text-sm text-muted-foreground">
              Administra los vehículos con acceso VIP
            </span>
          </div>
        </div>
        <VipFormDialog
          initialData={null}
          open={openForm && !selected}
          setOpen={handleCreate}
          showTrigger
        />
      </header>

      <Separator className="my-2" />

      <div className="relative mb-3">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por placa o cliente..."
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground text-center py-10">Cargando...</p>
      ) : (
        <DataTable columns={columns} data={filtered} />
      )}

      <VipFormDialog
        initialData={selected}
        open={openForm && !!selected}
        setOpen={setOpenForm}
      />

      <ConfirmDialog
        open={openConfirm}
        setOpen={setOpenConfirm}
        title="Eliminar VIP"
        description={`¿Deseas eliminar el VIP de la placa ${selected?.vehicle_plate}?`}
        fx={() => { if (selected) deleteVipMutation.mutate(selected.id); }}
      />
    </PageLayout>
  );
};

export default VipPage;
