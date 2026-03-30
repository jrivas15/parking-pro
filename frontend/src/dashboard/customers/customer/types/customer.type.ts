export interface Customer {
  id: number;
  name: string;
  personType: string;
  documentType: string;
  nDoc: number;
  phone: string | null;
  address: string | null;
  postalCode: string | null;
  location: number | null;
  email: string | null;
  taxID: number | null;
}
