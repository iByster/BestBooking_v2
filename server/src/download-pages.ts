import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
const XmlStream = require('xml-stream');

const xmlFilePath = path.join(
    __dirname,
    'sitemaps',
    'sitemap-homes-urls-98.xml'
);

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

const writePageToFileSystem = (pageName: string, pageContent: string) => {
    fs.writeFileSync(path.join(__dirname, 'htmls', pageName), pageContent, { encoding: 'utf-8'});
}

const userInput = {
    adults: 2,
    children: 0,
    checkIn: '2023-01-02',
    checkOut: '2023-01-05',
};

const main = async () => {
    const browser = await puppeteer.launch({
        headless: false,
    });

    let i = 1;

    const xmlFileReadStream = fs.createReadStream(xmlFilePath);
    const xmlStream = new XmlStream(xmlFileReadStream);

    xmlStream.on('endElement: url', async (url: AirBnbXmlObjectType) => {
        // console.log(url);
        const { loc } = url;
        const urlObject = new URL(loc);

        xmlStream.pause();

        if (userInput.adults)
            urlObject.searchParams.set(
                AirBnbUrlParamsNames.adults,
                userInput.adults.toString()
            );
        if (userInput.children)
            urlObject.searchParams.set(
                AirBnbUrlParamsNames.children,
                userInput.children.toString()
            );
        if (userInput.checkIn)
            urlObject.searchParams.set(
                AirBnbUrlParamsNames.checkIn,
                userInput.checkIn
            );
        if (userInput.checkOut)
            urlObject.searchParams.set(
                AirBnbUrlParamsNames.checkOut,
                userInput.checkOut
            );

        const page = await browser.newPage();

        await page.setRequestInterception(true);
        page.on('request', (request) => {
            if (request.isNavigationRequest() && request.redirectChain().length)
                request.abort();
            else request.continue();
        });

        await page.goto(urlObject.href, {
            waitUntil: 'load',
        });

        try {
            await page.waitForSelector(AirBnBHotelPageSelectors.hotelName, { timeout: 1500 });
            const html = await page.content();
            writePageToFileSystem(`page${i}.html`, html);
            i++;
        } catch (err) {
            console.log('Redirected. Err: ' + err);
        }



        await page.close();
        xmlStream.resume();

        // writeResultToCSV({ ...userInput, ...hotelData, url: urlObject.href });
    });

    xmlStream.on('end', function () {
        // when processing finished for all objects/items in that file
    });
};

main().catch((err) => console.log(err));
