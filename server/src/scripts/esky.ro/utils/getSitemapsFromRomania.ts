import SitemapCrawler from '../../../crawlers/SitemapCrawler';
import parseXmlString from '../../../utils/files/xmlToJson';
import logger from '../../../utils/logger/Logger';
import delay from '../../../utils/scrape/delay';
import { getCities } from '../../agoda.com/utils/getRomaniaCityIds';
import sitemapURL from '../crawler/sitemap';
import fs from 'fs';
import path from 'path';

const CITY_SITEMAPS = path.join(__dirname, 'cities.json');

export const getRomaniaAllCities = () => {
    const cities = getCities();

    return cities.map((city: any) => city.url.split('/')[2].slice(0, -8));
};

export const fetchAndFilterSitemaps = async () => {
    if (fs.existsSync(CITY_SITEMAPS)) {
        return JSON.parse(fs.readFileSync(CITY_SITEMAPS).toString());
    } else {
        const cities = getRomaniaAllCities();
        const res = [];
        logger.log('Featching sitemap XML files ...');
        const sitemap = await SitemapCrawler.fetchXmlFile(sitemapURL);
        // filter sitemap
        const hotelSitemapUrls = SitemapCrawler.extractXmlUrlsFromSitemap(
            sitemap,
            'https://www.esky.ro/sitemap_hotel_result_seo_city'
        );

        // loop through for the filter sitemaps
        for (let i = 0; i < hotelSitemapUrls.length; ++i) {
            const hotelSitemap = hotelSitemapUrls[i];

            // download and parse
            const hotelSitemapXml = await SitemapCrawler.fetchXmlFile(
                hotelSitemap
            );
            const hotelSitemapJson = parseXmlString(hotelSitemapXml);

            let {
                urlset: { url: hotelUrls },
            } = hotelSitemapJson;

            const hotelUrlRo = hotelUrls
                .filter((hotelUrl: any) =>
                    cities.find(
                        (city: any) =>
                            hotelUrl.loc._text
                                .split('/')
                                .pop()
                                ?.split('hoteluri-')[1] === city
                    )
                )
                .map((hotelUrl: any) => hotelUrl.loc._text);
            res.push(...hotelUrlRo);
            console.log(hotelUrlRo);
            await delay(6000);
        }

        fs.writeFileSync(CITY_SITEMAPS, JSON.stringify(res));
    }
};
