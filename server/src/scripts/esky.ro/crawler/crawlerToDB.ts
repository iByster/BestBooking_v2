import path from 'path';
import { Hotel } from "../../../entities/Hotel";
import { HotelPrice } from "../../../entities/HotelPrice";
import { Location } from "../../../entities/Location";
import HotelService from "../../../services/HotelService";
import { EskyRoWorkerPayload, EskyRoWorkerResponse, IUserInputForCrawling } from "../../../types/types";
import appendToCSVFile from "../../../utils/files/appendToCsvFile";
import jsObjectToCsvRecord from "../../../utils/files/jsObjectToCsvRecord";
import logger from "../../../utils/logger/Logger";
import { colorizeStringByNumber } from "../../../utils/logger/colorizeString";
import getRandomUserInput from "../../../utils/payload/randomUserInput";
import { WorkerPool } from "../../../utils/worker-pool/WorkerPool";
import { getHotelsFromRomania } from "../utils/getHotelsFromRomania";

export const crawlXMLFileFromFile = async (
    cookie: string,
    userInput?: IUserInputForCrawling,
) => {
    // creating worker pool
    const workerPath = path.join(__dirname, 'worker.js');
    const pool = new WorkerPool<
        EskyRoWorkerPayload,
        EskyRoWorkerResponse
    >(workerPath, 10);

    // define chunk limit
    const chunckMaxSize = 5;
    let chunkCount = 1;

    let hotelsData: Hotel[] = [];
    let hotelLocationsData: Location[] = [];
    let hotelPricesDataArr: HotelPrice[] = [];

    const hotels = await getHotelsFromRomania();

    await Promise.all(
        hotels.map(async (hotel: any) => {
            const { id, url } = hotel;

            // extract hotel id from hotel url
            const hotelService = new HotelService();
            const existingHotel = await hotelService.checkIfHotelExistByUrl(
                url
            );

            // run worker with hotelId and user input
            let res = await pool.run(() => ({
                userInput:
                    userInput || getRandomUserInput({ withChildren: false }),
                hotelUrl: url,
                cookie,
                existingHotel,
                siteHotelId: id,
            }));

            const { data, error, workerId } = res;

            if (data) {
                const { hotelData, hotelPricesData, locationData } = data;

                if (hotelData && !existingHotel) {
                    hotelsData.push(Hotel.create(hotelData as Hotel));
                }

                if (locationData) {
                    hotelLocationsData.push(
                        Location.create(locationData as Location)
                    );
                }

                hotelPricesData.forEach((hotelPrice) => {
                    hotelPricesDataArr.push(
                        HotelPrice.create(hotelPrice as HotelPrice)
                    );
                });

                ++chunkCount;

                if (chunkCount > chunckMaxSize) {
                    await Hotel.createQueryBuilder()
                        .insert()
                        .values(hotelsData)
                        .execute();
                    await Location.createQueryBuilder()
                        .insert()
                        .values(hotelLocationsData)
                        .execute();
                    await HotelPrice.createQueryBuilder()
                        .insert()
                        .values(hotelPricesDataArr)
                        .execute();

                    // reset
                    chunkCount = 0;
                    hotelsData = [];
                    hotelLocationsData = [];
                    hotelPricesDataArr = [];
                }

                if (hotelPricesData && hotelPricesData.length === 0) {
                    logger.warn(
                        `WORKER ID ${colorizeStringByNumber(
                            workerId.toString(),
                            workerId
                        )}: hotel with id: ${
                            hotelData.siteHotelId
                        } scraped successfully but no prices were collected`
                    );
                } else {
                    logger.log(
                        `WORKER ID ${colorizeStringByNumber(
                            workerId.toString(),
                            workerId
                        )}: hotel with id: ${
                            hotelData.siteHotelId
                        } scraped successfully`
                    );
                }
            } else if (error) {
                logger.error(
                    `WORKER ID ${colorizeStringByNumber(
                        workerId.toString(),
                        workerId
                    )}: ${error.message}`,
                    error
                );
                appendToCSVFile(
                    path.join(__dirname, '..', 'output', 'airBnbErrorData.csv'),
                    jsObjectToCsvRecord({ errorMsg: error?.message }, [
                        'errorMsg',
                    ])
                );
            } else {
                logger.error(
                    `WORKER ID ${colorizeStringByNumber(
                        workerId.toString(),
                        workerId
                    )}: Unexpected error`
                );
            }
        })
    );
};