import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sileo } from "sileo";
import { SubscriptionFormData } from "../types/subscription.type";
import { newSubscription, updateSubscription, deleteSubscription } from "../services/subscription.service";

const useSubscriptionMutation = () => {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["subscriptions"] });

  const newSubscriptionMutation = useMutation({
    mutationFn: (data: SubscriptionFormData) => newSubscription(data),
    onSuccess: () => {
      invalidate();
      sileo.success({ title: "Mensualidades", description: "Suscripción creada exitosamente" });
    },
    onError: () => sileo.error({ title: "Mensualidades", description: "Error al crear la suscripción" }),
  });

  const updateSubscriptionMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: SubscriptionFormData }) => updateSubscription(id, data),
    onSuccess: () => {
      invalidate();
      sileo.success({ title: "Mensualidades", description: "Suscripción actualizada exitosamente" });
    },
    onError: () => sileo.error({ title: "Mensualidades", description: "Error al actualizar la suscripción" }),
  });

  const deleteSubscriptionMutation = useMutation({
    mutationFn: (id: number) => deleteSubscription(id),
    onSuccess: () => {
      invalidate();
      sileo.success({ title: "Mensualidades", description: "Suscripción eliminada exitosamente" });
    },
    onError: () => sileo.error({ title: "Mensualidades", description: "Error al eliminar la suscripción" }),
  });

  return { newSubscriptionMutation, updateSubscriptionMutation, deleteSubscriptionMutation };
};

export default useSubscriptionMutation;
