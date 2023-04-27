import { Column, Entity } from "typeorm";
import { ILocation, Nullable } from "../types/types";
import { BaseEntity } from "./BaseEntity";
import { Field, ObjectType, Float } from 'type-graphql';

@ObjectType()
@Entity()
export class Location extends BaseEntity implements ILocation {
    @Field()
    @Column()
    hotelId!: string;

    @Field()
    @Column({ nullable: true, type: 'text' })
    locationName!: string;

    @Field(() => Float, { nullable: true })
    @Column({ nullable: true, type: 'float' })
    lat: Nullable<number>;

    @Field(() => Float, { nullable: true })
    @Column({ nullable: true, type: 'float' })
    lon: Nullable<number>;

    @Field(() => String, { nullable: true })
    @Column({ nullable: true, type: 'text' })
    country: Nullable<string>;

    @Field(() => String, { nullable: true })
    @Column({ nullable: true, type: 'text' })
    area: Nullable<string>;

    @Field(() => String, { nullable: true })
    @Column({ nullable: true, type: 'text' })
    address: Nullable<string>;

    @Field(() => String, { nullable: true })
    @Column({ nullable: true, type: 'text' })
    region: Nullable<string>;
}