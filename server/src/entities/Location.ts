import { Column, Entity } from "typeorm";
import { ILocation, Nullable } from "../types/types";
import { BaseEntity } from "./BaseEntity";

@Entity()
export class Location extends BaseEntity implements ILocation {
    @Column()
    hotelId!: string;

    @Column({ nullable: true, type: 'text' })
    locationName!: string;

    @Column({ nullable: true, type: 'float' })
    lat: Nullable<number>;

    @Column({ nullable: true, type: 'float' })
    lon: Nullable<number>;

    @Column({ nullable: true, type: 'text' })
    country: Nullable<string>;

    @Column({ nullable: true, type: 'text' })
    area: Nullable<string>;

    @Column({ nullable: true, type: 'text' })
    address: Nullable<string>;

    @Column({ nullable: true, type: 'text' })
    region: Nullable<string>;
}