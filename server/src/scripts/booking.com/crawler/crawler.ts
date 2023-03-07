import fs from 'fs';
import path from 'path';
import SitemapCrawler from '../../../crawlers/SitemapCrawler';
import { BookingComWorkerPayload, BookingComWorkerResponse, IUserInputForCrawling } from '../../../types/types';
import appendToCSVFile from '../../../utils/files/appendToCsvFile';
import jsObjectToCsvRecord from '../../../utils/files/jsObjectToCsvRecord';
import parseXmlString from '../../../utils/files/xmlToJson';
import getRandomUserInput from '../../../utils/payload/randomUserInput';
import { WorkerPool } from '../../../utils/worker-pool/WorkerPool';
import { sitemapURL } from './sitemap';

const hotelCsvHeaders = 'id,hotelName,siteOrigin,siteHotelId,description,rating,reviews,link,imageLink,balcony,freeParking,kitchen,bayView,mountainView,washer,wifi,bathroom,coffeMachine,airConditioning,createdAt\n';
const locationCsvHeaders = 'id,hotelId,locationName,lat,lon,address,area,country,region,createdAt\n';
const hotelPriceCsvHeaders = 'id,hotelId,from,to,pricePerNight,pricePerRoom,serviceFee,cleaningFree,taxes,currency,rooms,date,description,createdAt\n';
const hotelCsvColumns = hotelCsvHeaders.split(',').slice(0, -1);
const locationCsvColumns = locationCsvHeaders.split(',').slice(0, -1);
const hotelPriceCsvColumns = hotelPriceCsvHeaders.split(',').slice(0, -1);
hotelCsvColumns.push('createdAt');
locationCsvColumns.push('createdAt');
hotelPriceCsvColumns.push('createdAt');
const hotelCsvFilePath = path.join(__dirname, '..', 'output', 'airBnbHotelData.csv');
const hotelPriceCsvFilePath = path.join(__dirname, '..', 'output', 'airBnbHotelPriceData.csv');
const locationCsvFilePath = path.join(__dirname, '..', 'output', 'airBnbLocationData.csv');

// crawl xml sitemaps and scrapes the desired url via request
export const crawlXMLFile = async (userInput?: IUserInputForCrawling, xmlFilesLastIndex: number = 0, hotelsLastIndex: number = 0) => {
    // dowload sitemap
    const sitemap = await SitemapCrawler.fetchXmlFile(sitemapURL);
    // filter sitemap
    const hotelSitemapUrls = SitemapCrawler.extractXmlUrlsFromSitemap(sitemap, 'https://www.booking.com/sitembk-hotel-en-gb');

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
        const pool = new WorkerPool<BookingComWorkerPayload, BookingComWorkerResponse>(workerPath, 10);

        // create write stream for each data set
        const hotelDataWriteStream = fs.createWriteStream(hotelCsvFilePath, { flags: 'a' });
        const hotelPriceDataWriteStream = fs.createWriteStream(hotelPriceCsvFilePath, { flags: 'a' });
        const locationDataWriteStream = fs.createWriteStream(locationCsvFilePath, { flags: 'a' });

        // define chunk limit
        const chunckMaxSize = 5;
        let chunkCount = 1;

        // first chunk will have the headers as first line
        let hotelDataChunck = hotelCsvHeaders;
        let hotelPriceDataChunck = hotelPriceCsvHeaders;
        let locationDataChunck = locationCsvHeaders;

        // running workers in parallel
        await Promise.all(hotelUrls.map(async (hotelUrl: any) => {
            // extract hotel id from hotel url
            const url = hotelUrl.loc._text;
            // const hotelId = extractHotelIdFromUrl(url);

            // run worker with hotelId and user input
            let res = await pool.run(() => ({
                userInput: userInput || getRandomUserInput({ withChildren: false }),
                hotelUrl: url
            }));

            const { data, error } = res;

            if (data) {
                const { hotelData, hotelPricesData, locationData } = data;

                hotelDataChunck += jsObjectToCsvRecord(hotelData, hotelCsvColumns);
                hotelPricesData.forEach(hotelPrice => {
                    hotelPriceDataChunck += jsObjectToCsvRecord(hotelPrice, hotelPriceCsvColumns);
                })
                locationDataChunck += jsObjectToCsvRecord(locationData, locationCsvColumns);

                ++chunkCount;

                if (chunkCount > chunckMaxSize) {
                    // stream
                    hotelDataWriteStream.write(hotelDataChunck);
                    hotelPriceDataWriteStream.write(hotelPriceDataChunck);
                    locationDataWriteStream.write(locationDataChunck);

                    // rest
                    chunkCount = 0;
            
                    hotelDataChunck = '';
                    hotelPriceDataChunck = '';
                    locationDataChunck = '';
                }

                console.log(`Hotel with id: ${hotelData.siteHotelId} scraped`);
            } else {
                console.log(error?.message);
                appendToCSVFile(path.join(__dirname, '..', 'output', 'airBnbErrorData.csv'), jsObjectToCsvRecord({ errorMsg: error?.message }, ['errorMsg']));
            }
        }));
    }
}