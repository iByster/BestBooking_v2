import DropPoint from "../../type-orm.config";
import CookieManager from "../../utils/cookie/CookieManager";
import { crawlXMLFileFromFile } from "./crawler/crawlerToDB";

const BASE_URL = 'https://www.agoda.com/';

const run = async () => {
    const cookieManager = new CookieManager(BASE_URL);
    const cookie = await cookieManager.fetchCookie({ proxy: false });
    await DropPoint.initialize();
    await crawlXMLFileFromFile(cookie);
};

run().catch(err => console.log(err));