import { useState } from "react";
import { Search, User } from "lucide-react";
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
import useCustomersQuery from "@/dashboard/customers/customer/hooks/useCustomersQuery";
import { Customer } from "@/dashboard/customers/customer/types/customer.type";

interface CustomerSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (customer: Customer) => void;
}

const CustomerSearchDialog = ({ open, onOpenChange, onSelect }: CustomerSearchDialogProps) => {
  const [query, setQuery] = useState("");
  const { listCustomers } = useCustomersQuery();

  const filtered = listCustomers?.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.nDoc.toString().includes(query) ||
      c.documentType.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (customer: Customer) => {
    onSelect(customer);
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
            <User className="size-4" />
            Buscar cliente
          </DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            autoFocus
            placeholder="Nombre o documento..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="max-h-72 overflow-y-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Documento</TableHead>
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
                filtered?.map((customer) => (
                  <TableRow
                    key={customer.id}
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => handleSelect(customer)}
                  >
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {customer.documentType}: {customer.nDoc}
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

export default CustomerSearchDialog;
