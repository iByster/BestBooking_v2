import { IRoom, IUserInputForCrawling } from '../../../../types/types';
import {
    getDateDifferenceInDays,
    parseDateToISO
} from '../../../../utils/parse/parseUtils';
import { graphqlQuery } from './graphqlQuery';

const basePaylaoad = {
    variantParams: {
        hotelMetaCode: 2240579,
        roomConfiguration: [
            {
                childrenAges: [4],
                adults: 2,
            },
        ],
        stayInformation: {
            checkinDate: '2023-04-19',
            nights: 9,
        },
        searchContext: {
            flightBookingId: null,
            mobileDevice: false,
            userId: null,
            destination: {
                code: 'CND',
                type: 'City',
            },
        },
    },
};

const getPayload = (id: number, destinationCode: string, userInput: IUserInputForCrawling) => {
    const { checkIn, checkOut, rooms } = userInput;

    const roomConfiguration = rooms.map((room: IRoom) => {
        const { adults, childAges } = room;
        return {
            adults,
            childrenAges: childAges,
        }
    })

    basePaylaoad.variantParams.hotelMetaCode = id;
    basePaylaoad.variantParams.roomConfiguration = roomConfiguration;
    basePaylaoad.variantParams.stayInformation.checkinDate = parseDateToISO(checkIn);
    basePaylaoad.variantParams.stayInformation.nights = getDateDifferenceInDays(checkIn, checkOut);
    basePaylaoad.variantParams.searchContext.destination.code = destinationCode;

    return basePaylaoad;
};

export const constructGraphQLPayload = (
    id: number,
    destinationCode: string,
    userInput: IUserInputForCrawling
) => {
    return {
        operationName: 'Variants',
        variables: getPayload(id, destinationCode, userInput),
        query: graphqlQuery,
    };
};
