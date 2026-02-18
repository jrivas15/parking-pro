export interface User {
    id: number;
    username: string;
    fullName: string;
    isActive: boolean;
    tel?: string;
    nDoc?: string;
    lastLogin?: Date;
}