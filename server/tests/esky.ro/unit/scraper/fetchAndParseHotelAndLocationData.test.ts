import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { describe } from 'mocha';
import CookieManager from '../../../../src/utils/cookie/CookieManager';
import getRandomUserInput from '../../../../src/utils/payload/randomUserInput';
import delay from '../../../../src/utils/scrape/delay';
import { fetchHotelAndLocationData, parseHotelAndLocationData } from '../../../../src/scripts/esky.ro/scraper/scraper';
chai.use(chaiAsPromised);

const BASE_URL = 'https://www.esky.ro/';

declare global {
    interface Window {
        ibeConfig: any;
    }
  }

describe('esky.ro fetchHotelAndLocationData and parseHotelAndLocationData', function () {
    let response1: any = null;
    let response2: any = null;
    let response3: any = null;
    let response4: any = null;
    let response5: any = null;
    let response6: any = null;
    let response7: any = null;

    before(async function() {
        this.siteHotelId1 = '1781962';
        this.siteHotelId2 = '528238';
        this.siteHotelId3 = '5908177';
        this.siteHotelId4 = '637416';
        this.siteHotelId5 = '865060';
        
        this.hotelUrl1 = 'https://www.esky.ro/hoteluri/ho/1781962/vistisoara-pensiunea-casa-luanna';
        this.hotelUrl2 = 'https://www.esky.ro/hoteluri/ho/528238/hunedoara-hotel-krystal'
        this.hotelUrl3 = 'https://www.esky.ro/hoteluri/ho/5908177/jurilovca-casa-madalina';
        this.hotelUrl4 = 'https://www.esky.ro/hoteluri/ho/637416/jupiter-vila-casa-leul';
        this.hotelUrl5 = 'https://www.esky.ro/hoteluri/ho/865060/cluj-napoca-camino-home';
        
        this.siteHotelId6 = '-1'
        this.siteHotelId7 = '637448';
        this.hotelUrl6 = 'https://www.esky.ro/macacmoale.aspx'
        this.hotelUrl7 = 'https://www.esky.ro/hoteluri/ho/637448/vama-veche-casa-luca';

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
            response1 = await fetchHotelAndLocationData(this.hotelUrl1, this.siteHotelId1, this.cookie);
            await delay(1000);
            expect(response1).to.be.not.null;
        });

        it('should successfully fetch hotel and location data for hotelUrl2', async function() {
            response2 = await fetchHotelAndLocationData(this.hotelUrl2, this.siteHotelId2, this.cookie);
            await delay(1000);
            expect(response2).to.be.not.null;
        });

        it('should successfully fetch hotel and location data for hotelUrl3', async function() {
            response3 = await fetchHotelAndLocationData(this.hotelUrl3, this.siteHotelId3, this.cookie);
            await delay(1000);
            expect(response3).to.be.not.null;
        });

        it('should successfully fetch hotel and location data for hotelUrl4', async function() {
            response4 = await fetchHotelAndLocationData(this.hotelUrl4, this.siteHotelId4, this.cookie);
            await delay(1000);
            expect(response4).to.be.not.null;
        });

        it('should successfully fetch hotel and location data for hotelUrl5', async function() {
            response5 = await fetchHotelAndLocationData(this.hotelUrl5, this.siteHotelId5, this.cookie);
            await delay(1000);
            expect(response5).to.be.not.null;
        });

        it('should successfully fetch hotel and location data for hotelUrl6', async function() {
            response6 = fetchHotelAndLocationData(this.hotelUrl6, this.siteHotelId6, this.cookie);
            await delay(1000);
            await expect(response6).to.be.rejectedWith(/Request failed with status code 404/);
        });

        it('should successfully fetch hotel and location data for hotelUrl7', async function() {
            response7 = fetchHotelAndLocationData(this.hotelUrl7, this.siteHotelId7, this.cookie);
            await delay(1000);
            await expect(response7).to.be.rejectedWith(`fetchData: Request was redirected to:https://www.esky.ro/hoteluri`);
        });
    });

    context('parseHotelAndLocationData', function() {
        it('should successfully parse hotel and location data for response1', async function() {
            const parsedData = await parseHotelAndLocationData(response1, this.siteHotelId1, this.hotelUrl1);
            const { hotelData, locationData, cityCode, hotelMetaCode } = parsedData;

            expect(hotelData.hotelName).to.be.eq('Pensiunea Casa Luanna');
            expect(hotelData.siteOrigin).to.be.eq('https://www.esky.ro');
            expect(hotelData.siteHotelId).to.be.eq(this.siteHotelId1);
            expect(hotelData.description).to.be.eq('Pensiunea Casa Luanna se află în Drăguș, în județul Brașov, la 500 de metri de parcul de aventură Drăguș. Proprietatea oferă loc de joacă pentru copii și terasă la soare. Oaspeții beneficiază de WiFi gratuit în toată proprietatea și parcare privată gratuită. Fiecare cameră are TV cu ecran plat. Unele camere includ zonă de relaxare. Unele camere oferă vedere la munte sau grădină. Camerele au baie privată. Oaspeții beneficiază de articole de toaletă gratuite, papuci și uscător de păr. Zona din jur este renumită pentru schi. La această pensiune agroturistică puteți să jucați tenis de masă. Pensiunea agroturistică oferă serviciul de închirieri de biciclete. Aeroportul Internațional Sibiu este la 54 km.');
            expect(hotelData.rating).to.be.eq(null);
            expect(hotelData.reviews).to.be.eq(null);
            expect(hotelData.link).to.be.eq(this.hotelUrl1);
            expect(hotelData.imageLink).to.be.eq('https://q-xx.bstatic.com/xdata/images/hotel/max1024x768/79389213.jpg?k=f5f74870a63367aca6f99dd74df017e45cac316ba6667efc3bd4cee42b5169b7&o=');
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
            expect(locationData.locationName).to.be.eq('Drăguş 507251');
            expect(locationData.country).to.be.eq('ro');
            expect(locationData.region).to.be.eq(null);
            expect(locationData.lat).to.be.eq('45.69899');
            expect(locationData.lon).to.be.eq('24.7813');
            expect(locationData.area).to.be.eq(undefined);
            expect(locationData.address).to.be.eq('Aleea Fagului Nr.1002 , Drăguş 507251 , ro');

            expect(cityCode).to.be.eq('65215');
            expect(hotelMetaCode).to.be.eq(1170539);
        });

        it('should successfully parse hotel and location data for response2', async function() {

            
            const parsedData = await parseHotelAndLocationData(response2, this.siteHotelId2, this.hotelUrl2);
            const { hotelData, locationData, cityCode, hotelMetaCode } = parsedData;

            expect(hotelData.hotelName).to.be.eq('Krystal Boutique Mansion');
            expect(hotelData.siteOrigin).to.be.eq('https://www.esky.ro');
            expect(hotelData.siteHotelId).to.be.eq(this.siteHotelId2);
            expect(hotelData.description).to.be.eq('Situat la marginea oraşului Hunedoara, Hotelul Krystal oferă camere elegante şi spaţioase, cu aer condiţionat, Wi-Fi gratuit şi un TV cu ecran plat cu canale prin cablu. Hotelul are restaurant, bar şi facilităţi de grătar. Toate camerele oferă zonă de relaxare, minibar şi birou. Fiecare cameră are baie privată cu uscător de păr. Oaspeţii pot să savureze o băutură de la bar sau să ia masa pe terasa cu şezlonguri de lângă piscină. În lunile de vară, puteţi să înotaţi în piscina în aer liber sau să faceţi plajă pe şezlong. Puteţi să exploraţi castelul medieval bine conservat al familiei Corvin, aflat la 10 minute de mers cu maşina. Oaspeţii pot să facă drumeţii într-o rezervaţie naturală din Munţii Retezat şi să viziteze ruinele cetăţii Ulpia Traiana Sarmizegetusa. Hotelul Krystal oferă parcare privată gratuită.');
            expect(hotelData.rating).to.be.eq(null);
            expect(hotelData.reviews).to.be.eq(null);
            expect(hotelData.link).to.be.eq(this.hotelUrl2);
            expect(hotelData.imageLink).to.be.eq('https://q-xx.bstatic.com/xdata/images/hotel/max1024x768/348332220.jpg?k=1517e4dfac72ba2656d377d0b48f9b0154d4d2a334e9ecccd7caba7a6eb603e5&o=');
            expect(hotelData.balcony).to.be.eq(false);
            expect(hotelData.freeParking).to.be.eq(true);
            expect(hotelData.kitchen).to.be.eq(false);
            expect(hotelData.bayView).to.be.eq(false);
            expect(hotelData.mountainView).to.be.eq(false);
            expect(hotelData.washer).to.be.eq(true);
            expect(hotelData.wifi).to.be.eq(true);
            expect(hotelData.bathroom).to.be.eq(true);
            expect(hotelData.coffeMachine).to.be.eq(false);
            expect(hotelData.airConditioning).to.be.eq(true);

            expect(locationData.hotelId).to.be.eq(hotelData.id);
            expect(locationData.locationName).to.be.eq('Hunedoara 331004');
            expect(locationData.country).to.be.eq('ro');
            expect(locationData.region).to.be.eq(null);
            expect(locationData.lat).to.be.eq('45.79895');
            expect(locationData.lon).to.be.eq('22.92099');
            expect(locationData.area).to.be.eq(undefined);
            expect(locationData.address).to.be.eq('Pestisul Mare Street nr.48H , Hunedoara 331004 , ro');

            expect(cityCode).to.be.eq('35953');
            expect(hotelMetaCode).to.be.eq(345610);
        });

        it('should successfully parse hotel and location data for response3', async function() {
            const parsedData = await parseHotelAndLocationData(response3, this.siteHotelId3, this.hotelUrl3);
            const { hotelData, locationData, cityCode, hotelMetaCode } = parsedData;

            expect(hotelData.hotelName).to.be.eq('Casa Mădălina');
            expect(hotelData.siteOrigin).to.be.eq('https://www.esky.ro');
            expect(hotelData.siteHotelId).to.be.eq(this.siteHotelId3);
            expect(hotelData.description).to.be.eq('Casa Mădălina se află în Jurilovca și are o grădină și o terasă. Parcarea privată este disponibilă la un cost suplimentar. Unitățile de cazare includ cuptor cu microunde, frigider, fierbător, bideu, uscător de păr și dulap. Camerele pensiunii au baie comună și vedere la lac. Toate camerele sunt dotate cu cuptor. Dunavățu de Jos este la 38 km de Casa Mădălina, iar Murighiol se află la 40 km. Cel mai apropiat aeroport este Aeroportul Internațional Mihail Kogălniceanu, situat la 53 km de proprietate.');
            expect(hotelData.rating).to.be.eq(null);
            expect(hotelData.reviews).to.be.eq(null);
            expect(hotelData.link).to.be.eq(this.hotelUrl3);
            expect(hotelData.imageLink).to.be.eq(undefined);
            expect(hotelData.balcony).to.be.eq(false);
            expect(hotelData.freeParking).to.be.eq(true);
            expect(hotelData.kitchen).to.be.eq(false);
            expect(hotelData.bayView).to.be.eq(false);
            expect(hotelData.mountainView).to.be.eq(false);
            expect(hotelData.washer).to.be.eq(false);
            expect(hotelData.wifi).to.be.eq(false);
            expect(hotelData.bathroom).to.be.eq(false);
            expect(hotelData.coffeMachine).to.be.eq(false);
            expect(hotelData.airConditioning).to.be.eq(false);

            expect(locationData.hotelId).to.be.eq(hotelData.id);
            expect(locationData.locationName).to.be.eq('Jurilovca 827115');
            expect(locationData.country).to.be.eq('ro');
            expect(locationData.region).to.be.eq(null);
            expect(locationData.lat).to.be.eq('44.75413');
            expect(locationData.lon).to.be.eq('28.86175');
            expect(locationData.area).to.be.eq(undefined);
            expect(locationData.address).to.be.eq('Viilor 33 , Jurilovca 827115 , ro');

            expect(cityCode).to.be.eq('114559');
            expect(hotelMetaCode).to.be.eq(2772742);
        });

        it('should successfully parse hotel and location data for response4', async function() {
            const parsedData = await parseHotelAndLocationData(response4, this.siteHotelId4, this.hotelUrl4);
            const { hotelData, locationData, cityCode, hotelMetaCode } = parsedData;

            expect(hotelData.hotelName).to.be.eq('Vila Casa Leul');
            expect(hotelData.siteOrigin).to.be.eq('https://www.esky.ro');
            expect(hotelData.siteHotelId).to.be.eq(this.siteHotelId4);
            expect(hotelData.description).to.be.eq('Vila Casa Leul, aflată în apropiere de pădurea din Jupiter și la doar 450 de metri de plaja cu nisip, oferă o grădină amenajată, cu o piscină mică, un teren de joacă pentru copii și acces gratuit la internet Wi-Fi. Camerele sunt situate în 2 vile moderne, cu terasă în aer liber, fiecare cameră fiind prevăzută cu un frigider, un balcon și TV prin cablu. Baia privată are un duș. Aerul condiţionat este disponibil la un cost suplimentar. Oaspeții au la dispoziție o bucătărie și o sală de mese la parterul fiecărei vile, precum și facilități de grătar în grădină. Proprietatea se află la 300 de metri de o stație de autobuz și la mai puțin de 500 de metri de câteva restaurante. La cerere, se oferă jocuri de societate și servicii de transfer de la/la gară, aflată la 3 km.');
            expect(hotelData.rating).to.be.eq(null);
            expect(hotelData.reviews).to.be.eq(null);
            expect(hotelData.link).to.be.eq(this.hotelUrl4);
            expect(hotelData.imageLink).to.be.eq('https://q-xx.bstatic.com/xdata/images/hotel/max1024x768/375138370.jpg?k=fb4b0ebb9c00346a4b18a42855d9b9cf9077bf8bf65e6d0ca707c790029f5445&o=');
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
            expect(locationData.locationName).to.be.eq('Jupiter 905500');
            expect(locationData.country).to.be.eq('ro');
            expect(locationData.region).to.be.eq(null);
            expect(locationData.lat).to.be.eq('43.85572');
            expect(locationData.lon).to.be.eq('28.59867');
            expect(locationData.area).to.be.eq(undefined);
            expect(locationData.address).to.be.eq('Str. Aldea nr8 , Jupiter 905500 , ro');

            expect(cityCode).to.be.eq('54478');
            expect(hotelMetaCode).to.be.eq(437315);
        });

        it('should successfully parse hotel and location data for response5', async function() {
            const parsedData = await parseHotelAndLocationData(response5, this.siteHotelId5, this.hotelUrl5);
            const { hotelData, locationData, cityCode, hotelMetaCode } = parsedData;

            expect(hotelData.hotelName).to.be.eq('Camino Home');
            expect(hotelData.siteOrigin).to.be.eq('https://www.esky.ro');
            expect(hotelData.siteHotelId).to.be.eq(this.siteHotelId5);
            expect(hotelData.description).to.be.eq('Camino Home este situat în centrul orașului Cluj-Napoca şi oferă unităţi de cazare în sistem self-catering. Se oferă acces gratuit la conexiunea WiFi. Apartamentele de la Camino Home au zonă de relaxare și TV prin satelit. Există și o masă. Baia privată este dotată și cu duş. Printre facilități se numără, de asemenea, o canapea, lenjerie de pat și produse de curățenie. Micul dejun este oferit la un restaurant situat la 600 de metri de Camino Home. La 20 de metri de proprietate există un supermarket. Aeroportul Internaţional Avram Iancu din Cluj-Napoca este situat la 7 km de unitatea de cazare. La 3 km se află o gară.');
            expect(hotelData.rating).to.be.eq(null);
            expect(hotelData.reviews).to.be.eq(null);
            expect(hotelData.link).to.be.eq(this.hotelUrl5);
            expect(hotelData.imageLink).to.be.eq('https://q-xx.bstatic.com/xdata/images/hotel/max1024x768/37350478.jpg?k=f0a8d9681780369ab17edfd4d3b78b61290e49a5d09bac43e4d5ce4613ea6162&o=');
            expect(hotelData.balcony).to.be.eq(false);
            expect(hotelData.freeParking).to.be.eq(false);
            expect(hotelData.kitchen).to.be.eq(false);
            expect(hotelData.bayView).to.be.eq(false);
            expect(hotelData.mountainView).to.be.eq(false);
            expect(hotelData.washer).to.be.eq(false);
            expect(hotelData.wifi).to.be.eq(true);
            expect(hotelData.bathroom).to.be.eq(false);
            expect(hotelData.coffeMachine).to.be.eq(false);
            expect(hotelData.airConditioning).to.be.eq(true);

            expect(locationData.hotelId).to.be.eq(hotelData.id);
            expect(locationData.locationName).to.be.eq('Cluj-Napoca 400095');
            expect(locationData.country).to.be.eq('ro');
            expect(locationData.region).to.be.eq(null);
            expect(locationData.lat).to.be.eq('46.77107');
            expect(locationData.lon).to.be.eq('23.5932');
            expect(locationData.area).to.be.eq(undefined);
            expect(locationData.address).to.be.eq('Iuliu Maniu 19 , Cluj-Napoca 400095 , ro');

            expect(cityCode).to.be.eq('CLJ');
            expect(hotelMetaCode).to.be.eq(520444);
        });
    });
});
