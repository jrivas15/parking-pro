export interface PaymentMethod {
    id: number;
    name: string;
    isActive: boolean;
    codeEI?: string;
}
