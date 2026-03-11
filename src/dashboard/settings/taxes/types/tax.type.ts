export interface Tax {
    id: number;
    name: string;
    percent: number;
    isActive: boolean;
    codeEI?: string;
}
