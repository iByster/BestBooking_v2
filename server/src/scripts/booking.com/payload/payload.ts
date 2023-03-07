import { IUserInputForCrawling } from "../../../types/types"
import { destructureRooms, parseDateToISO } from "../../../utils/parse/parseUtils";
import { createQueryString } from "../../../utils/url/createQueryString";

const queryStringObject = {
    checkin: '2023-02-13',
    checkout: '2023-02-17',
    dest_id: -1881733,
    dest_type: 'hotel',
    group_adults: 2,
    req_adults: 2,
    group_children: 0,
    req_children: 0,
    no_rooms: 1,
    label: 'gen173nr-1FCAsoO0JQbW9kZXJuZXMtYm9hcmRpbmdob3VzZS1maXJtZW4tb2Rlci1mZXJpZW53b2hudW5nLWdsYXNmYXNlci13bGFuLWJhbGtvbi1zdGVsbHBsYXRICVgEaMABiAEBmAEJuAEXyAEV2AEB6AEB-AECiAIBqAIDuAKXoeWeBsACAdICJDhjODY4YWFhLWJjNWYtNDViNS05ZjdhLWFmMjY3OTg0MzQ3N9gCBeACAQ',
    sid: 'fc280a917005ec9d905e35f12e23bc6d',
    aid: '304142',
    ucfs: 1,
    arphpl: 1,
    hpos: 1,
    hapos: 1,
    sr_order: 'popularity',
    srpvid: '7cfb7b63368a0c12',
    srepoch: '1675186377',
    all_sr_blocks: '663695601_272093679_4_0_0',
    highlighted_blocks: '663695601_272093679_4_0_0',
    matching_block_id: '663695601_272093679_4_0_0',
    sr_pri_blocks: '663695601_272093679_4_0_0__53500',
    from_sustainable_property_sr: 1,
    from: 'searchresults',
    show_room: '663695601'
}

const getQueryString = (id: string, userInput: IUserInputForCrawling) => {
    const { checkIn, checkOut, rooms } = userInput;
    const { adults, children } = destructureRooms(rooms);

    queryStringObject.dest_id = +id;
    queryStringObject.checkin = parseDateToISO(checkIn);
    queryStringObject.checkout = parseDateToISO(checkOut);
    queryStringObject.req_adults = adults;
    queryStringObject.group_adults = adults;
    queryStringObject.req_children = children;
    queryStringObject.group_children = children;
    queryStringObject.no_rooms = rooms.length;

    return queryStringObject;
}

export const constructQueryStringPayload = (
    id: string,
    userInput: IUserInputForCrawling
) => {
    const queryString = createQueryString(getQueryString(id, userInput));
    return queryString;
};