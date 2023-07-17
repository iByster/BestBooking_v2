import { executablePath } from 'puppeteer';
import puppeteerXtra from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { v4 as uuidv4 } from 'uuid';
import { Hotel } from '../../entities/Hotel';
import { HotelPrice } from '../../entities/HotelPrice';
import { Location } from '../../entities/Location';
import RequestScraper from '../../scrapers/RequestScraper';
import { IUserInputForCrawling } from '../../types/types';
import { cookie } from '../headers/cookie';
import { tripComBaseHeaders } from '../headers/headers';
import fs from 'fs';
import { createQueryString } from '../../utils/url/createQueryString';
import { baseQueryParams, getPayload } from '../payload/payload';
import { escapeJson } from '../../utils/parse/parseUtils';
puppeteerXtra.use(StealthPlugin());

const siteOrigin = 'https://www.trip.com/';

const parsePriceData = async (response: any, siteHotelId: string, userInput: IUserInputForCrawling): Promise<{ hotelPrices: HotelPrice[]}> => {
    const saleRoomMap = response.saleRoomMap;
    const physicRoomMap = response.physicRoomMap;

    const hotelPrices: HotelPrice[] = [];

    for (const key in saleRoomMap) {
        const room = saleRoomMap[key];

        const from = userInput.checkIn;
        const to = userInput.checkOut;
        const currency = 'USD';

        const pricePerNight = room.priceInfo.price;
        const pricePerRoom = room.priceInfo.price;
        const taxes = room.totalPriceInfo.includedTax.price;
        const cleaningFee = null;
        const serviceFee = null;
        const description = physicRoomMap[room.physicalRoomId].name;
        const hotelId = siteHotelId;

        hotelPrices.push({
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
    }

    return { hotelPrices };
}

export const getHotelAndLocationData = async (hotelUrl: string): Promise<{hotelData: Hotel, locationData: Location}> => {
    const requestScraper = new RequestScraper(siteOrigin);

    const requestOptions = await requestScraper.buildRequestOptions({
        apiEndpoint: hotelUrl,
        body: null,
        cookie: false,
        proxy: false,
        method: 'GET',
        specificHeaders: {
            cookie,
            ...tripComBaseHeaders,
            "Accept-Encoding": "br;q=1.0, gzip;q=0.8, *;q=0.1"
        },
        includeRotatingHeaders: true,
    });

    const response = await requestScraper.scrapeHotel(requestOptions);

    const browser = await puppeteerXtra.launch({
        executablePath: executablePath(),
    });

    const page = await browser.newPage();
    await page.setContent(response);

    const ibuHotel = await page.evaluate(() => {
        return window.IBU_HOTEL;
    })

    await browser.close();

    fs.writeFileSync('./junk/ibuHotel3.json', JSON.stringify(ibuHotel));

    const hotelId = uuidv4();

    const hotelName = ibuHotel?.initData?.base?.hotelName || ibuHotel?.initData?.hotelBaseData?.baseInfo?.hotelName;
    const siteHotelId = ibuHotel?.initData?.base?.masterHotelId || ibuHotel?.initData?.masterHotelId;
    const description = ibuHotel?.initData?.staticHotelInfo?.hotelInfo?.basic?.description;
    const rating = ibuHotel?.initData?.hotelBaseData?.comment?.score || ibuHotel?.initData?.comment?.score;
    const reviews = ibuHotel?.initData?.hotelBaseData?.comment?.totalReviews.split(' ')[0] || ibuHotel?.initData?.comment?.totalReviews;
    const link = hotelUrl;
    const imageLink = ibuHotel?.initData?.hotelBaseData?.hotelImg?.imgUrlList[0]?.imgUrl || ibuHotel?.initData?.album?.bigPic?.src;

    const hotelFacilities = ibuHotel?.initData?.hotelBaseData?.hotelFacility || ibuHotel?.initData?.hotFacility?.list;

    const wifi = hotelFacilities?.find((x: any) => x.facilityId === 102) ? true : false;
    const coffeMachine = hotelFacilities?.find((x: any) => x.facilityId === 3) ? true : false;
    const balcony = null;
    const kitchen = null;
    const bayView = null;
    const mountainView = null;
    const washer = null;
    const freeParking = null;
    const bathroom = null;
    const airConditioning = null;

    const locationName = ibuHotel?.initData?.hotelBaseData?.baseInfo?.cityName || ibuHotel?.initData?.base?.cityName;
    const lat = ibuHotel?.initData?.position?.lat;
    const lon = ibuHotel?.initData?.position?.lng;
    const address = ibuHotel?.initData?.hotelBaseData?.mapInfo?.address || ibuHotel?.initData?.position?.address;
    const addressSplit = address.split(',');
    const area = null;
    const country = addressSplit[addressSplit.length - 1];
    const region = addressSplit[addressSplit.length - 3];

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

export const scrapeHotelPricesByIdAndUserInput = async (id: string, userInput: IUserInputForCrawling, hotelUrl: string) => {
    const requestScraper = new RequestScraper(siteOrigin);

    const apiEndpoint = `${siteOrigin}htls/restapi/getHotelRoomList?${createQueryString(baseQueryParams)}`;

    const requestOptions = await requestScraper.buildRequestOptions({
        apiEndpoint,
        body: JSON.stringify(getPayload(id, userInput, hotelUrl)),
        cookie: false,
        proxy: false,
        method: 'POST',
        specificHeaders: {
            cookie,
            ...tripComBaseHeaders,
            'Accept-Encoding': 'zip, deflate, br',
            'Accept': 'application/json',
        },
        includeRotatingHeaders: true,
    });

    const response = await requestScraper.scrapeHotel(requestOptions);
    fs.writeFileSync('./junk/responseTRIP.json', JSON.stringify(response));
    const parsedData = await parsePriceData(response, id, userInput);
    return parsedData;
} 