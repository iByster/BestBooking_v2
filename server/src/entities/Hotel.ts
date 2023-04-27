import { Column, Entity } from 'typeorm';
import { IHotel, Nullable } from '../types/types';
import { BaseEntity } from './BaseEntity';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
class Rating {
  @Field()
  score!: number;

  @Field()
  maxScore!: number;
}


@ObjectType()
@Entity()
export class Hotel extends BaseEntity implements IHotel {
  @Field()
  @Column({ type: 'text' })
  siteOrigin!: string;

  @Field()
  @Column({ type: 'text' })
  siteHotelId!: string;
  
  @Field()
  @Column({ type: 'text' })
  hotelName!: string;

  @Field()
  @Column({ type: 'text' })
  link!: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true, type: 'text' })
  description: Nullable<string>;

  @Field(() => Rating, { nullable: true })
  @Column({ nullable: true, type: 'simple-json' })
  rating: Nullable<{ score: number, maxScore: number }>;

  @Field(() => String,{ nullable: true })
  @Column({ nullable: true, type: 'text' })
  reviews: Nullable<string>;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true, type: 'text' })
  imageLink: Nullable<string>;

  @Field(() => Boolean, { nullable: true })
  @Column({ nullable: true, type: 'boolean' })
  wifi: Nullable<boolean>;

  @Field(() => Boolean, { nullable: true })
  @Column({ nullable: true, type: 'boolean' })
  kitchen: Nullable<boolean>;

  @Field(() => Boolean, { nullable: true })
  @Column({ nullable: true, type: 'boolean' })
  washer: Nullable<boolean>;

  @Field(() => Boolean, { nullable: true })
  @Column({ nullable: true, type: 'boolean' })
  bayView: Nullable<boolean>;

  @Field(() => Boolean, { nullable: true })
  @Column({ nullable: true, type: 'boolean' })
  mountainView: Nullable<boolean>;

  @Field(() => Boolean, { nullable: true })
  @Column({ nullable: true, type: 'boolean' })
  freeParking: Nullable<boolean>;

  @Field(() => Boolean, { nullable: true })
  @Column({ nullable: true, type: 'boolean' })
  balcony: Nullable<boolean>;

  @Field(() => Boolean, { nullable: true })
  @Column({ nullable: true, type: 'boolean' })
  bathroom: Nullable<boolean>;

  @Field(() => Boolean, { nullable: true })
  @Column({ nullable: true, type: 'boolean' })
  airConditioning: Nullable<boolean>;

  @Field(() => Boolean, { nullable: true })
  @Column({ nullable: true, type: 'boolean' })
  coffeMachine: Nullable<boolean>;
}
