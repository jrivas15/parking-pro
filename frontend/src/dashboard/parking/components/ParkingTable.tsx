import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  RowSelectionState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Movement } from "../types/movements.type";
import { useEffect, useState } from "react";
import {
  Bike,
  Calendar,
  Car,
  Clock,
  Motorbike,
  Printer,
  Image,
} from "lucide-react";
import dayjs from "dayjs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Plate from "./Plate";

interface Props {
  data: Movement[];
  onSelectMovement: (movement: Movement) => void;
  onDoubleClickMovement?: (movement: Movement) => void;
  onPrintMovement?: (movement: Movement) => void;
}

export function ParkingTable({ data, onSelectMovement, onDoubleClickMovement, onPrintMovement }: Props) {
  const columns: ColumnDef<Movement>[] = [
    {
      accessorKey: "plate",
      header: "Placa",
      cell: (info) => {
        const plate = info.getValue() as string;
        return <Plate plate={plate} />
      },
    },
    {
      accessorKey: "entryTime",
      header: "Fecha",
      cell: (info) => {
        const entryTime = info.getValue() as Date;
        return (
          <span className="flex items-center gap-1">
            <Calendar className="size-3" />
            {dayjs(entryTime).format("DD-MM-YY")}
          </span>
        );
      },
    },
    {
      header: "Hora",
      cell: (info) => {
        const time = info.row.original.entryTime;
        return (
          <span className="flex items-center gap-1">
            <Clock className="size-3" />
            {dayjs(time).format("HH:mm:ss")}
          </span>
        );
      },
    },
    {
      accessorKey: "vehicleType",
      header: "Tipo",
      cell: (info) => {
        const type = info.getValue() as string;
        const typeIcon = () => {
          switch (type) {
            case "C":
              return <Car className="size-5" />;
            case "M":
              return <Motorbike className="size-5" />;
            case "B":
              return <Bike className="size-5" />;
            default:
              return <span className="text-muted-foreground">{type}</span>;
          }
        };

        return (
          <div className="flex items-center justify-center ">{typeIcon()}</div>
        );
      },
    },
    {
      accessorKey: "nTicket",
      header: "N°.Recibo",
      cell: (info) => {
        const nTicket = info.getValue() as string;
        return (
          <span className="flex items-center justify-center gap-1">
            {nTicket}
          </span>
        );
      },
    },
    // { accessorKey: "tariff", header: "Tarifa" },
    {
      accessorKey: "speciality",
      header: "Especialidad",
      cell: (info) => {
        const speciality = info.getValue() as string;
        const specialtyBagde = () => {
          switch (speciality) {
            case "NORMAL":
              return <Badge variant="secondary">Normal</Badge>;
            case "VIP":
              return <Badge variant="default">VIP</Badge>;
            case "MENS":
              return (
                <Badge variant="outline" className="bg-green-600">
                  MENS
                </Badge>
              );
            default:
              return null;
          }
        };
        return (
          <div className="flex items-center justify-center">
            {specialtyBagde()}
          </div>
        );
      },
    },
    {
      header: "Acciones",
      cell: (info) => {
        const movement = info.row.original;
        return (
          <div className="flex gap-1.5">
            <Button variant="outline" size="sm" className="text-blue-500">
              <Image />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => { e.stopPropagation(); onPrintMovement?.(movement); }}
            >
              <Printer />
            </Button>
          </div>
        );
      },
    },
  ];
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    enableMultiRowSelection: false,
  });

  useEffect(() => {
    // console.log(table.getSelectedRowModel().rows[0]?.original)
    const data = table.getSelectedRowModel().rows[0]?.original;
    if (data) {
      onSelectMovement(data);
    } else {
      onSelectMovement(null);
    }
  }, [table.getSelectedRowModel().rows]);

  return (
    <div className="overflow-auto rounded-md border">
      <Table>
        <TableHeader className="bg-zinc-900">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="text-center sticky top-0 bg-zinc-900 z-10">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className={
                  row.getIsSelected() ? "border-l-yellow-600" : "cursor-pointer"
                }
                onClick={row.getToggleSelectedHandler()}
                onDoubleClick={() => {
                  if (onDoubleClickMovement) {
                    onDoubleClickMovement(row.original);
                  }
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No hay data.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
