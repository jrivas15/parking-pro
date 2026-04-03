import {z} from "zod";

export const parkingInfoSchema = z.object({
    id: z.number(),
    name: z.string().min(1, "El nombre es requerido"),
    nit: z.string().nullable().optional().transform(v => v ?? ""),
    address: z.string().nullable().optional().transform(v => v ?? ""),
    phone: z.string().nullable().optional().transform(v => v ?? ""),
    email: z.string().nullable().optional().transform(v => v ?? "").pipe(
        z.string().refine(v => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), { message: "Correo electrónico inválido" })
    ),
    additionalInfo: z.string().nullable().optional().transform(v => v ?? ""),
    includeLogo: z.boolean().nullable().optional().transform(v => v ?? false),
    includeParkingInfo: z.boolean().nullable().optional().transform(v => v ?? false),
    includeFeResolution: z.boolean().nullable().optional().transform(v => v ?? false),
    includeQRCode: z.boolean().nullable().optional().transform(v => v ?? false),
    ticketHeader: z.string().nullable().optional().transform(v => v ?? ""),
    includeBasicRules: z.boolean().nullable().optional().transform(v => v ?? false),
    ticketFooter: z.string().nullable().optional().transform(v => v ?? ""),
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