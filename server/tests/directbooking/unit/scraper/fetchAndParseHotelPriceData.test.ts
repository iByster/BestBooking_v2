import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { describe } from 'mocha';
import { fetchHotelPrices, parsePriceData } from '../../../../src/scripts/directbooking.ro/scraper/scraper';
import delay from '../../../../src/utils/scrape/delay';
import getRandomUserInput from '../../../../src/utils/payload/randomUserInput';
import CookieManager from '../../../../src/utils/cookie/CookieManager';
chai.use(chaiAsPromised);

const BASE_URL = 'https://www.directbooking.ro/';

describe('directbooking.ro fetchHotelPrices and parsePriceData', function () {
    let response1: any = null;
    let response2: any = null;
    let response3: any = null;
    let response4: any = null;
    let response5: any = null;
    let response6: any = null;

    before(async function() {
        this.siteHotelId1 = '5936';
        this.siteHotelId2 = '5034289';
        this.siteHotelId3 = '5655';
        this.siteHotelId4 = '5651279';
        this.siteHotelId5 = '4893714';

        this.hotelUrl1 = 'https://www.directbooking.ro/cazare-novotel-brussels-centre-bruxelles-oferta-rezervare-sejur-5936.aspx';
        this.hotelUrl2 = 'https://www.directbooking.ro/cazare-apartment-tamarinier-complexe-flic-en-flac-oferta-rezervare-sejur-5034289.aspx';
        this.hotelUrl3 = 'https://www.directbooking.ro/cazare-nieuw-slotania-amsterdam-oferta-rezervare-sejur-5655.aspx';
        this.hotelUrl4 = 'https://www.directbooking.ro/cazare-travelodge-londra-oferta-rezervare-sejur-5651279.aspx';
        this.hotelUrl5 = 'https://www.directbooking.ro/cazare-bright-1-bedroom-flat-near-finsbury-park-londra-oferta-rezervare-sejur-4893714.aspx';

        this.siteHotelId6 = '-1'
        this.hotelUrl6 = 'https://www.directbooking.ro/macacmoale.aspx'

        this.userInput1 = getRandomUserInput({
            numberOfAdultsRange: {
                min: 2,
                max: 2,
            },
            withChildren: false,
        });
        this.userInput2 = getRandomUserInput({
            withChildren: true,
            numberOfAdultsRange: {
                min: 2,
                max: 2,
            },
        });

        const cookieManager = new CookieManager(BASE_URL);
        this.cookie = await cookieManager.fetchCookie({ proxy: false });
    })

    context('fetchHotelPrices', function() {
        it('should successfully fetch price data for siteHotelId1 with userInput1', async function() {
            response1 = await fetchHotelPrices(this.siteHotelId1, this.userInput1, this.cookie);
            await delay(1000);
            expect(response1).to.be.not.null;
        });

        it('should successfully fetch price data for siteHotelId2 with userInput2', async function() {
            response2 = await fetchHotelPrices(this.siteHotelId2, this.userInput2, this.cookie);
            await delay(1000);
            expect(response2).to.be.not.null;
        });

        it('should successfully fetch price data for siteHotelId3 with userInput1', async function() {
            response3 = await fetchHotelPrices(this.siteHotelId3, this.userInput1, this.cookie);
            await delay(1000);
            expect(response3).to.be.not.null;
        });

        it('should successfully fetch price data for siteHotelId4 with userInput2', async function() {
            response4 = await fetchHotelPrices(this.siteHotelId4, this.userInput2, this.cookie);
            await delay(1000);
            expect(response4).to.be.not.null;
        });

        it('should successfully fetch price data for siteHotelId5 with userInput1', async function() {
            response5 = await fetchHotelPrices(this.siteHotelId5, this.userInput1, this.cookie);
            await delay(1000);
            expect(response5).to.be.not.null;
        });

        it('should successfully fetch price data for siteHotelId6 with userInput2', async function() {
            response6 = await fetchHotelPrices(this.siteHotelId6, this.userInput2, this.cookie);
            await delay(1000);
            expect(response6).to.contain('alert-error');
        });
    });

    context('parsePriceData', function() {
        it('should successfully parse hotel prices data for response1', async function() {
            const parsedData = parsePriceData(response1, this.userInput1, this.siteHotelId1);
            const { hotelPricesData } = parsedData;

            if (response1.includes('alert-error')) {
                expect(hotelPricesData).to.be.an('array').that.is.empty;
            } else {
                expect(hotelPricesData).to.be.an('array').that.is.not.empty;
                expect(hotelPricesData[0].hotelId).to.be.eq(this.siteHotelId1);
                expect(hotelPricesData[0].currency).to.be.eq('EUR');
                expect(hotelPricesData[0].serviceFee).to.be.null;
                expect(hotelPricesData[0].taxes).to.be.null;
                expect(hotelPricesData[0].cleaningFee).to.be.null;
                expect(hotelPricesData[0].pricePerNight).to.be.not.null;
                expect(hotelPricesData[0].pricePerRoom).to.be.not.null;
                expect(hotelPricesData[0].description).to.be.not.null;
            }
        });

        it('should successfully parse hotel prices data for response2', async function() {
            const parsedData = parsePriceData(response2, this.userInput2, this.siteHotelId2);
            const { hotelPricesData } = parsedData;
            
            if (response2.includes('alert-error')) {
                expect(hotelPricesData).to.be.an('array').that.is.empty;
            } else {
                expect(hotelPricesData).to.be.an('array').that.is.not.empty;
                expect(hotelPricesData[0].hotelId).to.be.eq(this.siteHotelId2);
                expect(hotelPricesData[0].currency).to.be.eq('EUR');
                expect(hotelPricesData[0].serviceFee).to.be.null;
                expect(hotelPricesData[0].taxes).to.be.null;
                expect(hotelPricesData[0].cleaningFee).to.be.null;
                expect(hotelPricesData[0].pricePerNight).to.be.not.null;
                expect(hotelPricesData[0].pricePerRoom).to.be.not.null;
                expect(hotelPricesData[0].description).to.be.not.null;
            }
        });

        it('should successfully parse hotel prices data for response3', async function() {
            const parsedData = parsePriceData(response3, this.userInput1, this.siteHotelId3);
            const { hotelPricesData } = parsedData;
            
            if (response3.includes('alert-error')) {
                expect(hotelPricesData).to.be.an('array').that.is.empty;
            } else {
                expect(hotelPricesData).to.be.an('array').that.is.not.empty;
                expect(hotelPricesData[0].hotelId).to.be.eq(this.siteHotelId3);
                expect(hotelPricesData[0].currency).to.be.eq('EUR');
                expect(hotelPricesData[0].serviceFee).to.be.null;
                expect(hotelPricesData[0].taxes).to.be.null;
                expect(hotelPricesData[0].cleaningFee).to.be.null;
                expect(hotelPricesData[0].pricePerNight).to.be.not.null;
                expect(hotelPricesData[0].pricePerRoom).to.be.not.null;
                expect(hotelPricesData[0].description).to.be.not.null;
            }
        });

        it('should successfully parse hotel prices data for response4', async function() {
            const parsedData = parsePriceData(response4, this.userInput2, this.siteHotelId4);
            const { hotelPricesData } = parsedData;

            if (response4.includes('alert-error')) {
                expect(hotelPricesData).to.be.an('array').that.is.empty;
            } else {
                expect(hotelPricesData).to.be.an('array').that.is.not.empty;
                expect(hotelPricesData[0].hotelId).to.be.eq(this.siteHotelId4);
                expect(hotelPricesData[0].currency).to.be.eq('EUR');
                expect(hotelPricesData[0].serviceFee).to.be.null;
                expect(hotelPricesData[0].taxes).to.be.null;
                expect(hotelPricesData[0].cleaningFee).to.be.null;
                expect(hotelPricesData[0].pricePerNight).to.be.not.null;
                expect(hotelPricesData[0].pricePerRoom).to.be.not.null;
                expect(hotelPricesData[0].description).to.be.not.null;
            }
        });

        it('should successfully parse hotel prices data for response5', async function() {
            const parsedData = parsePriceData(response5, this.userInput1, this.siteHotelId5);
            const { hotelPricesData } = parsedData;
            
            if (response5.includes('alert-error')) {
                expect(hotelPricesData).to.be.an('array').that.is.empty;
            } else {
                expect(hotelPricesData).to.be.an('array').that.is.not.empty;
                expect(hotelPricesData[0].hotelId).to.be.eq(this.siteHotelId5);
                expect(hotelPricesData[0].currency).to.be.eq('EUR');
                expect(hotelPricesData[0].serviceFee).to.be.null;
                expect(hotelPricesData[0].taxes).to.be.null;
                expect(hotelPricesData[0].cleaningFee).to.be.null;
                expect(hotelPricesData[0].pricePerNight).to.be.not.null;
                expect(hotelPricesData[0].pricePerRoom).to.be.not.null;
                expect(hotelPricesData[0].description).to.be.not.null;
            }
        });

        it('should successfully parse hotel prices data for response6', async function() {
            const parsedData = parsePriceData(response6, this.userInput2, this.siteHotelId6);
            const { hotelPricesData } = parsedData;

            expect(hotelPricesData).to.be.an('array').that.is.empty;

        });
    });
});
