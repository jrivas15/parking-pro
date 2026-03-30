export interface VehicleCustomer {
  id: number;
  name: string;
  documentType: string;
  nDoc: number;
  phone: string | null;
}

export interface Vehicle {
  id: number;
  plate: string;
  vehicleType: "C" | "M" | "B";
  brand: string | null;
  color: string | null;
  isActive: boolean;
  description: string | null;
  customer: number | null;
  customerData: VehicleCustomer | null;
  createdAt: string;
  updatedAt: string;
}
