export interface Vehicle {
  id: number;
  plate: string;
  vehicleType: "C" | "M" | "B";
  brand: string;
  model: string;
  year: string;
  color: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  ownerDoc: string;
  docType: "CC" | "NIT" | "CE";
  notes?: string;
}
