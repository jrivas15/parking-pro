import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Search } from "lucide-react";
import { useState } from "react";

interface Customer {
  id: number;
  name: string;
  type: "NATURAL" | "JURIDICA";
  typeDoc: string;
  nDoc: string;
  email: string;
}

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSelectCustomer: (customer: Customer) => void;
}

// Test data
const testCustomers: Customer[] = [
  {
    id: 1,
    name: "Juan Pérez García",
    type: "NATURAL",
    typeDoc: "CC",
    nDoc: "1234567890",
    email: "juan.perez@email.com",
  },
  {
    id: 2,
    name: "María López Martínez",
    type: "NATURAL",
    typeDoc: "CC",
    nDoc: "9876543210",
    email: "maria.lopez@email.com",
  },
  {
    id: 3,
    name: "Tech Solutions S.A.S",
    type: "JURIDICA",
    typeDoc: "NIT",
    nDoc: "900123456-1",
    email: "contacto@techsolutions.com",
  },
  {
    id: 4,
    name: "Carlos Rodríguez",
    type: "NATURAL",
    typeDoc: "CC",
    nDoc: "5551234567",
    email: "carlos.r@email.com",
  },
  {
    id: 5,
    name: "Distribuidora ABC Ltda",
    type: "JURIDICA",
    typeDoc: "NIT",
    nDoc: "800456789-2",
    email: "ventas@distribuidoraabc.com",
  },
  {
    id: 6,
    name: "Ana Martínez Silva",
    type: "NATURAL",
    typeDoc: "CC",
    nDoc: "7778889990",
    email: "ana.martinez@email.com",
  },
  {
    id: 7,
    name: "Servicios Empresariales XYZ",
    type: "JURIDICA",
    typeDoc: "NIT",
    nDoc: "900888777-3",
    email: "info@serviciosxyz.com",
  },
  {
    id: 8,
    name: "Pedro González Ramírez",
    type: "NATURAL",
    typeDoc: "CC",
    nDoc: "3334445556",
    email: "pedro.gonzalez@email.com",
  },
  {
    id: 9,
    name: "Laura Hernández Torres",
    type: "NATURAL",
    typeDoc: "CC",
    nDoc: "6667778889",
    email: "laura.hernandez@email.com",
  },
  {
    id: 10,
    name: "Comercializadora Del Sur",
    type: "JURIDICA",
    typeDoc: "NIT",
    nDoc: "800111222-4",
    email: "comercial@delsur.com",
  },
];

const CustomerSearchDialog = ({ open, setOpen, onSelectCustomer }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>(testCustomers);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value.trim() === "") {
      setFilteredCustomers(testCustomers);
      return;
    }

    const filtered = testCustomers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(value.toLowerCase()) ||
        customer.nDoc.includes(value)
    );
    setFilteredCustomers(filtered);
  };

  const handleSelect = (customer: Customer) => {
    onSelectCustomer(customer);
    setOpen(false);
    setSearchTerm("");
    setFilteredCustomers(testCustomers);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Buscar Cliente</DialogTitle>
          <DialogDescription>
            Busque por nombre o número de documento
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <Input
            placeholder="Buscar por nombre o documento..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
            autoFocus
          />
        </div>

        <div className="max-h-100 overflow-y-auto border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre/Razón Social</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <TableRow 
                    key={customer.id}
                    onDoubleClick={() => handleSelect(customer)}
                    className="cursor-pointer hover:bg-accent/50"
                  >
                    <TableCell 
                      className="font-medium text-primary underline"
                      onClick={() => handleSelect(customer)}
                    >
                      {customer.name}
                    </TableCell>
                    <TableCell>
                      <span className="text-xs px-2 py-1 bg-accent rounded">
                        {customer.type}
                      </span>
                    </TableCell>
                    <TableCell>
                      {customer.typeDoc} {customer.nDoc}
                    </TableCell>
                    <TableCell>{customer.email}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No se encontraron clientes
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerSearchDialog;
