import { z } from "zod";

export const userSchema = z.object({
    username: z.string().min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
    password: z.string().min(4, "La contraseña debe tener al menos 4 caracteres"),
    fullName: z.string().min(3, "El nombre completo debe tener al menos 3 caracteres"),
    isActive: z.boolean(),
    imgUrl: z.instanceof(File, { error: "La imagen es obligatoria" })
        .refine((file) => file.size <= 5 * 1024 * 1024, "Máximo 6 MB")
        .refine((file) => file !== undefined, "La imagen es obligatoria").optional(),
    role: z.string("*Requerido").min(1, "El rol es obligatorio"),
})

export const defaultValues = {
    username: "",
    password: "",
    fullName: "",
    isActive: true,
    imgUrl: new File([], "", { type: "image/*" }),
    role:  "",
}

export type UserFormData = z.infer<typeof userSchema>;