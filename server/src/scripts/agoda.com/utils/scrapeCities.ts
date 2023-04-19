import RequestScraper from '../../../scrapers/RequestScraper';
import CookieManager from '../../../utils/cookie/CookieManager';
import logger from '../../../utils/logger/Logger';
import delay from '../../../utils/scrape/delay';
import { agodaCitySearchHeades } from '../headers/headers';
import { constructGraphQLPayload } from '../payload/citySearch/payload';
import fs from 'fs';
import path from 'path';
import { getCityIds } from './getRomaniaCityIds';

const SITE_ORIGIN = 'https://agoda.com';
const ALL_HOTELS_PATH = path.join(__dirname, `allHotels.json`);

export const scrapeCityAndGetHotelIds = async (
    cityId: number,
    cookie: string
) => {
    const res = [];
    let properties = [];
    let pageNumber = 1;
    const requestScraper = new RequestScraper(SITE_ORIGIN);
    let fetched = false;

    if (!fs.existsSync(path.join(__dirname, `${cityId}.json`))) {
        do {
            await delay(6000);
            const body = constructGraphQLPayload(
                cityId.toString(),
                undefined,
                pageNumber
            );

            try {
                const data = await requestScraper.scrapeHotelAndBuildReq({
                    apiEndpoint: 'https://www.agoda.com/graphql/search',
                    body,
                    cookie: false,
                    proxy: false,
                    method: 'POST',
                    specificHeaders: {
                        cookie,
                        ...agodaCitySearchHeades,
                    },
                    includeRotatingHeaders: true,
                });

                logger.log(
                    `Hotel for city with id ${cityId} and page number ${pageNumber} fetch successfully`
                );

                properties = data?.data?.citySearch?.properties;

                console.log(properties.length);

                for (let i = 0; i < properties.length; ++i) {
                    const property = properties[i];

                    const id = property?.propertyId;
                    const url =
                        property?.content?.informationSummary?.propertyLinks
                            ?.propertyPage;

                    res.push({
                        id,
                        url,
                    });
                }
                fetched = true;
                pageNumber++;
            } catch (err) {
                if (err instanceof Error) {
                    logger.error(err.message);
                }
                fetched = false;
            }
        } while (properties.length !== 0 && fetched);

        fs.writeFileSync(
            path.join(__dirname, `${cityId}.json`),
            JSON.stringify(res)
        );

        return res;
    } else {
        return JSON.parse(
            fs.readFileSync(path.join(__dirname, `${cityId}.json`)).toString()
        );
    }
};

export const scrapeCities = async () => {
    if (fs.existsSync(ALL_HOTELS_PATH)) {
        return JSON.parse(fs.readFileSync(ALL_HOTELS_PATH).toString());
    } else {
        const cookieManager = new CookieManager(SITE_ORIGIN);
        const cookie = await cookieManager.fetchCookie({ proxy: false });
        const allHotels = [];

        const cities = getCityIds();

        for (let i = 0; i < cities.length; ++i) {
            const cityId = cities[i];
            logger.log(`Fetching hotels from city with id: ${cityId}`);
            const hotelForCity = await scrapeCityAndGetHotelIds(cityId, cookie);
            allHotels.push(...hotelForCity);
        }

        fs.writeFileSync(ALL_HOTELS_PATH, JSON.stringify(allHotels));
        return allHotels;
    }
};
