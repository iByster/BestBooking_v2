import PuppeteerScraper from '../../../scrapers/PuppeteerScraper';
import { executablePath } from 'puppeteer';
import puppeteerXtra from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
puppeteerXtra.use(StealthPlugin());
import fs from 'fs';

const getRomaniaHotelUrls = (pageNumber: number) => {
    return `https://romania.directbooking.ro/hoteluri-romania.aspx?mk=homesectiuni&pag=${pageNumber}`;
};

const fetchHotels = async (url: string) => {
    let page, browser;

    try {
        browser = await puppeteerXtra.launch({
            executablePath: executablePath(),
            headless: false,
        });

        page = await browser.newPage();
        await page.setRequestInterception(true);

        page.on('request', (request) => {
            if (
                request.resourceType() === 'image' ||
                request.resourceType() === 'font' ||
                request.resourceType() === 'stylesheet'
            ) {
                request.abort();
            } else {
                request.continue();
            }
        });

        await page.goto(url);

        await page.waitForFunction(
            () => {
                return (
                    window.hotels !== undefined
                );
            },
            { timeout: 100000 }
        );

        const hotelId = await page.evaluate(() => {
            return window.hotels;
        });

        return hotelId;
    } catch (err) {
        let message = 'Could not featch window property: ';
        if (err instanceof Error) {
            throw new Error(message + err.message);
        }
        throw new Error(message);
    } finally {
        page && (await page.close());
        browser && (await browser.close());
    }
};

const crawlHotelFromRo = async (opts?: { saveToFile: boolean }) => {
    const hotels = await fetchHotels(
        getRomaniaHotelUrls(3)
    );

    if (opts?.saveToFile) {
        hotels.forEach((h: any) => {
            fs.writeFileSync('./sitemaps.txt', h[3].substring(2) + '\n', {
                flag: 'a',
            });
        });
    }

    return hotels;
};

export default crawlHotelFromRo;
