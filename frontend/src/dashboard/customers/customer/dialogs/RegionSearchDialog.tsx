import { useState } from "react";
import { Search, MapPin } from "lucide-react";
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

interface Region {
  code: string;
  name: string;
}

const REGIONS: Region[] = [
  { code: "05", name: "Antioquia" },
  { code: "08", name: "Atlántico" },
  { code: "11", name: "Bogotá D.C." },
  { code: "13", name: "Bolívar" },
  { code: "15", name: "Boyacá" },
  { code: "17", name: "Caldas" },
  { code: "18", name: "Caquetá" },
  { code: "19", name: "Cauca" },
  { code: "20", name: "Cesar" },
  { code: "23", name: "Córdoba" },
  { code: "25", name: "Cundinamarca" },
  { code: "27", name: "Chocó" },
  { code: "41", name: "Huila" },
  { code: "44", name: "La Guajira" },
  { code: "47", name: "Magdalena" },
  { code: "50", name: "Meta" },
  { code: "52", name: "Nariño" },
  { code: "54", name: "Norte de Santander" },
  { code: "63", name: "Quindío" },
  { code: "66", name: "Risaralda" },
  { code: "68", name: "Santander" },
  { code: "70", name: "Sucre" },
  { code: "73", name: "Tolima" },
  { code: "76", name: "Valle del Cauca" },
];

interface RegionSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (region: Region) => void;
}

const RegionSearchDialog = ({
  open,
  onOpenChange,
  onSelect,
}: RegionSearchDialogProps) => {
  const [query, setQuery] = useState("");

  const filtered = REGIONS.filter(
    (r) =>
      r.name.toLowerCase().includes(query.toLowerCase()) ||
      r.code.includes(query)
  );

  const handleSelect = (region: Region) => {
    onSelect(region);
    onOpenChange(false);
    setQuery("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="size-4" />
            Buscar departamento / región
          </DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            autoFocus
            placeholder="Buscar por nombre o código..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="max-h-72 overflow-y-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Código</TableHead>
                <TableHead>Departamento</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={2}
                    className="text-center text-muted-foreground py-6"
                  >
                    Sin resultados
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((region) => (
                  <TableRow
                    key={region.code}
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => handleSelect(region)}
                  >
                    <TableCell className="font-mono text-sm">
                      {region.code}
                    </TableCell>
                    <TableCell>{region.name}</TableCell>
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

export default RegionSearchDialog;
