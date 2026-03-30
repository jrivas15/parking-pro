export type SubscriptionState = "active" | "expired" | "cancelled" | "pending";

export interface SubscriptionVehicle {
  id: number;
  plate: string;
  vehicleType: string;
}

export interface Subscription {
  id: number;
  vehicles: number[];
  vehicles_data: SubscriptionVehicle[];
  customer_name: string | null;
  card: string | null;
  startDate: string;
  endDate?: string;
  total: number;
  isActive: boolean;
  note: string | null;
  state: SubscriptionState;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionFormData {
  vehicles: number[];
  card?: string;
  startDate: string;
  endDate?: string;
  total: number;
  note?: string;
  state: SubscriptionState;
}

export interface SubscriptionPaymentFormData {
  paymentMethodId: number;
  total: number;
  amountPaid: number;
  note?: string;
}

export interface SubscriptionPaymentDetail {
  id: number;
  subscription: number;
  period: string;
  startDate: string;
  endDate: string;
  note: string | null;
  createdAt: string;
  isPaid: boolean;
  paymentMethod: { id: number; name: string } | null;
  total: string | null;
}

export interface PeriodFormData {
  startDate: string;
  endDate: string;
  period: string;
  note?: string;
}
