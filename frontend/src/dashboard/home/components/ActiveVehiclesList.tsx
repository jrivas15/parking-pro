import { Movement } from "@/dashboard/parking/types/movements.type";
import Plate from "@/dashboard/parking/components/Plate";
import { Car } from "lucide-react";
import dayjs from "dayjs";

interface ActiveVehiclesListProps {
  data: Movement[] | undefined;
  isLoading: boolean;
}

const vehicleColor: Record<string, string> = {
  C: "bg-blue-500/10 text-blue-500",
  M: "bg-orange-500/10 text-orange-500",
  B: "bg-green-500/10 text-green-500",
};

const vehicleLabel: Record<string, string> = {
  C: "C",
  M: "M",
  B: "B",
};

const SkeletonItem = () => (
  <div className="flex items-center justify-between px-2 py-2.5 border-b border-border/40">
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 rounded-lg bg-muted animate-pulse" />
      <div className="w-16 h-5 rounded bg-muted animate-pulse" />
    </div>
    <div className="w-10 h-3.5 rounded bg-muted animate-pulse" />
  </div>
);

const ActiveVehiclesList = ({ data, isLoading }: ActiveVehiclesListProps) => {
  if (!isLoading && (!data || data.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
        <Car size={28} className="opacity-30" />
        <span className="text-sm">Sin vehículos activos</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-auto h-full">
      {isLoading
        ? [...Array(7)].map((_, i) => <SkeletonItem key={i} />)
        : data!.map((movement) => {
            const colorCls = vehicleColor[movement.vehicleType] ?? "bg-muted text-muted-foreground";
            const elapsed = dayjs().diff(dayjs(movement.entryTime), "minute");
            const elapsedLabel =
              elapsed < 60
                ? `${elapsed}m`
                : `${Math.floor(elapsed / 60)}h ${elapsed % 60}m`;

            return (
              <div
                key={movement.nTicket}
                className="flex items-center justify-between px-2 py-2.5 border-b border-border/40 last:border-0 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold shrink-0 ${colorCls}`}>
                    {vehicleLabel[movement.vehicleType] ?? movement.vehicleType}
                  </div>
                  <Plate plate={movement.plate} />
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {dayjs(movement.entryTime).format("HH:mm")}
                  </span>
                  <span className="font-mono text-[10px] bg-muted px-1 rounded text-muted-foreground">
                    {elapsedLabel}
                  </span>
                </div>
              </div>
            );
          })}
    </div>
  );
};

export default ActiveVehiclesList;
