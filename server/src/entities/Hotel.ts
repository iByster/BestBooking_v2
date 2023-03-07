import { Nullable } from '../types/types';
import { BaseEntity } from './BaseEntity';

export class Hotel extends BaseEntity {
  siteOrigin!: string;
  siteHotelId!: number | string;
  hotelName!: string;
  link!: string;
  description: Nullable<string>;
  rating: Nullable<{ score: number, maxScore: number }>;
  // stars: Nullable<number>
  reviews: Nullable<string>;
  imageLink: Nullable<string>;
  wifi: Nullable<boolean>;
  kitchen: Nullable<boolean>;
  washer: Nullable<boolean>;
  bayView: Nullable<boolean>;
  mountainView: Nullable<boolean>;
  freeParking: Nullable<boolean>;
  balcony: Nullable<boolean>;
  bathroom: Nullable<boolean>;
  airConditioning: Nullable<boolean>;
  coffeMachine: Nullable<boolean>;
}
