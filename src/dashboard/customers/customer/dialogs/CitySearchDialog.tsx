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
import useMunicipiosQuery from "../hooks/useMunicipios";
import { MunicipioData } from "../types/municipios.type";

interface CitySearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (city: MunicipioData) => void;
  deptoCode?: string;
}

const CitySearchDialog = ({
  open,
  onOpenChange,
  onSelect,
  deptoCode,
}: CitySearchDialogProps) => {
  const [query, setQuery] = useState("");
  const { municipios } = useMunicipiosQuery();

  const filteredCities = deptoCode
    ? municipios?.filter((c) => c.dptoCode === deptoCode)
    : municipios;

  const filtered = filteredCities?.filter(
    (c) =>
      c.municipio.toLowerCase().includes(query.toLowerCase()) ||
      c.municipioCode.includes(query)
  );

  const handleSelect = (city: MunicipioData) => {
    onSelect(city);
    onOpenChange(false);
    setQuery("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="size-4" />
            Buscar ciudad
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
                <TableHead className="w-28">Código</TableHead>
                <TableHead>Ciudad</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={2}
                    className="text-center text-muted-foreground py-6"
                  >
                    Sin resultados
                  </TableCell>
                </TableRow>
              ) : (
                filtered?.map((city) => (
                  <TableRow
                    key={city.municipioCode}
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => handleSelect(city)}
                  >
                    <TableCell className="font-mono text-sm">
                      {city.municipioCode}
                    </TableCell>
                    <TableCell>{city.municipio}</TableCell>
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

export default CitySearchDialog;
