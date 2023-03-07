import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { describe } from 'mocha';
import { getHotelId } from '../../../../src/scripts/booking.com/scraper/scraper';
import delay from '../../../../src/utils/scrape/delay';
chai.use(chaiAsPromised);

declare global {
    interface Window {
        booking: any;
    }
  }

describe('booking.com getHotelId', function () {
    before(function() {
        this.hotelUrl1 = 'https://www.booking.com/hotel/us/idyllic-home-on-cumberland-river-with-boat-dock.en-gb.html';
        this.hotelUrl2 = 'https://www.booking.com/hotel/us/coastal-naples-getaway-about-2-miles-to-beaches.en-gb.html';
        this.hotelUrl3 = 'https://www.booking.com/hotel/us/pet-friendly-sacramento-home-less-than-5-mi-to-dtwn.en-gb.html';
        this.hotelUrl4 = 'https://www.booking.com/hotel/us/lakeside-cabin-with-fire-pit-by-pine-point-park.en-gb.html';
        this.hotelUrl5 = 'https://www.booking.com/hotel/za/manaba-family-holiday-house.en-gb.html';
        this.hotelUrl6 = 'https://www.booking.com/hotel/za/the-view-summer-beach-villa-by-grand-property-sa-cape-town.en-gb.html';
        this.hotelUrl7 = 'https://www.booking.com/hotel/za/nonexistingurl.html';
    })

    it('should return hotel id for first hotel url', async function() {
        const hotelId = await getHotelId(this.hotelUrl1);
        delay(2000);
        expect(hotelId).to.be.eq('7723912');
    });

    it('should return hotel id for second hotel url', async function() {
        const hotelId = await getHotelId(this.hotelUrl2);
        delay(2000);
        expect(hotelId).to.be.eq('8156710');
    });

    it('should return hotel id for third hotel url', async function() {
        const hotelId = await getHotelId(this.hotelUrl3);
        delay(2000);
        expect(hotelId).to.be.eq('9261924');
    });

    it('should return hotel id for fourth hotel url', async function() {
        const hotelId = await getHotelId(this.hotelUrl4);
        delay(2000);
        expect(hotelId).to.be.eq('7288110');
    });

    it('should return hotel id for fifth hotel url', async function() {
        const hotelId = await getHotelId(this.hotelUrl5);
        delay(2000);
        expect(hotelId).to.be.eq('9032347');
    });

    it('should return hotel id for sixth hotel url', async function() {
        const hotelId = await getHotelId(this.hotelUrl6);
        delay(2000);
        expect(hotelId).to.be.eq('9048177');
    });

    it('should not return if hotel url doesn\'t exists', async function() {
        const response = getHotelId(this.hotelUrl7);
        delay(2000);
        await expect(response).to.be.rejectedWith(/Could not featch hotel id, problem with getHotelId function: Request failed with status code 404/)
    });
});
