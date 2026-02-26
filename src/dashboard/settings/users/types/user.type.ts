export interface User {
    id: number;
    username: string;
    fullName: string;
    isActive: boolean;
    lastLogin?: Date;
    role: string;
    imgUrl?: string;
}