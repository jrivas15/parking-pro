import { z } from "zod";

export const customerSchema = z.object({
  name:         z.string().min(1, "El nombre es requerido"),
  personType:   z.enum(["NATURAL", "JURIDICA"]),
  documentType: z.enum(["CC", "NIT", "CE"]),
  nDoc:         z.coerce.number("El documento es requerido").min(1, "El documente debe tener al menos 5 dígitos"),
  phone:        z.string().optional(),
  address:      z.string().optional(),
  postalCode:   z.string().optional(),
  location:     z.number().nullable().optional(),
  email:        z.email("Correo inválido").optional().or(z.literal("")),
  taxID:        z.coerce.number().nullable().optional(),
});

export type CustomerFormData = z.infer<typeof customerSchema>;

export const defaultValues: CustomerFormData = {
  name:         "",
  personType:   "NATURAL",
  documentType: "CC",
  nDoc:         0,
  phone:        "",
  address:      "",
  postalCode:   "",
  location:     null,
  email:        "",
  taxID:        null,
};
