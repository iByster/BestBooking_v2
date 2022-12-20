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
    'Referer': string;
    'sec-ch-ua'?: string;
    'sec-ch-ua-mobile'?: string;
    'sec-ch-ua-platform'?: string;
    [key: string]: unknown; 
};