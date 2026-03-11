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

interface LocationSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (city: MunicipioData) => void;
}

const LocationSearchDialog = ({
  open,
  onOpenChange,
  onSelect,
}: LocationSearchDialogProps) => {
  const [query, setQuery] = useState("");
  const { municipios } = useMunicipiosQuery();

  // console.log(municipios)

  const filtered = municipios?.filter(
    (c) =>
      c.municipio.toLowerCase().includes(query.toLowerCase()) ||
      c.dpto.toLowerCase().includes(query.toLowerCase()) ||
      c.municipioCode.includes(query) ||
      c.dptoCode.includes(query)
  );

  const handleSelect = (city: MunicipioData) => {
    onSelect(city);
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
            <MapPin className="size-4" />
            Buscar ciudad
          </DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            autoFocus
            placeholder="Ciudad, departamento o código..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="max-h-72 overflow-y-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ciudad</TableHead>
                <TableHead>Departamento</TableHead>
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
                    <TableCell>{city.municipio}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {city.dpto}
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

export default LocationSearchDialog;
