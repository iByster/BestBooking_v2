import { v4 as uuidv4 } from 'uuid';
import RequestScraper from '../../scrapers/RequestScraper';
import { AirBnbWorkerResponse, IUserInputForCrawling } from '../../types/types';
import { extractNumbers } from '../../utils/parse/parseUtils';
import { createQueryString } from '../../utils/url/createQueryString';
import { airBnbHeaders } from '../headers/headers';
import { constructGraphQLPayload } from '../payload/payload';

const siteOrigin = 'https://www.airbnb.com';
const apiEndpoint = `${siteOrigin}/api/v3/StaysPdpSections`;

const parseData = (response: any, userInput: IUserInputForCrawling): AirBnbWorkerResponse => {
    // HOTEL Data
    const hotelId = uuidv4();
    const hotelName = response?.data?.presentation?.stayProductDetailPage?.sections?.metadata?.seoFeatures?.ogTags?.ogTitle;
    const description = response?.data?.presentation?.stayProductDetailPage?.sections?.metadata?.seoFeatures?.ogTags?.ogDescription;
    const siteOrigin = 'https://airbnb.com';
    const siteHotelId = response?.data?.presentation?.stayProductDetailPage?.sections?.metadata?.loggingContext?.eventDataLogging?.listingId.toString();
    const rating = response?.data?.presentation?.stayProductDetailPage?.sections?.metadata?.sharingConfig?.starRating;
    const reviews = response?.data?.presentation?.stayProductDetailPage?.sections?.metadata?.sharingConfig?.reviewCount;
    const link = response?.data?.presentation?.stayProductDetailPage?.sections?.metadata?.sharingConfig?.pdpLink;
    const imageLink = response?.data?.presentation?.stayProductDetailPage?.sections?.metadata?.sharingConfig?.imageUrl;

    // LOCATION Data
    const locationName = response?.data?.presentation?.stayProductDetailPage?.sections?.metadata?.sharingConfig?.location;
    const lat = response?.data?.presentation?.stayProductDetailPage?.sections?.metadata?.loggingContext?.eventDataLogging?.listingLat;
    const lon = response?.data?.presentation?.stayProductDetailPage?.sections?.metadata?.loggingContext?.eventDataLogging?.listingLng;

    // HOTEL_PRICE Data
    const to = userInput?.checkOut;
    const from = userInput?.checkIn;
    const currency = 'RON';

    let pricePerNight = undefined;
    let cleaningFee = undefined;
    let serviceFee = undefined;
    let taxes = undefined;

    const detailedPrices = response?.data?.presentation?.stayProductDetailPage?.sections?.sections[0]?.section?.structuredDisplayPrice?.explanationData?.priceDetails[0]?.items;

    for (let i = 0; i < detailedPrices.length; ++i) {
        const section = detailedPrices[i];
        if (section.description === 'Service fee') {
            serviceFee = extractNumbers(section.priceString)[0];
        }
        else if (section.description === 'Cleaning fee') {
            cleaningFee = extractNumbers(section.priceString)[0];
        }
        else if (section.description === 'Taxes') {
            taxes = extractNumbers(section.priceString)[0];
        } else {
            pricePerNight = extractNumbers(section.description)[0];
        }
    }

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
            balcony: null,
            freeParking: null,
            kitchen: null,
            bayView: null,
            mountainView: null,
            washer: null,
            wifi: null,
            bathroom: null,
            coffeMachine: null,
            airConditioning: null,
            createdAt: new Date()
        },
        locationData: {
            id: uuidv4(),
            hotelId,
            locationName,
            lat,
            lon,
            address: null,
            area: null,
            country: null,
            region: null,
            createdAt: new Date()
        },
        hotelPricesData: [{
            id: uuidv4(),
            hotelId,
            from,
            to,
            pricePerNight,
            pricePerRoom: pricePerNight,
            serviceFee,
            cleaningFee,
            taxes,
            currency,
            rooms: userInput.rooms,
            date: null,
            description: null,
            createdAt: new Date()
        }]
    }
}

import fs from 'fs';

export const scrapeHotelByIdAndUserInput = async (id: string, userInput: IUserInputForCrawling): Promise<AirBnbWorkerResponse> => {
    const requestScraper = new RequestScraper(siteOrigin);

    const requestOptions = await requestScraper.buildRequestOptions({
        apiEndpoint: `${apiEndpoint}?${createQueryString(constructGraphQLPayload(id, userInput))}`,
        body: null,
        cookie: false,
        proxy: false,
        method: 'GET',
        specificHeaders: airBnbHeaders,
        includeRotatingHeaders: false,
    });

    const response = await requestScraper.scrapeHotel(requestOptions);
    fs.writeFileSync('./junk/airbnbres.json', JSON.stringify(response));
    const parsedData = parseData(response, userInput);

    return parsedData;
} 