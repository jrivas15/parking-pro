import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/DataTable";
import PageLayout from "@/layouts/PageLayout";
import BackBtn from "@/components/shared/BackBtn";
import Plate from "@/dashboard/parking/components/Plate";
import {
  Users,
  CheckCircle2,
  CalendarClock,
  AlertCircle,
  Search,
  Filter,
  Download,
  CircleDollarSign,
  History,
  Pencil,
  Trash2,
  PlusCircle,
} from "lucide-react";
import dayjs from "dayjs";

// ─── Types ─────────────────────────────────────────────────────────────────
type MensualidadStatus = "Activo" | "Vencido" | "Por Vencer";

interface Mensualidad {
  id: number;
  plate: string;
  owner: string;
  phone: string;
  startDate: string;
  endDate: string;
  value: number;
  status: MensualidadStatus;
}

// ─── Test data ──────────────────────────────────────────────────────────────
const TEST_DATA: Mensualidad[] = [
  { id: 1, plate: "ABC1234", owner: "Juan Pérez",        phone: "555-0123", startDate: "2023-10-01", endDate: "2023-10-31", value: 120_000, status: "Activo"     },
  { id: 2, plate: "XYZ7890", owner: "María García",      phone: "555-9876", startDate: "2023-09-15", endDate: "2023-10-15", value:  85_000, status: "Vencido"    },
  { id: 3, plate: "PLT4567", owner: "Carlos Rodríguez",  phone: "555-5555", startDate: "2023-09-20", endDate: "2023-10-20", value: 150_000, status: "Por Vencer" },
  { id: 4, plate: "MNP3321", owner: "Ana Lucía Torres",  phone: "555-1122", startDate: "2023-10-05", endDate: "2023-11-05", value: 100_000, status: "Activo"     },
  { id: 5, plate: "KLM9900", owner: "Roberto Silva",     phone: "555-3344", startDate: "2023-10-01", endDate: "2023-10-31", value: 120_000, status: "Activo"     },
  { id: 6, plate: "QWE5544", owner: "Laura Martínez",    phone: "555-7788", startDate: "2023-09-10", endDate: "2023-10-10", value:  90_000, status: "Vencido"    },
  { id: 7, plate: "RTY2211", owner: "Diego Herrera",     phone: "555-6600", startDate: "2023-10-12", endDate: "2023-11-12", value: 110_000, status: "Activo"     },
  { id: 8, plate: "OPL8877", owner: "Valentina Ríos",    phone: "555-4411", startDate: "2023-10-18", endDate: "2023-10-25", value:  75_000, status: "Por Vencer" },
];

// ─── Helpers ────────────────────────────────────────────────────────────────
const fmt = (n: number) =>
  "$" + n.toLocaleString("es-CO", { minimumFractionDigits: 2 });

const StatusBadge = ({ status }: { status: MensualidadStatus }) => {
  const map: Record<MensualidadStatus, string> = {
    Activo:     "bg-green-500/15 text-green-500 border-green-500/30",
    Vencido:    "bg-destructive/15 text-destructive border-destructive/30",
    "Por Vencer": "bg-orange-500/15 text-orange-400 border-orange-400/30",
  };
  return (
    <Badge variant="outline" className={`${map[status]} font-medium`}>
      <span className="size-1.5 rounded-full bg-current mr-1.5 inline-block" />
      {status}
    </Badge>
  );
};

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

// ─── Page ────────────────────────────────────────────────────────────────────
const MonthlyPaymentPage = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<MensualidadStatus | "Todos">("Todos");

  const filtered = TEST_DATA.filter((m) => {
    const matchSearch =
      !search ||
      m.plate.toLowerCase().includes(search.toLowerCase()) ||
      m.owner.toLowerCase().includes(search.toLowerCase()) ||
      m.status.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "Todos" || m.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const columns: ColumnDef<Mensualidad>[] = [
    {
      accessorKey: "plate",
      header: "PLACA",
      cell: (info) => <Plate plate={info.getValue() as string} />,
    },
    {
      accessorKey: "owner",
      header: "PROPIETARIO",
      cell: (info) => <span className="font-medium">{info.getValue() as string}</span>,
    },
    {
      accessorKey: "phone",
      header: "TELÉFONO",
      cell: (info) => <span className="text-muted-foreground">{info.getValue() as string}</span>,
    },
    {
      header: "PERIODO",
      cell: (info) => {
        const { startDate, endDate, status } = info.row.original;
        const isExpired = status === "Vencido" || status === "Por Vencer";
        return (
          <div className="flex flex-col text-xs leading-5">
            <span>Inicia: {dayjs(startDate).format("DD/MM/YYYY")}</span>
            <span className={isExpired ? "text-destructive" : ""}>
              Vence: {dayjs(endDate).format("DD/MM/YYYY")}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "value",
      header: "VALOR",
      cell: (info) => <span className="font-semibold">{fmt(info.getValue() as number)}</span>,
    },
    {
      accessorKey: "status",
      header: "ESTADO",
      cell: (info) => <StatusBadge status={info.getValue() as MensualidadStatus} />,
    },
    {
      header: "ACCIONES",
      cell: () => (
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="size-8">
            <History size={14} />
          </Button>
          <Button variant="outline" size="icon" className="size-8">
            <Pencil size={14} />
          </Button>
          <Button variant="outline" size="icon" className="size-8 text-destructive hover:text-destructive">
            <Trash2 size={14} />
          </Button>
        </div>
      ),
    },
  ];

  const statusCycles: (MensualidadStatus | "Todos")[] = ["Todos", "Activo", "Por Vencer", "Vencido"];

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
          <Button className="gap-2">
            <PlusCircle size={16} />
            Crear Nueva Mensualidad
          </Button>
        </div>

        {/* Stat cards */}
        <div className="flex gap-4">
          <StatCard
            title="Total Suscripciones"
            value={1280}
            sub="↑ +12% este mes"
            icon={<Users size={22} />}
          />
          <StatCard
            title="Activas"
            value={1150}
            sub="↑ +5% este mes"
            icon={<CheckCircle2 size={22} />}
          />
          <StatCard
            title="Por Vencer"
            value={45}
            sub="Próximos 7 días"
            subColor="text-orange-400"
            icon={<CalendarClock size={22} />}
          />
          <StatCard
            title="En Mora"
            value={85}
            sub="↑ +8% de retraso"
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
              placeholder="Buscar por placa, propietario o estado..."
              className="pl-9"
            />
          </div>

          {/* Status toggle */}
          <div className="flex border border-border rounded-md overflow-hidden">
            {statusCycles.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 text-sm transition-colors ${
                  statusFilter === s
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "bg-background text-muted-foreground hover:bg-accent"
                }`}
              >
                {s === "Todos" ? "Todos los Estados" : s}
              </button>
            ))}
          </div>

          <Button variant="outline" className="gap-2">
            <Filter size={14} />
            Filtros
          </Button>
          <Button variant="outline" className="gap-2">
            <Download size={14} />
            Exportar
          </Button>
        </div>

        {/* Table */}
        <div className="flex flex-col gap-2 flex-1 min-h-0">
          <DataTable columns={columns} data={filtered} />
          <p className="text-xs text-muted-foreground">
            Mostrando 1 a {filtered.length} de {TEST_DATA.length} mensualidades
          </p>
        </div>

      </div>
    </PageLayout>
  );
};

export default MonthlyPaymentPage;
