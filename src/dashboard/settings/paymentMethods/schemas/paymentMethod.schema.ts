import { z } from "zod";

export const paymentMethodSchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
    isActive: z.boolean(),
    codeEI: z.string().optional()
});

export const defaultValues = {
    name: "",
    isActive: true,
    codeEI: "",
};

export type PaymentMethodFormData = z.infer<typeof paymentMethodSchema>;
