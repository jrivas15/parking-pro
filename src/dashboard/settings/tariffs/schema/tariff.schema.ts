import { z } from "zod";

export const tariffSchema = z.object({
  name: z.string().max(100, "El nombre no puede exceder 100 caracteres").min(1, "El nombre es requerido"),
  tariffType: z.string().max(100, "El tipo de tarifa no puede exceder 100 caracteres").min(1, "El tipo de tarifa es requerido"),
  vehicleType: z.string().max(2, "El tipo de vehículo no puede exceder 2 caracteres").min(1, "El tipo de vehículo es requerido"),
  priceHour: z.number().nonnegative("El precio por hora debe ser positivo o cero"),
  priceHourAdditional: z.number().nonnegative("El precio por hora adicional debe ser positivo o cero"),
  maxPrice: z.number().nonnegative("El precio máximo debe ser positivo o cero"),
  segment: z
    .number()
    .int("El segmento debe ser un número entero")
    .nonnegative("El segmento debe ser positivo o cero"),
  startTimeCharge: z
    .number()
    .int("El inicio de cobro debe ser un número entero")
    .nonnegative("El inicio de cobro no puede ser negativo"),
  startTimeAdditional: z
    .number()
    .int("El tiempo adicional debe ser un número entero")
    .nonnegative("El tiempo adicional no puede ser negativo"),
  enableDays: z
    .array(
      z
        .number()
        .int()
        .min(1, "El día debe ser entre 1 y 7")
        .max(7, "El día debe ser entre 1 y 7")
    )
    .default([]),
  enable: z.boolean().default(true),
});

export const defaultValues: TariffFormData = {
    name: "",
    tariffType: "",
    vehicleType: "",
    priceHour: 0,
    priceHourAdditional: 0,
    maxPrice: 0,
    segment: 0,
    startTimeCharge: 0,
    startTimeAdditional: 0,
    enableDays: [],
    enable: true
}

export type TariffFormData = z.infer<typeof tariffSchema>;