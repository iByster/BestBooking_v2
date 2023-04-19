import fs from 'fs';

// TODO
export const scrapeAndFilterXML = (sitemapFilter: string, hotelUrls: any) => {
    const a = hotelUrls
        .filter((h: any) => h.loc._text.includes(sitemapFilter))
        .forEach((h: any) => {
            fs.writeFileSync('./sitemaps.txt', h.loc._text + '\n', {
                flag: 'a',
            });
        });

    return a;
};
