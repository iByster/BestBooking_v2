import path from 'path';
import SitemapCrawler from '../../../crawlers/SitemapCrawler';
import { Hotel } from '../../../entities/Hotel';
import { HotelPrice } from '../../../entities/HotelPrice';
import { Location } from '../../../entities/Location';
import HotelService from '../../../services/HotelService';
import { DirectBookingWorkerPayload, DirectBookingWorkerResponse, IUserInputForCrawling } from '../../../types/types';
import appendToCSVFile from '../../../utils/files/appendToCsvFile';
import jsObjectToCsvRecord from '../../../utils/files/jsObjectToCsvRecord';
import parseXmlString from '../../../utils/files/xmlToJson';
import getRandomUserInput from '../../../utils/payload/randomUserInput';
import { WorkerPool } from '../../../utils/worker-pool/WorkerPool';
import { sitemapURL } from './sitemap';

const extractHotelIdFromUrl = (url: string) => {
    const split = url.split('-');
    const hotelId = split[split.length - 1].split('.')[0];
    return hotelId;
}

// crawl xml sitemaps and scrapes the desired url via request
export const crawlXMLFile = async (cookie: string, xmlFilesLastIndex: number = 0, hotelsLastIndex: number = 0, userInput?: IUserInputForCrawling) => {
    const hotelService = new HotelService();

    // dowload sitemap
    const sitemap = await SitemapCrawler.fetchXmlFile(sitemapURL);
    // filter sitemap
    const hotelSitemapUrls = SitemapCrawler.extractXmlUrlsFromSitemap(sitemap, 'https://www.directbooking.ro/sitemap_ro_hotels');

    // loop through for the filter sitemaps
    for (let i = xmlFilesLastIndex; i < hotelSitemapUrls.length; ++i) {
        const hotelSitemap = hotelSitemapUrls[i];

        // download and parse
        const hotelSitemapXml = await SitemapCrawler.fetchXmlFile(hotelSitemap);
        const hotelSitemapJson = parseXmlString(hotelSitemapXml);

        let { urlset: { url: hotelUrls } } = hotelSitemapJson;

        hotelUrls = hotelUrls.slice(hotelsLastIndex);
        hotelsLastIndex = 0;

        // creating worker pool
        const workerPath = path.join(__dirname, 'worker.js');
        const pool = new WorkerPool<DirectBookingWorkerPayload, DirectBookingWorkerResponse>(workerPath, 7);

        // define chunk limit
        const chunckMaxSize = 10;
        let chunkCount = 1;

        let hotelsData: Hotel[] = [];
        let hotelLocationsData: Location[] = [];
        let hotelPricesDataArr: HotelPrice[] = [];

        // running workers in parallel
        await Promise.all(hotelUrls.map(async (hotelUrl: any) => {
            // extract hotel id from hotel url
            const url = hotelUrl.loc._text;
            const hotelId = extractHotelIdFromUrl(url);

            const existingHotel = await hotelService.checkIfHotelExist(hotelId);

            // run worker with hotelId and user input
            let res = await pool.run(() => ({
                hotelId,
                userInput: userInput || getRandomUserInput({ withChildren: false }),
                hotelUrl: url,
                cookie,
                siteHotelId: existingHotel?.siteHotelId,
            }));

            const { data, error } = res;

            if (data) {
                const { hotelData, hotelPricesData, locationData } = data;

                if (hotelData) {
                    hotelsData.push(Hotel.create(hotelData as Hotel));
                }

                if (locationData) {
                    hotelLocationsData.push(Location.create(locationData as Location));
                }

                hotelPricesData.forEach(hotelPrice => {
                    hotelPricesDataArr.push(HotelPrice.create(hotelPrice as HotelPrice));
                })

                ++chunkCount;

                if (chunkCount > chunckMaxSize) {
                    await Hotel.createQueryBuilder().insert().values(hotelsData).execute();
                    await Location.createQueryBuilder().insert().values(hotelLocationsData).execute();
                    await HotelPrice.createQueryBuilder().insert().values(hotelPricesDataArr).execute();

                    // reset
                    chunkCount = 0;
                    hotelsData = [];
                    hotelLocationsData = [];
                    hotelPricesDataArr = [];
                }

                if (existingHotel) {
                    console.log(`Hotel with id: ${existingHotel?.siteHotelId} already scraped but got the prices`);
                } else {
                    console.log(`Hotel with id: ${hotelData?.siteHotelId} scraped`);
                }
            } else {
                console.log(error?.message);
                appendToCSVFile(path.join(__dirname, '..', 'output', 'directBookingErros.csv'), jsObjectToCsvRecord({ errorMsg: error?.message }, ['errorMsg']));
            }
        }));
    }
}