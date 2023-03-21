import SitemapCrawler from "../../crawlers/SitemapCrawler";
import parseXmlString from "../files/xmlToJson";

export const findHotelInXML = async (sitemapURL: string, sitemapFilter: string, hotelUrl: string) => {
    const sitemap = await SitemapCrawler.fetchXmlFile(sitemapURL);
    // filter sitemap
    const hotelSitemapUrls = SitemapCrawler.extractXmlUrlsFromSitemap(sitemap, sitemapFilter);

    for (let i = 0; i < hotelSitemapUrls.length; ++i) {
        const hotelSitemap = hotelSitemapUrls[i];

        // download and parse
        const hotelSitemapXml = await SitemapCrawler.fetchXmlFile(hotelSitemap);
        const hotelSitemapJson = parseXmlString(hotelSitemapXml);

        let { urlset: { url: hotelUrls } } = hotelSitemapJson;

        const hotelIndex = hotelUrls.findIndex((url: any) => url.loc._text === hotelUrl); 

        if (hotelIndex !== -1) {
            return {
                hotelsLastIndex: hotelIndex,
                xmlFilesLastIndex: i,
            }
        }
    }

    return null;
}