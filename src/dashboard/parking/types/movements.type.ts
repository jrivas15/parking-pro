export interface Movement {
    nTicket: number;
    plate: string;
    entryTime: Date;
    exitTime?: Date;
    vehicleType: string;
    card?: string;
    speciality?: string;
    parkingTime: string;
    tariff?: number;
    updatedAt: Date;
    user?: number;
}

export interface PaymentData {
    total: number;
    parkingTime: string;
}

export type MovementLike = Pick<Movement, 'plate' | 'card'>;