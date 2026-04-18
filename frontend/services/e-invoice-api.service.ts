import axios from "axios";
import { z } from "zod";
import apiService from "services/api.service";

// ─── Config schema & types ─────────────────────────────────────────────────────

export const eInvoiceConfigSchema = z.object({
    id: z.number(),
    endpoint: z.string().url("URL inválida"),
    api_key: z.string().min(1, "La API Key es requerida"),
});

export type EInvoiceConfigFormType = z.infer<typeof eInvoiceConfigSchema>;

// ─── Config CRUD (parking-pro backend, requires auth token) ───────────────────

export const getEInvoiceConfig = async (): Promise<EInvoiceConfigFormType> => {
    const response = await apiService.get('/e-invoices/api-config/1/');
    return eInvoiceConfigSchema.parse(response.data);
};

export const updateEInvoiceConfig = async (data: EInvoiceConfigFormType): Promise<EInvoiceConfigFormType> => {
    const response = await apiService.patch('/e-invoices/api-config/1/', data);
    invalidateClient();
    return response.data;
};

// ─── Direct client (e-invoice API, uses X-API-Key from settings) ──────────────

let cachedClient: ReturnType<typeof axios.create> | null = null;

export const invalidateClient = () => { cachedClient = null; };

const getClient = async () => {
    if (cachedClient) return cachedClient;

    const response = await apiService.get('/e-invoices/api-config/1/');
    const { endpoint, api_key } = response.data as { endpoint: string; api_key: string };

    cachedClient = axios.create({
        baseURL: endpoint.replace(/\/$/, ''),
        timeout: 15000,
        headers: {
            'X-API-Key': api_key,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    });

    return cachedClient;
};

// ─── Send invoice ──────────────────────────────────────────────────────────────

export interface SendEInvoicePayload {
    customerName: string;
    customerNDoc: string;
    customerTypeDoc: "CC" | "NIT";
    customerEmail: string;
    customerAddress?: string;
    customerCityCode?: string;
    subtotal: number;
    discounts: number;
    taxes: number;
    taxPercent: number;
    total: number;
    paymentMeansCode?: string;
    externalReference: number | string;
}

const DOC_TYPE_MAP: Record<string, string> = { CC: "13", NIT: "31" };

export const sendEInvoice = async (payload: SendEInvoicePayload) => {
    const client = await getClient();
    const data = {
        customer: {
            documentType: DOC_TYPE_MAP[payload.customerTypeDoc] ?? "13",
            documentNumber: payload.customerNDoc,
            legalName: payload.customerName,
            email: payload.customerEmail,
            address: payload.customerAddress ?? "",
            cityCode: payload.customerCityCode ?? "",
        },
        items: [
            {
                description: "Servicio de parqueadero",
                quantity: 1,
                unitPrice: payload.subtotal,
                discount: payload.discounts,
                taxes: [{ type: "01", rate: payload.taxPercent }],
            },
        ],
        subtotal: payload.subtotal,
        discounts: payload.discounts,
        taxes: payload.taxes,
        total: payload.total,
        paymentMeansCode: payload.paymentMeansCode ?? "10",
        externalReference: String(payload.externalReference),
    }
    console.log(data)
    const response = await client.post('/invoices/', data );
    return response.data;
};

// ─── List & detail ─────────────────────────────────────────────────────────────

export type EInvoiceStatus = 'pending' | 'processing' | 'sent' | 'accepted' | 'rejected' | 'error';

export interface EInvoiceListItem {
    id: string;
    fullNumber: string;
    status: EInvoiceStatus;
    total: string;
    customerName?: string | null;
    createdAt: string;
}

export interface EInvoiceListResponse {
    results: EInvoiceListItem[];
    total: number;
    page: number;
    per_page: number;
    pages: number;
}

export interface EInvoiceFilters {
    page: number;
    per_page: number;
    status: EInvoiceStatus | '';
    search: string;
}

export interface EInvoiceDetail {
    id: string;
    fullNumber: string;
    status: EInvoiceStatus;
    cufe: string | null;
    customer?: {
        documentType?: string | null;
        documentNumber?: string | null;
        legalName?: string | null;
        email?: string | null;
        address?: string | null;
        cityCode?: string | null;
    } | null;
    /** @deprecated use customer.email */
    customerEmail?: string | null;
    subtotal?: number | string | null;
    discounts?: number | string | null;
    taxes?: number | string | null;
    total?: number | string | null;
    paymentMeansCode?: string | null;
    externalReference?: string | null;
    dianResponse: {
        code: string;
        description: string;
        errors: string[];
    } | null;
    createdAt: string;
}

export const getEInvoices = async (filters: EInvoiceFilters): Promise<EInvoiceListResponse> => {
    const client = await getClient();
    const params: Record<string, string | number> = {
        page: filters.page,
        per_page: filters.per_page,
    };
    if (filters.status) params.status = filters.status;
    if (filters.search.trim()) params.search = filters.search.trim();

    const response = await client.get('/invoices/', { params });
    return response.data;
};

export const getEInvoiceDetail = async (id: string): Promise<EInvoiceDetail> => {
    const client = await getClient();
    const response = await client.get(`/invoices/${id}/`);
    return response.data;
};

export const resendEInvoice = async (id: string, email?: string): Promise<void> => {
    const client = await getClient();
    const payload = email ? { email } : undefined;
    await client.post(`/invoices/${id}/resend-email/`, payload);
};
