import axios from 'axios';
import { isGzFile } from '../utils/files/isGzFile';
import unzipFile from '../utils/files/unzip';
import parseXmlString from '../utils/files/xmlToJson';

class SitemapCrawler {
    // downloads xml fxml file and unzip if is gz compression
    static async fetchXmlFile(xmlUrl: string): Promise<string> {
        const { data } = await axios({
            url: xmlUrl,
            method: 'GET',
            responseType: 'arraybuffer',
            headers: { "Accept-Encoding": "gzip" },
        });

        if (isGzFile(xmlUrl)) {
            return unzipFile(data);
        }

        return data;
    }


    // todo maybe try to stream this process
    // converts xml file in json and filter values
    static extractXmlUrlsFromSitemap(xml: string, include: string): string[] {
        const urls: string[] = [];
        const jsonXml = parseXmlString(xml);

        jsonXml.sitemapindex.sitemap.forEach((sm: any) => {
            if (sm.loc._text.includes(include))
            urls.push(sm.loc._text)
        });

        return urls;
    }

}

export default SitemapCrawler;