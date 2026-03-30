export interface SalesClosing {
    id: number;
    createdAt: string;
    username: string | null;
    total: number;
    subtotal: number;
    tax_value: number;
    discount: number;
    expenses: number;
    note: string | null;
}
