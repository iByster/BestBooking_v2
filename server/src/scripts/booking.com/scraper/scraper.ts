import { JSDOM } from 'jsdom';
import { executablePath } from 'puppeteer';
import puppeteerXtra from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { v4 as uuidv4 } from 'uuid';
import { Hotel } from '../../../entities/Hotel';
import RequestScraper from '../../../scrapers/RequestScraper';
import { BaseScraperResponse, ErrorRequestFetch, IHotelPrice, IRoom, IUserInputForCrawling, Nullable } from '../../../types/types';
import { extractNumbers, getDateDifferenceInDays } from '../../../utils/parse/parseUtils';
import { bookingBaseHeaders } from '../headers/headers';
import { constructQueryStringPayload } from '../payload/payload';
puppeteerXtra.use(StealthPlugin());

const siteOrigin = 'https://www.booking.com/';

export const parseData = async (response: string, siteHotelId: string, hotelUrl: string, userInput: IUserInputForCrawling) => {
    const { checkIn, checkOut, rooms } = userInput;
    const currency = 'RON'
    
    const dom = new JSDOM(response);
    const document = dom.window.document;

    let hotelDetails = null;

    const hotelDetailsString = document.querySelector('script[type="application/ld+json"]')?.textContent;
    if (hotelDetailsString) {
        hotelDetails = JSON.parse(hotelDetailsString);
    }

    const hotelPricesData: IHotelPrice[] = [];

    const browser = await puppeteerXtra.launch({
        executablePath: executablePath(),
    });

    const page = await browser.newPage();
    await page.setContent(response);

    const hotelPricesRaw = await page.evaluate(() => {
        return window.booking.env.b_rooms_available_and_soldout;
    });

    await browser.close();

    // BASE HOTEL DETAILS
    const hotelId = uuidv4();
    const hotelName = hotelDetails?.name || document.querySelector('header h1')?.textContent;
    const description = hotelDetails?.description || document.querySelector('#description > section > div.page-section--content')?.textContent;
    const ratingExtract = extractNumbers(document.querySelector('[aria-label="Rated exceptional"]')?.textContent);
    const rating = { score: hotelDetails?.aggregateRating?.ratingValue || document.querySelector('#htInfo > div:nth-child(1) > header > div.bui-u-margin-top--4.bui-u-inline.js-hp-header-review-cta.js-review-tab-link > div > div > div > div.b5cd09854e.d10a6220b4')?.textContent || (ratingExtract && ratingExtract.length > 0 ? ratingExtract[0] : undefined), maxScore: 10 };
    const reviews = hotelDetails?.aggregateRating?.reviewCount;
    const link = hotelUrl || hotelDetails.url;
    const imageLink = hotelDetails?.image;

    const hotelFacilitiesRaw = document.querySelectorAll('section.hotel-facilities ul li span');
    const hotelFacilities: string[] = [];

    hotelFacilitiesRaw.forEach((hf: any) => hotelFacilities.push(hf.textContent));

    // FACILITIES
    const balcony = !!hotelFacilities.find(hf => hf.toLowerCase().includes('balcony')) || document.querySelector('[data-testid=ROOM_17]') ? true : false;
    const freeParking = !!hotelFacilities.find(hf => hf.toLowerCase().includes('free parking')) || document.querySelector('[data-testid=PROPERTY_46]') ? true : false;
    const kitchen = !!hotelFacilities.find(hf => hf.toLowerCase().includes('kitchen')) || document.querySelector('[data-testid=ROOM_45]') ? true : false;
    const bayView =  !!hotelFacilities.find(hf => hf.toLowerCase().includes('bay view')) ? true : false;
    const mountainView = !!hotelFacilities.find(hf => hf.toLowerCase().includes('mountain view')) ? true : false;
    const washer = !!hotelFacilities.find(hf => hf.toLowerCase().includes('washing machine')) || document.querySelector('[data-testid=ROOM_34]') ? true : false;
    const wifi = !!hotelFacilities.find(hf => hf.toLowerCase().includes('wifi')) || document.querySelector('[data-testid=PROPERTY_107]') ? true : false;
    const bathroom = !!hotelFacilities.find(hf => hf.toLowerCase().includes('bathroom')) || document.querySelector('[data-testid=PROPERTY_38]') ? true : false;
    const coffeMachine = !!hotelFacilities.find(hf => hf.toLowerCase().includes('coffe machine')) || document.querySelector('path[d="M.75 24h22.5a.75.75 0 0 0 0-1.5H.75a.75.75 0 0 0 0 1.5zM24 2.25A2.25 2.25 0 0 0 21.75 0H4.5a2.25 2.25 0 0 0-2.25 2.25v6A2.25 2.25 0 0 0 4.5 10.5H12a.75.75 0 0 1 .75.75v12c0 .414.336.75.75.75h9.75a.75.75 0 0 0 .75-.75v-21zm-1.5 0v21l.75-.75H13.5l.75.75v-12A2.25 2.25 0 0 0 12 9H4.5a.75.75 0 0 1-.75-.75v-6a.75.75 0 0 1 .75-.75h17.25a.75.75 0 0 1 .75.75zM18.75 24h4.5a.75.75 0 0 0 .75-.75v-10.5a.75.75 0 0 0-.75-.75h-3A2.25 2.25 0 0 0 18 14.25v9c0 .414.336.75.75.75zm0-1.5l.75.75v-9a.75.75 0 0 1 .75-.75h3l-.75-.75v10.5l.75-.75h-4.5zM6 9.75v3a.75.75 0 0 0 1.5 0v-3a.75.75 0 0 0-1.5 0zm2.25-4.5a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0zm1.5 0a2.25 2.25 0 1 0-4.5 0 2.25 2.25 0 0 0 4.5 0zm13.5-.75h-4.5a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5zm0 3h-4.5a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5zM2.344 18c0 .866.012 1.295.069 1.833C2.69 22.437 4.003 24 6.844 24c2.234 0 3.38-1.189 3.977-3.297.057-.203.11-.411.168-.66l.136-.599c.029-.126.054-.228.077-.32a1.5 1.5 0 0 0-1.454-1.874H3.094a.75.75 0 0 0-.75.75zm1.5 0l-.75.75h6.655c-.027.107-.054.22-.086.357l-.135.595c-.053.229-.1.415-.15.592-.434 1.53-1.085 2.206-2.534 2.206-1.97 0-2.736-.912-2.94-2.825-.05-.47-.06-.861-.06-1.675zm-.75-.75a3 3 0 0 0-3 3 .75.75 0 0 0 1.5 0 1.5 1.5 0 0 1 1.5-1.5.75.75 0 0 0 0-1.5z"]') ? true : false;
    const airConditioning = !!hotelFacilities.find(hf => hf.toLowerCase().includes('air con')) || document.querySelector('[data-testid=ROOM_11]') ? true : false;

    // LOCATION DATA
    const address = hotelDetails?.address?.streetAddress;
    const locationName = hotelDetails?.address?.addressLocality || document.querySelector('#htInfo > div:nth-child(1) > header > div.hp-header--address.b-no-text-selection.b-no-context-menu.b-no-tap-highlight > span.js_hp_address_content > span.js_hp_address_text_line')?.textContent || address.split(',')[0];
    const geoLocation = hotelDetails?.hasMap.split('&').find((s: string) => s.includes('center')).split('=')[1].split(',');
    const [lat, lon] = geoLocation;
    const country = hotelDetails?.address?.addressCountry;
    const region = hotelDetails?.address?.addressRegion;

    if (!hotelPricesRaw) {
        const availableHotelRooms = document.querySelectorAll('[data-component="hotel/room-page"]');

        availableHotelRooms.forEach(room => {
            const to = checkOut;
            const from = checkIn;

            let pricePerNight = null;

            const pricePerNightString = room.querySelector('.priceInfo .mpc-inline-block-maker-helper')?.textContent
            const description = room.querySelector('.room__title-text')?.textContent;

            if (pricePerNightString) {
                pricePerNight = extractNumbers(pricePerNightString)![0] / getDateDifferenceInDays(checkIn, checkOut);
            }

            hotelPricesData.push({
                id: uuidv4(),
                hotelId,
                to,
                from,
                pricePerNight,
                pricePerRoom: pricePerNight,
                serviceFee: null,
                cleaningFee: null,
                taxes: null,
                currency,
                rooms,
                date: null,
                description,
                createdAt: new Date()
            })
        })
    } else {
        hotelPricesRaw.forEach((hotelBlock: any) => {
            const blocks = hotelBlock?.b_blocks;

            const description = hotelBlock?.b_name;

            blocks.forEach((block: any) => {
                const priceRaw = +block?.b_raw_price;
                const room: IRoom[] = [{ adults: +block.b_max_persons, childAges: [] }];
                const pricePerNight = priceRaw / getDateDifferenceInDays(checkIn, checkOut);
                const taxes = block?.b_price_breakdown_simplified?.b_tax_exception;
                const to = checkOut;
                const from = checkIn;

                hotelPricesData.push({
                    id: uuidv4(),
                    hotelId,
                    from,
                    to,
                    pricePerNight,
                    pricePerRoom: pricePerNight,
                    serviceFee: null,
                    cleaningFee: null,
                    taxes,
                    currency,
                    rooms: room,
                    date: null,
                    description,
                    createdAt: new Date()
                })

            })
        })
    }

    // const availableRooms = await page.evaluate(() => {
    //     return document.querySelector('ul.c-next-available-dates__carousel').getElementsByTagName('li');
    // });

    return {
        hotelData: {
            id: hotelId,
            hotelName,
            siteOrigin,
            siteHotelId,
            description,
            rating,
            reviews,
            link,
            imageLink,
            balcony,
            freeParking,
            kitchen,
            bayView,
            mountainView,
            washer,
            wifi,
            bathroom,
            coffeMachine,
            airConditioning,
            createdAt: new Date()
        },
        locationData: {
            id: uuidv4(),
            hotelId,
            locationName,
            lat,
            lon,
            address,
            area: null,
            country,
            region,
            createdAt: new Date()
        },
        hotelPricesData
    }
}

