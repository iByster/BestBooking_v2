import { executablePath } from 'puppeteer';
import puppeteerXtra from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { v4 as uuidv4 } from 'uuid';
import { Hotel } from '../../../entities/Hotel';
import RequestScraper from '../../../scrapers/RequestScraper';
import { AgodaComWorkerResponse, ErrorRequestFetch, IHotel, IHotelPrice, ILocation, IRoom, IUserInputForCrawling, Nullable } from '../../../types/types';
import { agodaBaseHeaders, agodaPriceHeaders } from '../headers/headers';
import { constructGraphQLPayload } from '../payload/hotelData/payload';
import { constructQueryStringPayload } from '../payload/hotelPrice/paylaod';
puppeteerXtra.use(StealthPlugin());

const siteOrigin = 'https://www.agoda.com';
const propertyEndpoint = `${siteOrigin}/graphql/property`;
const priceEndpoint = `${siteOrigin}/api/cronos/property/BelowFoldParams/GetSecondaryData`

export const getHotelId = async (url: string) => {
    let page, browser;

    try {
        browser = await puppeteerXtra.launch({
            executablePath: executablePath(),
        });
        
        page = await browser.newPage();
        await page.setRequestInterception(true);

        page.on('request', (request) => {
          if (
            request.resourceType() === 'image' ||
            request.resourceType() === 'font' ||
            request.resourceType() === 'stylesheet'
          ) {
            request.abort();
          } else {
            request.continue();
          }
        });

        await page.goto(url);

        await page.waitForFunction(() => {
            return window.initParams.propertyId !== undefined;
        }, { timeout: 10000 });

        const hotelId = await page.evaluate(() => {
            return window.initParams.propertyId;
        });

        return hotelId;
    } catch(err) {
        let message = 'Could not featch hotel id, problem with getHotelId function: ';
        if (err instanceof Error) {
            throw new Error(message + err.message);
        }
        throw new Error(message);
    } finally {
        page && await page.close();
        browser && await browser.close();
    }
}

export const fetchHotelAndLocationData = async (siteHotelId: string, userInput: IUserInputForCrawling, cookie: string) => {
    const requestScraper = new RequestScraper(siteOrigin);

    try {
        const requestOptions = await requestScraper.buildRequestOptions({
            apiEndpoint: propertyEndpoint,
            body: constructGraphQLPayload(siteHotelId, userInput),
            cookie: false,
            proxy: false,
            method: 'POST',
            specificHeaders: {
                ...agodaBaseHeaders,
                cookie,
            },
            includeRotatingHeaders: true,
        });
        
        const response = await requestScraper.scrapeHotel(requestOptions);
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

        throw new ErrorRequestFetch(message)
    }
}

export const parseHotelAndLocationData = (siteHotelId: string, hotelUrl: string, response: any): { hotelData: IHotel, locationData: ILocation } => {
    const hotelId = uuidv4()

    const content = response?.data?.propertyDetailsSearch?.propertyDetails[0]?.contentDetail;
    const contentSummary = content?.contentSummary;
    const contentInformation = content?.contentInformation;
    const contentReviewScore = content?.contentReviewScore;
    const combinedReviewScore = contentReviewScore?.combinedReviewScore?.cumulative;
    const contentImages = content?.contentImages;
    const contentFacilities = content?.contentFeatures;
    const contentFacilitiesHighlights = contentFacilities?.facilityHighlights;

    // HOTEL DATA

    const hotelName = contentSummary?.displayName;
    const description = contentInformation?.description?.short;
    const rating = { score: combinedReviewScore?.score, maxScore: combinedReviewScore?.maxScore };
    const reviews = combinedReviewScore?.reviewCount;
    const link = hotelUrl;
    const imageLink = contentImages?.hotelImages[0]?.urls.find((url: any) => url.key === 'main').value;

    const balcony = !!contentFacilitiesHighlights?.find((facility: any) => facility?.facilityName.toLowerCase().includes('balcony'))
    const freeParking = !!contentFacilitiesHighlights?.find((facility: any) => facility?.facilityName.toLowerCase().includes('park'));
    const kitchen = !!contentFacilitiesHighlights?.find((facility: any) => facility?.facilityName.toLowerCase().includes('kitchen'));
    const bayView = !!contentFacilitiesHighlights?.find((facility: any) => facility?.facilityName.toLowerCase().includes('bay'));
    const mountainView = !!contentFacilitiesHighlights?.find((facility: any) => facility?.facilityName.toLowerCase().includes('montain'));
    const washer = !!contentFacilitiesHighlights?.find((facility: any) => facility?.facilityName.toLowerCase().includes('washer'));
    const bathroom = !!contentFacilitiesHighlights?.find((facility: any) => facility?.facilityName.toLowerCase().includes('bathroom'));
    const coffeMachine = !!contentFacilitiesHighlights?.find((facility: any) => facility?.facilityName.toLowerCase().includes('coffe'));
    const airConditioning = !!contentFacilitiesHighlights?.find((facility: any) => facility?.facilityName.toLowerCase().includes('air'));
    const wifi = !!contentFacilitiesHighlights?.find((facility: any) => facility?.facilityName.toLowerCase().includes('wi-fi'));
    
    // LOCATION DATA
    const locationName = contentSummary?.address?.city?.name;
    const lat = contentSummary?.geoInfo?.latitude;
    const lon = contentSummary?.geoInfo?.longitude;
    const address = contentSummary?.address?.address1;
    const country = contentSummary?.address?.country?.name;
    const region = null;
    const area = contentSummary?.address?.area?.name;

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
            createdAt: new Date()
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
            region,
            createdAt: new Date()
        },
    }
}

