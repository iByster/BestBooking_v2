import {
    Field,
    InputType,
    Int,
    ObjectType,
    Float,
} from 'type-graphql';
import { IDestination, IRoom, IUserInput, Nullable } from '../types/types';
import { HotelPrice, Room } from '../entities/HotelPrice';
import { Location } from '../entities/Location';

@InputType()
export class HotelMetadata {
    @Field(() => Int)
    limit!: number;

    @Field({ nullable: true })
    offset!: number;
}

@InputType()
class RoomInput implements IRoom {
    @Field()
    adults!: number;

    @Field(() => [Int])
    childAges!: number[];
}

@InputType()
export class Destination implements IDestination {
    @Field({ nullable: true })
    hotelName?: string;
    
    @Field()
    locationName!: string;

    @Field()
    country!: string;

    @Field({ nullable: true })
    region?: string;

    @Field({ nullable: true })
    area?: string;

    @Field(() => [String], { nullable: true })
    terms?: string[];

    @Field(() => String, { nullable: true })
    description?: string;
}

@InputType()
export class UserInput implements IUserInput {
    @Field()
    checkIn!: Date;

    @Field()
    checkOut!: Date;

    @Field(() => Destination)
    destination!: Destination;

    @Field(() => [RoomInput])
    rooms!: RoomInput[];
}


@ObjectType()
class Score {
  @Field(() => Float, { nullable: true })
  score?: number;

  @Field(() => Float, { nullable: true })
  maxScore?: number;

  @Field(() => String, { nullable: true })
  reviews!: string | null;
}

@ObjectType()
class Scores {
  @Field()
  field!: string;

  @Field(() => Score)
  value!: Score; 
}

@ObjectType()
class Links {
  @Field()
  field!: string;

  @Field()
  value!: string; 
}

@ObjectType()
export class HotelContent {
    @Field()
    hotelName!: string;
    @Field(() => String, { nullable: true })
    description: Nullable<string>;
    @Field(() => [Scores])
    scores!: Scores[];
    @Field(() => [String])
    imageLinks!: (string|null)[];
    @Field(() => [Links])
    links!: Links[];
    @Field(() => Boolean, { nullable: true })
    wifi: Nullable<boolean>;
    @Field(() => Boolean, { nullable: true })
    kitchen: Nullable<boolean>;
    @Field(() => Boolean, { nullable: true })
    washer: Nullable<boolean>;
    @Field(() => Boolean, { nullable: true })
    bayView: Nullable<boolean>;
    @Field(() => Boolean, { nullable: true })
    mountainView: Nullable<boolean>;
    @Field(() => Boolean, { nullable: true })
    freeParking: Nullable<boolean>;
    @Field(() => Boolean, { nullable: true })
    balcony: Nullable<boolean>;
    @Field(() => Boolean, { nullable: true })
    bathroom: Nullable<boolean>;
    @Field(() => Boolean, { nullable: true })
    airConditioning: Nullable<boolean>;
    @Field(() => Boolean, { nullable: true })
    coffeMachine: Nullable<boolean>;
}

@ObjectType()
export class HotelPricesGraph {
  // Use index signatures to dynamically create fields for each key in the hotelPricesData object
  @Field()
  field!: string;

  @Field(() => [HotelPrice])
  value!: HotelPrice[];
}

@ObjectType()
export class HotelPricesMain {
    @Field()
    field!: string;
  
    @Field(() => HotelPrice)
    value!: HotelPrice;
}

@ObjectType()
class HotelPricesData {
    @Field(() => [HotelPricesMain])
    hotelPricesMain!: HotelPricesMain[];

    @Field(() => [HotelPricesGraph])
    hotelPricesGraph!: HotelPricesGraph[];
}


@ObjectType()
export class HotelsResponse {
    @Field(() => HotelContent)
    hotelData!: HotelContent;
    @Field(() => Location)
    hotelLocationData!: Location;
    @Field(() => HotelPricesData)
    hotelPricesData!: HotelPricesData;
}

@ObjectType()
export class Response {
    @Field(() => HotelsResponse, { nullable: true })
    main?: HotelsResponse;
    @Field(() => [HotelsResponse])
    secondary!: HotelsResponse[];
    @Field({ nullable: true })
    hasMore?: boolean;
}