import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sileo } from "sileo";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Movement } from "../types/movements.type";
import { updatePlate } from "../services/movements.service";
import Plate from "./Plate";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  movement: Movement | null;
}

const CorrectPlateDialog = ({ open, onOpenChange, movement }: Props) => {
  const queryClient = useQueryClient();
  const [newPlate, setNewPlate] = useState("");

  useEffect(() => {
    if (!open) setNewPlate("");
  }, [open]);

  const mutation = useMutation({
    mutationFn: updatePlate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movements"] });
      sileo.success({ title: "Placa corregida", description: `Placa actualizada a ${newPlate}` });
      onOpenChange(false);
    },
    onError: () => {
      sileo.error({ title: "Error", description: "No se pudo actualizar la placa." });
    },
  });

  const handleConfirm = () => {
    if (!movement) return;
    mutation.mutate({ plate: movement.plate, newPlate: newPlate.trim().toUpperCase() });
  };

  const isValid = newPlate.trim().length >= 3 && newPlate.trim().toUpperCase() !== movement?.plate;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Corregir placa</DialogTitle>
          <DialogDescription>
            Escribe la placa correcta para el vehículo seleccionado.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted-foreground">Placa actual:</span>
            {movement && <Plate plate={movement.plate} />}
            <span className="text-muted-foreground text-xs ml-auto">#{movement?.nTicket}</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Nueva placa</Label>
            <Input
              autoFocus
              placeholder="Ej: ABC123"
              value={newPlate}
              onChange={(e) => setNewPlate(e.target.value.toUpperCase())}
              maxLength={10}
              onKeyDown={(e) => e.key === "Enter" && isValid && handleConfirm()}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={!isValid || mutation.isPending}>
            {mutation.isPending ? "Guardando..." : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CorrectPlateDialog;
