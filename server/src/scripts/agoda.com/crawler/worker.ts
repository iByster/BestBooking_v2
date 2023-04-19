import { AgodaComWorkerPayload, AgodaComWorkerResponse } from "../../../types/types";
import { randomDelay } from "../../../utils/scrape/randomDelay";
import { scrapeHotelByUserInput } from "../scraper/scraper";
import logger from '../../../utils/logger/Logger';
import { colorizeStringByNumber } from "../../../utils/logger/colorizeString";
const { parentPort, isMainThread, threadId } = require('worker_threads');

if (isMainThread) {
    throw new Error('Its not a worker');
}

parentPort.on('message', async (payload: AgodaComWorkerPayload) => {
    const { userInput, hotelUrl, cookie, existingHotel, siteHotelId } = payload;
    logger.debug(`WORKER ID ${colorizeStringByNumber(threadId.toString(), threadId)}: entered worker with user input: ${JSON.stringify(userInput)}`);

    if (existingHotel) {
        logger.debug(`WORKER ID ${colorizeStringByNumber(threadId.toString(), threadId)}: scraping existing hotel: ${hotelUrl}`);
    }

    let response: AgodaComWorkerResponse = { workerId: threadId, data: null, error: null };
    
    await randomDelay(30000, 35000);
    
    try {
        const workerResponse = await scrapeHotelByUserInput(hotelUrl, userInput, cookie, existingHotel, siteHotelId);
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