export const fetchHotelPrices = async (hotelId: string, userInput: IUserInputForCrawling, cookie: string) => {
    const requestScraper = new RequestScraper(siteOrigin);

    try {
        const requestOptions = await requestScraper.buildRequestOptions({
            apiEndpoint: `${priceEndpoint}?${constructQueryStringPayload(hotelId, userInput)}`,
            body: null,
            cookie: false,
            proxy: false,
            method: 'GET',
            specificHeaders: {
                ...agodaPriceHeaders,
                cookie,
            },
            includeRotatingHeaders: true,
            
        });

        const response = await requestScraper.scrapeHotel(requestOptions);
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

export const parseHotelPriceData = (response: any, userInput: IUserInputForCrawling, hotelId: string): IHotelPrice[] => {
    // HOTEL PRICE DATA
    const hotelPricesData: IHotelPrice[] = [];

    const masterRooms = response?.roomGridData?.masterRooms;

    masterRooms?.forEach((masterRoom: any) => {
        const description = masterRoom?.name;
        
        masterRoom?.rooms?.forEach((room: any) => {
            const { checkIn: from, checkOut: to } = userInput;
            const pricePerNight = room?.perNightPrice?.display;
            const serviceFee = null;
            const cleaningFee = null;
            const taxes = room?.pricePopupViewModel?.taxesAndFeesAmount;
            const currency = 'EUR';
            const adults = room?.adults;
            const children = room?.children;

            const roomCapacity: IRoom[] = [{
                adults,
                childAges: Array(children).fill(5),
            }] 

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
                rooms: roomCapacity,
                date: null,
                description,
                createdAt: new Date()
            }

            hotelPricesData.push(hotelPrice);
        })
    })


    return hotelPricesData;
}

export const scrapeHotelByUserInput = async (hotelUrl: string, userInput: IUserInputForCrawling, cookie: string, existingHotel?: Nullable<Hotel>): Promise<AgodaComWorkerResponse> => {
    try {
        if (!existingHotel) {
            const hotelId = await getHotelId(hotelUrl);
            const hotelAndLocationDataRaw = await fetchHotelAndLocationData(hotelId, userInput, cookie);
            const { hotelData, locationData } = parseHotelAndLocationData(hotelId, hotelUrl, hotelAndLocationDataRaw);
            const hotelPricesDataRaw = await fetchHotelPrices(hotelId, userInput, cookie);
            const hotelPricesData = parseHotelPriceData(hotelPricesDataRaw, userInput, hotelData.id);
            
            return {
                data: {
                    hotelData,
                    locationData,
                    hotelPricesData,
                },
                error: null
            }
        } else {
            const hotelPricesDataRaw = await fetchHotelPrices(existingHotel.siteHotelId, userInput, cookie);
            const hotelPricesData = parseHotelPriceData(hotelPricesDataRaw, userInput, existingHotel.id);

            return {
                data: {
                    hotelData: existingHotel,
                    hotelPricesData,
                },
                error: null
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