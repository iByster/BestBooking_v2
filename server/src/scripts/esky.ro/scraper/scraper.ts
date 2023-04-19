import RequestScraper from '../../../scrapers/RequestScraper';
import { JSDOM } from 'jsdom';
import { executablePath } from 'puppeteer';
import puppeteerXtra from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { v4 as uuidv4 } from 'uuid';
import {
    BaseScraperResponse,
    ErrorRequestFetch,
    IHotel,
    IHotelPrice,
    ILocation,
    IUserInputForCrawling,
    Nullable,
} from '../../../types/types';
import { constructGraphQLPayload } from '../payload/getHotelPrices/payload';
import { getHotelPricesHeaders } from '../headers/headers';
puppeteerXtra.use(StealthPlugin());
import fs from 'fs';
import { Hotel } from '../../../entities/Hotel';

const siteOrigin = 'https://www.esky.ro';
const hotelPricesEndpoint = 'https://www.esky.ro/eapi';

export const fetchHotelAndLocationData = async (hotelUrl: string, siteHotelId: number, cookie: string) => {

    const requestScraper = new RequestScraper(siteOrigin);
    try {

        const requestOptions = await requestScraper.buildRequestOptions({
            apiEndpoint: hotelUrl,
            body: null,
            cookie: false,
            includeRotatingHeaders: true,
            method: 'GET',
            proxy: false,
            specificHeaders: {
                cookie,
            },
        });
        
        const response = await requestScraper.scrapeHotel(requestOptions);
        const { data, status, request } = response;

        if (status !== 200) {
            throw new Error(`Request failed with status code: ` + status);
        }

        if (!request.res.responseUrl.includes(siteHotelId)) {
            throw new Error('Request was redirected to:' + request.res.responseUrl);
        }

        return data;
    } catch(err) {
        let message;
        if (err instanceof Error) {
            message = err.message;
        } else {
            message = String(err);
        }

        throw new ErrorRequestFetch(`fetchData: ${message}`);
    }
};

export const getConfigFromWindow = async (html: string) => {
    let page, browser;

    try {
        browser = await puppeteerXtra.launch({
            executablePath: executablePath(),
        });

        page = await browser.newPage();
        await page.setContent(html);

        await page.waitForFunction(
            () => {
                return window.ibeConfig !== undefined;
            },
            { timeout: 20000 }
        );

        const hotelId = await page.evaluate(() => {
            return window.ibeConfig;
        });

        return hotelId;
    } catch (err) {
        let message =
            'Could not featch hotel id, problem with getHotelId function: ';
        if (err instanceof Error) {
            throw new Error(message + err.message);
        }
        throw new Error(message);
    } finally {
        page && (await page.close());
        browser && (await browser.close());
    }
};

export const fetchHotelPrices = (
    userInput: IUserInputForCrawling,
    metaCode: number,
    cityCode: string,
    cookie: string
) => {
    const requestScraper = new RequestScraper(siteOrigin);

    const data = requestScraper.scrapeHotelAndBuildReq({
        apiEndpoint: hotelPricesEndpoint,
        body: constructGraphQLPayload(metaCode, cityCode, userInput),
        cookie: false,
        includeRotatingHeaders: true,
        method: 'POST',
        proxy: false,
        specificHeaders: {
            cookie,
            ...getHotelPricesHeaders,
        },
    });

    return data;
};

export const parseHotelPrices = (
    data: any,
    userInput: IUserInputForCrawling,
    hotelId: string
) => {
    const hotelVariants = data?.data?.hotelVariants?.variants;
    const hotelPricesData: IHotelPrice[] = [];

    hotelVariants.forEach((hotelVariant: any) => {
        const { checkIn: from, checkOut: to, rooms } = userInput;
        const pricePerNight = hotelVariant?.price?.amount;
        const currency = hotelVariant?.price?.currency;
        const serviceFee = null;
        const cleaningFee = null;
        const taxes = null;

        const hotelVariantRooms = hotelVariant?.rooms;

        hotelVariantRooms.forEach((room: any) => {
            const description = room?.name;

            const hotelPrice: IHotelPrice = {
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
                rooms,
                date: null,
                description,
                createdAt: new Date(),
            };

            hotelPricesData.push(hotelPrice);
        });
    });

    return hotelPricesData;
};

export const parseHotelAndLocationDataIfHotelExist = async (data: any) => {
    const config = await getConfigFromWindow(data);
    const hotelMetaCode = parseInt(config?.hotelDetails?.metaCode);
    const cityCode = config?.hotelDetails?.cityCode;

    return {
        cityCode,
        hotelMetaCode,
    }
}

