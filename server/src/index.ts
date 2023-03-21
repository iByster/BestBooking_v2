import * as dotenv from 'dotenv';
import { Hotel } from './entities/Hotel';
import { crawlXMLFile } from './scripts/agoda.com/crawler/crawlerToCSV';
import DropPoint from './type-orm.config';
import { IUserInputForCrawling } from './types/types';
import { findHotelInXML } from './utils/crawler/findHotelInXML';
import getRandomNumberBetween from './utils/number/getRandomNumberInterval';
import getRandomUserInput from './utils/payload/randomUserInput';
dotenv.config();

const userInput: IUserInputForCrawling = {
    checkIn: new Date('2023-03-15'),
    checkOut: new Date('2023-03-20'),
    rooms: [
        {
            adults: 2,
            childAges: [],
        }
    ]
};

const main = async () => {
    // await crawlXMLFile(userInput);
    const sitemap = 'https://www.booking.com/sitembk-hotel-index.xml';
    const sitemapFilter = 'https://www.booking.com/sitembk-hotel-en-gb';
    const hotelUrl = 'https://www.booking.com/hotel/za/river-view-cottages.en-gb.html';
    const res = await findHotelInXML(sitemap, sitemapFilter, hotelUrl);
    console.log(res);

    //
}

main().catch((err) => console.log(err));
