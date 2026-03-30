import { z } from "zod";

export const vehicleSchema = z.object({
  plate:       z.string().min(1, "La placa es requerida").max(15),
  vehicleType: z.enum(["C", "M", "B"], { message: "Selecciona el tipo de vehículo" }),
  brand:       z.string().optional(),
  color:       z.string().optional(),
  isActive:    z.boolean().default(true),
  description: z.string().optional(),
  customer:    z.number().nullable().optional(),
});

export const defaultValues: VehicleFormData = {
  plate:       "",
  vehicleType: "C",
  brand:       "",
  color:       "",
  isActive:    true,
  description: "",
  customer:    null,
};

export type VehicleFormData = z.infer<typeof vehicleSchema>;
