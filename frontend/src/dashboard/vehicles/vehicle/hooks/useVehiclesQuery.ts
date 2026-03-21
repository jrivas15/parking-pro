import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Vehicle } from "../types/vehicle.type";

// ─── Test data (reemplazar con getVehicles() cuando esté el API) ─────────────
const TEST_VEHICLES: Vehicle[] = [
  { id: 1, plate: "ABC1234", vehicleType: "C", brand: "Toyota",   model: "Corolla",   year: "2020", color: "blanco", ownerName: "Juan Pérez",       ownerPhone: "555-0123", ownerEmail: "juan@mail.com",     ownerDoc: "1001234567", docType: "CC" },
  { id: 2, plate: "XYZ7890", vehicleType: "M", brand: "Honda",    model: "CB500F",    year: "2019", color: "negro",  ownerName: "María García",      ownerPhone: "555-9876", ownerEmail: "maria@mail.com",    ownerDoc: "1009876543", docType: "CC" },
  { id: 3, plate: "PLT4567", vehicleType: "C", brand: "Mazda",    model: "CX-5",      year: "2022", color: "rojo",   ownerName: "Carlos Rodríguez",  ownerPhone: "555-5555", ownerEmail: "carlos@mail.com",   ownerDoc: "1005554433", docType: "CC" },
  { id: 4, plate: "MNP3321", vehicleType: "B", brand: "Trek",     model: "Domane",    year: "2021", color: "azul",   ownerName: "Ana Lucía Torres",  ownerPhone: "555-1122", ownerEmail: "ana@mail.com",      ownerDoc: "1001122334", docType: "CC" },
  { id: 5, plate: "KLM9900", vehicleType: "C", brand: "Renault",  model: "Sandero",   year: "2018", color: "gris",   ownerName: "Roberto Silva",     ownerPhone: "555-3344", ownerEmail: "roberto@mail.com",  ownerDoc: "9001234567", docType: "NIT" },
  { id: 6, plate: "QWE5544", vehicleType: "M", brand: "Yamaha",   model: "MT-07",     year: "2023", color: "plata",  ownerName: "Laura Martínez",    ownerPhone: "555-7788", ownerEmail: "laura@mail.com",    ownerDoc: "1007788990", docType: "CC" },
];

const useVehiclesQuery = () => {
  const queryClient = useQueryClient();

  const { data: listVehicles, isLoading } = useQuery<Vehicle[]>({
    queryKey: ["vehicles"],
    // TODO: reemplazar con getVehicles cuando esté el API
    queryFn: () =>
      queryClient.getQueryData<Vehicle[]>(["vehicles"]) ?? TEST_VEHICLES,
    staleTime: Infinity,
    gcTime: Infinity,
    initialData: TEST_VEHICLES,
  });

  return { listVehicles, isLoading };
};

export default useVehiclesQuery;
