import RequestScraper from '../../../scrapers/RequestScraper';
const SITE_ORIGIN = 'https://agoda.com';
import fs from 'fs';
import path from 'path';
import delay from '../../../utils/scrape/delay';

const COUNTIES_FILE_PATH = path.join(__dirname, './counties.json');
const CITIES_FILE_PATH = path.join(__dirname, './cities.json');

const getCounties = async (opts?: { fromFile: boolean }) => {
    if (opts?.fromFile) {
        return JSON.parse(fs.readFileSync(COUNTIES_FILE_PATH).toString());
    }

    const requestScraper = new RequestScraper(SITE_ORIGIN);

    const counties = await requestScraper.scrapeHotelAndBuildReq({
        apiEndpoint:
            'https://www.agoda.com/api/cronos/geo/AllStates?pageTypeId=4&objectId=75&accommodationType=0&themeType=0',
        body: null,
        cookie: false,
        proxy: false,
        method: 'GET',
        specificHeaders: {},
        includeRotatingHeaders: true,
    });

    fs.writeFileSync(COUNTIES_FILE_PATH, JSON.stringify(counties));

    return counties;
};

const getCitiesFromCounty = async (countyId: number) => {
    const requestScraper = new RequestScraper(SITE_ORIGIN);

    const cities = await requestScraper.scrapeHotelAndBuildReq({
        apiEndpoint: `https://www.agoda.com/api/cronos/geo/NeighborHoods?pageTypeId=8&objectId=${countyId}&accommodationType=0&themeType=0`,
        body: null,
        cookie: false,
        proxy: false,
        method: 'GET',
        specificHeaders: {},
        includeRotatingHeaders: true,
    });

    // fs.writeFileSync(CITIES_FILE_PATH, JSON.stringify(cities));

    return cities;
};

export const getCityIds = () => {
    try {
        if (fs.existsSync(CITIES_FILE_PATH)) {
            return JSON.parse(
                fs.readFileSync(CITIES_FILE_PATH).toString()
            )
            .flat(2)
            .map((city: any) => city.hotelId);
        } else {
            throw new Error('cities.json is not generated.');
        }
    } catch (err) {
        console.error(err);
    }
};


export const getCities = () => {
    try {
        if (fs.existsSync(CITIES_FILE_PATH)) {
            return JSON.parse(
                fs.readFileSync(CITIES_FILE_PATH).toString()
            )
            .flat(2)
        } else {
            throw new Error('cities.json is not generated.');
        }
    } catch (err) {
        console.error(err);
    }
}

export const generateCountyAndCityFiles = async (opts?: {
    fromFile: boolean;
}) => {
    const counties = await getCounties({ fromFile: opts?.fromFile || false });
    const cities = [];

    for (let i = 0; i < counties.length; ++i) {
        const citiesFromACounty = await getCitiesFromCounty(counties[i].id);
        cities.push(citiesFromACounty);
        console.log(citiesFromACounty);
        await delay(10000);
    }

    fs.writeFileSync(CITIES_FILE_PATH, JSON.stringify(cities));
};
