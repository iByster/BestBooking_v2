import { Location } from "../entities/Location";

class LocationService {
    async getLocationsByHotels(hotelIds: string[]) {
        const locations = await Location.createQueryBuilder().connection.query(`
            SELECT * FROM public.location WHERE "hotelId" = ANY($1); 
        `, [
            hotelIds,
        ]);

        return locations as Location[];
    } 
}

export default LocationService;