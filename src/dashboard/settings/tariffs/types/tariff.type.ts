export interface Tariff {
    id: number;
    name: string;
    tariffType: string;
    vehicleType: string;
    priceHour: number;
    priceHourAdditional: number;
    maxPrice: number;
    segment: number;
    startTimeCharge: number;
    enableDays: number[];
    enable: boolean;
}