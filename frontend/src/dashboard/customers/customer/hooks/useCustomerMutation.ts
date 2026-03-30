import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sileo } from "sileo";
import { CustomerFormData } from "../schemas/customer.schema";
import { newCustomer, updateCustomer, deleteCustomer } from "../services/customer.service";

const useCustomerMutation = () => {
  const queryClient = useQueryClient();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["customers"] });

  const newCustomerMutation = useMutation({
    mutationFn: (data: CustomerFormData) => newCustomer(data),
    onSuccess: () => {
      invalidate();
      sileo.success({ title: "Clientes", description: "Cliente creado exitosamente" });
    },
    onError: () => sileo.error({ title: "Clientes", description: "Error al crear el cliente" }),
  });

  const updateCustomerMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CustomerFormData }) => updateCustomer(id, data),
    onSuccess: () => {
      invalidate();
      sileo.success({ title: "Clientes", description: "Cliente actualizado exitosamente" });
    },
    onError: () => sileo.error({ title: "Clientes", description: "Error al actualizar el cliente" }),
  });

  const deleteCustomerMutation = useMutation({
    mutationFn: (id: number) => deleteCustomer(id),
    onSuccess: () => {
      invalidate();
      sileo.success({ title: "Clientes", description: "Cliente eliminado exitosamente" });
    },
    onError: () => sileo.error({ title: "Clientes", description: "Error al eliminar el cliente" }),
  });

  return { newCustomerMutation, updateCustomerMutation, deleteCustomerMutation };
};

export default useCustomerMutation;
