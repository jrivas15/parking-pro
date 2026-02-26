import {z} from "zod";

export const parkingInfoSchema = z.object({
    id: z.number(),
    name: z.string().min(1, "El nombre es requerido"),
    nit: z.string().optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
    email: z.string("Correo electrónico inválido").optional(),
    additionalInfo: z.string().optional(),
    includeLogo: z.boolean(),
    includeParkingInfo: z.boolean(),
    includeFeResolution: z.boolean(),
    includeQRCode: z.boolean(),
    ticketHeader: z.string(),
    includeBasicRules: z.boolean(),
    ticketFooter: z.string(),
})

export const defaultValues = {
    id: 1,
    name: "",
    nit: "",
    address: "",
    phone: "",
    email: "",
    additionalInfo: "",
    includeQRCode: false,
    includeFeResolution: false,
    ticketHeader: "",
    includeLogo: false,
    includeBasicRules: false,
    includeParkingInfo: false,
    ticketFooter: "",
}

export type ParkingInfoFormType = z.infer<typeof parkingInfoSchema>