export interface Vip {
  id: number;
  vehicle: number;
  vehicle_plate: string;
  vehicle_type: string;
  customer_name: string | null;
  card: string | null;
  isActive: boolean;
  note: string | null;
}

export interface VipFormData {
  vehicle: number;
  card?: string;
  isActive: boolean;
  note?: string;
}
