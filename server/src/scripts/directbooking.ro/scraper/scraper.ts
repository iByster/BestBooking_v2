import { DirectBookingWorkerResponse, ErrorRequestFetch, IUserInputForCrawling } from '../../../types/types';
import { JSDOM } from 'jsdom';
import { v4 as uuidv4 } from 'uuid';
import { Hotel } from '../../../entities/Hotel';
import { HotelPrice } from '../../../entities/HotelPrice';
import { Location } from '../../../entities/Location';
import RequestScraper from '../../../scrapers/RequestScraper';
import { getDateDifferenceInDays } from '../../../utils/parse/parseUtils';
import { constructQueryStringPayload } from '../payload/payload';
import { directBookingHeaders } from '../headers/headers';

const siteOrigin = 'https://www.directbooking.ro';
const apiEndpoint = `${siteOrigin}/ajax.ashx`;

export const parsePriceData = (priceHTML: any, userInput: IUserInputForCrawling, hotelId: string): { hotelPricesData: HotelPrice[] } => {
    const dom = new JSDOM(priceHTML);
    const document = dom.window.document;

    const to = userInput?.checkOut;
    const from = userInput?.checkIn;
    const currency = 'EUR';

    const serviceFee = null;
    const cleaningFee = null;
    const taxes = null;

    const hotelPricesData: HotelPrice[] = [];

    const rooms = document.querySelectorAll('.room');

    rooms.forEach(room => {
        const totalPrice = room.querySelector('.price')?.textContent?.split(' ')[0];
        const pricePerNight = +totalPrice! / getDateDifferenceInDays(userInput.checkIn, userInput.checkOut);
        const pricePerRoom = +totalPrice! / getDateDifferenceInDays(userInput.checkIn, userInput.checkOut);
        const description = room.querySelector('.room-title')?.textContent;

        hotelPricesData.push({
            id: uuidv4(),
            hotelId,
            from,
            to,
            pricePerNight,
            pricePerRoom,
            serviceFee,
            cleaningFee,
            taxes,
            currency,
            rooms: userInput.rooms,
            date: null,
            description,
            createdAt: new Date()
        })
    });

    return {
        hotelPricesData
    }
}

export const parseDetailsAndLocationData = (detailsHTML: string): { hotelData: Hotel, locationData: Location } => {
    const hotelId = uuidv4();
    
    const dom = new JSDOM(detailsHTML);
    const document = dom.window.document;

    const detailsJSON = document.querySelector('script[type="application/ld+json"]')?.textContent;

    if (detailsJSON) {
        const details = JSON.parse(detailsJSON);

        // HOTEL DATA
        const hotelName = details.name;
        const siteHotelId = details['@id'];
        const description = details.description;
        const rating = { score: +details.starRating.ratingValue, maxScore: 5 };
        const reviews = undefined;
        const link = details.url;
        const imageLink = details.photo;

        // LOCATION DATA
        const locationName = details.address.addressLocality;
        const country = details.address.addressCountry;
        const region = details.address.addressRegion;
        const address = details.address.streetAddress;
        const lat = details.geo.latitude;
        const lon = details.geo.longitude;

        return {
            hotelData: {
                id: hotelId,
                hotelName,
                siteOrigin,
                siteHotelId,
                description,
                rating,
                reviews,
                link,
                imageLink,
                balcony: !!null,
                freeParking: !!null,
                kitchen: !!null,
                bayView: !!null,
                mountainView: !!null,
                washer: !!null,
                wifi: !!null,
                bathroom: !!null,
                coffeMachine: !!null,
                airConditioning: !!null,
                createdAt: new Date()
            },
            locationData: {
                id: uuidv4(),
                hotelId,
                locationName,
                lat,
                lon,
                address,
                area: null,
                country,
                region,
                createdAt: new Date()
            },
        }
    } else {
        throw new Error('Error at featching details')
    }
}

export const fetchHotelPrices = async (hotelId: string, userInput: IUserInputForCrawling) => {
    const requestScraper = new RequestScraper(siteOrigin);

    try {
        const requestOptionsForPrices = await requestScraper.buildRequestOptions({
            apiEndpoint: preparePayload(hotelId, userInput),
            body: null,
            cookie: false,
            proxy: false,
            method: 'GET',
            specificHeaders: directBookingHeaders,
            includeRotatingHeaders: true,
        });

        const response = await requestScraper.scrapeHotel(requestOptionsForPrices);
        const { data, status } = response;

        if (status !== 200) {
            throw new Error(`Request failed with status code: ` + status);
        }

        return data;
    } catch(err) {
        let message;
        if (err instanceof Error) {
            message = err.message;
        } else {
            message = String(err);
        }

        throw new ErrorRequestFetch(`fetchHotelPrice: ${message}`)
    }
}

export const fetchHotelAndLocationData = async (hotelUrl: string) => {
    const requestScraper = new RequestScraper(siteOrigin);

    try {
        const requestOptionsForDetails = await requestScraper.buildRequestOptions({
            apiEndpoint: hotelUrl,
            body: null,
            cookie: false,
            proxy: false,
            method: 'GET',
            specificHeaders: directBookingHeaders,
            includeRotatingHeaders: true,
        });

        const response = await requestScraper.scrapeHotel(requestOptionsForDetails);
        const { data, status } = response;

        if (status !== 200) {
            throw new Error(`Request failed with status code: ` + status);
        }

        return data;
    } catch(err) {
        let message;
        if (err instanceof Error) {
            message = err.message;
        } else {
            message = String(err);
        }

        throw new ErrorRequestFetch(`fetchHotelPrice: ${message}`);
    }
}

const preparePayload = (id: string, userInput: IUserInputForCrawling) => {
    const queryString = constructQueryStringPayload(id, userInput);
    const endpoint = `${apiEndpoint}?${queryString}`;
    return endpoint;
}

export const scrapeHotelByIdAndUserInput = async (id: string, userInput: IUserInputForCrawling, hotelUrl: string): Promise<DirectBookingWorkerResponse> => {
    try {
        const hotelAndLocationDataRaw = await fetchHotelAndLocationData(hotelUrl);
        const { hotelData, locationData } = parseDetailsAndLocationData(hotelAndLocationDataRaw);
        const hotelPricesDataRaw = await fetchHotelPrices(id, userInput);
        const { hotelPricesData } = parsePriceData(hotelPricesDataRaw, userInput, hotelData.id);

        return {
            data: {
                hotelData,
                locationData,
                hotelPricesData,
            },
            error: null
        }
    } catch(err: any) {
        if (err instanceof Error) {
            err.message += `. ${hotelUrl}`;
            throw err;
        }

        throw new Error(err);
    }
} 