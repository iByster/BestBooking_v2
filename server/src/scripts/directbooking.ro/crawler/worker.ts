import { DirectBookingWorkerPayload, DirectBookingWorkerResponse } from "../../../types/types";
import { randomDelay } from "../../../utils/scrape/randomDelay";
import { scrapeHotelByIdAndUserInput } from "../scraper/scraper";

const { parentPort, isMainThread } = require('worker_threads');

if (isMainThread) {
    throw new Error('Its not a worker');
}

parentPort.on('message', async (payload: DirectBookingWorkerPayload) => {
    const { hotelId, userInput, hotelUrl } = payload;
    console.log('entered worker with user input: ', userInput);

    let response: DirectBookingWorkerResponse = { data: null, error: null };
    
    await randomDelay(10000, 20000);
    
    try {
        const workerResponse = await scrapeHotelByIdAndUserInput(hotelId, userInput, hotelUrl);
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