import DropPoint from "../../type-orm.config";
import CookieManager from "../../utils/cookie/CookieManager";
import { crawlXMLFile } from "./crawler/crawlerToDB";

const BASE_URL = 'https://www.directbooking.ro/';

const run = async () => {
    const cookieManager = new CookieManager(BASE_URL);
    const cookie = await cookieManager.fetchCookie({ proxy: false });
    await DropPoint.initialize();
    await crawlXMLFile(cookie, 0, 2527);
};

run().catch(err => console.log(err));