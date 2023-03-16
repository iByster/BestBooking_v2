import { Hotel } from "../entities/Hotel";

class HotelService {

    async checkIfHotelExist(siteHotelId: string) {
        const hotel = await Hotel.findOneBy({ siteHotelId });

        return hotel;
    }
}

export default HotelService;