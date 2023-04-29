import { IRoom } from "../../components/GuestPicker/GuestPicker";
import { destructureRooms, parseDateToISO } from "../parse/parseUtils";

interface Payload { 
    destination: Destination
    checkIn: Date | null;
    checkOut: Date | null;
    rooms: IRoom[];
}

export interface Destination {
    terms: any | null;
    hotelName: string | null;
    country: string;
    area: string | null;
    region: string | null;
    locationName: string;
    description?: string | null;
}

export const getQueryStringFromPayload = (payload: Payload) => {
    const { destination, checkIn, checkOut, rooms } = payload;
    const { area, country, hotelName, locationName, region, terms, description } = destination;
    const { adults, childAges } = destructureRooms(rooms);


    const urlSearchParams = new URLSearchParams();

    if (area) {
        urlSearchParams.set('area', area);
    }

    if (description) {
        urlSearchParams.set('description', description);
    }

    if (country) {
        urlSearchParams.set('country', country);
    }

    if (hotelName) {
        urlSearchParams.set('hotelName', hotelName);
    }

    if (locationName) {
        urlSearchParams.set('locationName', locationName);
    }

    if (region) {
        urlSearchParams.set('region', region);
    }

    if (terms && terms.length > 0) {
        urlSearchParams.set('terms', terms.join(','));
    }

    if (checkIn) {
        urlSearchParams.set('checkIn', parseDateToISO(checkIn));
    }

    if (checkOut) {
        urlSearchParams.set('checkOut', parseDateToISO(checkOut));
    }

    rooms.forEach((room, index) => {
        const { adults, childAges } = room;
        const guests: string[] = [adults.toString()];
        const childAgesStr = childAges.map(childAge => childAge.toString());
        guests.push(...childAgesStr);
        urlSearchParams.set(`room${index + 1}`, guests.join(','));
    })
    urlSearchParams.set('rooms', rooms.length.toString());
    urlSearchParams.set('adults', adults.toString());
    urlSearchParams.set('childAges', childAges.join(','));

    return urlSearchParams;
}

export const getPayloadFromQueryString = (queryString: URLSearchParams) => {
    const area = queryString.get('area');
    const region = queryString.get('region');
    const hotelName = queryString.get('hotelName');
    const locationName = queryString.get('locationName')!;
    const country = queryString.get('country')!;
    const description = queryString.get('description');
    const termsStr = queryString.get('terms');

    let terms = null;

    if (termsStr) {
        terms = termsStr.split(',');
    }

    const destination: Destination = {
        area,
        region,
        hotelName,
        locationName,
        country,
        terms,
        description
    }

    const checkInParam = queryString.get('checkIn');
    const checkOutParam = queryString.get('checkOut');
    const checkIn = checkInParam ? new Date(checkInParam) : null;
    const checkOut = checkOutParam ? new Date(checkOutParam) : null;

    const rooms: IRoom[] = [];

    let index = 1;
    while (queryString.get(`room${index}`) !== null) {
        const roomStr = queryString.get(`room${index}`);
        if (roomStr) {
            const roomComponents = roomStr.split(',');

            let adults: number = 1;
            const childAges: number[] = [];
            roomComponents.forEach((r, i) => {
                if (i === 0) {
                    adults = +r;
                } else {
                    childAges.push(+r);
                }
            });

            rooms.push({
                adults,
                childAges,
            })
        }
        
        index++;
    }

    const payload: Payload = {
        destination,
        checkIn,
        checkOut, 
        rooms,
    };

    return payload;
}