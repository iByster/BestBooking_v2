import HotelService from "../../../services/HotelService";
import { DirectBookingWorkerPayload, DirectBookingWorkerResponse } from "../../../types/types";
import { randomDelay } from "../../../utils/scrape/randomDelay";
import { scrapeHotelByIdAndUserInput } from "../scraper/scraper";

const { parentPort, isMainThread } = require('worker_threads');

if (isMainThread) {
    throw new Error('Its not a worker');
}

parentPort.on('message', async (payload: DirectBookingWorkerPayload) => {
    const { hotelId, userInput, hotelUrl, cookie, existingHotel } = payload;
    console.log('entered worker with user input: ', userInput);

    console.log(hotelUrl);

    if (existingHotel) {
        console.log(`Scraping existing hotel: ${hotelUrl}`);
    }

    let response: DirectBookingWorkerResponse = { data: null, error: null };
    
    await randomDelay(10000, 20000);
    
    try {
        const workerResponse = await scrapeHotelByIdAndUserInput(hotelId, userInput, hotelUrl, cookie, existingHotel);
        response = workerResponse;
    } catch (err) {
        if (err instanceof Error) {
            response.error = err;
        } else {
            response.error = new Error(`Error scraping hotel: ${hotelUrl}. Unexpected error: ` + err); 
        }
    }

    parentPort.postMessage(response);
});