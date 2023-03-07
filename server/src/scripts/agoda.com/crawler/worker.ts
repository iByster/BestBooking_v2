import { AgodaComWorkerPayload, AgodaComWorkerResponse } from "../../../types/types";
import { randomDelay } from "../../../utils/scrape/randomDelay";
import { scrapeHotelByUserInput } from "../scraper/scraper";
const { parentPort, isMainThread } = require('worker_threads');

if (isMainThread) {
    throw new Error('Its not a worker');
}

parentPort.on('message', async (payload: AgodaComWorkerPayload) => {
    const { userInput, hotelUrl } = payload;
    console.log('entered worker with user input: ', userInput);

    let response: AgodaComWorkerResponse = { data: null, error: null };
    
    await randomDelay(30000, 55000);
    
    try {
        const workerResponse = await scrapeHotelByUserInput(hotelUrl, userInput);
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