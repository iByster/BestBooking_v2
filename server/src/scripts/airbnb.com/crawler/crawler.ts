import path from 'path';
import { AirBnbWorkerPayload, AirBnbWorkerResponse, IUserInputForCrawling } from '../../types/types';
import appendToCSVFile from '../../utils/files/appendToCsvFile';
import jsObjectToCsvRecord from '../../utils/files/jsObjectToCsvRecord';
import parseXmlString from '../../utils/files/xmlToJson';
import { WorkerPool } from '../../utils/worker-pool/WorkerPool';
import { sitemapURL } from './sitemap';
import fs from 'fs';
import SitemapCrawler from '../../crawlers/SitemapCrawler';

const hotelCsvHeaders = 'id,hotelName,siteOrigin,siteHotelId,description,rating,reviews,link,imageLink,balcony,freeParking,kitchen,bayView,mountainView,washer,wifi,bathroom,coffeMachine,airConditioning,createdAt\n';
const locationCsvHeaders = 'id,hotelId,locationName,lat,lon,address,area,country,region,createdAt\n';
const hotelPriceCsvHeaders = 'id,hotelId,from,to,pricePerNight,pricePerRoom,serviceFee,cleaningFree,taxes,currency,rooms,date,description,createdAt\n';
const hotelCsvFilePath = path.join(__dirname, '..', 'output', 'airBnbHotelData.csv');
const hotelPriceCsvFilePath = path.join(__dirname, '..', 'output', 'airBnbHotelPriceData.csv');
const locationCsvFilePath = path.join(__dirname, '..', 'output', 'airBnbLocationData.csv');

const extractHotelIdFromUrl = (url: string) => {
    const split = url.split('/');
    return split[split.length - 1];
}

// todo should cache the xml files and check when they are outdated
// crawl xml sitemaps and scrapes the desired url via request
export const crawlXMLFile = async (userInput: IUserInputForCrawling) => {
    // dowload sitemap
    const sitemap = await SitemapCrawler.fetchXmlFile(sitemapURL);
    // filter sitemap
    const hotelSitemapUrls = SitemapCrawler.extractXmlUrlsFromSitemap(sitemap, 'https://www.airbnb.com/sitemap-homes-urls');

    // loop through for the filter sitemaps
    for (let i = 0; i < hotelSitemapUrls.length; ++i) {
        const hotelSitemap = hotelSitemapUrls[i];

        // download and parse
        const hotelSitemapXml = await SitemapCrawler.fetchXmlFile(hotelSitemap);
        const hotelSitemapJson = parseXmlString(hotelSitemapXml);

        const { urlset: { url: hotelUrls } } = hotelSitemapJson;

        // creating worker pool
        const workerPath = path.join(__dirname, 'worker.js');
        const pool = new WorkerPool<AirBnbWorkerPayload, AirBnbWorkerResponse>(workerPath, 10);

        // create write stream for each data set
        const hotelDataWriteStream = fs.createWriteStream(hotelCsvFilePath, { flags: 'a' });
        const hotelPriceDataWriteStream = fs.createWriteStream(hotelPriceCsvFilePath, { flags: 'a' });
        const locationDataWriteStream = fs.createWriteStream(locationCsvFilePath, { flags: 'a' });

        // define chunk limit
        const chunckMaxSize = 10000;
        let chunkCount = 1;

        // first chunk will have the headers as first line
        let hotelDataChunck = hotelCsvHeaders;
        let hotelPriceDataChunck = hotelPriceCsvHeaders;
        let locationDataChunck = locationCsvHeaders;

        // running workers in parallel
        await Promise.all(hotelUrls.map(async (hotelUrl: any) => {
            // extract hotel id from hotel url
            const url = hotelUrl.loc._text;
            const hotelId = extractHotelIdFromUrl(url);

            // run worker with hotelId and user input
            let res = await pool.run(() => ({
                hotelId,
                userInput,
            }));

            if (res) {
                const { hotelData, hotelPricesData, locationData } = res;

                hotelDataChunck += jsObjectToCsvRecord(hotelData);
                hotelPricesData.forEach(hotelPrice => {
                    hotelPriceDataChunck += jsObjectToCsvRecord(hotelPrice);
                })
                locationDataChunck += jsObjectToCsvRecord(locationData);

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
                    // or simple append
                    // appendToCSVFile(path.join(__dirname, '..', 'output', 'airBnbHotelData.csv'), jsObjectToCsvRecord(hotelData));
                    // appendToCSVFile(path.join(__dirname, '..', 'output', 'airBnbHotelPriceData.csv'), jsObjectToCsvRecord(hotelPriceData));
                    // appendToCSVFile(path.join(__dirname, '..', 'output', 'airBnbLocationData.csv'), jsObjectToCsvRecord(locationData));
                }

                console.log(`Hotel with id: ${hotelId} scraped`);
            } else {
                const errorMsg = `Error scraping hotel with id: ${hotelId}`
                appendToCSVFile(path.join(__dirname, '..', 'output', 'airBnbErrorData.csv'), jsObjectToCsvRecord({ errorMsg }));
            }
        }));
    }
}