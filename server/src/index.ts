import * as dotenv from 'dotenv';
import { IUserInputForCrawling } from './types/types';
import { getHotelsFromRomania } from './scripts/esky.ro/utils/getHotelsFromRomania';
dotenv.config();
import fs from 'fs';
import { findKeyPath } from './utils/keyFinder/keyFinder';


const userInput: IUserInputForCrawling = {
    checkIn: new Date('2023-03-15'),
    checkOut: new Date('2023-03-20'),
    rooms: [
        {
            adults: 2,
            childAges: [],
        },
    ],
};

const main = async () => {


};

main().catch((err) => console.log(err));
