import { z } from "zod";

export const vehicleSchema = z.object({
  plate:       z.string().min(1, "La placa es requerida").max(10),
  vehicleType: z.enum(["C", "M", "B"], { message: "Selecciona el tipo de vehículo" }),
  brand:       z.string().min(1, "La marca es requerida"),
  model:       z.string().min(1, "El modelo es requerido"),
  year:        z.string().regex(/^\d{4}$/, "Año inválido"),
  color:       z.string().min(1, "El color es requerido"),
  ownerName:   z.string().min(1, "El nombre es requerido"),
  ownerPhone:  z.string().min(1, "El teléfono es requerido"),
  ownerEmail:  z.string().email("Correo inválido"),
  ownerDoc:    z.string().min(1, "El documento es requerido"),
  docType:     z.enum(["CC", "NIT", "CE"]),
  notes:       z.string().optional(),
});

export const defaultValues: VehicleFormData = {
  plate:       "",
  vehicleType: "C",
  brand:       "",
  model:       "",
  year:        "",
  color:       "",
  ownerName:   "",
  ownerPhone:  "",
  ownerEmail:  "",
  ownerDoc:    "",
  docType:     "CC",
  notes:       "",
};

export type VehicleFormData = z.infer<typeof vehicleSchema>;
