import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { describe } from 'mocha';
import { fetchData, parseData } from '../../../../src/scripts/booking.com/scraper/scraper';
import getRandomUserInput from '../../../../src/utils/payload/randomUserInput';
import delay from '../../../../src/utils/scrape/delay';
chai.use(chaiAsPromised);
import fs from 'fs';
import CookieManager from '../../../../src/utils/cookie/CookieManager';

declare global {
    interface Window {
      booking: any;
    }
  }

const BASE_URL = 'https://www.booking.com/';

describe('booking.com fetchData and parseData', function () {
    let response1: any = null;
    let response2: any = null;
    let response3: any = null;
    let response4: any = null;
    let response5: any = null;
    let response6: any = null;

    before(async function() {
        this.siteHotelId1 = '7723912';
        this.siteHotelId2 = '8156710';
        this.siteHotelId3 = '9261924';
        this.siteHotelId4 = '7288110';
        this.siteHotelId5 = '9032347';

        this.hotelUrl1 = 'https://www.booking.com/hotel/us/idyllic-home-on-cumberland-river-with-boat-dock.en-gb.html';
        this.hotelUrl2 = 'https://www.booking.com/hotel/us/coastal-naples-getaway-about-2-miles-to-beaches.en-gb.html';
        this.hotelUrl3 = 'https://www.booking.com/hotel/us/pet-friendly-sacramento-home-less-than-5-mi-to-dtwn.en-gb.html';
        this.hotelUrl4 = 'https://www.booking.com/hotel/us/lakeside-cabin-with-fire-pit-by-pine-point-park.en-gb.html';
        this.hotelUrl5 = 'https://www.booking.com/hotel/za/manaba-family-holiday-house.en-gb.html';
        this.hotelUrl6 = 'https://www.booking.com/hotel/za/nonexistingurl.html';

        this.siteHotelId6 = '-1'

        this.userInput1 = getRandomUserInput({});
        this.userInput2 = getRandomUserInput({});

        const cookieManager = new CookieManager(BASE_URL);
        this.cookie = await cookieManager.fetchCookie({ proxy: false });
    })

    context('fetchHotelAndLocationData', function() {
        it('should successfully fetch hotel and location data for siteHotelId1', async function() {
            response1 = await fetchData(this.siteHotelId1, this.userInput1, this.hotelUrl1, this.cookie);
            await delay(1000);
            expect(response1).to.be.not.null;
        });

        it('should successfully fetch hotel and location data for siteHotelId2', async function() {
            response2 = await fetchData(this.siteHotelId2, this.userInput2, this.hotelUrl2, this.cookie);
            await delay(1000);
            expect(response2).to.be.not.null;
        });

        it('should successfully fetch hotel and location data for siteHotelId3', async function() {
            response3 = await fetchData(this.siteHotelId3, this.userInput1, this.hotelUrl3, this.cookie);
            await delay(1000);
            expect(response3).to.be.not.null;
        });

        it('should successfully fetch hotel and location data for siteHotelId4', async function() {
            response4 = await fetchData(this.siteHotelId4, this.userInput2, this.hotelUrl4, this.cookie);
            await delay(1000);
            expect(response4).to.be.not.null;
        });

        it('should successfully fetch hotel and location data for siteHotelId5', async function() {
            response5 = await fetchData(this.siteHotelId5, this.userInput1, this.hotelUrl5, this.cookie);
            await delay(1000);
            expect(response5).to.be.not.null;
        });

        it('should successfully fetch hotel and location data for siteHotelId6', async function() {
            response6 = fetchData(this.siteHotelId6, this.userInput1, this.hotelUrl6, this.cookie);
            await delay(1000);
            await expect(response6).to.be.rejectedWith(/fetchData: Request failed with status code 404/);
        });
    });

    context('parseData', function() {
        it('should successfully parse hotel and location data for siteHotelId1', async function() {
            const parsedData = await parseData(response1, this.siteHotelId1, this.hotelUrl1, this.userInput1);
            const { hotelData, locationData, hotelPricesData } = parsedData;

            fs.writeFileSync('./junk/response1.html', response1);

            expect(hotelData.hotelName).to.be.eq('Lakefront Home in Quiet Cove Dock, Patio and Kayaks');
            expect(hotelData.siteOrigin).to.be.eq('https://www.booking.com/'); 
            expect(hotelData.siteHotelId).to.be.eq(this.siteHotelId1);
            expect(hotelData.description).to.be.eq('Set in Old Hickory, 11 km from The Hermitage, 22 km from Grand Ole Opry and 24 km from Lane Motor Museum, Lakefront Home in Quiet Cove Dock, Patio and...');
            expect(hotelData.rating?.score).to.be.eq(undefined);
            expect(hotelData.rating?.maxScore).to.be.eq(10);
            expect(hotelData.reviews).to.be.eq(undefined);
            expect(hotelData.link).to.be.eq(this.hotelUrl1);
            expect(hotelData.imageLink).to.be.eq('https://cf.bstatic.com/xdata/images/hotel/max500/322669885.jpg?k=e6c52e67b0abbf86e11de175e53462b102a85f007a1065da8e45c19a5fef3565&o=&hp=1');
            // expect(hotelData.balcony).to.be.eq(true);
            // expect(hotelData.freeParking).to.be.eq(false);
            // expect(hotelData.kitchen).to.be.eq(true);
            // expect(hotelData.bayView).to.be.eq(false);
            // expect(hotelData.mountainView).to.be.eq(false);
            // expect(hotelData.washer).to.be.eq(true);
            // expect(hotelData.wifi).to.be.eq(true);
            // expect(hotelData.bathroom).to.be.eq(false);
            // expect(hotelData.coffeMachine).to.be.eq(true);
            // expect(hotelData.airConditioning).to.be.eq(true);

            expect(locationData.hotelId).to.be.eq(hotelData.id);
            expect(locationData.locationName).to.be.eq('Old Hickory');
            expect(locationData.lat).to.be.eq('36.2419904');
            expect(locationData.lon).to.be.eq('-86.5672604');
            expect(locationData.address).to.be.eq('Old Hickory, 37138-1116, United States');
            expect(locationData.area).to.be.eq(null);
            expect(locationData.country).to.be.eq('USA');
            expect(locationData.region).to.be.eq('Tennessee');

            if (response1.includes('Not available on our site') || response1.includes('We have no availability here between')) {
                expect(hotelPricesData).to.be.an('array').that.is.empty;
            } else {
                expect(hotelPricesData).to.be.an('array').that.is.not.empty;
                expect(hotelPricesData[0].pricePerNight).to.be.not.null;
                expect(hotelPricesData[0].pricePerRoom).to.be.eq(hotelPricesData[0].pricePerNight);
                expect(hotelPricesData[0].from).to.be.eq(this.userInput1.checkIn);
                expect(hotelPricesData[0].to).to.be.eq(this.userInput1.checkOut);
                expect(hotelPricesData[0].serviceFee).to.be.null;
                expect(hotelPricesData[0].cleaningFee).to.be.null;
            }
        });

        it('should successfully parse hotel and location data for siteHotelId2', async function() {
            const parsedData = await parseData(response2, this.siteHotelId2, this.hotelUrl2, this.userInput2);
            const { hotelData, locationData, hotelPricesData } = parsedData;

            fs.writeFileSync('./junk/response2.html', response2);

            expect(hotelData.hotelName).to.be.eq('Coastal Naples Getaway about 2 Miles to Beaches!');
            expect(hotelData.siteOrigin).to.be.eq('https://www.booking.com/'); 
            expect(hotelData.siteHotelId).to.be.eq(this.siteHotelId2);
            expect(hotelData.description).to.be.eq('Coastal Naples Getaway about 2 Miles to Beaches! is set in Naples, 2 km from Silverspot Cinema, 2.9 km from Delnor-Wiggins Pass State Park, and 6.');
            expect(hotelData.rating?.score).to.be.eq(10);
            expect(hotelData.rating?.maxScore).to.be.eq(10);
            expect(hotelData.reviews).to.be.eq(undefined);
            expect(hotelData.link).to.be.eq(this.hotelUrl2);
            expect(hotelData.imageLink).to.be.eq('https://cf.bstatic.com/xdata/images/hotel/max500/336976435.jpg?k=e66384af2489be155a3a38019216e32e965d6ddc0aca25cedea54113dc89f4a6&o=&hp=1');
            // expect(hotelData.balcony).to.be.eq(true);
            // expect(hotelData.freeParking).to.be.eq(true);
            // expect(hotelData.kitchen).to.be.eq(false);
            // expect(hotelData.bayView).to.be.eq(false);
            // expect(hotelData.mountainView).to.be.eq(false);
            // expect(hotelData.washer).to.be.eq(true);
            // expect(hotelData.wifi).to.be.eq(true);
            // expect(hotelData.bathroom).to.be.eq(false);
            // expect(hotelData.coffeMachine).to.be.eq(false);
            // expect(hotelData.airConditioning).to.be.eq(false);

            expect(locationData.hotelId).to.be.eq(hotelData.id);
            expect(locationData.locationName).to.be.eq('Naples');
            expect(locationData.lat).to.be.eq('26.2658489');
            expect(locationData.lon).to.be.eq('-81.8043521');
            expect(locationData.address).to.be.eq('Naples, 34108-3231, United States');
            expect(locationData.area).to.be.eq(null);
            expect(locationData.country).to.be.eq('USA');
            expect(locationData.region).to.be.eq('Florida');


            if (response2.includes('Not available on our site') || response2.includes('We have no availability here between')) {
                expect(hotelPricesData).to.be.an('array').that.is.empty;
            } else {
                expect(hotelPricesData).to.be.an('array').that.is.not.empty;
                expect(hotelPricesData[0].pricePerNight).to.be.not.null;
                expect(hotelPricesData[0].pricePerRoom).to.be.eq(hotelPricesData[0].pricePerNight);
                expect(hotelPricesData[0].from).to.be.eq(this.userInput2.checkIn);
                expect(hotelPricesData[0].to).to.be.eq(this.userInput2.checkOut);
                expect(hotelPricesData[0].serviceFee).to.be.null;
                expect(hotelPricesData[0].cleaningFee).to.be.null;
            }
        });

        it('should successfully parse hotel and location data for siteHotelId3', async function() {
            const parsedData = await parseData(response3, this.siteHotelId3, this.hotelUrl3, this.userInput1);
            const { hotelData, locationData, hotelPricesData } = parsedData;

            fs.writeFileSync('./junk/response3.html', response3);

            expect(hotelData.hotelName).to.be.eq('Pet-Friendly Sacramento Home Less Than 5 Mi to Dtwn!');
            expect(hotelData.siteOrigin).to.be.eq('https://www.booking.com/'); 
            expect(hotelData.siteHotelId).to.be.eq(this.siteHotelId3);
            expect(hotelData.description).to.be.eq('Pet-Friendly Sacramento Home Less Than 5 Mi to Dtwn! is located in Sacramento, 37 km from University of California, Davis, 4.');
            expect(hotelData.rating?.score).to.be.eq(undefined);
            expect(hotelData.rating?.maxScore).to.be.eq(10);
            expect(hotelData.reviews).to.be.eq(undefined);
            expect(hotelData.link).to.be.eq(this.hotelUrl3);
            expect(hotelData.imageLink).to.be.eq('https://cf.bstatic.com/xdata/images/hotel/max500/408080475.jpg?k=6899d759cc850dbb871609f35efe317678bce1335a9aa84406a3f9456eacf0a9&o=&hp=1');
            // expect(hotelData.balcony).to.be.eq(true);
            // expect(hotelData.freeParking).to.be.eq(true);
            // expect(hotelData.kitchen).to.be.eq(false);
            // expect(hotelData.bayView).to.be.eq(false);
            // expect(hotelData.mountainView).to.be.eq(true);
            // expect(hotelData.washer).to.be.eq(true);
            // expect(hotelData.wifi).to.be.eq(true);
            // expect(hotelData.bathroom).to.be.eq(true);
            // expect(hotelData.coffeMachine).to.be.eq(true);
            // expect(hotelData.airConditioning).to.be.eq(true);

            expect(locationData.hotelId).to.be.eq(hotelData.id);
            expect(locationData.locationName).to.be.eq('Sacramento');
            expect(locationData.lat).to.be.eq('38.6180479');
            expect(locationData.lon).to.be.eq('-121.4521572');
            expect(locationData.address).to.be.eq('Sacramento, 95815, United States');
            expect(locationData.area).to.be.eq(null);
            expect(locationData.country).to.be.eq('USA');
            expect(locationData.region).to.be.eq('California');


            if (response3.includes('Not available on our site') || response3.includes('We have no availability here between')) {
                expect(hotelPricesData).to.be.an('array').that.is.empty;
            } else {
                expect(hotelPricesData).to.be.an('array').that.is.not.empty;
                expect(hotelPricesData[0].pricePerNight).to.be.not.null;
                expect(hotelPricesData[0].pricePerRoom).to.be.eq(hotelPricesData[0].pricePerNight);
                expect(hotelPricesData[0].from).to.be.eq(this.userInput1.checkIn);
                expect(hotelPricesData[0].to).to.be.eq(this.userInput1.checkOut);
                expect(hotelPricesData[0].serviceFee).to.be.null;
                expect(hotelPricesData[0].cleaningFee).to.be.null;
            }
        });

        it('should successfully parse hotel and location data for siteHotelId4', async function() {
            const parsedData = await parseData(response4, this.siteHotelId4, this.hotelUrl4, this.userInput2);
            const { hotelData, locationData, hotelPricesData } = parsedData;

            fs.writeFileSync('./junk/response4.html', response4);

            expect(hotelData.hotelName).to.be.eq('Lakeside Cabin with Fire Pit Near Pine Point Park!');
            expect(hotelData.siteOrigin).to.be.eq('https://www.booking.com/'); 
            expect(hotelData.siteHotelId).to.be.eq(this.siteHotelId4);
            expect(hotelData.description).to.be.eq('Lakeside Cabin with Fire Pit Near Pine Point Park! is set in Holcombe. It has a garden, garden views and free WiFi throughout the property.');
            expect(hotelData.rating?.score).to.be.eq(10);
            expect(hotelData.rating?.maxScore).to.be.eq(10);
            expect(hotelData.reviews).to.be.eq(1);
            expect(hotelData.link).to.be.eq(this.hotelUrl4);
            expect(hotelData.imageLink).to.be.eq('https://cf.bstatic.com/xdata/images/hotel/max500/297558137.jpg?k=663bd9bce355f45eaa59b60409febacc785f675d8a88c9567a8b69e45277415a&o=&hp=1');
            // expect(hotelData.balcony).to.be.eq(true);
            // expect(hotelData.freeParking).to.be.eq(true);
            // expect(hotelData.kitchen).to.be.eq(false);
            // expect(hotelData.bayView).to.be.eq(false);
            // expect(hotelData.mountainView).to.be.eq(true);
            // expect(hotelData.washer).to.be.eq(true);
            // expect(hotelData.wifi).to.be.eq(true);
            // expect(hotelData.bathroom).to.be.eq(true);
            // expect(hotelData.coffeMachine).to.be.eq(true);
            // expect(hotelData.airConditioning).to.be.eq(true);

            expect(locationData.hotelId).to.be.eq(hotelData.id);
            expect(locationData.locationName).to.be.eq('Holcombe');
            expect(locationData.lat).to.be.eq('45.2385440');
            expect(locationData.lon).to.be.eq('-91.1697360');
            expect(locationData.address).to.be.eq('Holcombe, 54745, United States');
            expect(locationData.area).to.be.eq(null);
            expect(locationData.country).to.be.eq('USA');
            expect(locationData.region).to.be.eq('Wisconsin');


            if (response4.includes('Not available on our site') || response4.includes('We have no availability here between')) {
                expect(hotelPricesData).to.be.an('array').that.is.empty;
            } else {
                expect(hotelPricesData).to.be.an('array').that.is.not.empty;
                expect(hotelPricesData[0].pricePerNight).to.be.not.null;
                expect(hotelPricesData[0].pricePerRoom).to.be.eq(hotelPricesData[0].pricePerNight);
                expect(hotelPricesData[0].from).to.be.eq(this.userInput2.checkIn);
                expect(hotelPricesData[0].to).to.be.eq(this.userInput2.checkOut);
                expect(hotelPricesData[0].serviceFee).to.be.null;
                expect(hotelPricesData[0].cleaningFee).to.be.null;
            }
        });

        it('should successfully parse hotel and location data for siteHotelId5', async function() {
            const parsedData = await parseData(response5, this.siteHotelId5, this.hotelUrl5, this.userInput1);
            const { hotelData, locationData, hotelPricesData } = parsedData;

            fs.writeFileSync('./junk/response5.html', response5);

            expect(hotelData.hotelName).to.be.eq('Family Retreat Holiday Home');
            expect(hotelData.siteOrigin).to.be.eq('https://www.booking.com/'); 
            expect(hotelData.siteHotelId).to.be.eq(this.siteHotelId5);
            expect(hotelData.description).to.be.eq('Family Retreat Holiday Home is set in Margate, 2.2 km from Uvongo Beach, 9 km from Mbumbazi Nature Reserve, and 13 km from Southbroom Golf Club.');
            expect(hotelData.rating?.score).to.be.eq(7);
            expect(hotelData.rating?.maxScore).to.be.eq(10);
            expect(hotelData.reviews).to.be.eq(3);
            expect(hotelData.link).to.be.eq(this.hotelUrl5);
            expect(hotelData.imageLink).to.be.eq('https://cf.bstatic.com/xdata/images/hotel/max500/390863420.jpg?k=b7a656f1030093e6d00e7c66bf65a128df7d004155e470591580ae412a04aeef&o=&hp=1');
            // expect(hotelData.balcony).to.be.eq(true);
            // expect(hotelData.freeParking).to.be.eq(true);
            // expect(hotelData.kitchen).to.be.eq(false);
            // expect(hotelData.bayView).to.be.eq(false);
            // expect(hotelData.mountainView).to.be.eq(true);
            // expect(hotelData.washer).to.be.eq(true);
            // expect(hotelData.wifi).to.be.eq(true);
            // expect(hotelData.bathroom).to.be.eq(true);
            // expect(hotelData.coffeMachine).to.be.eq(true);
            // expect(hotelData.airConditioning).to.be.eq(true);

            expect(locationData.hotelId).to.be.eq(hotelData.id);
            expect(locationData.locationName).to.be.eq('60 Queen Street');
            expect(locationData.lat).to.be.eq('-30.8519809');
            expect(locationData.lon).to.be.eq('30.3813111');
            expect(locationData.address).to.be.eq('60 Queen Street, 4276 Margate, South Africa');
            expect(locationData.area).to.be.eq(null);
            expect(locationData.country).to.be.eq('South Africa');
            expect(locationData.region).to.be.eq('KwaZulu-Natal');


            if (response5.includes('Not available on our site') || response5.includes('We have no availability here between')) {
                expect(hotelPricesData).to.be.an('array').that.is.empty;
            } else {
                expect(hotelPricesData).to.be.an('array').that.is.not.empty;
                expect(hotelPricesData[0].pricePerNight).to.be.not.null;
                expect(hotelPricesData[0].pricePerRoom).to.be.eq(hotelPricesData[0].pricePerNight);
                expect(hotelPricesData[0].from).to.be.eq(this.userInput1.checkIn);
                expect(hotelPricesData[0].to).to.be.eq(this.userInput1.checkOut);
                expect(hotelPricesData[0].serviceFee).to.be.null;
                expect(hotelPricesData[0].cleaningFee).to.be.null;
            }
        });
    });
});
