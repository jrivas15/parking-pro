import { z } from "zod";

export const customerSchema = z.object({
  name:         z.string().min(1, "El nombre es requerido"),
  customerType: z.enum(["NATURAL", "JURIDICA"]),
  documentType:      z.enum(["CC", "NIT"]),
  nDoc:          z.string().min(1, "El documento es requerido"),
  phone:        z.string().optional(),
  address :      z.string().optional(),
  postalCode:   z.string().optional(),
  location: z.number().optional(),
  email:        z.email("Correo inválido"),
  tax:        z.string().optional(),
  taxCode:    z.string().optional(),
});

export type CustomerFormData = z.infer<typeof customerSchema>;

export const defaultValues: CustomerFormData = {
  name:         "",
  documentType:      "CC",
  nDoc:          "",
  phone:        "",
  email:        "",
  customerType: "NATURAL",
  address: "",
  postalCode: "",
  location: null,
  tax: "",
  taxCode: "",
};
