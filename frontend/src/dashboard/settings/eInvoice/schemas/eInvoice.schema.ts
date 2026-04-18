export { eInvoiceConfigSchema } from "services/e-invoice-api.service";
export type { EInvoiceConfigFormType } from "services/e-invoice-api.service";

export const defaultValues = {
    id: 1,
    endpoint: "http://localhost:8001/api/v1",
    api_key: "",
};
