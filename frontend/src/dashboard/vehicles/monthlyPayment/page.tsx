import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/DataTable";
import PageLayout from "@/layouts/PageLayout";
import BackBtn from "@/components/shared/BackBtn";
import {
  Users,
  CheckCircle2,
  CalendarClock,
  AlertCircle,
  Search,
  Pencil,
  Trash2,
  CircleDollarSign,
} from "lucide-react";
import dayjs from "dayjs";
import { Subscription, SubscriptionState } from "./types/subscription.type";
import useSubscriptionsQuery from "./hooks/useSubscriptionsQuery";
import useSubscriptionMutation from "./hooks/useSubscriptionMutation";
import useSubscriptions from "./hooks/useSubscriptions";
import SubscriptionFormDialog from "./dialogs/SubscriptionFormDialog";
import SubscriptionPaymentsDialog from "./dialogs/SubscriptionPaymentsDialog";
import { ConfirmDialog } from "@/components/dialogs/ConfimDialog";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt = (n: number) =>
  "$" + Number(n).toLocaleString("es-CO", { minimumFractionDigits: 2 });

const stateLabel: Record<SubscriptionState, string> = {
  active:    "Activo",
  expired:   "Vencido",
  cancelled: "Cancelado",
  pending:   "Pendiente",
};

const stateClass: Record<SubscriptionState, string> = {
  active:    "bg-green-500/15 text-green-500 border-green-500/30",
  expired:   "bg-destructive/15 text-destructive border-destructive/30",
  cancelled: "bg-muted text-muted-foreground border-border",
  pending:   "bg-orange-500/15 text-orange-400 border-orange-400/30",
};

const StateBadge = ({ state }: { state: SubscriptionState }) => (
  <Badge variant="outline" className={`${stateClass[state]} font-medium`}>
    <span className="size-1.5 rounded-full bg-current mr-1.5 inline-block" />
    {stateLabel[state]}
  </Badge>
);

// ─── Stat card ───────────────────────────────────────────────────────────────
interface StatCardProps {
  title: string;
  value: number;
  sub: string;
  subColor?: string;
  icon: React.ReactNode;
}

const StatCard = ({ title, value, sub, subColor = "text-green-400", icon }: StatCardProps) => (
  <Card className="flex-1">
    <CardContent className="flex items-start justify-between gap-4 pt-5">
      <div className="flex flex-col gap-1">
        <span className="text-sm text-muted-foreground">{title}</span>
        <span className="text-4xl font-bold">{value.toLocaleString("es-CO")}</span>
        <span className={`text-xs flex items-center gap-1 ${subColor}`}>{sub}</span>
      </div>
      <div className="p-2 rounded-md bg-accent text-muted-foreground">{icon}</div>
    </CardContent>
  </Card>
);

