import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { describe } from 'mocha';
import { fetchHotelPrices, parseHotelPriceData } from '../../../../src/scripts/agoda.com/scraper/scraper';
import delay from '../../../../src/utils/scrape/delay';
import getRandomUserInput from '../../../../src/utils/payload/randomUserInput';
chai.use(chaiAsPromised);

declare global {
    interface Window {
      initParams: any;
    }
  }


describe('agoda.com fetchHotelPrices and parseHotelPriceData', function () {
    let response1: any = null;
    let response2: any = null;
    let response3: any = null;
    let response4: any = null;
    let response5: any = null;
    let response6: any = null;

    before(function() {
        this.siteHotelId1 = '128492';
        this.siteHotelId2 = '17';
        this.siteHotelId3 = '538354';
        this.siteHotelId4 = '807397';
        this.siteHotelId5 = '2690923';

        this.hotelUrl1 = 'https://www.agoda.com/en-gb/hotel-alpen-residence/hotel/ehrwald-at.html';
        this.hotelUrl2 = 'https://www.agoda.com/en-gb/hotel-dann-carlton-medellin/hotel/medellin-co.html';
        this.hotelUrl3 = 'https://www.agoda.com/en-gb/drury-plaza-st-louis-at-the-arch/hotel/st-louis-mo-us.html';
        this.hotelUrl4 = 'https://www.agoda.com/en-gb/cafe-brasserie-het-heerenhuis/hotel/het-kalf-nl.html';
        this.hotelUrl5 = 'https://www.agoda.com/en-gb/harris-hotel-sentraland/hotel/semarang-id.html';

        this.siteHotelId6 = '-1'

        this.userInput1 = getRandomUserInput({
            withChildren: false,
        });
        this.userInput2 = getRandomUserInput({
            withChildren: true,
        });
    })

    context('fetchHotelPrices', function() {
        it('should successfully fetch hotel prices data for siteHotelId1', async function() {
            response1 = await fetchHotelPrices(this.siteHotelId1, this.userInput1);
            await delay(1000);
            expect(response1).to.be.not.null;
        });

        it('should successfully fetch hotel prices data for siteHotelId2', async function() {
            response2 = await fetchHotelPrices(this.siteHotelId2, this.userInput2);
            await delay(1000);
            expect(response2).to.be.not.null;
        });

        it('should successfully fetch hotel prices data for siteHotelId3', async function() {
            response3 = await fetchHotelPrices(this.siteHotelId3, this.userInput1);
            await delay(1000);
            expect(response3).to.be.not.null;
        });

        it('should successfully fetch hotel prices data for siteHotelId4', async function() {
            response4 = await fetchHotelPrices(this.siteHotelId4, this.userInput2);
            await delay(1000);
            expect(response4).to.be.not.null;
        });

        it('should successfully fetch hotel prices data for siteHotelId5', async function() {
            response5 = await fetchHotelPrices(this.siteHotelId5, this.userInput1);
            await delay(1000);
            expect(response5).to.be.not.null;
        });

        it('should successfully fetch hotel prices data for siteHotelId6', async function() {
            response6 = fetchHotelPrices(this.siteHotelId6, this.userInput1);
            await delay(1000);
            await expect(response6).to.be.rejectedWith(/Request failed with status code 502/);
        });
    });

    context('parseHotelPriceData', function() {
        it('should successfully parse hotel prices data for siteHotelId1', async function() {
            const parsedData = parseHotelPriceData(response1, this.userInput1, this.siteHotelId1);

            let totalNumberOfOffers = 0;
            const masterRooms = response1?.roomGridData?.masterRooms;

            if (masterRooms && masterRooms.length > 0) {
                masterRooms.forEach((mr: any) => {
                    totalNumberOfOffers += mr.rooms.length;
                })
                expect(parsedData).to.be.an('array').that.has.lengthOf(totalNumberOfOffers);
                expect(parsedData[0].hotelId).to.be.eq(this.siteHotelId1);
                expect(parsedData[0].currency).to.be.eq('EUR');
                expect(parsedData[0].serviceFee).to.be.null;
                expect(parsedData[0].taxes).to.be.not.null;
                expect(parsedData[0].cleaningFee).to.be.null;
                expect(parsedData[0].pricePerNight).to.be.not.null;
                expect(parsedData[0].pricePerRoom).to.be.not.null;
                expect(parsedData[0].description).to.be.not.null;
            } else {
                expect(parsedData).to.be.an('array').that.is.empty;
            }
        });

        it('should successfully parse hotel prices data for siteHotelId2', async function() {
            const parsedData = parseHotelPriceData(response2, this.userInput2, this.siteHotelId2);

            let totalNumberOfOffers = 0;
            const masterRooms = response2?.roomGridData?.masterRooms;

            if (masterRooms && masterRooms.length > 0) {
                masterRooms.forEach((mr: any) => {
                    totalNumberOfOffers += mr.rooms.length;
                })
                expect(parsedData).to.be.an('array').that.has.lengthOf(totalNumberOfOffers);
                expect(parsedData[0].hotelId).to.be.eq(this.siteHotelId2);
                expect(parsedData[0].currency).to.be.eq('EUR');
                expect(parsedData[0].serviceFee).to.be.null;
                expect(parsedData[0].taxes).to.be.not.null;
                expect(parsedData[0].cleaningFee).to.be.null;
                expect(parsedData[0].pricePerNight).to.be.not.null;
                expect(parsedData[0].pricePerRoom).to.be.not.null;
                expect(parsedData[0].description).to.be.not.null;
            } else {
                expect(parsedData).to.be.an('array').that.is.empty;
            }
        });

        it('should successfully parse hotel prices data for siteHotelId3', async function() {
            const parsedData = parseHotelPriceData(response3, this.userInput1, this.siteHotelId3);

            let totalNumberOfOffers = 0;
            const masterRooms = response3?.roomGridData?.masterRooms;

            if (masterRooms && masterRooms.length > 0) {
                masterRooms.forEach((mr: any) => {
                    totalNumberOfOffers += mr.rooms.length;
                })
                expect(parsedData).to.be.an('array').that.has.lengthOf(totalNumberOfOffers);
                expect(parsedData[0].hotelId).to.be.eq(this.siteHotelId3);
                expect(parsedData[0].currency).to.be.eq('EUR');
                expect(parsedData[0].serviceFee).to.be.null;
                expect(parsedData[0].taxes).to.be.not.null;
                expect(parsedData[0].cleaningFee).to.be.null;
                expect(parsedData[0].pricePerNight).to.be.not.null;
                expect(parsedData[0].pricePerRoom).to.be.not.null;
                expect(parsedData[0].description).to.be.not.null;
            } else {
                expect(parsedData).to.be.an('array').that.is.empty;
            }
        });

        it('should successfully parse hotel prices data for siteHotelId4', async function() {
            const parsedData = parseHotelPriceData(response4, this.userInput2, this.siteHotelId4);

            let totalNumberOfOffers = 0;
            const masterRooms = response4?.roomGridData?.masterRooms;

            if (masterRooms && masterRooms.length > 0) {
                masterRooms.forEach((mr: any) => {
                    totalNumberOfOffers += mr.rooms.length;
                })
                expect(parsedData).to.be.an('array').that.has.lengthOf(totalNumberOfOffers);
                expect(parsedData[0].hotelId).to.be.eq(this.siteHotelId4);
                expect(parsedData[0].currency).to.be.eq('EUR');
                expect(parsedData[0].serviceFee).to.be.null;
                expect(parsedData[0].taxes).to.be.not.null;
                expect(parsedData[0].cleaningFee).to.be.null;
                expect(parsedData[0].pricePerNight).to.be.not.null;
                expect(parsedData[0].pricePerRoom).to.be.not.null;
                expect(parsedData[0].description).to.be.not.null;
            } else {
                expect(parsedData).to.be.an('array').that.is.empty;
            }
        });

        it('should successfully parse hotel prices data for siteHotelId5', async function() {
            const parsedData = parseHotelPriceData(response5, this.userInput1, this.siteHotelId5);

            let totalNumberOfOffers = 0;
            const masterRooms = response5?.roomGridData?.masterRooms;

            if (masterRooms && masterRooms.length > 0) {
                masterRooms.forEach((mr: any) => {
                    totalNumberOfOffers += mr.rooms.length;
                })
                expect(parsedData).to.be.an('array').that.has.lengthOf(totalNumberOfOffers);
                expect(parsedData[0].hotelId).to.be.eq(this.siteHotelId5);
                expect(parsedData[0].currency).to.be.eq('EUR');
                expect(parsedData[0].serviceFee).to.be.null;
                expect(parsedData[0].taxes).to.be.not.null;
                expect(parsedData[0].cleaningFee).to.be.null;
                expect(parsedData[0].pricePerNight).to.be.not.null;
                expect(parsedData[0].pricePerRoom).to.be.not.null;
                expect(parsedData[0].description).to.be.not.null;
            } else {
                expect(parsedData).to.be.an('array').that.is.empty;
            }
        });

        it('should successfully parse hotel prices data for siteHotelId6', async function() {
            const parsedData = parseHotelPriceData(response6, this.userInput2, this.siteHotelId6);

            expect(parsedData).to.be.an('array').that.is.empty;
        });
    });
});