export const parseHotelAndLocationData = async (
    data: any,
    // hotelId: string,
    siteHotelId: number,
    url: string,
): Promise<{
    hotelData: IHotel;
    locationData: ILocation;
    hotelMetaCode: number;
    cityCode: string;
}> => {
    const hotelId = uuidv4();
    const config = await getConfigFromWindow(data);
    const hotelMetaCode = parseInt(config?.hotelDetails?.metaCode);
    const cityCode = config?.hotelDetails?.cityCode;

    const dom = new JSDOM(data);
    const document = dom.window.document;

    // HOTEL DATA
    const hotelName = document.querySelector('.hotel-name')?.textContent!;
    const description = document.querySelector(
        '.hotel-description-item'
    )?.textContent;
    const rating = null;
    const reviews = null;
    const link = url;
    const imageLink = config?.hotelDetails?.hotelPhotos[0]?.main;

    const facilities: string[] = [];
    document.querySelectorAll('.facility').forEach((facility: any) => {
        facilities.push(facility?.textContent);
    });

    const balcony = !!facilities.find((facility: any) =>
        facility.toLowerCase().includes('balcon')
    );
    const freeParking = !!facilities.find((facility: any) =>
        facility.toLowerCase().includes('parcare gratuită')
    );
    const kitchen = !!facilities.find((facility: any) =>
        facility.toLowerCase().includes('bucătărie')
    );
    const bayView = !!facilities.find((facility: any) =>
        facility.toLowerCase().includes('mare')
    );
    const mountainView = !!facilities.find((facility: any) =>
        facility.toLowerCase().includes('munte')
    );
    const washer = !!facilities.find((facility: any) =>
        facility.toLowerCase().includes('spălătorie')
    );
    const wifi = !!facilities.find((facility: any) =>
        facility.toLowerCase().includes('wifi')
    );
    const bathroom = !!facilities.find((facility: any) =>
        facility.toLowerCase().includes('baie')
    );
    const coffeMachine = !!facilities.find((facility: any) =>
        facility.toLowerCase().includes('cafea')
    );
    const airConditioning = !!facilities.find((facility: any) =>
        facility.toLowerCase().includes('aer condiţionat')
    );

    fs.writeFileSync('./config.json', JSON.stringify(config));

    // LOCATION DATA
    const address = config?.hotelDetails?.hotelAddress;
    const addressParts = address?.split(',');
    const locationName = addressParts[1]?.trim();
    const country = addressParts[2]?.trim();
    const area = addressParts[0]?.split('(')[1]?.trim()?.slice(0, -1);
    const coordinates = config?.hotelDetails?.hotelLocation;
    const lat = coordinates?.lat;
    const lon = coordinates?.lng;

    return {
        hotelData: {
            id: hotelId,
            hotelName,
            siteOrigin,
            siteHotelId: siteHotelId.toString(),
            description,
            rating,
            reviews,
            link,
            imageLink,
            balcony,
            freeParking,
            kitchen,
            bayView,
            mountainView,
            washer,
            wifi,
            bathroom,
            coffeMachine,
            airConditioning,
            createdAt: new Date(),
        },
        locationData: {
            id: uuidv4(),
            hotelId,
            locationName,
            lat,
            lon,
            address,
            area,
            country,
            region: null,
            createdAt: new Date(),
        },
        hotelMetaCode,
        cityCode,
    };
};


export const scrapeHotelByUserInput = async (hotelUrl: string, userInput: IUserInputForCrawling, cookie: string, siteHotelId: number, existingHotel?: Nullable<Hotel>): Promise<BaseScraperResponse> => {
    try {
        if (!existingHotel) {
            const hotelAndLocationDataRaw = await fetchHotelAndLocationData(hotelUrl, siteHotelId, cookie);
            const { hotelData, locationData, cityCode, hotelMetaCode } = await parseHotelAndLocationData(hotelAndLocationDataRaw, siteHotelId, hotelUrl);
            const hotelPricesDataRaw = await fetchHotelPrices(userInput, hotelMetaCode, cityCode, cookie);
            const hotelPricesData = parseHotelPrices(hotelPricesDataRaw, userInput, hotelData.id);
            
            return {
                hotelData,
                locationData,
                hotelPricesData,
            }
        } else {
            const hotelAndLocationDataRaw = await fetchHotelAndLocationData(hotelUrl, siteHotelId, cookie);
            const { cityCode, hotelMetaCode } = await parseHotelAndLocationDataIfHotelExist(hotelAndLocationDataRaw);
            const hotelPricesDataRaw = await fetchHotelPrices(userInput, hotelMetaCode, cityCode, cookie);
            const hotelPricesData = parseHotelPrices(hotelPricesDataRaw, userInput, existingHotel.id);

            return {
                hotelData: existingHotel,
                hotelPricesData,
            }
        }
    } catch(err: any) {
        if (err instanceof Error) {
            err.message += `. ${hotelUrl}`;
            throw err;
        }

        throw new Error(err);
    }
}
