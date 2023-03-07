import axios from "axios";
import { RequestOptions, RequestScraperOptions } from "../types/types";
import CookieManager from "../utils/cookie/CookieManager";
import { rotatePrebuildHeaders } from "../utils/header/getPrebuildBaseHeaders";

class RequestScraper {
    private siteOrigin: string;

    constructor(siteOrigin: string) {
        this.siteOrigin = siteOrigin;
    }

    private getPrebuildHeaders() {
        return rotatePrebuildHeaders();
    }

    private async getCookie() {
        const cookieManager = new CookieManager(this.siteOrigin);
        const cookie = await cookieManager.fetchCookie();
        return cookie;
    }

    private getProxy() {
        const proxy = {
            protocol: 'http',
            host: process.env.STORM_PROXIES_GATEWAY_HOST!,
            port: parseInt(process.env.STORM_PROXIES_GATEWAY_PORT!),
        };

        return proxy;
    }

    async buildRequestOptions(opts: RequestScraperOptions) {
        const requestOptions: RequestOptions = {
            url: opts.apiEndpoint,
            method: opts.method,
        }
        let headers = {
            ...opts.specificHeaders,
        };

        if (opts.includeRotatingHeaders) {
            headers = { ...this.getPrebuildHeaders(), ...headers };
        }

        if (opts.cookie) {
            headers.cookie = await this.getCookie();
        }

        if (opts.proxy) {
            requestOptions.proxy = this.getProxy();
        }

        if (opts.body) {
            requestOptions.data = opts.body;
        }

        requestOptions.headers = headers;
        return requestOptions;
    }


    async scrapeHotel(requestOptions: RequestOptions): Promise<{ data: any, status: number }> {
        const { data, status } = await axios(requestOptions);

        return {
            data,
            status,
        };
    }
}

export default RequestScraper;