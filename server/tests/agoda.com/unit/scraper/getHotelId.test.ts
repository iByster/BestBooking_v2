import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { describe } from 'mocha';
import { getHotelId } from '../../../../src/scripts/agoda.com/scraper/scraper';
import delay from '../../../../src/utils/scrape/delay';
chai.use(chaiAsPromised);

declare global {
    interface Window {
      initParams: any;
    }
  }

describe('agoda.com getHotelId', function () {
    before(function() {
        this.hotelUrl1 = 'https://www.agoda.com/en-gb/hotel-alpen-residence/hotel/ehrwald-at.html';
        this.hotelUrl2 = 'https://www.agoda.com/en-gb/hotel-dann-carlton-medellin/hotel/medellin-co.html';
        this.hotelUrl3 = 'https://www.agoda.com/en-gb/drury-plaza-st-louis-at-the-arch/hotel/st-louis-mo-us.html';
        this.hotelUrl4 = 'https://www.agoda.com/en-gb/cafe-brasserie-het-heerenhuis/hotel/het-kalf-nl.html';
        this.hotelUrl5 = 'https://www.agoda.com/en-gb/harris-hotel-sentraland/hotel/semarang-id.html';
        this.hotelUrl6 = 'https://www.agoda.com/en-gb/coral-cove-beach-resort-h31479548/hotel/varkala-in.html';
        this.hotelUrl7 = 'https://www.agoda.com/en-gb/unexisting-hotel/hotel/varkala-in.html';
    })

    it('should return hotel id for first hotel url', async function() {
        const hotelId = await getHotelId(this.hotelUrl1);
        await delay(2000);
        expect(hotelId).to.be.eq(128492);
    });

    it('should return hotel id for second hotel url', async function() {
        const hotelId = await getHotelId(this.hotelUrl2);
        await delay(2000);
        expect(hotelId).to.be.eq(17);
    });

    it('should return hotel id for third hotel url', async function() {
        const hotelId = await getHotelId(this.hotelUrl3);
        await delay(2000);
        expect(hotelId).to.be.eq(538354);
    });

    it('should return hotel id for fourth hotel url', async function() {
        const hotelId = await getHotelId(this.hotelUrl4);
        await delay(2000);
        expect(hotelId).to.be.eq(807397);
    });

    it('should return hotel id for fifth hotel url', async function() {
        const hotelId = await getHotelId(this.hotelUrl5);
        await delay(2000);
        expect(hotelId).to.be.eq(2690923);
    });

    it('should return hotel id for sixth hotel url', async function() {
        const hotelId = await getHotelId(this.hotelUrl6);
        await delay(2000);
        expect(hotelId).to.be.eq(31479548);
    });

    it('should not return if hotel url doesn\'t exists', async function() {
        const response = getHotelId(this.hotelUrl7);
        await delay(2000);
        await expect(response).to.be.rejectedWith(/Could not featch hotel id, problem with getHotelId function/)
    });
});
