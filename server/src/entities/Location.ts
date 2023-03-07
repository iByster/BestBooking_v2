import { Nullable } from "../types/types";
import { BaseEntity } from "./BaseEntity";

export class Location extends BaseEntity {
    hotelId!: number | string;
    locationName!: string;
    lat: Nullable<number>;
    lon: Nullable<number>;
    country: Nullable<string>;
    area: Nullable<string>;
    address: Nullable<string>;
    region: Nullable<string>;
}