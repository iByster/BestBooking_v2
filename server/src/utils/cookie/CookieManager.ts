import _ from 'lodash';
import { Browser, Page } from 'puppeteer';
import puppeteerXtra from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { executablePath } from 'puppeteer'
import { Nullable } from '../../types/types';
import { rotateUserAgentWithAPI } from '../header/getRandomUserAgent';
import delay from '../scrape/delay';

puppeteerXtra.use(StealthPlugin());

class CookieManager {
    private cookie: any;
    private browser: Nullable<Browser>;
    private url: string;
    private page: Nullable<Page>;
    // private acceptCookieSelector?: string;

    constructor(url: string) {
        this.cookie = null;
        this.browser = null;
        this.page = null;
        this.url = url
        // this.acceptCookieSelector = acceptCookieSelector;
    }

    // getter
    getCookie() {
        return this.cookie;
    }

    // setter
    setCookie(cookie: any) {
        this.cookie = cookie;
    }

    async fetchCookie() {
        const attemptCount = 3;

        console.log(process.env.STORM_PROXIES_GATEWAY_HOST);

        try {
            this.browser = await puppeteerXtra.launch({
                args: [
                    '--window-size=1920,1080',
                    // `--proxy-server=http://${process.env.STORM_PROXIES_GATEWAY_HOST}:${process.env.STORM_PROXIES_GATEWAY_PORT}`
                ],
                headless: false,
                executablePath: executablePath(),
            });

            this.page = await this.browser.newPage();
            await this.page.setUserAgent(rotateUserAgentWithAPI());

            for (let i = 0; i < attemptCount; i += 1) {
                // Chromium asks the web server for an authorization page
                //and waiting for DOM
                await this.page.goto(this.url, { waitUntil: ['domcontentloaded'] });

                await delay(1000);

                this.setCookie(
                    _.join(
                        _.map(
                            await this.page.cookies(),
                            ({ name, value }) => _.join([name, value], '='),
                        ),
                        '; ',
                    ),
                );

                // when the cookie has been received, break the loop
                if (this.cookie) break;
            }

            return this.getCookie();
        } catch (err) {
            if (typeof err === 'string') throw new Error(err);
            else console.log(err);
        } finally {
            this.page && await this.page.close();
            this.browser && await this.browser.close();
        }
    }
}

export default CookieManager;