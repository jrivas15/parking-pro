import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import {
  userSchema,
  defaultValues,
  UserFormData,
} from "../schemas/user.schema";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomInput from "@/components/forms/CustomInput";
import FormSwitch from "@/components/forms/FormSwitch";
import useUserMutation from "../hooks/useUserMutation";
import { useEffect, useState } from "react";
import FormSelect from "@/components/forms/FormSelect";
import { User } from "../types/user.type";
interface UserFormDialogProps {
  initialData?: User;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserFormDialog = ({
  initialData,
  open,
  setOpen,
}: UserFormDialogProps) => {
  const { newUserMutation, updateUserMutation } = useUserMutation();
  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: initialData
      ? {
          username: initialData.username,
          fullName: initialData.fullName,
          isActive: initialData.isActive,
          role: initialData.role,
          password: "",
        }
      : defaultValues,
  });

  const onSubmit = async (data: UserFormData) => {
    console.log(data);
    if (!initialData) {
      newUserMutation.mutate(data);
    } else {
      updateUserMutation.mutate({ id: initialData.id, data });
    }
  };
  
  useEffect(() => {
    if (newUserMutation.isSuccess || updateUserMutation.isSuccess) {
      setOpen(false);
    }
  }, [newUserMutation.isSuccess, updateUserMutation.isSuccess]);

  useEffect(() => {
    if (initialData) {
      form.reset({
        username: initialData.username,
        fullName: initialData.fullName,
        isActive: initialData.isActive,
        role: initialData.role,
        password: "",
      });
    } else {
      form.reset(defaultValues);
    }
  }, [initialData]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus /> Nuevo usuario
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Editar usuario" : "Nuevo usuario"}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? "Actualiza la información del usuario."
              : "Completa el formulario para crear un nuevo usuario."}
          </DialogDescription>
          <FormProvider {...form}>
            <form
              className="flex flex-col gap-3"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <CustomInput formName="username" label="Nombre de usuario" />
              <CustomInput formName="fullName" label="Nombre completo" />
              <CustomInput
                formName="password"
                label="Contraseña"
                type="password"
              />
              <FormSwitch formName="isActive" label="Activo" />
              <FormSelect
                formName="role"
                label="Rol"
                options={[
                  { label: "Administrador", value: "Admin" },
                  { label: "Cajero", value: "Cajero" },
                ]}
                placeholder={""}
              />
              <menu className="flex justify-end gap-3">
                <DialogClose asChild>
                  <Button variant="outline">Cancelar</Button>
                </DialogClose>
                <Button type="submit">Guardar</Button>
              </menu>
            </form>
          </FormProvider>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default UserFormDialog;
