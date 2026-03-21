import { useMemo } from "react";
import { Movement } from "@/dashboard/parking/types/movements.type";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import dayjs from "dayjs";

interface VehiclesByHourChartProps {
  activeMovements: Movement[] | undefined;
  lastExits: Movement[] | undefined;
  isLoading: boolean;
}

const chartConfig: ChartConfig = {
  vehiculos: {
    label: "Vehículos",
    color: "hsl(var(--primary))",
  },
};

const VehiclesByHourChart = ({
  activeMovements,
  lastExits,
  isLoading,
}: VehiclesByHourChartProps) => {
  const chartData = useMemo(() => {
    const counts = Array.from({ length: 24 }, (_, i) => ({
      hora: `${String(i).padStart(2, "0")}:00`,
      vehiculos: 0,
    }));

    const all = [...(activeMovements ?? []), ...(lastExits ?? [])];
    all.forEach((m) => {
      const hour = dayjs(m.entryTime).hour();
      counts[hour].vehiculos += 1;
    });

    // Solo mostrar desde la primera hora con datos hasta la última
    const firstNonZero = counts.findIndex((d) => d.vehiculos > 0);
    const lastNonZero = [...counts].reverse().findIndex((d) => d.vehiculos > 0);

    if (firstNonZero === -1) return counts;

    const start = Math.max(0, firstNonZero - 1);
    const end = Math.min(23, 24 - lastNonZero) + 1;
    return counts.slice(start, end);
  }, [activeMovements, lastExits]);

  if (isLoading) {
    return (
      <div className="flex items-end gap-1 h-full px-2 pb-5">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-sm bg-muted animate-pulse"
            style={{ height: `${20 + Math.random() * 60}%` }}
          />
        ))}
      </div>
    );
  }

  const hasData = chartData.some((d) => d.vehiculos > 0);

  if (!hasData) {
    return (
      <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
        Sin registros de entradas hoy
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/40" />
        <XAxis
          dataKey="hora"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 10 }}
          tickMargin={6}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 10 }}
          allowDecimals={false}
          width={28}
        />
        <ChartTooltip
          cursor={{ fill: "hsl(var(--muted))", radius: 4 }}
          content={
            <ChartTooltipContent
              labelFormatter={(label) => `Hora: ${label}`}
              formatter={(value) => [value, "vehículos"]}
            />
          }
        />
        <Bar
          dataKey="vehiculos"
          fill="var(--color-primary)"
          radius={[4, 4, 0, 0]}
          maxBarSize={40}
        />
      </BarChart>
    </ChartContainer>
  );
};

export default VehiclesByHourChart;
