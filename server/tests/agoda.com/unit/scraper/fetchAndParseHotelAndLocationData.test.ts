import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { describe } from 'mocha';
import { fetchHotelAndLocationData, parseHotelAndLocationData } from '../../../../src/scripts/agoda.com/scraper/scraper';
import CookieManager from '../../../../src/utils/cookie/CookieManager';
import getRandomUserInput from '../../../../src/utils/payload/randomUserInput';
import delay from '../../../../src/utils/scrape/delay';
chai.use(chaiAsPromised);

declare global {
    interface Window {
      initParams: any;
    }
}

const BASE_URL = 'https://www.agoda.com/';

describe('agoda.com fetchHotelAndLocationData and parseHotelAndLocationData', function () {
    let response1: any = null;
    let response2: any = null;
    let response3: any = null;
    let response4: any = null;
    let response5: any = null;
    let response6: any = null;

    before(async function() {
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
            numberOfAdultsRange: { min: 2, max: 3 },
            numberOfRoomsRange: { min: 1, max: 1},
        });

        this.userInput2 = getRandomUserInput({
            withChildren: false,
            numberOfAdultsRange: { min: 2, max: 3 },
            numberOfRoomsRange: { min: 1, max: 1},
        });

        const cookieManager = new CookieManager(BASE_URL);
        this.cookie = await cookieManager.fetchCookie({ proxy: false });
    })

    context('fetchHotelAndLocationData', function() {
        it('should successfully fetch hotel and location data for siteHotelId1', async function() {
            response1 = await fetchHotelAndLocationData(this.siteHotelId1, this.userInput1, this.cookie);
            await delay(1000);
            expect(response1).to.be.not.null;
        });

        it('should successfully fetch hotel and location data for siteHotelId2', async function() {
            response2 = await fetchHotelAndLocationData(this.siteHotelId2, this.userInput2, this.cookie);
            await delay(1000);
            expect(response2).to.be.not.null;
        });

        it('should successfully fetch hotel and location data for siteHotelId3', async function() {
            response3 = await fetchHotelAndLocationData(this.siteHotelId3, this.userInput1, this.cookie);
            await delay(1000);
            expect(response3).to.be.not.null;
        });

        it('should successfully fetch hotel and location data for siteHotelId4', async function() {
            response4 = await fetchHotelAndLocationData(this.siteHotelId4, this.userInput2, this.cookie);
            await delay(1000);
            expect(response4).to.be.not.null;
        });

        it('should successfully fetch hotel and location data for siteHotelId5', async function() {
            response5 = await fetchHotelAndLocationData(this.siteHotelId5, this.userInput1, this.cookie);
            await delay(1000);
            expect(response5).to.be.not.null;
        });

        it('should successfully fetch hotel and location data for siteHotelId6', async function() {
            response6 = await fetchHotelAndLocationData(this.siteHotelId6, this.userInput1, this.cookie);
            await delay(1000);
            expect(response6).to.be.not.null;
        });
    });

    context('parseHotelAndLocationData', function() {
        it('should successfully parse hotel and location data for siteHotelId1', async function() {
            const parsedData = parseHotelAndLocationData(this.siteHotelId1, this.hotelUrl1, response1);
            const { hotelData, locationData } = parsedData;

            expect(hotelData.hotelName).to.be.eq('Hotel Alpen Residence');
            expect(hotelData.siteOrigin).to.be.eq('https://www.agoda.com'); 
            expect(hotelData.siteHotelId).to.be.eq('128492');
            expect(hotelData.description).to.be.eq('Conveniently situated in the Ehrwald part of Ehrwald, this property puts you close to attractions and interesting dining options. This 4-star property is packed with in-house facilities to improve the quality and joy of your stay.');
            expect(hotelData.rating?.score).to.be.eq(9.2);
            expect(hotelData.rating?.maxScore).to.be.eq(10);
            expect(hotelData.reviews).to.be.eq(317);
            expect(hotelData.link).to.be.eq(this.hotelUrl1);
            expect(hotelData.imageLink).to.be.eq('//q-xx.bstatic.com/xdata/images/hotel/840x460/294903170.jpg?k=8a46087430fa27c8c3e4e0edfaef0ebe48a0944991c2b0347f07ab989296f356&o=');
            expect(hotelData.balcony).to.be.eq(false);
            expect(hotelData.freeParking).to.be.eq(true);
            expect(hotelData.kitchen).to.be.eq(false);
            expect(hotelData.bayView).to.be.eq(false);
            expect(hotelData.mountainView).to.be.eq(false);
            expect(hotelData.washer).to.be.eq(false);
            expect(hotelData.wifi).to.be.eq(true);
            expect(hotelData.bathroom).to.be.eq(false);
            expect(hotelData.coffeMachine).to.be.eq(false);
            expect(hotelData.airConditioning).to.be.eq(true);

            expect(locationData.hotelId).to.be.eq(hotelData.id);
            expect(locationData.locationName).to.be.eq('Ehrwald');
            expect(locationData.lat).to.be.eq(47.39609146118164);
            expect(locationData.lon).to.be.eq(10.919960021972656);
            expect(locationData.address).to.be.eq('Florentin-Wehner-Weg 37');
            expect(locationData.area).to.be.eq('Ehrwald');
            expect(locationData.country).to.be.eq('Austria');
            expect(locationData.region).to.be.eq(null);
        });

        it('should successfully parse hotel and location data for siteHotelId2', async function() {
            const parsedData = parseHotelAndLocationData(this.siteHotelId2, this.hotelUrl2, response2);
            const { hotelData, locationData } = parsedData;

            expect(hotelData.hotelName).to.be.eq('Hotel Dann Carlton Medellin');
            expect(hotelData.siteOrigin).to.be.eq('https://www.agoda.com'); 
            expect(hotelData.siteHotelId).to.be.eq('17');
            expect(hotelData.description).to.be.eq('Conveniently situated in the El Poblado part of Medellín, this property puts you close to attractions and interesting dining options. This 5-star property is packed with in-house facilities to improve the quality and joy of your stay.');
            expect(hotelData.rating?.score).to.be.eq(8.7);
            expect(hotelData.rating?.maxScore).to.be.eq(10);
            expect(hotelData.reviews).to.be.greaterThanOrEqual(8322);
            expect(hotelData.link).to.be.eq(this.hotelUrl2);
            expect(hotelData.imageLink).to.include('agoda.net/hotelImages/17/17/17_16051513410042341853.jpg?ca=6&ce=1&s=1024x768');
            expect(hotelData.balcony).to.be.eq(false);
            expect(hotelData.freeParking).to.be.eq(true);
            expect(hotelData.kitchen).to.be.eq(false);
            expect(hotelData.bayView).to.be.eq(false);
            expect(hotelData.mountainView).to.be.eq(false);
            expect(hotelData.washer).to.be.eq(false);
            expect(hotelData.wifi).to.be.eq(true);
            expect(hotelData.bathroom).to.be.eq(false);
            expect(hotelData.coffeMachine).to.be.eq(false);
            expect(hotelData.airConditioning).to.be.eq(true);

            expect(locationData.hotelId).to.be.eq(hotelData.id);
            expect(locationData.locationName).to.be.eq('Medellín');
            expect(locationData.lat).to.be.eq(6.207240104675293);
            expect(locationData.lon).to.be.eq(-75.57105255126953);
            expect(locationData.address).to.be.eq('Cra 43A No. 7-50');
            expect(locationData.area).to.be.eq('El Poblado');
            expect(locationData.country).to.be.eq('Colombia');
            expect(locationData.region).to.be.eq(null);
        });

        it('should successfully parse hotel and location data for siteHotelId3', async function() {
            const parsedData = parseHotelAndLocationData(this.siteHotelId3, this.hotelUrl3, response3);
            const { hotelData, locationData } = parsedData;

            expect(hotelData.hotelName).to.be.eq('Drury Plaza St Louis at the Arch');
            expect(hotelData.siteOrigin).to.be.eq('https://www.agoda.com'); 
            expect(hotelData.siteHotelId).to.be.eq('538354');
            expect(hotelData.description).to.be.eq("Get your trip off to a great start with a stay at this property, which offers free Wi-Fi in all rooms. Conveniently situated in the Saint Louis Downtown part of St. Louis (MO), this property puts you close to attractions and interesting dining options. Don't leave before paying a visit to the famous The Gateway Arch.  Rated with 3 stars, this high-quality property provides guests with access to restaurant, hot tub and fitness center on-site.");
            expect(hotelData.rating?.score).to.be.eq(9.4);
            expect(hotelData.rating?.maxScore).to.be.eq(10);
            expect(hotelData.reviews).to.be.greaterThanOrEqual(164);
            expect(hotelData.link).to.be.eq(this.hotelUrl3);
            expect(hotelData.imageLink).to.include('agoda.net/hotelImages/538354/0/be7125d9020d17bb9ec6200139a4fb09.jpg?ca=0&ce=1&s=1024x768');
            expect(hotelData.balcony).to.be.eq(false);
            expect(hotelData.freeParking).to.be.eq(true);
            expect(hotelData.kitchen).to.be.eq(false);
            expect(hotelData.bayView).to.be.eq(false);
            expect(hotelData.mountainView).to.be.eq(false);
            expect(hotelData.washer).to.be.eq(false);
            expect(hotelData.wifi).to.be.eq(true);
            expect(hotelData.bathroom).to.be.eq(false);
            expect(hotelData.coffeMachine).to.be.eq(false);
            expect(hotelData.airConditioning).to.be.eq(false);

            expect(locationData.hotelId).to.be.eq(hotelData.id);
            expect(locationData.locationName).to.be.eq('St. Louis (MO)');
            expect(locationData.lat).to.be.eq(38.62501525878906);
            expect(locationData.lon).to.be.eq(-90.1886215209961);
            expect(locationData.address).to.be.eq('2 South 4th St');
            expect(locationData.area).to.be.eq('Saint Louis Downtown');
            expect(locationData.country).to.be.eq('United States');
            expect(locationData.region).to.be.eq(null);
        });

        it('should successfully parse hotel and location data for siteHotelId4', async function() {
            const parsedData = parseHotelAndLocationData(this.siteHotelId4, this.hotelUrl4, response4);
            const { hotelData, locationData } = parsedData;

            expect(hotelData.hotelName).to.be.eq('Cafe Brasserie Het Heerenhuis');
            expect(hotelData.siteOrigin).to.be.eq('https://www.agoda.com'); 
            expect(hotelData.siteHotelId).to.be.eq('807397');
            expect(hotelData.description).to.be.eq("Conveniently situated in the Het Kalf part of Het Kalf, this property puts you close to attractions and interesting dining options.");
            expect(hotelData.rating?.score).to.be.eq(10);
            expect(hotelData.rating?.maxScore).to.be.eq(10);
            expect(hotelData.reviews).to.be.eq(1);
            expect(hotelData.link).to.be.eq(this.hotelUrl4);
            expect(hotelData.imageLink).to.include('//q-xx.bstatic.com/xdata/images/hotel/840x460/420996860.jpg?k=4886a0f7b1a3060f10c5fe51808a30fde584b623a93f33fdd4d88e7a9e0c8d78&o=');
            expect(hotelData.balcony).to.be.eq(false);
            expect(hotelData.freeParking).to.be.eq(true);
            expect(hotelData.kitchen).to.be.eq(true);
            expect(hotelData.bayView).to.be.eq(false);
            expect(hotelData.mountainView).to.be.eq(false);
            expect(hotelData.washer).to.be.eq(false);
            expect(hotelData.wifi).to.be.eq(false);
            expect(hotelData.bathroom).to.be.eq(false);
            expect(hotelData.coffeMachine).to.be.eq(false);
            expect(hotelData.airConditioning).to.be.eq(false);

            expect(locationData.hotelId).to.be.eq(hotelData.id);
            expect(locationData.locationName).to.be.eq('Het Kalf');
            expect(locationData.lat).to.be.eq(52.472049713134766);
            expect(locationData.lon).to.be.eq(4.843259811401367);
            expect(locationData.address).to.be.eq('Zuiderweg 74');
            expect(locationData.area).to.be.eq('Het Kalf');
            expect(locationData.country).to.be.eq('Netherlands');
            expect(locationData.region).to.be.eq(null);
        });

        it('should successfully parse hotel and location data for siteHotelId5', async function() {
            const parsedData = parseHotelAndLocationData(this.siteHotelId5, this.hotelUrl5, response5);
            const { hotelData, locationData } = parsedData;

            expect(hotelData.hotelName).to.be.eq('HARRIS Hotel Sentraland');
            expect(hotelData.siteOrigin).to.be.eq('https://www.agoda.com'); 
            expect(hotelData.siteHotelId).to.be.eq('2690923');
            expect(hotelData.description).to.be.eq("In addition to the standard of Indonesia Care, all guests get free Wi-Fi in all rooms and free parking if arriving by car. Strategically situated in Simpang Lima, allowing you access and proximity to local attractions and sights. Don't leave before paying a visit to the famous Lawang Sewu.  Rated with 4 stars, this high-quality property provides guests with access to massage, restaurant and fitness center on-site.");
            expect(hotelData.rating?.score).to.be.eq(8.4);
            expect(hotelData.rating?.maxScore).to.be.eq(10);
            expect(hotelData.reviews).to.be.greaterThanOrEqual(800);
            expect(hotelData.link).to.be.eq(this.hotelUrl5);
            expect(hotelData.imageLink).to.include('agoda.net/hotelImages/2690923/-1/81abfe4d4fc3ea0d41646f4486d10d92.jpg?ca=7&ce=1&s=1024x768');
            expect(hotelData.balcony).to.be.eq(false);
            expect(hotelData.freeParking).to.be.eq(true);
            expect(hotelData.kitchen).to.be.eq(false);
            expect(hotelData.bayView).to.be.eq(false);
            expect(hotelData.mountainView).to.be.eq(false);
            expect(hotelData.washer).to.be.eq(false);
            expect(hotelData.wifi).to.be.eq(true);
            expect(hotelData.bathroom).to.be.eq(false);
            expect(hotelData.coffeMachine).to.be.eq(false);
            expect(hotelData.airConditioning).to.be.eq(true);

            expect(locationData.hotelId).to.be.eq(hotelData.id);
            expect(locationData.locationName).to.be.eq('Semarang');
            expect(locationData.lat).to.be.eq(-6.9920233173245325);
            expect(locationData.lon).to.be.eq(110.42938530452375);
            expect(locationData.address).to.be.eq('Ki Mangunsarkoro St. Number. 36 Semarang, Central Jawa, Indonesia');
            expect(locationData.area).to.be.eq('Simpang Lima');
            expect(locationData.country).to.be.eq('Indonesia');
            expect(locationData.region).to.be.eq(null);
        });

        it('should successfully parse hotel and location data for siteHotelId6', async function() {
            const parsedData = parseHotelAndLocationData('', '', response6);
            const { hotelData, locationData } = parsedData;

            expect(hotelData.hotelName).to.be.eq('');
            expect(hotelData.siteOrigin).to.be.eq('https://www.agoda.com'); 
            expect(hotelData.siteHotelId).to.be.eq('');
            expect(hotelData.description).to.be.eq(undefined);
            expect(hotelData.rating?.score).to.be.eq(undefined);
            expect(hotelData.rating?.maxScore).to.be.eq(undefined);
            expect(hotelData.reviews).to.be.eq(undefined);
            expect(hotelData.link).to.be.eq('');
            expect(hotelData.imageLink).to.be.eq(undefined);
            expect(hotelData.balcony).to.be.eq(false);
            expect(hotelData.freeParking).to.be.eq(false);
            expect(hotelData.kitchen).to.be.eq(false);
            expect(hotelData.bayView).to.be.eq(false);
            expect(hotelData.mountainView).to.be.eq(false);
            expect(hotelData.washer).to.be.eq(false);
            expect(hotelData.wifi).to.be.eq(false);
            expect(hotelData.bathroom).to.be.eq(false);
            expect(hotelData.coffeMachine).to.be.eq(false);
            expect(hotelData.airConditioning).to.be.eq(false);

            expect(locationData.hotelId).to.be.eq(hotelData.id);
            expect(locationData.locationName).to.be.eq(undefined);
            expect(locationData.lat).to.be.eq(undefined);
            expect(locationData.lon).to.be.eq(undefined);
            expect(locationData.address).to.be.eq(undefined);
            expect(locationData.area).to.be.eq(undefined);
            expect(locationData.country).to.be.eq(undefined);
            expect(locationData.region).to.be.eq(null);
        });
    });
});
