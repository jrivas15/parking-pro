export interface Customer {
  id: number;
  name: string;
  docType: "CC" | "NIT" | "CE";
  doc: string;
  phone: string;
  email: string;
  customerType: "NATURAL" | "JURIDICA";
  notes?: string;
}
