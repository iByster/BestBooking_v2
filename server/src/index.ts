import * as dotenv from 'dotenv';
import { crawlXMLFile } from './scripts/agoda.com/crawler/crawler';
import { IUserInputForCrawling } from './types/types';
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
}

main().catch((err) => console.log(err));
