import { Movement } from "@/dashboard/parking/types/movements.type";
import Plate from "@/dashboard/parking/components/Plate";
import VehicleIcon from "@/components/shared/VehicleIcon";
import { formatMoney } from "@/dashboard/tools/balance/hooks/useBalance";
import { LogOut } from "lucide-react";
import dayjs from "dayjs";

interface RecentExitsTableProps {
  data: Movement[] | undefined;
  isLoading: boolean;
}

const SkeletonRow = () => (
  <tr className="border-b border-border/50">
    {[...Array(6)].map((_, i) => (
      <td key={i} className="py-2.5 pr-4">
        <div className="h-3.5 bg-muted rounded animate-pulse" style={{ width: `${50 + (i * 17) % 40}%` }} />
      </td>
    ))}
  </tr>
);

const VehicleTypeBadge = ({ type }: { type: string }) => {
  const map: Record<string, { label: string; cls: string }> = {
    C: { label: "Carro", cls: "bg-blue-500/10 text-blue-500" },
    M: { label: "Moto", cls: "bg-orange-500/10 text-orange-500" },
    B: { label: "Bici", cls: "bg-green-500/10 text-green-500" },
  };
  const { label, cls } = map[type] ?? { label: type, cls: "bg-muted text-muted-foreground" };
  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium ${cls}`}>
      <VehicleIcon type={type} />
      {label}
    </span>
  );
};

const RecentExitsTable = ({ data, isLoading }: RecentExitsTableProps) => {
  if (!isLoading && (!data || data.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
        <LogOut size={28} className="opacity-30" />
        <span className="text-sm">No hay salidas recientes</span>
      </div>
    );
  }

  return (
    <div className="overflow-auto h-full">
      <table className="w-full text-sm border-separate border-spacing-0">
        <thead className="sticky top-0 z-10">
          <tr className="bg-card">
            <th className="text-left py-2 pr-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground border-b border-border w-10">
              #
            </th>
            <th className="text-left py-2 pr-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground border-b border-border">
              Placa
            </th>
            <th className="text-left py-2 pr-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground border-b border-border">
              Tipo
            </th>
            <th className="text-left py-2 pr-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground border-b border-border">
              Entrada
            </th>
            <th className="text-left py-2 pr-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground border-b border-border">
              Tiempo
            </th>
            <th className="text-right py-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground border-b border-border">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading
            ? [...Array(6)].map((_, i) => <SkeletonRow key={i} />)
            : data!.map((movement) => (
                <tr
                  key={movement.nTicket}
                  className="group border-b border-border/40 last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="py-2.5 pr-4 text-muted-foreground text-xs tabular-nums">
                    {movement.nTicket}
                  </td>
                  <td className="py-2.5 pr-4">
                    <Plate plate={movement.plate} />
                  </td>
                  <td className="py-2.5 pr-4">
                    <VehicleTypeBadge type={movement.vehicleType} />
                  </td>
                  <td className="py-2.5 pr-4 text-muted-foreground text-xs tabular-nums">
                    {dayjs(movement.entryTime).format("HH:mm")}
                  </td>
                  <td className="py-2.5 pr-4">
                    <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                      {movement.parkingTime}
                    </span>
                  </td>
                  <td className="py-2.5 text-right font-semibold tabular-nums">
                    {(movement as any).amountPaid != null
                      ? formatMoney((movement as any).amountPaid)
                      : "—"}
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentExitsTable;
