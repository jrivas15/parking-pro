import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ColumnDef } from "@tanstack/react-table";
import {
  Plus,
  User as UserIcon,
  UserCircleIcon,
  Pencil,
  Trash,
} from "lucide-react";
import { User } from "./types/user.type";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";

const UserPage = () => {
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
    { accessorKey: "tel", header: "Teléfono" },
    { accessorKey: "nDoc", header: "N° Documento" },
    {
      id: "actions",
      header: "Acciones",
      cell: () => {
        return (
          <>
            <Button variant="outline" size="sm">
              <Pencil />
            </Button>
            <Button variant="destructive" size="sm" className="ml-2">
              <Trash />
            </Button>
          </>
        );
      },
    },
  ];

  const data: User[] = [
    {
      id: 2,
      username: "jsmith",
      fullName: "John Smith",
      isActive: true,
      tel: "555-0123",
      nDoc: "12345678",
    },
    {
      id: 3,
      username: "mgarcia",
      fullName: "María García",
      isActive: true,
      tel: "555-0124",
      nDoc: "87654321",
    },
    {
      id: 4,
      username: "alopez",
      fullName: "Alberto López",
      isActive: false,
      tel: "555-0125",
      nDoc: "11223344",
    },
    {
      id: 5,
      username: "arodriguez",
      fullName: "Ana Rodríguez",
      isActive: true,
      tel: "555-0126",
      nDoc: "55667788",
    },
    {
      id: 6,
      username: "cmoreno",
      fullName: "Carlos Moreno",
      isActive: true,
      tel: "555-0127",
      nDoc: "99887766",
    },
  ];

  return (
    <section className="p-4">
      <header className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <UserIcon className="size-11" />
            <h1 className="text-white text-3xl">Usuarios</h1>
          </div>
          <span className="text-sm text-muted-foreground">
            Administra los usuarios del sistema
          </span>
        </div>
        <Button>
          <Plus /> Nuevo usuario
        </Button>
      </header>
      <Separator className="my-2" />
      <div>
        <DataTable columns={columns} data={data} />
      </div>
    </section>
  );
};

export default UserPage;
