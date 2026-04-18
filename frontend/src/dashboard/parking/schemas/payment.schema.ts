import {z} from "zod";

export const paymentSchema = z.object({
    nTicket: z.number(),
    note: z.string().optional(),
    discount: z.number().optional(),
    paymentMethod: z.string(),
    total: z.number(),
    amountPaid: z.number(),
    customerName: z.string(),
    customerEmail: z.email("*Requerido"),
    customerNDoc: z.string(),
    customerTypeDoc: z.enum(["NIT", "CC"]),
    customerType: z.enum(["NATURAL", "JURIDICA"]),
    isEI: z.boolean(),
    parkingTime: z.string(),
    tariff: z.string().min(1, "*Requerido"),
    customerAddress: z.string().optional(),
    customerCityCode: z.string().optional(),
})

export const defaultValues: PaymentFormData = {
    nTicket: 0,
    note: "",
    discount: 0,
    paymentMethod: "1",
    total: 0,
    amountPaid: 0,
    customerName: "consumidor final",
    customerEmail: "cfinal@ejemplo.com",
    customerNDoc: "222222222222",
    customerTypeDoc: "CC",
    customerType: "NATURAL",
    isEI: false,
    parkingTime: "",
    tariff: "1",
    customerAddress: "",
    customerCityCode: "",
}

export type PaymentFormData = z.infer<typeof paymentSchema>;