export const getHotelId = async (hotelUrl: string, cookie: string): Promise<Nullable<string>> => {
    const requestScraper = new RequestScraper(siteOrigin);
    let page, browser;

    try {
        const requestOptions = await requestScraper.buildRequestOptions({
            apiEndpoint: hotelUrl,
            body: null,
            cookie: false,
            proxy: false,
            method: 'GET',
            specificHeaders: {
                cookie,
                ...bookingBaseHeaders,
                "Accept-Encoding": "br;q=1.0, gzip;q=0.8, *;q=0.1"
            },
            includeRotatingHeaders: true,
        });
        
        const response = await requestScraper.scrapeHotel(requestOptions);
        const { data, status } = response;
        
        if (status !== 200) {
            throw new Error(`Request failed with status code: ` + status);
        }

        browser = await puppeteerXtra.launch({
            executablePath: executablePath(),
        });
        
        page = await browser.newPage();
        await page.setContent(data);

        await page.waitForFunction(() => {
            return window.booking.env.b_hotel_id !== undefined;
        }, { timeout: 20000 });
        
        const hotelId = await page.evaluate(() => {
            return window.booking.env.b_hotel_id;
        })
        
        return hotelId;
    } catch(err) {
        let message = 'Could not featch hotel id, problem with getHotelId function: ';
        if (err instanceof Error) {
            throw new Error(message + err.message);
        }
        throw new Error(message);
    } finally {
        page && await page.close();
        browser && await browser.close();
    }
}

