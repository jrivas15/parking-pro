import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Customer } from "../types/customer.type";

const TEST_CUSTOMERS: Customer[] = [
  { id: 1, name: "Juan Pérez",        docType: "CC",  doc: "1001234567", phone: "555-0123", email: "juan@mail.com",      customerType: "NATURAL",  notes: "Cliente frecuente" },
  { id: 2, name: "Empresa XYZ S.A.S", docType: "NIT", doc: "9001234567", phone: "555-9876", email: "info@xyz.com",       customerType: "JURIDICA", notes: "Convenio corporativo" },
  { id: 3, name: "María García",      docType: "CC",  doc: "1009876543", phone: "555-4433", email: "maria@mail.com",     customerType: "NATURAL"  },
  { id: 4, name: "Carlos Rodríguez",  docType: "CC",  doc: "1005554433", phone: "555-5555", email: "carlos@mail.com",    customerType: "NATURAL"  },
  { id: 5, name: "Logística SAS",     docType: "NIT", doc: "8009876543", phone: "555-7788", email: "logistica@mail.com", customerType: "JURIDICA", notes: "Mensualidad activa" },
  { id: 6, name: "Ana Lucía Torres",  docType: "CE",  doc: "CE-123456",  phone: "555-1122", email: "ana@mail.com",       customerType: "NATURAL"  },
];

const useCustomersQuery = () => {
  const queryClient = useQueryClient();

  const { data: listCustomers, isLoading } = useQuery<Customer[]>({
    queryKey: ["customers"],
    // TODO: reemplazar con getCustomers() cuando esté el API
    queryFn: () =>
      queryClient.getQueryData<Customer[]>(["customers"]) ?? TEST_CUSTOMERS,
    staleTime: Infinity,
    gcTime: Infinity,
    initialData: TEST_CUSTOMERS,
  });

  return { listCustomers, isLoading };
};

export default useCustomersQuery;
