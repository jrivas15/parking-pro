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
import useCustomersQuery from "@/dashboard/customers/customer/hooks/useCustomersQuery";

interface Customer {
  id: number;
  name: string;
  type: "NATURAL" | "JURIDICA";
  typeDoc: string;
  nDoc: string;
  email: string;
  address?: string;
  cityCode?: string;
}

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSelectCustomer: (customer: Customer) => void;
}

const CustomerSearchDialog = ({ open, setOpen, onSelectCustomer }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { listCustomers, isLoading } = useCustomersQuery(open);

  const filteredCustomers = listCustomers?.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.nDoc.toString().includes(searchTerm)
  ) ?? [];

  const handleSelect = (customer: (typeof filteredCustomers)[number]) => {
    onSelectCustomer({
      id: customer.id,
      name: customer.name,
      type: customer.personType as "NATURAL" | "JURIDICA",
      typeDoc: customer.documentType,
      nDoc: customer.nDoc.toString(),
      email: customer.email ?? "",
      address: customer.address ?? undefined,
      cityCode: customer.postalCode ?? undefined,
    });
    setOpen(false);
    setSearchTerm("");
  };

  const handleOpenChange = (value: boolean) => {
    if (!value) setSearchTerm("");
    setOpen(value);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
            onChange={(e) => setSearchTerm(e.target.value)}
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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    Cargando clientes...
                  </TableCell>
                </TableRow>
              ) : filteredCustomers.length > 0 ? (
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
                        {customer.personType}
                      </span>
                    </TableCell>
                    <TableCell>
                      {customer.documentType} {customer.nDoc}
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
