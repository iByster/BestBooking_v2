import { AirBnbWorkerPayload } from "../../types/types";
import { randomDelay } from "../../utils/scrape/randomDelay";
import { scrapeHotelByIdAndUserInput } from "../scraper/scraper";

const { parentPort, isMainThread } = require('worker_threads');

if (isMainThread) {
    throw new Error('Its not a worker');
}


parentPort.on('message', async (payload: AirBnbWorkerPayload) => {
    console.log('entered worker');
    const { hotelId, userInput } = payload;

    let response = null;

    await randomDelay(5000, 10000);

    try {
        const response = await scrapeHotelByIdAndUserInput(hotelId, userInput);
        parentPort.postMessage(response);
    } catch (err) {
        console.log(`Error scraping hotel with id: ${hotelId}`);
        parentPort.postMessage(response);
    }
});