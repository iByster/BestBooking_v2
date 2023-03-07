import { IUserInputForCrawling } from '../../../../types/types';
import { destructureRooms, getDateDifferenceInDays } from '../../../../utils/parse/parseUtils';
import { graphqlQuery } from './graphqlQuery';

const basePaylaoad = {
    PropertyDetailsRequest: {
        propertyIds: [255503],
    },
    ContentImagesRequest: {
        imageSizes: [
            {
                key: 'main',
                size: {
                    width: 1024,
                    height: 768,
                },
            },
            {
                key: 'gallery_preview',
                size: {
                    width: 450,
                    height: 450,
                },
            },
            {
                key: 'thumbnail',
                size: {
                    width: 80,
                    height: 60,
                },
            },
            {
                key: 'thumbnail-2x',
                size: {
                    width: 160,
                    height: 120,
                },
            },
        ],
        isApo: false,
        isUseNewImageCaption: true,
    },
    ContentReviewSummariesRequest: {
        providerIds: [
            332, 3038, 27901, 28999, 29100, 27999, 27980, 27989, 29014,
        ],
        occupancyRequest: {
            numberOfAdults: 2,
            numberOfChildren: 0,
            travelerType: 1,
            lengthOfStay: 3,
            checkIn: '2023-03-21T22:00:00.000Z',
        },
        contentReviewPositiveMentionsRequest: {
            facilityClassesLimit: 3,
            facilityClassesSentimentLimit: 3,
        },
        contentReviewSnippetsRequest: {
            overrideLimit: 20,
        },
        isApo: false,
    },
    ContentReviewScoreRequest: {
        demographics: {
            filter: {
                defaultProviderOnly: true,
            },
        },
        providerIds: [],
    },
    ContentInformationSummaryRequest: {
        isApo: false,
    },
    ContentHighlightsRequest: {
        includeAtfPropertyHighlights: true,
        maxNumberOfItems: 5,
        occupancyRequest: {
            numberOfAdults: 2,
            numberOfChildren: 0,
            travelerType: 1,
            lengthOfStay: null,
        },
        images: {
            imageSizes: [
                {
                    key: 'main',
                    size: {
                        width: 360,
                        height: 270,
                    },
                },
            ],
        },
    },
    ContentLocalInformationRequest: {
        showWalkablePlaces: true,
        images: {
            imageSizes: [
                {
                    key: 'main',
                    size: {
                        width: 360,
                        height: 270,
                    },
                },
            ],
        },
    },
    ContentInformationRequest: {
        isApo: false,
        characteristicTopicsLimit: 3,
        showDynamicShortDescription: true,
    },
    ContentFeaturesRequest: {
        includeFacilityHighlights: true,
        occupancyRequest: {
            numberOfAdults: 2,
            numberOfChildren: 0,
            travelerType: 1,
            lengthOfStay: 3,
        },
        images: {
            imageSizes: [
                {
                    key: 'original',
                    size: {
                        width: 360,
                        height: 270,
                    },
                },
            ],
        },
    },
    PriceStreamMetaLabRequest: {
        attributesId: [8, 2, 3, 7, 18],
    },
};

const getPayload = (id: string, userInput: IUserInputForCrawling) => {
    const { checkIn, checkOut, rooms } = userInput;
    const { adults, children } = destructureRooms(rooms);

    basePaylaoad.PropertyDetailsRequest.propertyIds = [parseInt(id)];
    basePaylaoad.ContentReviewSummariesRequest.occupancyRequest.checkIn = checkIn.toISOString();
    basePaylaoad.ContentReviewSummariesRequest.occupancyRequest.lengthOfStay = getDateDifferenceInDays(checkIn, checkOut);
    basePaylaoad.ContentReviewSummariesRequest.occupancyRequest.numberOfAdults = adults;
    basePaylaoad.ContentReviewSummariesRequest.occupancyRequest.numberOfChildren = children;

    basePaylaoad.ContentHighlightsRequest.occupancyRequest.numberOfAdults = adults;
    basePaylaoad.ContentHighlightsRequest.occupancyRequest.numberOfChildren = children;
    
    basePaylaoad.ContentFeaturesRequest.occupancyRequest.lengthOfStay = getDateDifferenceInDays(checkIn, checkOut);
    basePaylaoad.ContentFeaturesRequest.occupancyRequest.numberOfAdults = adults;
    basePaylaoad.ContentFeaturesRequest.occupancyRequest.numberOfChildren = children;

    return basePaylaoad;
};

export const constructGraphQLPayload = (
    id: string,
    userInput: IUserInputForCrawling
) => {
    return {
        operationName: 'propertyDetailsSearch',
        variables: getPayload(id, userInput),
        query: graphqlQuery,
    };
};
