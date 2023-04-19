import { graphqlQuery } from './graphqlQuery';

const basePaylaoad = {
    context: {
        siteId: 300000025,
        locale: 'en_IE',
        eapid: 25,
        currency: 'EUR',
        device: {
            type: 'DESKTOP',
        },
        identity: {
            duaid: '77f0180d-4a77-4ed7-963d-a6c8d66b1261',
            expUserId: '-1',
            tuid: '-1',
            authState: 'ANONYMOUS',
        },
        privacyTrackingState: 'CAN_NOT_TRACK',
        debugContext: {
            abacusOverrides: [],
            alterMode: 'RELEASED',
        },
    },
    criteria: {
        primary: {
            dateRange: {
                checkInDate: {
                    day: 8,
                    month: 8,
                    year: 2023,
                },
                checkOutDate: {
                    day: 31,
                    month: 8,
                    year: 2023,
                },
            },
            destination: {
                regionName: 'Romania',
                regionId: '151',
                coordinates: null,
                pinnedPropertyId: null,
                propertyIds: null,
                mapBounds: null,
            },
            rooms: [
                {
                    adults: 2,
                    children: [],
                },
            ],
        },
        secondary: {
            counts: [
                {
                    id: 'resultsStartingIndex',
                    value: 5,
                },
                {
                    id: 'resultsSize',
                    value: 100,
                },
            ],
            booleans: [],
            selections: [
                {
                    id: 'sort',
                    value: 'RECOMMENDED',
                },
                {
                    id: 'privacyTrackingState',
                    value: 'CAN_NOT_TRACK',
                },
                {
                    id: 'useRewards',
                    value: 'SHOP_WITHOUT_POINTS',
                },
            ],
            ranges: [],
        },
    },
    destination: {
        regionName: null,
        regionId: null,
        coordinates: null,
        pinnedPropertyId: null,
        propertyIds: null,
        mapBounds: null,
    },
    shoppingContext: {
        multiItem: null,
    },
};

const getPayload = (
    pageNumber = 0
) => {
    basePaylaoad.criteria.secondary.counts[0].value = pageNumber * 100;

    return basePaylaoad;
};

export const constructGraphQLPayload = (
    pageNumber = 1
) => {
    return {
        operationName: 'LodgingPwaPropertySearch',
        variables: getPayload(pageNumber),
        query: graphqlQuery,
    };
};
