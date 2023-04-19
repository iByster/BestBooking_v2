import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { describe } from 'mocha';
import { fetchHotelAndLocationData, parseDetailsAndLocationData } from '../../../../src/scripts/directbooking.ro/scraper/scraper';
import CookieManager from '../../../../src/utils/cookie/CookieManager';
import getRandomUserInput from '../../../../src/utils/payload/randomUserInput';
import delay from '../../../../src/utils/scrape/delay';
chai.use(chaiAsPromised);

const BASE_URL = 'https://www.directbooking.ro/';

declare global {
    interface Window {
      initParams: any;
    }
  }

describe('directbooking.ro fetchHotelAndLocationData and parseHotelAndLocationData', function () {
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

    context('fetchHotelAndLocationData', function() {
        it('should successfully fetch hotel and location data for hotelUrl1', async function() {
            response1 = await fetchHotelAndLocationData(this.hotelUrl1, this.cookie);
            await delay(1000);
            expect(response1).to.be.not.null;
        });

        it('should successfully fetch hotel and location data for hotelUrl2', async function() {
            response2 = await fetchHotelAndLocationData(this.hotelUrl2, this.cookie);
            await delay(1000);
            expect(response2).to.be.not.null;
        });

        it('should successfully fetch hotel and location data for hotelUrl3', async function() {
            response3 = await fetchHotelAndLocationData(this.hotelUrl3, this.cookie);
            await delay(1000);
            expect(response3).to.be.not.null;
        });

        it('should successfully fetch hotel and location data for hotelUrl4', async function() {
            response4 = await fetchHotelAndLocationData(this.hotelUrl4, this.cookie);
            await delay(1000);
            expect(response4).to.be.not.null;
        });

        it('should successfully fetch hotel and location data for hotelUrl5', async function() {
            response5 = await fetchHotelAndLocationData(this.hotelUrl5, this.cookie);
            await delay(1000);
            expect(response5).to.be.not.null;
        });

        it('should successfully fetch hotel and location data for hotelUrl6', async function() {
            response6 = fetchHotelAndLocationData(this.hotelUrl6, this.cookie);
            await delay(1000);
            await expect(response6).to.be.rejectedWith(/Request failed with status code 404/);
        });
    });

    context('parseHotelAndLocationData', function() {
        it('should successfully parse hotel and location data for response1', async function() {
            const parsedData = parseDetailsAndLocationData(response1);
            const { hotelData, locationData } = parsedData;

            expect(hotelData.hotelName).to.be.eq('Novotel Brussels Centre');
            expect(hotelData.siteOrigin).to.be.eq('https://www.directbooking.ro');
            expect(hotelData.siteHotelId).to.be.eq(this.siteHotelId1);
            expect(hotelData.description).to.be.eq('Novotel Brussels City Centre este un hotel de 4* localizat in centrul orasului, la cateva minute de Manneken Pis, Grand Place si Magritte Museum.\r\n');
            expect(hotelData.rating?.score).to.be.eq(4);
            expect(hotelData.rating?.maxScore).to.be.eq(5);
            expect(hotelData.reviews).to.be.eq(undefined);
            expect(hotelData.link).to.be.eq('https://www.directbooking.ro/cazare-novotel-brussels-centre-bruxelles-oferta-rezervare-sejur-5936.aspx');
            expect(hotelData.imageLink).to.be.eq('https://img.directbooking.ro/getimage.ashx?w=880&h=660&file=a88ed756-25a3-438e-9424-4a059cd98c40.jpg');
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
            expect(locationData.locationName).to.be.eq('Bruxelles');
            expect(locationData.country).to.be.eq('Belgia');
            expect(locationData.region).to.be.eq('Regiunea Bruxelles');
            expect(locationData.lat).to.be.eq('50.851591');
            expect(locationData.lon).to.be.eq('4.3500');
            expect(locationData.area).to.be.eq(null);
            expect(locationData.address).to.be.eq('');
        });

        it('should successfully parse hotel and location data for response2', async function() {
            const parsedData = parseDetailsAndLocationData(response2);
            const { hotelData, locationData } = parsedData;

            expect(hotelData.hotelName).to.be.eq('Apartment Tamarinier Complexe');
            expect(hotelData.siteOrigin).to.be.eq('https://www.directbooking.ro');
            expect(hotelData.siteHotelId).to.be.eq(this.siteHotelId2);
            expect(hotelData.description).to.be.eq('');
            expect(hotelData.rating?.score).to.be.eq(0);
            expect(hotelData.rating?.maxScore).to.be.eq(5);
            expect(hotelData.reviews).to.be.eq(undefined);
            expect(hotelData.link).to.be.eq('https://www.directbooking.ro/cazare-apartment-tamarinier-complexe-flic-en-flac-oferta-rezervare-sejur-5034289.aspx');
            expect(hotelData.imageLink).to.be.eq(null);
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
            expect(locationData.locationName).to.be.eq('Flic En Flac');
            expect(locationData.country).to.be.eq('Mauritius');
            expect(locationData.region).to.be.eq('Mauritius');
            expect(locationData.lat).to.be.eq('-20.28426');
            expect(locationData.lon).to.be.eq('57.369926');
            expect(locationData.area).to.be.eq(null);
            expect(locationData.address).to.be.eq('');
        });

        it('should successfully parse hotel and location data for response3', async function() {
            const parsedData = parseDetailsAndLocationData(response3);
            const { hotelData, locationData } = parsedData;

            expect(hotelData.hotelName).to.be.eq('Xo Hotels Infinity Amsterdam Ex Nieuw Slotania');
            expect(hotelData.siteOrigin).to.be.eq('https://www.directbooking.ro');
            expect(hotelData.siteHotelId).to.be.eq(this.siteHotelId3);
            expect(hotelData.description).to.be.eq("Acest hotel modern de 3 stele, recent renovat, se află în cartierul Slotermeer și are legături bune de transport spre centrul orașului Amsterdam și Aeroportul Schiphol. Situată vizavi de XO Hotels Infinity, stația de tramvai și de autobuz Plein '40-'45- oferă conexiuni spre Rijksmuseum și Gara Centrală din Amsterdam. Acolo oprește și autobuzul de noapte spre Dam și locurile cu viață de noapte din Piața Leidse.");
            expect(hotelData.rating?.score).to.be.eq(2);
            expect(hotelData.rating?.maxScore).to.be.eq(5);
            expect(hotelData.reviews).to.be.eq(undefined);
            expect(hotelData.link).to.be.eq('https://www.directbooking.ro/cazare-nieuw-slotania-amsterdam-oferta-rezervare-sejur-5655.aspx');
            expect(hotelData.imageLink).to.be.eq('https://img.directbooking.ro/getimage.ashx?w=880&h=660&file=hot$hot_e5d430ce-dfde-47aa-9fb8-38a90d440876.jpg');
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
            expect(locationData.locationName).to.be.eq('Amsterdam');
            expect(locationData.country).to.be.eq('Olanda');
            expect(locationData.region).to.be.eq('Zona metropolitana Amsterdam');
            expect(locationData.lat).to.be.eq('52.3826');
            expect(locationData.lon).to.be.eq('4.8216');
            expect(locationData.area).to.be.eq(null);
            expect(locationData.address).to.be.eq('');
        });

        it('should successfully parse hotel and location data for response4', async function() {
            const parsedData = parseDetailsAndLocationData(response4);
            const { hotelData, locationData } = parsedData;

            expect(hotelData.hotelName).to.be.eq('Travelodge');
            expect(hotelData.siteOrigin).to.be.eq('https://www.directbooking.ro');
            expect(hotelData.siteHotelId).to.be.eq(this.siteHotelId4);
            expect(hotelData.description).to.be.eq('');
            expect(hotelData.rating?.score).to.be.eq(3);
            expect(hotelData.rating?.maxScore).to.be.eq(5);
            expect(hotelData.reviews).to.be.eq(undefined);
            expect(hotelData.link).to.be.eq('https://www.directbooking.ro/cazare-travelodge-londra-oferta-rezervare-sejur-5651279.aspx');
            expect(hotelData.imageLink).to.be.eq(null);
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
            expect(locationData.locationName).to.be.eq('Londra');
            expect(locationData.country).to.be.eq('Marea Britanie');
            expect(locationData.region).to.be.eq('Londra Mare');
            expect(locationData.lat).to.be.eq('51.459897');
            expect(locationData.lon).to.be.eq('-0.302591');
            expect(locationData.area).to.be.eq(null);
            expect(locationData.address).to.be.eq('');
        });

        it('should successfully parse hotel and location data for response5', async function() {
            const parsedData = parseDetailsAndLocationData(response5);
            const { hotelData, locationData } = parsedData;

            expect(hotelData.hotelName).to.be.eq('Bright 1 Bedroom Flat Near Finsbury Park');
            expect(hotelData.siteOrigin).to.be.eq('https://www.directbooking.ro');
            expect(hotelData.siteHotelId).to.be.eq(this.siteHotelId5);
            expect(hotelData.description).to.be.eq('');
            expect(hotelData.rating?.score).to.be.eq(4);
            expect(hotelData.rating?.maxScore).to.be.eq(5);
            expect(hotelData.reviews).to.be.eq(undefined);
            expect(hotelData.link).to.be.eq('https://www.directbooking.ro/cazare-bright-1-bedroom-flat-near-finsbury-park-londra-oferta-rezervare-sejur-4893714.aspx');
            expect(hotelData.imageLink).to.be.eq('https://img.directbooking.ro/getimage.ashx?w=880&h=660&file=aci$aci_04818b4b-f9d9-450f-a4a0-1f878e9f9afd.jpg');
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
            expect(locationData.locationName).to.be.eq('Londra');
            expect(locationData.country).to.be.eq('Marea Britanie');
            expect(locationData.region).to.be.eq('Londra Mare');
            expect(locationData.lat).to.be.eq('51.573256');
            expect(locationData.lon).to.be.eq('-0.080825');
            expect(locationData.area).to.be.eq(null);
            expect(locationData.address).to.be.eq('');
        });
    });
});
