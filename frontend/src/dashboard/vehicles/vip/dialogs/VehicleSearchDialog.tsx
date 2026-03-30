import { useState } from "react";
import { Car, Search } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import useVehiclesQuery from "@/dashboard/vehicles/vehicle/hooks/useVehiclesQuery";
import { Vehicle } from "@/dashboard/vehicles/vehicle/types/vehicle.type";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (vehicle: Vehicle) => void;
}

const VehicleSearchDialog = ({ open, onOpenChange, onSelect }: Props) => {
  const [query, setQuery] = useState("");
  const { listVehicles } = useVehiclesQuery();

  const filtered = listVehicles?.filter((v) =>
    v.plate.toUpperCase().includes(query.toUpperCase()) ||
    (v.customerData?.name ?? "").toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (v: Vehicle) => {
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
            placeholder="Placa o cliente..."
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
                <TableHead>Cliente</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!filtered?.length ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground py-6">
                    Sin resultados
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((v) => (
                  <TableRow
                    key={v.id}
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => handleSelect(v)}
                  >
                    <TableCell className="font-mono font-medium">{v.plate}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{v.vehicleType}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {v.customerData?.name ?? "—"}
                    </TableCell>
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
