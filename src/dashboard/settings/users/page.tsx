import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ColumnDef } from "@tanstack/react-table";
import { User as UserIcon, Pencil, Trash } from "lucide-react";
import { User } from "./types/user.type";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import UserFormDialog from "./dialogs/UserFormDialog";
import useUsers from "./hooks/useUsersQuery";
import { ConfirmDialog } from "@/components/dialogs/ConfimDialog";
import useUserMutation from "./hooks/useUserMutation";
import useUser from "./hooks/useUsers";
import PageLayout from "@/layouts/PageLayout";
import BackBtn from "@/components/shared/BackBtn";

const UserPage = () => {
  const { listUsers: users } = useUsers();
  const { deleteUserMutation } = useUserMutation();
  const {
    openConfirm,
    setOpenConfirm,
    selectedUser,
    handleDelete,
    handleUpdate,
    openForm,
    setOpenForm,
  } = useUser();

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "username",
      header: "Usuario",
      cell: ({ row }) => (
        <div className="flex items-center">
          <Avatar className="mr-2 bg-linear-to-r from-orange-300 to-orange-500">
            <UserIcon className="size-11" />
          </Avatar>
          {row.original.username}
        </div>
      ),
    },
    { accessorKey: "fullName", header: "Nombre completo" },
    {
      accessorKey: "isActive",
      header: "Activo",
      cell: ({ row }) =>
        row.original.isActive ? (
          <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
            Sí
          </Badge>
        ) : (
          <Badge variant="destructive">No</Badge>
        ),
    },
    {
      accessorKey: "role",
      header: "Rol",
      cell: ({ row }) => {
        const role = row.original.role;
        return <Badge variant="secondary">{role}</Badge>;
      },
    },
    {
      id: "actions",
      header: "Acciones",
      cell: (info) => {
        const user = info.row.original;
        return (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleUpdate(user)}
            >
              <Pencil />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="ml-2"
              onClick={() => handleDelete(user)}
            >
              <Trash />
            </Button>
          </>
        );
      },
    },
  ];

  return (
    <PageLayout>
      <header className="flex justify-between items-center">
        <div className="flex items-center">
          <BackBtn />
          <div>
            <div className="flex items-center gap-2">
              <UserIcon className="size-11" />
              <h1 className="text-white text-3xl">Usuarios</h1>
            </div>
            <span className="text-sm text-muted-foreground">
              Administra los usuarios del sistema
            </span>
          </div>
        </div>
        <UserFormDialog
          initialData={selectedUser}
          open={openForm}
          setOpen={setOpenForm}
        />
      </header>
      <Separator className="my-2" />
      <div>
        <DataTable columns={columns} data={users || []} />
      </div>
      <ConfirmDialog
        open={openConfirm}
        setOpen={setOpenConfirm}
        fx={() => deleteUserMutation.mutate(selectedUser.id)}
        title="Confirmar"
        description="¿Estás seguro de que deseas realizar esta acción?"
      />
    </PageLayout>
  );
};

export default UserPage;
