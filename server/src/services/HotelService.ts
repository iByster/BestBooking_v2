import { Hotel } from '../entities/Hotel';
import { HotelMetadata } from '../resolvers/GraphqlTypes';
import { IDestination } from '../types/types';

class HotelService {
    async checkIfHotelExist(siteHotelId: string) {
        const hotel = await Hotel.findOneBy({ siteHotelId });

        return hotel;
    }

    async checkIfHotelExistByUrl(link: string) {
        const hotel = await Hotel.findOneBy({ link });

        return hotel;
    }

    async getHotelsByName(destination: IDestination, metadata: HotelMetadata) {
        const { country, locationName, hotelName } = destination;
        const { limit, offset } = metadata;

        const hotels = await Hotel.createQueryBuilder().connection.query(
            `
            SELECT h.* FROM public.hotel h
            JOIN public.location l ON h.id = CAST(l."hotelId" as UUID)
            WHERE SIMILARITY(LOWER(h."hotelName"), LOWER($1)) > 0.5 
            AND SIMILARITY(LOWER(l.country), LOWER($2)) > 0.2
            AND (SIMILARITY(LOWER(l."locationName"), LOWER($3)) > 0.2 OR LOWER(l.address) LIKE LOWER('%' || $3 || '%'))
            ORDER BY h.id
            LIMIT $4 OFFSET $5
        `,
            [hotelName, country, locationName, limit, offset]
        );

        return hotels as Hotel[];
    }

    async getHotelsByLocation(
        destination: IDestination,
        metadata: HotelMetadata
    ) {
        const { country, locationName, terms } = destination;
        const { limit, offset } = metadata;

        const realLimit = Math.min(50, limit);
        const reaLimitPlusOne = realLimit + 1;

        let query = `
            SELECT h.* FROM public.hotel h
            JOIN public.location l ON h.id = CAST(l."hotelId" as UUID)
            WHERE SIMILARITY(LOWER(l.country), LOWER($1)) > 0.2
            AND (SIMILARITY(LOWER(l."locationName"), LOWER($2)) > 0.2 OR LOWER(l.address) LIKE LOWER('%' || $2 || '%'))
        `;

        const variables: any[] = [country, locationName];
        let variableCount = 3;

        terms?.forEach((term, index) => {
            if (index === 0) {
                query += 'AND (';
                query += `(SIMILARITY(LOWER(l.region), LOWER($${variableCount})) > 0.2 OR SIMILARITY(LOWER(l.area), LOWER($${variableCount})) > 0.2 OR LOWER(l.address) LIKE LOWER('%' || $${variableCount} || '%'))`;
            } else if (index === terms.length - 1) {
                query += 'OR ';
                query += `(SIMILARITY(LOWER(l.region), LOWER($${variableCount})) > 0.1 OR SIMILARITY(LOWER(l.area), LOWER($${variableCount})) > 0.1 OR LOWER(l.address) LIKE LOWER('%' || $${variableCount} || '%'))`;
                query += ')'
            } else {
                query += 'OR ';
                query += `(SIMILARITY(LOWER(l.region), LOWER($${variableCount})) > 0.1 OR SIMILARITY(LOWER(l.area), LOWER($${variableCount})) > 0.1 OR LOWER(l.address) LIKE LOWER('%' || $${variableCount} || '%'))`;
            }

            if (terms.length === 1) {
                query += ')';
            }
            variableCount++;
            variables.push(term);
        });

        variables.push(reaLimitPlusOne, offset)
        variableCount++; 

        query += ` ORDER BY h.id`
        query += ` LIMIT $${variableCount - 1} OFFSET $${variableCount}`;

        const hotels = await Hotel.createQueryBuilder().connection.query(query, variables);
        return {
            hotels: hotels.slice(0, realLimit) as Hotel[],
            hasMore: hotels.length === reaLimitPlusOne,
        };
    }

    async enhanceHotelsFound(hotelNames: string[]) {
        const hotels = await Hotel.createQueryBuilder().connection.query(`
            SELECT * FROM public.hotel
            WHERE "hotelName" = ANY($1)
        `, [
            hotelNames
        ]);

        return hotels as Hotel[];
    }
}

export default HotelService;
