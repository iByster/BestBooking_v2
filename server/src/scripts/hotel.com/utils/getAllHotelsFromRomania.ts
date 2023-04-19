import RequestScraper from '../../../scrapers/RequestScraper';
import CookieManager from '../../../utils/cookie/CookieManager';
import logger from '../../../utils/logger/Logger';
import delay from '../../../utils/scrape/delay';
import { searchPropertyHeaders } from '../headers/headers';
import { constructGraphQLPayload } from '../payload/propertySearch/payload';
import fs from 'fs';
import path from 'path';

const SITE_ORIGIN = 'https://hotels.com';
const HOTELS_PATH = path.join(__dirname, 'hotels.json');

export const fetchHotelsFromRomania = async (
    pageNumber: number,
    cookie: string
) => {
    const requestScraper = new RequestScraper(SITE_ORIGIN);
    const body = constructGraphQLPayload(pageNumber);

    const data = await requestScraper.scrapeHotelAndBuildReq({
        apiEndpoint: 'https://www.hotels.com/graphql',
        body,
        cookie: false,
        proxy: false,
        method: 'POST',
        specificHeaders: {
            cookie,
            ...searchPropertyHeaders,
            'user-agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
        },
        includeRotatingHeaders: true,
    });

    const properties = data?.data?.propertySearch?.propertySearchListings;

    return properties
        .map((property: any) => ({
            id: property.id,
            url: property?.cardLink?.resource?.value.split('?')[0],
        }))
        .filter((property: any) => Object.keys(property).length !== 0);
};

export const getAllHotelsFromRomania = async () => {
    if (fs.existsSync(HOTELS_PATH)) {
        return JSON.parse(fs.readFileSync(HOTELS_PATH).toString())
    } else {
        const hotels = [];
        let pageNumber = 0;
        const cookieManager = new CookieManager(SITE_ORIGIN);
        const cookie = await cookieManager.fetchCookie({ proxy: false });

        let hotelIds = [];
        let fetched = false;

        do {
            try {
                hotelIds = await fetchHotelsFromRomania(pageNumber, cookie);
                hotels.push(...hotelIds);
                logger.log(
                    `Hotels were successfully scraper on page ${pageNumber}`
                );
                fetched = true;
            } catch (err) {
                if (err instanceof Error) {
                    logger.error(err.message);
                }
            }
            pageNumber++;
            await delay(6000);
        } while (hotelIds.length !== 0 && fetched);
        
        fs.writeFileSync(HOTELS_PATH, JSON.stringify(hotels));
        return hotels;
    }
};
