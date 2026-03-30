import { useState } from "react";
import { Car, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useVehiclesQuery from "@/dashboard/vehicles/vehicle/hooks/useVehiclesQuery";
import useSubscriptionsQuery from "../hooks/useSubscriptionsQuery";
import { SubscriptionVehicle } from "../types/subscription.type";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (vehicle: SubscriptionVehicle) => void;
  excludeIds?: number[];
  currentSubscriptionId?: number;
}

const VehicleSearchDialog = ({ open, onOpenChange, onSelect, excludeIds = [], currentSubscriptionId }: Props) => {
  const [query, setQuery] = useState("");
  const { listVehicles } = useVehiclesQuery();
  const { subscriptions } = useSubscriptionsQuery();

  const assignedIds = new Set(
    subscriptions
      ?.filter((s) => s.id !== currentSubscriptionId)
      .flatMap((s) => s.vehicles) ?? []
  );

  const filtered = listVehicles?.filter(
    (v) =>
      !excludeIds.includes(v.id) &&
      !assignedIds.has(v.id) &&
      (v.plate.toUpperCase().includes(query) ||
        v.vehicleType.toUpperCase().includes(query))
  );

  const handleSelect = (v: SubscriptionVehicle) => {
    onSelect(v);
    onOpenChange(false);
    setQuery("");
  };

  const handleOpenChange = (value: boolean) => {
    if (!value) setQuery("");
    onOpenChange(value);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car className="size-4" />
            Buscar vehículo
          </DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            autoFocus
            placeholder="Placa o tipo de vehículo..."
            value={query}
            onChange={(e) => setQuery(e.target.value.toUpperCase())}
            className="pl-9"
          />
        </div>

        <div className="max-h-72 overflow-y-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Placa</TableHead>
                <TableHead>Tipo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-muted-foreground py-6">
                    Sin resultados
                  </TableCell>
                </TableRow>
              ) : (
                filtered?.map((v) => (
                  <TableRow
                    key={v.id}
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => handleSelect(v)}
                  >
                    <TableCell className="font-medium">{v.plate}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{v.vehicleType}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleSearchDialog;
