import HotelService from "../../../services/HotelService";
import DropPoint from "../../../type-orm.config";
import { BookingComWorkerPayload, BookingComWorkerResponse } from "../../../types/types";
import { randomDelay } from "../../../utils/scrape/randomDelay";
import { scrapeHotelByIdAndUserInput } from "../scraper/scraper";
const { parentPort, isMainThread } = require('worker_threads');

if (isMainThread) {
    throw new Error('Its not a worker');
}


parentPort.on('message', async (payload: BookingComWorkerPayload) => {
    console.log('entered worker');
    const { userInput, hotelUrl, cookie, existingHotel } = payload;
    console.log('entered worker with user input: ', userInput);

    console.log(hotelUrl);

    if (existingHotel) {
        console.log(`Scraping existing hotel: ${hotelUrl}`);
    }

    let response: BookingComWorkerResponse = { data: null, error: null };
    
    await randomDelay(20000, 25000);
    
    try {
        const workerResponse = await scrapeHotelByIdAndUserInput(userInput, hotelUrl, cookie, existingHotel);
        response = existingHotel ? { ...workerResponse, ...existingHotel } : workerResponse;
    } catch (err) {
        if (err instanceof Error) {
            response.error = err;
        } else {
            response.error = new Error(`Error scraping hotel: ${hotelUrl}. Unexpected error: ` + err); 
        }
    }

    parentPort.postMessage(response);
});