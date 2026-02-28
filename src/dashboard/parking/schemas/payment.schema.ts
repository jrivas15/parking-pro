import {z} from "zod";

export const paymentSchema = z.object({
    note: z.string().optional(),
    discount: z.number().optional(),
    paymentMethod: z.string(),
    total: z.number(),
    customerName: z.string(),
    customerEmail: z.email(),
    customerNDoc: z.string(),
    customerTypeDoc: z.enum(["NIT", "CC"]),
    customerType: z.enum(["NATURAL", "JURIDICA"]),
})

export const defaultValues: PaymentFormData = {
    note: "",
    discount: 0,
    paymentMethod: "1",
    total: 0,
    customerName: "consumidor final",
    customerEmail: "",
    customerNDoc: "222222222222",
    customerTypeDoc: "CC",
    customerType: "NATURAL"
}

export type PaymentFormData = z.infer<typeof paymentSchema>;