import { Column, Entity } from 'typeorm';
import { IHotel, Nullable } from '../types/types';
import { BaseEntity } from './BaseEntity';

@Entity()
export class Hotel extends BaseEntity implements IHotel {
  @Column({ type: 'text' })
  siteOrigin!: string;

  @Column({ type: 'text' })
  siteHotelId!: string;

  @Column({ type: 'text' })
  hotelName!: string;

  @Column({ type: 'text' })
  link!: string;

  @Column({ nullable: true, type: 'text' })
  description: Nullable<string>;

  @Column({ nullable: true, type: 'simple-json' })
  rating: Nullable<{ score: number, maxScore: number }>;

  @Column({ nullable: true, type: 'text' })
  reviews: Nullable<string>;

  @Column({ nullable: true, type: 'text' })
  imageLink: Nullable<string>;

  @Column({ nullable: true, type: 'boolean' })
  wifi: Nullable<boolean>;

  @Column({ nullable: true, type: 'boolean' })
  kitchen: Nullable<boolean>;

  @Column({ nullable: true, type: 'boolean' })
  washer: Nullable<boolean>;

  @Column({ nullable: true, type: 'boolean' })
  bayView: Nullable<boolean>;

  @Column({ nullable: true, type: 'boolean' })
  mountainView: Nullable<boolean>;

  @Column({ nullable: true, type: 'boolean' })
  freeParking: Nullable<boolean>;

  @Column({ nullable: true, type: 'boolean' })
  balcony: Nullable<boolean>;

  @Column({ nullable: true, type: 'boolean' })
  bathroom: Nullable<boolean>;

  @Column({ nullable: true, type: 'boolean' })
  airConditioning: Nullable<boolean>;

  @Column({ nullable: true, type: 'boolean' })
  coffeMachine: Nullable<boolean>;
}
