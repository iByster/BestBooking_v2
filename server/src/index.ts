import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { scrapeHotelByIdAndUserInput } from './airbnb/scraper/scraper';
import { IUserInput, IUserInputForCrawling } from './types';
const XmlStream = require('xml-stream');

const xmlFilePath = path.join(
    __dirname,
    'sitemaps',
    'sitemap-homes-urls-98.xml'
);
const outputFilePath = path.join(__dirname, 'output', 'output.csv');
const errorOutputFilePath = path.join(__dirname, 'output', 'errors.csv');

const createCSVResultRow = ({
    url,
    adults,
    children,
    checkIn,
    checkOut,
    pricePerNight,
    hotelName,
    location,
    pricePerNightReducere = null,
    pricePerNightReducerePretIntreg = null,
}: any) => {
    let pricePerNightV2;
    const locationV2 = location.split(',').join('.');
    if (pricePerNight) {
        pricePerNightV2 = pricePerNight.split(',').join('.');
    }
    const hotelNameV2 = hotelName.split(',').join('.');
    const row = `\r\n${pricePerNight ?  pricePerNightV2 : pricePerNight},${hotelNameV2},${locationV2},${adults},${children},${checkIn},${checkOut},${url}`;
    return row;
};

const createCSVErrorRow = ({ error, url }: any) => {
    const row = `\r\n${error},${url}`;
    return row;
};

const writeResultToCSV = (row: string) => {
    fs.appendFileSync(outputFilePath, row, 'utf-8');
};

const writeErrorsToCSV = (row: string) => {
    fs.appendFileSync(errorOutputFilePath, row, 'utf-8');
};

type AirBnbXmlObjectType = {
    loc: string;
    lastmod: string;
    changefreq: string;
    priority: string;
};

interface IHotelParams {
    adults: string;
    children: string;
    checkIn: string;
    checkOut: string;
}

const AirBnbUrlParamsNames: IHotelParams = {
    adults: 'adults',
    children: 'children',
    checkIn: 'check_in',
    checkOut: 'check_out',
};

const AirBnBHotelPageSelectors = {
    hotelName: 'h1',
    location: '._9xiloll',
    pricePerNight: '._tyxjp1',
    pricePerNightReducere: '_1y74zjx',
    pricePerNightReducerePretIntreg: '._1ks8cgb',
    bookTripDetailsError: '#bookItTripDetailsError',

    // pricePerNight: '#site-content > div > div:nth-child(1) > div:nth-child(3) > div > div._1s21a6e2 > div > div > div:nth-child(1) > div > div > div > div > div > div > div._wgmchy > div._c7v1se > div:nth-child(1) > div > span > div > span._tyxjp1'
};

// interface IUserInput {

// }

const userInput: IUserInputForCrawling = {
    checkIn: new Date('2023-01-02'),
    checkOut: new Date('2023-01-07'),
    rooms: [
        {
            adults: 2,
            childAges: [],
        }
    ]
};

const encodeId = (id: any) => {
    const text = `StayListing:${id}`;

    const buffer = Buffer.from(text);

    return buffer.toString('base64');
}


const main2 = async () => {
    const ceva = await (await scrapeHotelByIdAndUserInput(45421282, userInput)).data;
    fs.writeFileSync('./out.txt', JSON.stringify(ceva));
}

// main2().catch((err) => console.log(err));

const main3 = async () => {
    const xmlFileReadStream = fs.createReadStream(xmlFilePath);
    const xmlStream = new XmlStream(xmlFileReadStream);

    xmlStream.on('data', (a: any) => {
        console.log('chunck');
        console.log(a.length);
    })
    // xmlStream.on('endElement: url', async (url: AirBnbXmlObjectType) => {});
}

main3().catch(err => console.log(err));

