import { IUserInputForCrawling } from "../../../../types/types"
import { destructureRooms, getDateDifferenceInDays, parseDateToISO } from "../../../../utils/parse/parseUtils";
import { createQueryString } from "../../../../utils/url/createQueryString";

const basePayload = {
    finalPriceView: '2',
    isShowMobileAppPrice: 'false',
    cid: '-1',
    numberOfBedrooms: '',
    familyMode: '',
    adults: '2',
    children: '0',
    rooms: '1',
    maxRooms: '0',
    checkIn: '2023-02-25',
    isCalendarCallout: 'false',
    childAges: '',
    numberOfGuest: '0',
    missingChildAges: 'false',
    travellerType: '-1',
    showReviewSubmissionEntry: 'false',
    currencyCode: 'EUR',
    isFreeOccSearch: 'false',
    isCityHaveAsq: 'false',
    los: '2',
    searchrequestid: '38b60324-44fb-4c1c-b554-2ba4ff2893c7',
    hotel_id: '255503',
    all: 'false',
    price_view: '2',
    sessionid: '454ukzwa03do5liy0wcgpusl',
    pagetypeid: '7',
}

export const getPayload = (hotelId: string, userInput: IUserInputForCrawling) => {
    const { checkIn, checkOut, rooms } = userInput;
    const { adults, children, childAges } = destructureRooms(rooms);

    basePayload.hotel_id = hotelId;

    basePayload.adults = adults.toString();
    basePayload.children = children.toString();
    basePayload.rooms = rooms.length.toString();
    basePayload.checkIn = parseDateToISO(checkIn);
    basePayload.los = getDateDifferenceInDays(checkIn, checkOut).toString();
    basePayload.numberOfBedrooms = rooms.length.toString();
    basePayload.childAges = encodeURIComponent(childAges.join(','));

    return basePayload;
}

export const constructQueryStringPayload = (hotelId: string, userInput: IUserInputForCrawling) => {
    return createQueryString(getPayload(hotelId, userInput));
}