import DropPoint from "../../type-orm.config";
import CookieManager from "../../utils/cookie/CookieManager";
import { crawlXMLFileFromFile } from "./crawler/crawlerToDB";
import path from 'path';

const BASE_URL = 'https://www.booking.com/';

const run = async () => {
    const cookieManager = new CookieManager(BASE_URL);
    const cookie = await cookieManager.fetchCookie({ proxy: false });
    await DropPoint.initialize();
    await crawlXMLFileFromFile(cookie, path.join(__dirname, 'crawler', 'sitemaps', 'sitemapsRO.txt'));
};

run().catch(err => console.log(err));