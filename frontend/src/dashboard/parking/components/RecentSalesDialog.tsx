import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Printer, Receipt } from "lucide-react";
import dayjs from "dayjs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getRecentSales } from "../services/sales.service";
import { SaleReceipt } from "../types/sale.type";
import ParkingPrintDialog from "./ParkingPrintDialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RecentSalesDialog = ({ open, onOpenChange }: Props) => {
  const [selectedSale, setSelectedSale] = useState<SaleReceipt | null>(null);
  const [printOpen, setPrintOpen] = useState(false);

  const { data: sales, isLoading } = useQuery({
    queryKey: ["recent-sales"],
    queryFn: getRecentSales,
    enabled: open,
    staleTime: 0,
  });

  const handleReprint = (sale: SaleReceipt) => {
    setSelectedSale(sale);
    setPrintOpen(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="size-4" /> Últimas ventas
            </DialogTitle>
          </DialogHeader>

          {isLoading ? (
            <p className="text-sm text-muted-foreground py-4 text-center">Cargando...</p>
          ) : (
            <div className="overflow-auto max-h-[60vh]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground text-xs">
                    <th className="text-left py-2 px-2">Ticket</th>
                    <th className="text-left py-2 px-2">Placa</th>
                    <th className="text-left py-2 px-2">Salida</th>
                    <th className="text-left py-2 px-2">Tiempo</th>
                    <th className="text-left py-2 px-2">Método</th>
                    <th className="text-right py-2 px-2">Total</th>
                    <th className="py-2 px-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {sales?.map((sale) => (
                    <tr key={sale.id} className="border-b hover:bg-muted/40 transition-colors">
                      <td className="py-2 px-2 font-medium">#{sale.movement?.nTicket ?? "—"}</td>
                      <td className="py-2 px-2 font-mono tracking-widest">{sale.movement?.plate ?? "—"}</td>
                      <td className="py-2 px-2">
                        {sale.movement?.exitTime
                          ? dayjs(sale.movement.exitTime).format("DD/MM HH:mm")
                          : "—"}
                      </td>
                      <td className="py-2 px-2">{sale.movement?.parkingTime ?? "—"}</td>
                      <td className="py-2 px-2">{sale.paymentMethod?.name ?? "—"}</td>
                      <td className="py-2 px-2 text-right font-semibold">
                        ${Number(sale.total).toLocaleString("es-CO")}
                      </td>
                      <td className="py-2 px-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReprint(sale)}
                        >
                          <Printer className="size-3" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(!sales || sales.length === 0) && (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No hay ventas recientes.
                </p>
              )}
            </div>
          )}

          <div className="flex justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ParkingPrintDialog
        sale={selectedSale}
        open={printOpen}
        onOpenChange={setPrintOpen}
      />
    </>
  );
};

export default RecentSalesDialog;
