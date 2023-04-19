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
import { sitemapURL } from './sitemaps/sitemap';
import logger from '../../../utils/logger/Logger';
import { colorizeStringByNumber } from '../../../utils/logger/colorizeString';
import fs from 'fs';

const extractHotelIdFromUrl = (url: string) => {
    const split = url.split('-');
    const hotelId = split[split.length - 1].split('.')[0];
    return hotelId;
}

export const crawlXMLFileFromFile = async (
    cookie: string,
    filePath: string,
    userInput?: IUserInputForCrawling,
) => {
    // creating worker pool
    const workerPath = path.join(__dirname, 'worker.js');
    const pool = new WorkerPool<
        DirectBookingWorkerPayload,
        DirectBookingWorkerResponse
    >(workerPath, 6);

    // define chunk limit
    const chunckMaxSize = 5;
    let chunkCount = 1;

    let hotelsData: Hotel[] = [];
    let hotelLocationsData: Location[] = [];
    let hotelPricesDataArr: HotelPrice[] = [];

    const hotelUrls = fs.readFileSync(filePath).toString().split('\n').map((h: string) => 'https://' + h);

    await Promise.all(
        hotelUrls.map(async (url: any) => {
            // extract hotel id from hotel url
            const hotelId = extractHotelIdFromUrl(url);
            const hotelService = new HotelService();
            const existingHotel = await hotelService.checkIfHotelExistByUrl(
                url
            );

            // run worker with hotelId and user input
            let res = await pool.run(() => ({
                userInput:
                    userInput || getRandomUserInput({ withChildren: false }),
                hotelUrl: url,
                cookie,
                existingHotel,
                hotelId
            }));

            const { data, error, workerId } = res;

            if (data) {
                const { hotelData, hotelPricesData, locationData } = data;

                if (hotelData && !existingHotel) {
                    hotelsData.push(Hotel.create(hotelData as Hotel));
                }

                if (locationData) {
                    hotelLocationsData.push(
                        Location.create(locationData as Location)
                    );
                }

                hotelPricesData.forEach((hotelPrice) => {
                    hotelPricesDataArr.push(
                        HotelPrice.create(hotelPrice as HotelPrice)
                    );
                });

                ++chunkCount;

                if (chunkCount > chunckMaxSize) {
                    await Hotel.createQueryBuilder()
                        .insert()
                        .values(hotelsData)
                        .execute();
                    await Location.createQueryBuilder()
                        .insert()
                        .values(hotelLocationsData)
                        .execute();
                    await HotelPrice.createQueryBuilder()
                        .insert()
                        .values(hotelPricesDataArr)
                        .execute();

                    // reset
                    chunkCount = 0;
                    hotelsData = [];
                    hotelLocationsData = [];
                    hotelPricesDataArr = [];
                }

                if (hotelPricesData && hotelPricesData.length === 0) {
                    logger.warn(
                        `WORKER ID ${colorizeStringByNumber(
                            workerId.toString(),
                            workerId
                        )}: hotel with id: ${
                            hotelData.siteHotelId
                        } scraped successfully but no prices were collected`
                    );
                } else {
                    logger.log(
                        `WORKER ID ${colorizeStringByNumber(
                            workerId.toString(),
                            workerId
                        )}: hotel with id: ${
                            hotelData.siteHotelId
                        } scraped successfully`
                    );
                }
            } else if (error) {
                logger.error(
                    `WORKER ID ${colorizeStringByNumber(
                        workerId.toString(),
                        workerId
                    )}: ${error.message}`,
                    error
                );
                appendToCSVFile(
                    path.join(__dirname, '..', 'output', 'airBnbErrorData.csv'),
                    jsObjectToCsvRecord({ errorMsg: error?.message }, [
                        'errorMsg',
                    ])
                );
            } else {
                logger.error(
                    `WORKER ID ${colorizeStringByNumber(
                        workerId.toString(),
                        workerId
                    )}: Unexpected error`
                );
            }
        })
    );
};

// crawl xml sitemaps and scrapes the desired url via request
export const crawlXMLFile = async (cookie: string, xmlFilesLastIndex: number = 0, hotelsLastIndex: number = 0, userInput?: IUserInputForCrawling) => {
    // dowload sitemap
    logger.log('Featching sitemap XML files ...');
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
        const pool = new WorkerPool<DirectBookingWorkerPayload, DirectBookingWorkerResponse>(workerPath, 12);

        // define chunk limit
        const chunckMaxSize = 10;
        let chunkCount = 1;

        let hotelsData: Hotel[] = [];
        let hotelLocationsData: Location[] = [];
        let hotelPricesDataArr: HotelPrice[] = [];

        logger.log('Sitemaps fetched successfully');

        // running workers in parallel
        await Promise.all(hotelUrls.map(async (hotelUrl: any) => {
            // extract hotel id from hotel url
            const url = hotelUrl.loc._text;
            const hotelId = extractHotelIdFromUrl(url);

            const hotelService = new HotelService();
            const existingHotel = await hotelService.checkIfHotelExist(hotelId);

            // run worker with hotelId and user input
            let res = await pool.run(() => ({
                hotelId,
                userInput: userInput || getRandomUserInput({ withChildren: false }),
                hotelUrl: url,
                cookie,
                existingHotel,
            }));

            const { data, error, workerId } = res;

            if (data) {
                const { hotelData, hotelPricesData, locationData } = data;

                if (hotelData && !existingHotel) {
                    hotelsData.push(Hotel.create(hotelData as Hotel));
                }

                if (locationData) {
                    hotelLocationsData.push(Location.create(locationData as Location));
                }

                hotelPricesData.forEach(hotelPrice => {
                    hotelPricesDataArr.push(HotelPrice.create(hotelPrice as HotelPrice));
                })



                ++chunkCount;
                logger.debug('CHUNK COUNT: ' + chunkCount);

                if (chunkCount > chunckMaxSize) {
                    logger.debug('SAVING DATA: ' + JSON.stringify(hotelPricesDataArr));

                    await Hotel.createQueryBuilder().insert().values(hotelsData).execute();
                    await Location.createQueryBuilder().insert().values(hotelLocationsData).execute();
                    await HotelPrice.createQueryBuilder().insert().values(hotelPricesDataArr).execute();

                    

                    // reset
                    chunkCount = 0;
                    hotelsData = [];
                    hotelLocationsData = [];
                    hotelPricesDataArr = [];
                }

                if (hotelPricesData && hotelPricesData.length === 0) {
                    logger.warn(`WORKER ID ${colorizeStringByNumber(workerId.toString(), workerId)}: hotel with id: ${hotelData.siteHotelId} scraped successfully but no prices were collected`);
                } else {
                    logger.log(`WORKER ID ${colorizeStringByNumber(workerId.toString(), workerId)}: hotel with id: ${hotelData.siteHotelId} scraped successfully`);
                }
            } else if (error) {
                logger.error(`WORKER ID ${colorizeStringByNumber(workerId.toString(), workerId)}: ${error.message}`, error);
                appendToCSVFile(path.join(__dirname, '..', 'output', 'directBookingErros.csv'), jsObjectToCsvRecord({ errorMsg: error?.message }, ['errorMsg']));
            } else {
                logger.error(`WORKER ID ${colorizeStringByNumber(workerId.toString(), workerId)}: Unexpected error`);
            }
        }));
    }
}