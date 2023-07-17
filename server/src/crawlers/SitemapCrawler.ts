import axios from 'axios';
import { isGzFile } from '../utils/files/isGzFile';
import unzipFile from '../utils/files/unzip';
import parseXmlString from '../utils/files/xmlToJson';

class SitemapCrawler {
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