import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { describe } from 'mocha';
import delay from '../../../../src/utils/scrape/delay';
import getRandomUserInput from '../../../../src/utils/payload/randomUserInput';
import CookieManager from '../../../../src/utils/cookie/CookieManager';
import { fetchHotelPrices, parseHotelPrices } from '../../../../src/scripts/esky.ro/scraper/scraper';
chai.use(chaiAsPromised);

declare global {
    interface Window {
        ibeConfig: any;
    }
  }

const BASE_URL = 'https://www.agoda.com/';

describe('agoda.com fetchHotelPrices and parseHotelPrices', function () {
    let response1: any = null;
    let response2: any = null;
    let response3: any = null;
    let response4: any = null;
    let response5: any = null;
    // let response6: any = null;

    before(async function() {
        this.siteHotelId1 = '637409';
        this.siteHotelId2 = '1106498';
        this.siteHotelId3 = '805598';
        this.siteHotelId4 = '414481';
        this.siteHotelId5 = '414293';

        this.metaCode1 = 437306;
        this.metaCode2 = 750327;
        this.metaCode3 = 126273;
        this.metaCode4 = 252864;
        this.metaCode5 = 253065;
        this.metaCode6 = 437306;

        this.cityCode1 = '49977';
        this.cityCode2 = '111937';
        this.cityCode3 = 'CND';
        this.cityCode4 = 'CND';
        this.cityCode5 = '35917';
        this.cityCode6 = 'CND';

        this.hotelUrl1 = 'https://www.esky.ro/hoteluri/ho/637409/costinesti-aproape-de-mare';
        this.hotelUrl2 = 'https://www.esky.ro/hoteluri/ho/1106498/sapanta-vila-perla-sapanteana';
        this.hotelUrl3 = 'https://www.esky.ro/hoteluri/ho/805598/mamaia-phoenicia-holiday-resort';
        this.hotelUrl4 = 'https://www.esky.ro/hoteluri/ho/414481/constanta-hotel-megalos';
        this.hotelUrl5 = 'https://www.esky.ro/hoteluri/ho/414293/baile-herculane-hotel-afrodita';


        this.userInput1 = getRandomUserInput({
            withChildren: false,
        });
        this.userInput2 = getRandomUserInput({
            withChildren: true,
        });

        const cookieManager = new CookieManager(BASE_URL);
        this.cookie = await cookieManager.fetchCookie({ proxy: false });
    })

    context('fetchHotelPrices', function() {
        it('should successfully fetch hotel prices data for siteHotelId1', async function() {
            response1 = await fetchHotelPrices(this.userInput1, this.metaCode1, this.cityCode1, this.cookie);
            await delay(1000);
            expect(response1).to.be.not.null;
        });

        it('should successfully fetch hotel prices data for siteHotelId2', async function() {
            response2 = await fetchHotelPrices(this.userInput2, this.metaCode2, this.cityCode2, this.cookie);
            await delay(1000);
            expect(response2).to.be.not.null;
        });

        it('should successfully fetch hotel prices data for siteHotelId3', async function() {
            response3 = await fetchHotelPrices(this.userInput1, this.metaCode3, this.cityCode3, this.cookie);
            await delay(1000);
            expect(response3).to.be.not.null;
        });

        it('should successfully fetch hotel prices data for siteHotelId4', async function() {
            response4 = await fetchHotelPrices(this.userInput2, this.metaCode4, this.cityCode4, this.cookie);
            await delay(1000);
            expect(response4).to.be.not.null;
        });

        it('should successfully fetch hotel prices data for siteHotelId5', async function() {
            response5 = await fetchHotelPrices(this.userInput1, this.metaCode5, this.cityCode5, this.cookie);
            await delay(1000);
            expect(response5).to.be.not.null;
        });

        // it('should successfully fetch hotel prices data for siteHotelId6', async function() {
        //     response6 = fetchHotelPrices(this.userInput2, this.metaCode6, this.cityCode6, this.cookie);
        //     await delay(1000);
        //     await expect(response6).to.be.rejectedWith(/Request failed with status code 502/);
        // });
    });

    context('parseHotelPrices', function() {
        it('should successfully parse hotel prices data for siteHotelId1', async function() {
            const parsedData = parseHotelPrices(response1, this.userInput1, this.siteHotelId1);

            let totalNumberOfOffers = 0;
            const variants = response1?.data?.hotelVariants?.variants;;

            if (variants && variants.length > 0) {
                variants.forEach((mr: any) => {
                    const hotelVariantRooms = mr?.rooms;
                    hotelVariantRooms.forEach(() => {
                        totalNumberOfOffers += 1;
                    })
                })
                expect(parsedData).to.be.an('array').that.has.lengthOf(totalNumberOfOffers);
                expect(parsedData[0].hotelId).to.be.eq(this.siteHotelId1);
                expect(parsedData[0].currency).to.be.eq('EUR');
                expect(parsedData[0].serviceFee).to.be.null;
                expect(parsedData[0].taxes).to.be.null;
                expect(parsedData[0].cleaningFee).to.be.null;
                expect(parsedData[0].pricePerNight).to.be.not.null;
                expect(parsedData[0].pricePerRoom).to.be.not.null;
                expect(parsedData[0].description).to.be.not.null;
            } else {
                expect(parsedData).to.be.an('array').that.is.empty;
            }
        });

        it('should successfully parse hotel prices data for siteHotelId2', async function() {
            const parsedData = parseHotelPrices(response2, this.userInput2, this.siteHotelId2);

            let totalNumberOfOffers = 0;
            const variants = response2?.data?.hotelVariants?.variants;;

            if (variants && variants.length > 0) {
                variants.forEach((mr: any) => {
                    const hotelVariantRooms = mr?.rooms;
                    hotelVariantRooms.forEach(() => {
                        totalNumberOfOffers += 1;
                    })
                })
                expect(parsedData).to.be.an('array').that.has.lengthOf(totalNumberOfOffers);
                expect(parsedData[0].hotelId).to.be.eq(this.siteHotelId2);
                expect(parsedData[0].currency).to.be.eq('EUR');
                expect(parsedData[0].serviceFee).to.be.null;
                expect(parsedData[0].taxes).to.be.null;
                expect(parsedData[0].cleaningFee).to.be.null;
                expect(parsedData[0].pricePerNight).to.be.not.null;
                expect(parsedData[0].pricePerRoom).to.be.not.null;
                expect(parsedData[0].description).to.be.not.null;
            } else {
                expect(parsedData).to.be.an('array').that.is.empty;
            }
        });

        it('should successfully parse hotel prices data for siteHotelId3', async function() {
            const parsedData = parseHotelPrices(response3, this.userInput1, this.siteHotelId3);

            let totalNumberOfOffers = 0;
            const variants = response3?.data?.hotelVariants?.variants;;

            if (variants && variants.length > 0) {
                variants.forEach((mr: any) => {
                    const hotelVariantRooms = mr?.rooms;
                    hotelVariantRooms.forEach(() => {
                        totalNumberOfOffers += 1;
                    })
                })
                expect(parsedData).to.be.an('array').that.has.lengthOf(totalNumberOfOffers);
                expect(parsedData[0].hotelId).to.be.eq(this.siteHotelId3);
                expect(parsedData[0].currency).to.be.eq('EUR');
                expect(parsedData[0].serviceFee).to.be.null;
                expect(parsedData[0].taxes).to.be.null;
                expect(parsedData[0].cleaningFee).to.be.null;
                expect(parsedData[0].pricePerNight).to.be.not.null;
                expect(parsedData[0].pricePerRoom).to.be.not.null;
                expect(parsedData[0].description).to.be.not.null;
            } else {
                expect(parsedData).to.be.an('array').that.is.empty;
            }
        });

        it('should successfully parse hotel prices data for siteHotelId4', async function() {
            const parsedData = parseHotelPrices(response4, this.userInput2, this.siteHotelId4);

            let totalNumberOfOffers = 0;
            const variants = response4?.data?.hotelVariants?.variants;;

            if (variants && variants.length > 0) {
                variants.forEach((mr: any) => {
                    const hotelVariantRooms = mr?.rooms;
                    hotelVariantRooms.forEach(() => {
                        totalNumberOfOffers += 1;
                    })
                })
                expect(parsedData).to.be.an('array').that.has.lengthOf(totalNumberOfOffers);
                expect(parsedData[0].hotelId).to.be.eq(this.siteHotelId4);
                expect(parsedData[0].currency).to.be.eq('EUR');
                expect(parsedData[0].serviceFee).to.be.null;
                expect(parsedData[0].taxes).to.be.null;
                expect(parsedData[0].cleaningFee).to.be.null;
                expect(parsedData[0].pricePerNight).to.be.not.null;
                expect(parsedData[0].pricePerRoom).to.be.not.null;
                expect(parsedData[0].description).to.be.not.null;
            } else {
                expect(parsedData).to.be.an('array').that.is.empty;
            }
        });

        it('should successfully parse hotel prices data for siteHotelId5', async function() {
            const parsedData = parseHotelPrices(response5, this.userInput1, this.siteHotelId5);

            let totalNumberOfOffers = 0;
            const variants = response5?.data?.hotelVariants?.variants;;

            if (variants && variants.length > 0) {
                variants.forEach((mr: any) => {
                    const hotelVariantRooms = mr?.rooms;
                    hotelVariantRooms.forEach(() => {
                        totalNumberOfOffers += 1;
                    })
                })
                expect(parsedData).to.be.an('array').that.has.lengthOf(totalNumberOfOffers);
                expect(parsedData[0].hotelId).to.be.eq(this.siteHotelId5);
                expect(parsedData[0].currency).to.be.eq('EUR');
                expect(parsedData[0].serviceFee).to.be.null;
                expect(parsedData[0].taxes).to.be.null;
                expect(parsedData[0].cleaningFee).to.be.null;
                expect(parsedData[0].pricePerNight).to.be.not.null;
                expect(parsedData[0].pricePerRoom).to.be.not.null;
                expect(parsedData[0].description).to.be.not.null;
            } else {
                expect(parsedData).to.be.an('array').that.is.empty;
            }
        });

        // it('should successfully parse hotel prices data for siteHotelId6', async function() {
        //     const parsedData = parseHotelPrices(response6, this.userInput2, this.siteHotelId6);

        //     expect(parsedData).to.be.an('array').that.is.empty;
        // });
    });
});
