import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sileo } from "sileo";
import { SubscriptionPaymentFormData } from "../types/subscription.type";
import { paySubscription } from "../services/subscription.service";

const useSubscriptionPaymentMutation = () => {
  const queryClient = useQueryClient();

  const payMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: SubscriptionPaymentFormData }) =>
      paySubscription(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      sileo.success({ title: "Mensualidades", description: "Pago registrado exitosamente" });
    },
    onError: () => sileo.error({ title: "Mensualidades", description: "Error al registrar el pago" }),
  });

  return { payMutation };
};

export default useSubscriptionPaymentMutation;
