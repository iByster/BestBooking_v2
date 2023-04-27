import { Column, Entity } from 'typeorm';
import { IHotelPrice, IRoom, Nullable } from '../types/types';
import { BaseEntity } from './BaseEntity';
import { Field, ObjectType, Float, Int } from 'type-graphql';

@ObjectType()
export class Room implements IRoom {
    @Field()
    adults!: number;

    @Field(() => [Int])
    childAges!: number[];
}


@ObjectType()
@Entity()
export class HotelPrice extends BaseEntity implements IHotelPrice {
    @Field()
    @Column()
    hotelId!: string;

    @Field(() => Float, { nullable: true })
    @Column({ nullable: true, type: 'float' })
    pricePerNight: Nullable<number>;

    @Field(() => Float, { nullable: true })
    @Column({ nullable: true, type: 'float' })
    pricePerRoom: Nullable<number>;

    @Field(() => Float, { nullable: true })
    @Column({ nullable: true, type: 'float' })
    cleaningFee: Nullable<number>;

    @Field(() => String, { nullable: true })
    @Column({ nullable: true, type: 'text' })
    currency: Nullable<string>;

    @Field(() => Float, { nullable: true })
    @Column({ nullable: true, type: 'float' })
    serviceFee: Nullable<number>;

    @Field(() => Date, { nullable: true })
    @Column({ nullable: true, type: 'date' })
    date: Nullable<Date>;

    @Field(() => Date, { nullable: true })
    @Column({ nullable: true, type: 'date' })
    from: Nullable<Date>;

    @Field(() => Date, { nullable: true })
    @Column({ nullable: true, type: 'date' })
    to: Nullable<Date>;

    @Field(() => Float, { nullable: true })
    @Column({ nullable: true, type: 'float' })
    taxes: Nullable<number>;

    @Field(() => String, { nullable: true })
    @Column({ nullable: true, type: 'text' })
    description: Nullable<string | null>;

    @Field(() => String, { nullable: true })
    @Column({ nullable: true, type: 'simple-json' })
    rooms!: IRoom[];
}