import { DirectBookingWorkerPayload, DirectBookingWorkerResponse } from "../../../types/types";
import { randomDelay } from "../../../utils/scrape/randomDelay";
import { scrapeHotelByIdAndUserInput } from "../scraper/scraper";
import logger from '../../../utils/logger/Logger';
import { colorizeStringByNumber } from "../../../utils/logger/colorizeString";
const { parentPort, isMainThread, threadId } = require('worker_threads');

if (isMainThread) {
    throw new Error('Its not a worker');
}

parentPort.on('message', async (payload: DirectBookingWorkerPayload) => {
    const { hotelId, userInput, hotelUrl, cookie, existingHotel } = payload;
    logger.debug(`WORKER ID ${colorizeStringByNumber(threadId.toString(), threadId)}: entered worker with user input: ${JSON.stringify(userInput)}`);

    if (existingHotel) {
        logger.debug(`WORKER ID ${colorizeStringByNumber(threadId.toString(), threadId)}: scraping existing hotel: ${hotelUrl}`);
    }

    let response: DirectBookingWorkerResponse = { data: null, error: null, workerId: threadId };
    
    await randomDelay(30000, 40000);
    
    try {
        const workerResponse = await scrapeHotelByIdAndUserInput(hotelId, userInput, hotelUrl, cookie, existingHotel);
        response.data = workerResponse;
    } catch (err) {
        if (err instanceof Error) {
            response.error = err;
        } else {
            response.error = new Error(`Error scraping hotel: ${hotelUrl}. Unexpected error: ` + err); 
        }
    }

    parentPort.postMessage(response);
});