// ─── Page ─────────────────────────────────────────────────────────────────────
const MonthlyPaymentPage = () => {
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState<SubscriptionState | "all">("all");

  const [paymentTarget, setPaymentTarget] = useState<Subscription | null>(null);
  const [openPayment, setOpenPayment] = useState(false);

  const { subscriptions, stats } = useSubscriptionsQuery();
  const { deleteSubscriptionMutation } = useSubscriptionMutation();
  const {
    openConfirm, setOpenConfirm,
    openForm, setOpenForm,
    selected,
    handleDelete, handleUpdate,
  } = useSubscriptions();

  const handlePay = (s: Subscription) => {
    setPaymentTarget(s);
    setOpenPayment(true);
  };

  const filtered = (subscriptions ?? []).filter((s) => {
    const plates = s.vehicles_data.map((v) => v.plate).join(" ").toLowerCase();
    const matchSearch =
      !search ||
      plates.includes(search.toLowerCase()) ||
      (s.customer_name ?? "").toLowerCase().includes(search.toLowerCase());
    const matchState = stateFilter === "all" || s.state === stateFilter;
    return matchSearch && matchState;
  });

  const columns: ColumnDef<Subscription>[] = [
    {
      header: "PLACA(S)",
      cell: (info) => (
        <div className="flex flex-wrap gap-1">
          {info.row.original.vehicles_data.map((v) => (
            <Badge key={v.id} variant="outline" className="font-mono text-xs">
              {v.plate}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      accessorKey: "customer_name",
      header: "CLIENTE",
      cell: (info) => (
        <span className="text-muted-foreground text-sm">
          {(info.getValue() as string | null) ?? "—"}
        </span>
      ),
    },
    {
      header: "PERIODO",
      cell: (info) => {
        const { startDate, endDate, state } = info.row.original;
        const isWarn = state === "expired" || state === "pending";
        return (
          <div className="flex flex-col text-xs leading-5">
            <span>Inicia: {dayjs(startDate).format("DD/MM/YYYY")}</span>
            {endDate && (
              <span className={isWarn ? "text-destructive" : ""}>
                Vence: {dayjs(endDate).format("DD/MM/YYYY")}
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "total",
      header: "TOTAL",
      cell: (info) => (
        <span className="font-semibold">{fmt(info.getValue() as number)}</span>
      ),
    },
    {
      accessorKey: "state",
      header: "ESTADO",
      cell: (info) => <StateBadge state={info.getValue() as SubscriptionState} />,
    },
    {
      header: "ACCIONES",
      cell: (info) => (
        <div className="flex items-center gap-1">
          <Button
            variant="outline" size="icon" className="size-8 text-green-600 hover:text-green-600"
            onClick={() => handlePay(info.row.original)}
            title="Registrar pago"
          >
            <CircleDollarSign size={14} />
          </Button>
          <Button
            variant="outline" size="icon" className="size-8"
            onClick={() => handleUpdate(info.row.original)}
          >
            <Pencil size={14} />
          </Button>
          <Button
            variant="outline" size="icon" className="size-8 text-destructive hover:text-destructive"
            onClick={() => handleDelete(info.row.original)}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      ),
    },
  ];

  const filterOptions: { label: string; value: SubscriptionState | "all" }[] = [
    { label: "Todos",     value: "all"       },
    { label: "Activo",    value: "active"    },
    { label: "Pendiente", value: "pending"   },
    { label: "Vencido",   value: "expired"   },
    { label: "Cancelado", value: "cancelled" },
  ];

  return (
    <PageLayout>
      <div className="flex flex-col gap-5 p-6 flex-1 min-h-0 overflow-y-auto">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <BackBtn />
            <div>
              <h1 className="text-2xl font-bold">Gestión de Mensualidades</h1>
              <p className="text-sm text-muted-foreground">
                Administra los pagos recurrentes y el acceso de clientes VIP.
              </p>
            </div>
          </div>
          <SubscriptionFormDialog
            initialData={null}
            open={openForm && !selected}
            setOpen={setOpenForm}
            showTrigger
          />
        </div>

        {/* Stat cards */}
        <div className="flex gap-4">
          <StatCard
            title="Total Suscripciones"
            value={stats.total}
            sub="Registradas en el sistema"
            icon={<Users size={22} />}
          />
          <StatCard
            title="Activas"
            value={stats.active}
            sub="Vigentes actualmente"
            icon={<CheckCircle2 size={22} />}
          />
          <StatCard
            title="Por Vencer"
            value={stats.expiringSoon}
            sub="Próximos 7 días"
            subColor="text-orange-400"
            icon={<CalendarClock size={22} />}
          />
          <StatCard
            title="Vencidas"
            value={stats.expired}
            sub="Sin renovar"
            subColor="text-destructive"
            icon={<AlertCircle size={22} />}
          />
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por placa o cliente..."
              className="pl-9"
            />
          </div>

          <div className="flex border border-border rounded-md overflow-hidden">
            {filterOptions.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setStateFilter(value)}
                className={`px-3 py-1.5 text-sm transition-colors ${
                  stateFilter === value
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "bg-background text-muted-foreground hover:bg-accent"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="flex flex-col gap-2 flex-1 min-h-0">
          <DataTable columns={columns} data={filtered} />
          <p className="text-xs text-muted-foreground">
            Mostrando {filtered.length} de {subscriptions?.length ?? 0} mensualidades
          </p>
        </div>

      </div>

      {/* Edit dialog */}
      <SubscriptionFormDialog
        initialData={selected}
        open={openForm && !!selected}
        setOpen={setOpenForm}
        showTrigger={false}
      />

      {/* Delete confirm */}
      <ConfirmDialog
        open={openConfirm}
        setOpen={setOpenConfirm}
        title="Eliminar mensualidad"
        description="¿Deseas eliminar esta suscripción? Esta acción no se puede deshacer."
        fx={() => {
          if (selected) deleteSubscriptionMutation.mutate(selected.id);
        }}
      />

      <SubscriptionPaymentsDialog
        subscription={paymentTarget}
        open={openPayment}
        onOpenChange={setOpenPayment}
      />
    </PageLayout>
  );
};

export default MonthlyPaymentPage;
