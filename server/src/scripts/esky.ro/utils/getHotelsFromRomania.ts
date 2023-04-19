import RequestScraper from '../../../scrapers/RequestScraper';
import CookieManager from '../../../utils/cookie/CookieManager';
import logger from '../../../utils/logger/Logger';
import delay from '../../../utils/scrape/delay';
import { constructQueryStringPayload } from '../payload/getCityHotels/payload';
import { fetchAndFilterSitemaps } from './getSitemapsFromRomania';
import fs from 'fs';
import path from 'path';

const HOTELS_PATH = path.join(__dirname, 'hotels.json');
const SITE_ORIGIN = 'https://www.esky.ro';
const API_ENDPOINT = 'https://www.esky.ro/hotels/search-ajax';

export const getHotelsFromCity = async (
    cityCode: string,
    pageNumber: number,
    cookie: string,
    limit?: number
) => {
    const requestScraper = new RequestScraper(SITE_ORIGIN);

    const data = await requestScraper.scrapeHotelAndBuildReq({
        apiEndpoint: `${API_ENDPOINT}?${constructQueryStringPayload(
            pageNumber,
            cityCode,
            limit
        )}`,
        body: null,
        cookie: false,
        includeRotatingHeaders: true,
        method: 'GET',
        proxy: false,
        specificHeaders: {
            cookie,
        },
    });

    return data?.items.map((d: any) => ({
        id: d?.code,
        url: `${SITE_ORIGIN}${d.url.split('?')[0]}`,
    }));
};

export const getHotelsFromRomania = async () => {
    if (fs.existsSync(HOTELS_PATH)) {
        return JSON.parse(fs.readFileSync(HOTELS_PATH).toString());
    } else {
        const res = [];
        const cookieManager = new CookieManager(SITE_ORIGIN);
        const cookie = await cookieManager.fetchCookie({ proxy: false });

        const citySitemaps = await fetchAndFilterSitemaps();

        for (let i = 0; i < citySitemaps.length; ++i) {
            const citySitemap = citySitemaps[i];

            const citySitemapParts = citySitemap.split('/');
            const cityCode =
                citySitemapParts[citySitemapParts.length - 2].toUpperCase();

            let pageNumber = 1;
            let hotels = [];
            do {
                try {
                    hotels = await getHotelsFromCity(
                        cityCode,
                        pageNumber,
                        cookie,
                        50
                    );
                    logger.log(
                        `Featched hotels from city with code ${cityCode}, page ${pageNumber}`
                    );
                    pageNumber++;
                    res.push(...hotels);
                } catch (err) {
                    if (err instanceof Error) {
                        logger.error(err.message);
                    }
                }
                await delay(8000);
            } while (hotels.length !== 0);
        }

        fs.writeFileSync(HOTELS_PATH, JSON.stringify(res));
    }
};
