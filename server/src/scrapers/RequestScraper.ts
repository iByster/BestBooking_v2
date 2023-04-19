import axios from "axios";
import { ErrorRequestFetch, RequestOptions, RequestScraperOptions } from "../types/types";
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

    private async getCookie(opts: RequestScraperOptions) {
        const cookieManager = new CookieManager(this.siteOrigin);
        const cookie = await cookieManager.fetchCookie({proxy: opts.proxy ? true : false});
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
            headers.cookie = await this.getCookie(opts);
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


    async scrapeHotel(requestOptions: RequestOptions) {
        const { data, status, headers, request } = await axios(requestOptions);

        return {
            data,
            status,
            headers,
            request,
        };
    }

    async scrapeHotelAndBuildReq(requestOptions: RequestScraperOptions) {
        const { apiEndpoint, body, cookie, proxy, method, specificHeaders, includeRotatingHeaders, checkForRedirects } = requestOptions;

        try {
            const requestOptionsForDetails = await this.buildRequestOptions({
                apiEndpoint,
                body,
                cookie,
                proxy,
                method,
                specificHeaders,
                includeRotatingHeaders,
            });
    
            const response = await this.scrapeHotel(requestOptionsForDetails);
            const { data, status } = response;
    

            if (checkForRedirects) {
                if (response.request.res.responseUrl !== apiEndpoint) {
                    throw new Error('Request was redirected to:' + response.request.res.responseUrl);
                }
            }

            if (status >= 400) {
                throw new Error(`Request failed with status code: ` + status);
            }
    
            return data;
        } catch(err) {
            let message;
            if (err instanceof Error) {
                message = err.message;
            } else {
                message = String(err);
            }
    
            throw new ErrorRequestFetch(`fetchError: ${message}`);
        }
    }
}

export default RequestScraper;