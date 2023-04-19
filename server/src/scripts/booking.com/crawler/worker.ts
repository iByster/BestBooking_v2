import { BookingComWorkerPayload, BookingComWorkerResponse } from "../../../types/types";
import { colorizeStringByNumber } from "../../../utils/logger/colorizeString";
import { randomDelay } from "../../../utils/scrape/randomDelay";
import { scrapeHotelByIdAndUserInput } from "../scraper/scraper";
const { parentPort, isMainThread, threadId } = require('worker_threads');
import logger from '../../../utils/logger/Logger';

if (isMainThread) {
    throw new Error('Its not a worker');
}


parentPort.on('message', async (payload: BookingComWorkerPayload) => {
    console.log('entered worker');
    const { userInput, hotelUrl, cookie, existingHotel } = payload;
    logger.debug(`WORKER ID ${colorizeStringByNumber(threadId.toString(), threadId)}: entered worker with user input: ${JSON.stringify(userInput)}`);

    if (existingHotel) {
        logger.debug(`WORKER ID ${colorizeStringByNumber(threadId.toString(), threadId)}: scraping existing hotel: ${hotelUrl}`);
    }

    let response: BookingComWorkerResponse = { data: null, error: null, workerId: threadId };
    
    await randomDelay(20000, 25000);
    
    try {
        const workerResponse = await scrapeHotelByIdAndUserInput(userInput, hotelUrl, cookie, existingHotel);
        response.data = existingHotel ? { ...workerResponse, ...existingHotel } : workerResponse;
    } catch (err) {
        if (err instanceof Error) {
            response.error = err;
        } else {
            response.error = new Error(`Error scraping hotel: ${hotelUrl}. Unexpected error: ` + err); 
        }
    }

    parentPort.postMessage(response);
});