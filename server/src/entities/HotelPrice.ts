import { BaseEntity } from './BaseEntity';

export class HotelPrice extends BaseEntity {
    hotelId!: number;
    offerId!: number;
    pricePerNight?: number;
    pricePerRoom?: number;
    cleaningFee?: number;
    currency?: string;
    serviceFee?: number;
    date?: Date;
}