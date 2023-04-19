import { IUserInputForCrawling } from "../../types/types";
import { destructureRooms, parseDateToConcatString } from "../../utils/parse/parseUtils";

export const baseQueryParams = {
    testab: 'b534020d1156a7f575f49fb632176a2106f16b33dfe732e3e546d9a172c799b0',
    'x-traceID': '1675809086465.1bkdct-1676114353004-1917899130',
};

const basePayload = {
    search: {
        hotelId: 429709,
        roomId: 0,
        checkIn: '20230218',
        checkOut: '20230219',
        roomQuantity: 1,
        adult: 2,
        childInfoItems: [{ age: 1, meal: null, bed: null}],
        priceType: 0,
        mustShowRoomList: [],
        location: {
            geo: {
                cityID: null,
            },
        },
        meta: {
            fgt: -1,
            roomkey: '',
        },
        cancelPolicyType: 1,
    },
    head: {
        platform: 'PC',
        clientId: '1675809086465.1bkdct',
        bu: 'ibu',
        group: 'TRIP',
        aid: '',
        sid: '',
        ouid: '',
        caid: '1078328',
        csid: '2036522',
        couid: 'ctag.hash.bb48582f5b9e',
        region: 'XX',
        locale: 'en-XX',
        timeZone: '2',
        currency: 'USD',
        p: '66901689247',
        pageID: '10320668147',
        deviceID: 'PC',
        clientVersion: '0',
        frontend: {
            vid: '1675809086465.1bkdct',
            sessionID: '5',
            pvid: '29',
        },
        extension: [
            {
                name: 'cityId',
                value: '',
            },
            {
                name: 'checkIn',
                value: '',
            },
            {
                name: 'checkOut',
                value: '',
            },
        ],
        qid: 602999161825,
        pid: 'd5f959f1-70f3-4bc8-92f9-9e70837b0fe2',
        hotelExtension: {
            hotelUuidKey:
                'HlUe9XwqsJ0bY86YohehmyadJ7fKt3jfQwHY0MRpMj7gEo5YU6E7dxPZRlcvcYd1y6OilaKase6oRz7YpTWlSYF6I8FRLYOpYOTrtzEFtjTGwtlvOXjcJLPeFcWgOvHTjbJqsjplwSbvpgjPJdbvlGvLPY0Qwd9jgHefliS1YsByOhik1ybYN4vT5KPvtfyq0jNqv39EQ0vOPW4njtBxSHrLmYGYAtrFbrOdRzXYpqi0sw53R0tEX6W1lxb4JnsIMY4OyQ8IPmxkMI4mjmhwFY1lizhwtZjzaxTaWhUxmY0kIUSwGbYAGvPzYF3yNoj3qv0MesbYFUjSDybJUavahYnGyhpjS5vTgegTYlSjHgyXJl9Ypnvf6WB0WlvNgyA3ibYSoiDkjkfRU6vM3e4NYmfiHqYLXylbWqhw8Y3Gr37w4w3piSUK94IZYHDRAaxBpJToKoGyf4YBYXkyfLIbojg5YThi50iXLiF5jS5jkfe4yMY1FIQ8yh6e0Ai4qwXFYoqw0pJX7vdUYL5w4XK4teZaxbY3JztYpfJ75Rhdwt5yfswMmROgRBUESFis7Jm0RzQi7mY4djpUeDHEh6e9Y1qrm3r3mr60IXmi7DwqYkEPSKg8xzFR0Awd8yMgJk3jG6WQFvt4WhcjFQwpbESUwn8JojmkKbke0YNhItgjAySsjlaw5kvGojzhJHBRqcE0YNBeo7WkbrXDRqkv8OYQ9WoOeGTRL3W48jBsWPkEo7E0AJFYH6WZZx4svqLRhSvUAYFfWFAeLORGkW7DilDY89IbDedLx0YS1e1oi7gEPhRGTwa9ybawthRdDRg6EPTiU5JD5RAXi6dYF4w0OK38e7ZxgYk6enpi5cJBXE3Gj46Wl3WGZW9bYaQYc8YUgRZ3YTnWL0YL7YXHYMojHleBHEtbWnbe0FwakeOzj7TYzhyHMEsfj7NEqmrhsjq0wXgy0Xr0TJ5QvcYXARp4WTpWBaW1DWQgYlYS3YfdvzpRscv3kEXFWsHybAjnJGTvHTEO6WPTy7sjmLEOGjhLwoYawT0r7FKc8E83E7XEkBRtOEbhekcxcFI7YgarctYZFE1pEp0EXlE0FYPXYpgYlhYZdJsAj37',
        },
        cid: '1675809086465.1bkdct',
        traceLogID: 'b2fd05aa5bb72',
        ticket: '',
        hasAidInUrl: 'false',
        href: 'https://www.trip.com/hotels/guangzhou-hotel-detail-429709/aoyuan-golf-hotel/',
    },
};


export const getPayload = (hotelId: string, userInput: IUserInputForCrawling, hotelUrl: string) => {
    const { checkIn, checkOut, rooms } = userInput;
    const { adults, childAges } = destructureRooms(rooms);

    basePayload.search.checkIn = parseDateToConcatString(checkIn);
    basePayload.search.checkOut = parseDateToConcatString(checkOut);
    basePayload.search.adult = adults;
    basePayload.search.roomQuantity = rooms.length;
    basePayload.search.hotelId = parseInt(hotelId);

    if (childAges.length > 0) {
        childAges.forEach((childAge) => {
            basePayload.search.childInfoItems.push({
                age: childAge,
                meal: null,
                bed: null,
            })
        })
    } else {
        basePayload.search.childInfoItems = [];
    }

    basePayload.head.href = hotelUrl;
    return basePayload;
}