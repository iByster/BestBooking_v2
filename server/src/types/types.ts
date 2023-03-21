import { AxiosRequestConfig } from 'axios';
import { Hotel } from '../entities/Hotel';

export interface IUserInput {
    locationName: string;
    checkIn: Date;
    checkOut: Date;
    rooms: IRoom[];
}

export interface IUserInputForCrawling {
    checkIn: Date;
    checkOut: Date;
    rooms: IRoom[];
}

export interface IRoom {
    adults: number;
    childAges: number[];
}

// TODO set posible options like Content-Type
export type BaseHeader = {
    Accept: string;
    'Accept-Encoding': string;
    'Accept-Language': string;
    'Content-Type': string | 'application/json';
    'User-Agent': string;
    Referer: string;
    'sec-ch-ua'?: string;
    'sec-ch-ua-mobile'?: string;
    'sec-ch-ua-platform'?: string;
    [key: string]: unknown;
};

export interface QueueItem<T, N> {
    callback: QueueCallback<N>;
    getData: () => T;
}

export interface BaseWorkerPayload {
    hotelId: string;
    userInput: IUserInputForCrawling;
    cookie: string;
    existingHotel?: Nullable<Hotel>;
}

export interface AirBnbWorkerPayload extends BaseWorkerPayload {}

export interface DirectBookingWorkerPayload extends BaseWorkerPayload {
    hotelUrl: string;
}

export interface BookingComWorkerPayload {
    hotelUrl: string;
    userInput: IUserInputForCrawling;
    cookie: string;
    existingHotel?: Nullable<Hotel>;
}

export interface TripComWokerPayload extends BaseWorkerPayload {
}

export interface AgodaComWorkerPayload {
    hotelUrl: string;
    userInput: IUserInputForCrawling;
    cookie: string;
    existingHotel?: Nullable<Hotel>;
};

export interface AirBnbWorkerResponse extends WorkerResponse<BaseWorkerResponse> {}
export interface DirectBookingWorkerResponse extends WorkerResponse<BaseWorkerResponse> {}
export interface BookingComWorkerResponse extends WorkerResponse<BaseWorkerResponse> {}
export interface TripComWorkerResponse extends WorkerResponse<BaseWorkerResponse> {}
export interface AgodaComWorkerResponse extends WorkerResponse<BaseWorkerResponse> {}

export type WorkerError = Error;

export type WorkerResponse<T> = {
    data: Nullable<T>;
    error: Nullable<WorkerError>;
}

export interface BaseWorkerResponse {
    hotelData: IHotel;
    hotelPricesData: IHotelPrice[];
    locationData?: ILocation;
}

export type BasicHTTPMethods = 'GET' | 'POST' | 'DELETE' | 'PUT';

export interface RequestOptions extends AxiosRequestConfig {}

export type QueueCallback<N> = (err: any, result?: N) => void;

export type Nullable<T> = T | null | undefined;

export interface RequestScraperOptions {
    cookie: boolean;
    proxy: boolean;
    method: BasicHTTPMethods;
    apiEndpoint: string;
    body: any;
    includeRotatingHeaders: boolean;
    specificHeaders: any;
}

export class ErrorRequestFetch extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ErrorRequestFetch";
    }
}

export interface IBaseEntity {
    id: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IHotel extends IBaseEntity {
    siteOrigin: string;
    siteHotelId: string;
    hotelName: string;
    link: string;
    description: Nullable<string>;
    rating: Nullable<{ score: number, maxScore: number }>;
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


export interface ILocation extends IBaseEntity {
    hotelId: string;
    locationName: string;
    lat: Nullable<number>;
    lon: Nullable<number>;
    country: Nullable<string>;
    area: Nullable<string>;
    address: Nullable<string>;
    region: Nullable<string>;
}

export interface IHotelPrice extends IBaseEntity {
    hotelId: string;
    pricePerNight: Nullable<number>;
    pricePerRoom: Nullable<number>;
    cleaningFee: Nullable<number>;
    currency: Nullable<string>;
    serviceFee: Nullable<number>;
    date: Nullable<Date>;
    from: Nullable<Date>;
    to: Nullable<Date>;
    taxes: Nullable<number>;
    description: Nullable<string | null>;
    rooms: IRoom[];
}
