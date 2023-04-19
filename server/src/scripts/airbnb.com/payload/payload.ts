import { IUserInputForCrawling } from '../../types';
import { destructureRooms, parseDateToISO } from '../../utils/parse/parseUtils';

// base payload structure
const basePayload = {
    id: 'U3RheUxpc3Rpbmc6NDU0MTgwNzM=',
    pdpSectionsRequest: {
        adults: '2',
        bypassTargetings: false,
        categoryTag: null,
        causeId: null,
        children: '3',
        disasterId: null,
        discountedGuestFeeVersion: null,
        displayExtensions: null,
        federatedSearchId: null,
        forceBoostPriorityMessageType: null,
        infants: null,
        interactionType: null,
        layouts: ['SIDEBAR', 'SINGLE_COLUMN'],
        pets: 0,
        pdpTypeOverride: null,
        preview: false,
        previousStateCheckIn: null,
        previousStateCheckOut: null,
        priceDropSource: null,
        privateBooking: false,
        promotionUuid: null,
        relaxedAmenityIds: false,
        searchId: null,
        selectedCancellationPolicyId: null,
        selectedRatePlanId: null,
        splitStays: null,
        staysBookingMigrationEnabled: false,
        translateUgc: null,
        useNewSectionWrapperApi: false,
        sectionIds: [
            "BOOK_IT_CALENDAR_SHEET",
          ],
        checkIn: '2023-01-02',
        checkOut: '2023-01-05',
        p3ImpressionId: 'p3_1670438258_NDSQ+/5Elgqj+o1i',
        isLeanTreatment: false,
    },
    isLeanTreatment: false,
    isMobile: false,
    isHotel: false,
    isPlus: false,
    isMarketplace: false,
};

// StayListing:45418073
export const encodeId = (id: string) => {
    const text = `StayListing:${id}`;

    const buffer = Buffer.from(text);

    return buffer.toString('base64');
};

// replace payload fields that represents user input fields with a desired one
const getPayload = (id: string, userInput: IUserInputForCrawling) => {
    const { checkIn, checkOut, rooms } = userInput;
    const { adults, children } = destructureRooms(rooms);

    basePayload.id = encodeId(id);
    adults
        ? (basePayload.pdpSectionsRequest.adults = adults.toString())
        : (basePayload.pdpSectionsRequest.adults = '0');
    children
        ? (basePayload.pdpSectionsRequest.children = children.toString())
        : (basePayload.pdpSectionsRequest.children = '0');
    basePayload.pdpSectionsRequest.checkIn = parseDateToISO(checkIn);
    basePayload.pdpSectionsRequest.checkOut = parseDateToISO(checkOut);

    return basePayload;
};

export const constructGraphQLPayload = (
    id: string,
    userInput: IUserInputForCrawling
) => {
    return {
        operationName: 'StaysPdpSections',
        locale: 'en',
        currency: 'RON',
        variables: JSON.stringify(getPayload(id, userInput)),
        extensions: JSON.stringify({
            persistedQuery: {
                version: 1,
                sha256Hash:
                    '8f2f2ab9572540f6ffab551e368f6bdd58ddf90c85d8be5139e4cb6eb602489d',
            },
        })
    };
};
