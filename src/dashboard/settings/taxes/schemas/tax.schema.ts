import { z } from "zod";

export const taxSchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
    percent: z.number().min(0, "El porcentaje no puede ser negativo").max(100, "El porcentaje no puede superar 100"),
    isActive: z.boolean(),
    codeEI: z.string().optional().transform((val) => val === "" ? null : val),
});

export const defaultValues = {
    name: "",
    percent: 0,
    isActive: true,
    codeEI: "",
};

export type TaxFormData = z.infer<typeof taxSchema>;
