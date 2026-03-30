import apiService from "services/api.service";
import { PeriodFormData, Subscription, SubscriptionFormData, SubscriptionPaymentDetail, SubscriptionPaymentFormData } from "../types/subscription.type";

export const getSubscriptions = async (): Promise<Subscription[]> => {
  const response = await apiService.get("/subscriptions/");
  return response.data;
};

export const newSubscription = async (data: SubscriptionFormData): Promise<Subscription> => {
  const response = await apiService.post("/subscriptions/", data);
  return response.data;
};

export const updateSubscription = async (id: number, data: SubscriptionFormData): Promise<Subscription> => {
  const response = await apiService.put(`/subscriptions/${id}/`, data);
  return response.data;
};

export const deleteSubscription = async (id: number): Promise<void> => {
  await apiService.delete(`/subscriptions/${id}/`);
};

export const getSubscriptionPayments = async (id: number): Promise<SubscriptionPaymentDetail[]> => {
  const response = await apiService.get(`/subscriptions/${id}/payments/`);
  return response.data;
};

export const advanceSubscription = async (id: number): Promise<SubscriptionPaymentDetail> => {
  const response = await apiService.post(`/subscriptions/${id}/advance/`);
  return response.data;
};

export const deleteSubscriptionPeriod = async (paymentId: number): Promise<void> => {
  await apiService.delete(`/subscriptions/payments/${paymentId}/`);
};

export const updatePeriodDates = async (paymentId: number, data: Partial<PeriodFormData>): Promise<SubscriptionPaymentDetail> => {
  const response = await apiService.patch(`/subscriptions/payments/${paymentId}/update_dates/`, data);
  return response.data;
};

export const paySubscriptionPeriod = async (paymentId: number, data: SubscriptionPaymentFormData): Promise<SubscriptionPaymentDetail> => {
  const response = await apiService.post(`/subscriptions/payments/${paymentId}/pay/`, data);
  return response.data;
};
