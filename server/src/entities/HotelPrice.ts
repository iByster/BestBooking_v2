import { Column, Entity } from 'typeorm';
import { IHotelPrice, IRoom, Nullable } from '../types/types';
import { BaseEntity } from './BaseEntity';

@Entity()
export class HotelPrice extends BaseEntity implements IHotelPrice {
    @Column()
    hotelId!: string;

    @Column({ nullable: true, type: 'float' })
    pricePerNight: Nullable<number>;

    @Column({ nullable: true, type: 'float' })
    pricePerRoom: Nullable<number>;

    @Column({ nullable: true, type: 'float' })
    cleaningFee: Nullable<number>;

    @Column({ nullable: true, type: 'text' })
    currency: Nullable<string>;

    @Column({ nullable: true, type: 'float' })
    serviceFee: Nullable<number>;

    @Column({ nullable: true, type: 'date' })
    date: Nullable<Date>;

    @Column({ nullable: true, type: 'date' })
    from: Nullable<Date>;

    @Column({ nullable: true, type: 'date' })
    to: Nullable<Date>;

    @Column({ nullable: true, type: 'float' })
    taxes: Nullable<number>;

    @Column({ nullable: true, type: 'text' })
    description: Nullable<string | null>;

    @Column({ nullable: true, type: 'simple-json' })
    rooms!: IRoom[];
}