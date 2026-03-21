import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sileo } from "sileo";
import { CustomerFormData } from "../schemas/customer.schema";
import { Customer } from "../types/customer.type";

const useCustomerMutation = () => {
  const queryClient = useQueryClient();

  const getList = (): Customer[] =>
    queryClient.getQueryData<Customer[]>(["customers"]) ?? [];

  const newCustomerMutation = useMutation({
    mutationFn: async (data: CustomerFormData): Promise<Customer> => {
      // TODO: reemplazar con newCustomer(data)
      const next: Customer = { ...data, id: Date.now() };
      queryClient.setQueryData<Customer[]>(["customers"], [...getList(), next]);
      return next;
    },
    onSuccess: () => sileo.success({ title: "Clientes", description: "Cliente creado exitosamente" }),
    onError:   () => sileo.error({ title: "Clientes",  description: "Error al crear el cliente" }),
  });

  const updateCustomerMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: CustomerFormData }): Promise<Customer> => {
      // TODO: reemplazar con updateCustomer(id, data)
      const updated: Customer = { ...data, id };
      queryClient.setQueryData<Customer[]>(
        ["customers"],
        getList().map((c) => (c.id === id ? updated : c)),
      );
      return updated;
    },
    onSuccess: () => sileo.success({ title: "Clientes", description: "Cliente actualizado exitosamente" }),
    onError:   () => sileo.error({ title: "Clientes",  description: "Error al actualizar el cliente" }),
  });

  const deleteCustomerMutation = useMutation({
    mutationFn: async (id: number): Promise<void> => {
      // TODO: reemplazar con deleteCustomer(id)
      queryClient.setQueryData<Customer[]>(["customers"], getList().filter((c) => c.id !== id));
    },
    onSuccess: () => sileo.success({ title: "Clientes", description: "Cliente eliminado exitosamente" }),
    onError:   () => sileo.error({ title: "Clientes",  description: "Error al eliminar el cliente" }),
  });

  return { newCustomerMutation, updateCustomerMutation, deleteCustomerMutation };
};

export default useCustomerMutation;
