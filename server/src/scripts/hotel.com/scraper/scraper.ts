// import { executablePath } from 'puppeteer';
// import puppeteerXtra from 'puppeteer-extra';
// import StealthPlugin from 'puppeteer-extra-plugin-stealth';
// puppeteerXtra.use(StealthPlugin());

// const siteOrigin = 'https://www.hotel.com'

// const fetchHotelAndLocationData = async (hotelUrl: string) => {
//     let page, browser;

//     try {
//         browser = await puppeteerXtra.launch({
//             executablePath: executablePath(),
//         });
        
//         page = await browser.newPage();
//         await page.setRequestInterception(true);

//         page.on('request', (request) => {
//           if (
//             request.resourceType() === 'image' ||
//             request.resourceType() === 'font' ||
//             request.resourceType() === 'stylesheet'
//           ) {
//             request.abort();
//           } else {
//             request.continue();
//           }
//         });

//         await page.goto(hotelUrl);

//         await page.waitForFunction(() => {
//             return window.initParams.__PLUGIN_STATE__ !== undefined;
//         }, { timeout: 20000 });

//         const hotelId = await page.evaluate(() => {
//             return window.initParams.__PLUGIN_STATE__;
//         });

//         return hotelId;
//     } catch(err) {
//         let message = 'Could not featch hotel id, problem with getHotelId function: ';
//         if (err instanceof Error) {
//             throw new Error(message + err.message);
//         }
//         throw new Error(message);
//     } finally {
//         page && await page.close();
//         browser && await browser.close();
//     }
// }

// const parseHotelAndLocationData = (data: any, siteHotelId: string) => {
//     const propertyInfo = data?.apollo?.apolloState[`PropertyInfo:${siteHotelId}`];

//     const hotelName = propertyInfo?.summary?.name;
//     const description = null;
//     // const rating = ;
    

//     return {
//         hotelData: {
//             id: hotelId,
//             hotelName,
//             siteOrigin,
//             siteHotelId,
//             description,
//             rating,
//             reviews,
//             link,
//             imageLink,
//             balcony,
//             freeParking,
//             kitchen,
//             bayView,
//             mountainView,
//             washer,
//             wifi,
//             bathroom,
//             coffeMachine,
//             airConditioning,
//             createdAt: new Date()
//         },
//         locationData: {
//             id: uuidv4(),
//             hotelId,
//             locationName,
//             lat,
//             lon,
//             address,
//             area,
//             country,
//             region,
//             createdAt: new Date()
//         },
//     }
// }