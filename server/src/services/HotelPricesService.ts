import { HotelPrice } from "../entities/HotelPrice";

class HotelPrices {
    async getHotelPricesByHotelIds(hotelIds: string[]) {
        const prices = await HotelPrice.createQueryBuilder().connection.query(`
            SELECT * FROM public.hotel_price WHERE "hotelId" = ANY($1); 
        `, [
            hotelIds,
        ]);

        return prices as HotelPrice[];
    }
}

export default HotelPrices;