import { Hotel } from "../entities/Hotel";

class HotelService {

    async checkIfHotelExist(siteHotelId: string) {
        const hotel = await Hotel.findOneBy({ siteHotelId });

        return hotel;
    }

    async checkIfHotelExistByUrl(link: string) {
        const hotel = await Hotel.findOneBy({ link });

        return hotel;
    }
}

export default HotelService;