export const fetchData = async (id: string, userInput: IUserInputForCrawling, hotelUrl: string, cookie: string) => {
    const requestScraper = new RequestScraper(siteOrigin);

    const apiEndpoint = `${hotelUrl}?${constructQueryStringPayload(id, userInput)}`;
    try {

        const requestOptions = await requestScraper.buildRequestOptions({
            apiEndpoint,
            body: null,
            cookie: false,
            proxy: false,
            method: 'GET',
            specificHeaders: {
                cookie,
                ...bookingBaseHeaders,
                "Accept-Encoding": "br;q=1.0, gzip;q=0.8, *;q=0.1"
            },
            includeRotatingHeaders: true,
        });
        
        const response = await requestScraper.scrapeHotel(requestOptions);
        const { data, status } = response;

        if (status !== 200) {
            throw new Error(`Request failed with status code: ` + status);
        }

        return data;
    } catch(err) {
        let message;
        if (err instanceof Error) {
            message = err.message;
        } else {
            message = String(err);
        }

        throw new ErrorRequestFetch(`fetchData: ${message}`);
    }
}

export const scrapeHotelByIdAndUserInput = async (userInput: IUserInputForCrawling, hotelUrl: string, cookie: string, existingHotel?: Nullable<Hotel>): Promise<BaseScraperResponse> => {
    try {
        let hotelId;
        if (!existingHotel) {
            hotelId = await getHotelId(hotelUrl, cookie);
        } else {
            hotelId = existingHotel.siteHotelId;
        }

        if (!hotelId) {
            throw new Error('Could not featch hotel id, problem with getHotelId function');
        }

        const rawData = await fetchData(hotelId, userInput, hotelUrl, cookie);
        const parsedData = await parseData(rawData, hotelId, hotelUrl, userInput);

        return {
            ...parsedData,
        }
    } catch(err: any) {
        if (err instanceof Error) {
            err.message += `. ${hotelUrl}`;
            throw err;
        }

        throw new Error(err);
    }
} 