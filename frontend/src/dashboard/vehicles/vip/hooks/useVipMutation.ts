import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sileo } from "sileo";
import { VipFormData } from "../types/vip.type";
import { newVip, updateVip, deleteVip } from "../services/vip.service";

const useVipMutation = () => {
  const queryClient = useQueryClient();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["vips"] });

  const newVipMutation = useMutation({
    mutationFn: (data: VipFormData) => newVip(data),
    onSuccess: () => {
      invalidate();
      sileo.success({ title: "VIP", description: "VIP registrado exitosamente" });
    },
    onError: () => sileo.error({ title: "VIP", description: "Error al registrar el VIP" }),
  });

  const updateVipMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: VipFormData }) => updateVip(id, data),
    onSuccess: () => {
      invalidate();
      sileo.success({ title: "VIP", description: "VIP actualizado exitosamente" });
    },
    onError: () => sileo.error({ title: "VIP", description: "Error al actualizar el VIP" }),
  });

  const deleteVipMutation = useMutation({
    mutationFn: (id: number) => deleteVip(id),
    onSuccess: () => {
      invalidate();
      sileo.success({ title: "VIP", description: "VIP eliminado exitosamente" });
    },
    onError: () => sileo.error({ title: "VIP", description: "Error al eliminar el VIP" }),
  });

  return { newVipMutation, updateVipMutation, deleteVipMutation };
};

export default useVipMutation;