const main = async () => {
    const browser = await puppeteer.launch({
        headless: false,
    });

    // let i = 0,
    //     j = 0;
    // let rows = '',
    //     errors = '';

    const xmlFileReadStream = fs.createReadStream(xmlFilePath);
    const xmlStream = new XmlStream(xmlFileReadStream);

    xmlStream.on('endElement: url', async (url: AirBnbXmlObjectType) => {
        // console.log(url);
        const { loc } = url;
        const urlObject = new URL(loc);

        // xmlStream.pause();

        // if (userInput.adults)
        //     urlObject.searchParams.set(
        //         AirBnbUrlParamsNames.adults,
        //         userInput.adults.toString()
        //     );
        // if (userInput.children)
        //     urlObject.searchParams.set(
        //         AirBnbUrlParamsNames.children,
        //         userInput.children.toString()
        //     );
        // if (userInput.checkIn)
        //     urlObject.searchParams.set(
        //         AirBnbUrlParamsNames.checkIn,
        //         userInput.checkIn
        //     );
        // if (userInput.checkOut)
        //     urlObject.searchParams.set(
        //         AirBnbUrlParamsNames.checkOut,
        //         userInput.checkOut
        //     );

        // const page = await browser.newPage();
        // // await page.setRequestInterception(true);
        // // page.on('request', (request) => {
        // //     if (
        // //       request.resourceType() === 'image' ||
        // //       request.resourceType() === 'font' ||
        // //       request.resourceType() === 'stylesheet'
        // //     ) {
        // //       request.abort();
        // //     }
        // //   });
        // // page.setDefaultNavigationTimeout(0);

        // await page.setRequestInterception(true);
        // page.on('request', (request) => {
        //     if (request.isNavigationRequest() && request.redirectChain().length)
        //         request.abort();
        //     else request.continue();
        // });

        // await page.goto(urlObject.href, {
        //     waitUntil: 'domcontentloaded',
        // });

        // // hotel name, review, pricePerNight, totalPrice, location, userinput
        // const { hotelName, pricePerNight } = AirBnBHotelPageSelectors;

        // let hotelData = null;

        // try {
        //     let noPrice = false;
        //     if (page.url() !== urlObject.href) {
        //         throw new Error('Page has been redirected.');
        //     }
        //     await page.waitForSelector(hotelName, { timeout: 80000 });
        //     if (
        //         (await page.$(
        //             AirBnBHotelPageSelectors.bookTripDetailsError
        //         )) !== null
        //     ) {
        //         noPrice = true;
        //     }
        //     if (!noPrice) {
        //         await page.waitForSelector(pricePerNight, { timeout: 80000 });
        //     }
        //     hotelData = await page.evaluate(
        //         (AirBnBHotelPageSelectors: any, noPrice: boolean) => {
        //             const hotelName = document.querySelector(
        //                 AirBnBHotelPageSelectors.hotelName
        //             ).textContent;
        //             const location = document.querySelector(
        //                 AirBnBHotelPageSelectors.location
        //             ).textContent;

        //             let pricePerNight = null;

        //             if (!noPrice) {
        //                 try {
        //                     pricePerNight = document.querySelector(
        //                         AirBnBHotelPageSelectors.pricePerNight
        //                     ).textContent;
        //                 } catch (err) {

        //                 }
        //             }

        //             return { hotelName, pricePerNight, location };
        //         },
        //         AirBnBHotelPageSelectors,
        //         noPrice
        //     );
        //     if (i < 1000) {
        //         ++i;
        //         const row = createCSVResultRow({
        //             ...userInput,
        //             ...hotelData,
        //             url: urlObject.href,
        //         });
        //         console.log(row);
        //         rows += row;
        //     } else {
        //         writeResultToCSV(rows);
        //         i = 0;
        //     }
        // } catch (err) {
        //     if (j < 1000) {
        //         ++j;
        //         const error = createCSVErrorRow({
        //             error: err,
        //             url: urlObject.href,
        //         });
        //         console.error(error);
        //         errors += error;
        //     } else {
        //         writeErrorsToCSV(errors);
        //         j = 0;
        //     }
        // }

        // await page.close();
        // xmlStream.resume();

        // writeResultToCSV({ ...userInput, ...hotelData, url: urlObject.href });
    });

    xmlStream.on('end', function () {
        // when processing finished for all objects/items in that file
    });
};

// main().catch((err) => console.log(err));
