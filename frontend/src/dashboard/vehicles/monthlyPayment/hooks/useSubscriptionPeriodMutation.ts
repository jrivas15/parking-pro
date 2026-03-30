import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sileo } from "sileo";
import { PeriodFormData, SubscriptionPaymentFormData } from "../types/subscription.type";
import { advanceSubscription, deleteSubscriptionPeriod, paySubscriptionPeriod, updatePeriodDates } from "../services/subscription.service";

const useSubscriptionPeriodMutation = (subscriptionId: number | null) => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["subscriptionPayments", subscriptionId] });
    queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
  };

  const advanceMutation = useMutation({
    mutationFn: () => advanceSubscription(subscriptionId!),
    onSuccess: () => {
      invalidate();
      sileo.success({ title: "Mensualidades", description: "Periodo adelantado agregado" });
    },
    onError: () => sileo.error({ title: "Mensualidades", description: "Error al adelantar periodo" }),
  });

  const updateDatesMutation = useMutation({
    mutationFn: ({ paymentId, data }: { paymentId: number; data: Partial<PeriodFormData> }) =>
      updatePeriodDates(paymentId, data),
    onSuccess: () => {
      invalidate();
      sileo.success({ title: "Mensualidades", description: "Fechas actualizadas" });
    },
    onError: () => sileo.error({ title: "Mensualidades", description: "Error al actualizar fechas" }),
  });

  const payPeriodMutation = useMutation({
    mutationFn: ({ paymentId, data }: { paymentId: number; data: SubscriptionPaymentFormData }) =>
      paySubscriptionPeriod(paymentId, data),
    onSuccess: () => {
      invalidate();
      sileo.success({ title: "Mensualidades", description: "Pago registrado exitosamente" });
    },
    onError: () => sileo.error({ title: "Mensualidades", description: "Error al registrar el pago" }),
  });

  const deletePeriodMutation = useMutation({
    mutationFn: (paymentId: number) => deleteSubscriptionPeriod(paymentId),
    onSuccess: () => {
      invalidate();
      sileo.success({ title: "Mensualidades", description: "Periodo eliminado" });
    },
    onError: () => sileo.error({ title: "Mensualidades", description: "Error al eliminar el periodo" }),
  });

  return { advanceMutation, updateDatesMutation, payPeriodMutation, deletePeriodMutation };
};

export default useSubscriptionPeriodMutation;
