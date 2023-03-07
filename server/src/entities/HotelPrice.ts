import { IRoom, Nullable } from '../types/types';
import { BaseEntity } from './BaseEntity';

export class HotelPrice extends BaseEntity {
    hotelId!: number | string;
    // offerId!: number;
    pricePerNight: Nullable<number>;
    pricePerRoom: Nullable<number>;
    cleaningFee: Nullable<number>;
    currency: Nullable<string>;
    serviceFee: Nullable<number>;
    date: Nullable<Date>;
    from: Nullable<Date>;
    to: Nullable<Date>;
    taxes: Nullable<number>;
    // services: Nullable<string>;
    description: Nullable<string | null>;
    rooms!: IRoom[];
}