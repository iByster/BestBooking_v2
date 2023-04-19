import { IUserInputForCrawling } from '../../../../types/types';
import {
    destructureRooms,
    getDateDifferenceInDays,
    parseDateToISO,
} from '../../../../utils/parse/parseUtils';
import getRandomUserInput from '../../../../utils/payload/randomUserInput';
import { graphqlQuery } from './graphqlQuery';

const basePaylaoad = {
    CitySearchRequest: {
        cityId: 12706,
        searchRequest: {
            searchCriteria: {
                isAllowBookOnRequest: true,
                bookingDate: '2023-04-13T17:36:19.411Z',
                checkInDate: '2023-04-22T17:36:16.560Z',
                localCheckInDate: '2023-04-23',
                los: 1,
                rooms: 1,
                adults: 1,
                children: 0,
                childAges: [1, 2],
                ratePlans: [],
                featureFlagRequest: {
                    fetchNamesForTealium: true,
                    fiveStarDealOfTheDay: true,
                    isAllowBookOnRequest: false,
                    showUnAvailable: true,
                    showRemainingProperties: true,
                    isMultiHotelSearch: false,
                    enableAgencySupplyForPackages: true,
                    flags: [
                        {
                            feature: 'FamilyChildFriendlyPopularFilter',
                            enable: true,
                        },
                        {
                            feature: 'FamilyChildFriendlyPropertyTypeFilter',
                            enable: true,
                        },
                        {
                            feature: 'FamilyMode',
                            enable: false,
                        },
                    ],
                    enablePageToken: false,
                    enableDealsOfTheDayFilter: false,
                    isEnableSupplierFinancialInfo: false,
                    ignoreRequestedNumberOfRoomsForNha: false,
                },
                isUserLoggedIn: false,
                currency: 'EUR',
                travellerType: 'Couple',
                isAPSPeek: false,
                enableOpaqueChannel: false,
                isEnabledPartnerChannelSelection: null,
                sorting: {
                    sortField: 'Ranking',
                    sortOrder: 'Desc',
                    sortParams: null,
                },
                requiredBasis: 'PRPN',
                requiredPrice: 'AllInclusive',
                suggestionLimit: 0,
                synchronous: false,
                supplierPullMetadataRequest: null,
                isRoomSuggestionRequested: false,
                isAPORequest: false,
                hasAPOFilter: false,
            },
            searchContext: {
                userId: '5c20a0bc-4a50-43f3-8d8e-568dfdfe1d88',
                memberId: 0,
                locale: 'en-us',
                cid: 1844104,
                origin: 'RO',
                platform: 1,
                deviceTypeId: 1,
                experiments: {
                    forceByVariant: null,
                    forceByExperiment: [
                        {
                            id: 'UMRAH-B2B',
                            variant: 'B',
                        },
                        {
                            id: 'UMRAH-B2C-REGIONAL',
                            variant: 'B',
                        },
                        {
                            id: 'UMRAH-B2C',
                            variant: 'Z',
                        },
                        {
                            id: 'JGCW-204',
                            variant: 'B',
                        },
                        {
                            id: 'JGCW-264',
                            variant: 'B',
                        },
                        {
                            id: 'JGCW-202',
                            variant: 'B',
                        },
                        {
                            id: 'JGCW-299',
                            variant: 'B',
                        },
                    ],
                },
                isRetry: false,
                showCMS: false,
                storeFrontId: 3,
                pageTypeId: 103,
                whiteLabelKey: null,
                ipAddress: '82.79.161.110',
                endpointSearchType: 'CitySearch',
                trackSteps: null,
                searchId: 'f49cc40a-4db7-47ef-9f6b-a0a79a12b579',
            },
            matrix: null,
            matrixGroup: [
                {
                    matrixGroup: 'NumberOfBedrooms',
                    size: 100,
                },
                {
                    matrixGroup: 'LandmarkIds',
                    size: 10,
                },
                {
                    matrixGroup: 'AllGuestReviewBreakdown',
                    size: 100,
                },
                {
                    matrixGroup: 'GroupedBedTypes',
                    size: 100,
                },
                {
                    matrixGroup: 'RoomBenefits',
                    size: 100,
                },
                {
                    matrixGroup: 'AtmosphereIds',
                    size: 100,
                },
                {
                    matrixGroup: 'RoomAmenities',
                    size: 100,
                },
                {
                    matrixGroup: 'AffordableCategory',
                    size: 100,
                },
                {
                    matrixGroup: 'HotelFacilities',
                    size: 100,
                },
                {
                    matrixGroup: 'BeachAccessTypeIds',
                    size: 100,
                },
                {
                    matrixGroup: 'StarRating',
                    size: 20,
                },
                {
                    matrixGroup: 'MetroSubwayStationLandmarkIds',
                    size: 20,
                },
                {
                    matrixGroup: 'CityCenterDistance',
                    size: 100,
                },
                {
                    matrixGroup: 'ProductType',
                    size: 100,
                },
                {
                    matrixGroup: 'BusStationLandmarkIds',
                    size: 20,
                },
                {
                    matrixGroup: 'IsSustainableTravel',
                    size: 2,
                },
                {
                    matrixGroup: 'ReviewLocationScore',
                    size: 3,
                },
                {
                    matrixGroup: 'LandmarkSubTypeCategoryIds',
                    size: 20,
                },
                {
                    matrixGroup: 'ReviewScore',
                    size: 100,
                },
                {
                    matrixGroup: 'AccommodationType',
                    size: 100,
                },
                {
                    matrixGroup: 'PaymentOptions',
                    size: 100,
                },
                {
                    matrixGroup: 'TrainStationLandmarkIds',
                    size: 20,
                },
                {
                    matrixGroup: 'HotelAreaId',
                    size: 100,
                },
                {
                    matrixGroup: 'HotelChainId',
                    size: 10,
                },
                {
                    matrixGroup: 'RecommendedByDestinationCity',
                    size: 10,
                },
                {
                    matrixGroup: 'Deals',
                    size: 100,
                },
            ],
            filterRequest: {
                idsFilters: [],
                rangeFilters: [],
                textFilters: [],
            },
            page: {
                pageSize: 100,
                pageNumber: 1,
                pageToken: '',
            },
            apoRequest: {
                apoPageSize: 10,
            },
            searchHistory: [
                {
                    objectId: 255318,
                    searchDate: '2023-2-16',
                    searchType: 'PropertySearch',
                    childrenAges: [],
                },
                {
                    objectId: 255503,
                    searchDate: '2023-2-16',
                    searchType: 'PropertySearch',
                    childrenAges: [],
                },
                {
                    objectId: 255503,
                    searchDate: '2023-2-17',
                    searchType: 'PropertySearch',
                    childrenAges: [],
                },
                {
                    objectId: 255505,
                    searchDate: '2023-2-17',
                    searchType: 'PropertySearch',
                    childrenAges: [],
                },
                {
                    objectId: 255503,
                    searchDate: '2023-2-22',
                    searchType: 'PropertySearch',
                    childrenAges: [],
                },
                {
                    objectId: 255503,
                    searchDate: '2023-2-23',
                    searchType: 'PropertySearch',
                    childrenAges: [],
                },
                {
                    objectId: 2690923,
                    searchDate: '2023-2-24',
                    searchType: 'PropertySearch',
                    childrenAges: [],
                },
                {
                    objectId: 6,
                    searchDate: '2023-2-28',
                    searchType: 'PropertySearch',
                    childrenAges: [],
                },
                {
                    objectId: 255503,
                    searchDate: '2023-3-1',
                    searchType: 'PropertySearch',
                    childrenAges: [],
                },
                {
                    objectId: 803,
                    searchDate: '2023-3-1',
                    searchType: 'PropertySearch',
                    childrenAges: [],
                },
                {
                    objectId: 237,
                    searchDate: '2023-3-21',
                    searchType: 'PropertySearch',
                    childrenAges: [],
                },
                {
                    objectId: 253,
                    searchDate: '2023-3-21',
                    searchType: 'PropertySearch',
                    childrenAges: [],
                },
            ],
            searchDetailRequest: {
                priceHistogramBins: 50,
            },
            isTrimmedResponseRequested: false,
            featuredAgodaHomesRequest: null,
            featuredLuxuryHotelsRequest: null,
            highlyRatedAgodaHomesRequest: {
                numberOfAgodaHomes: 30,
                minimumReviewScore: 7.5,
                minimumReviewCount: 3,
                accommodationTypes: [
                    28, 29, 30, 102, 103, 106, 107, 108, 109, 110, 114, 115,
                    120, 131,
                ],
                sortVersion: 0,
            },
            extraAgodaHomesRequest: null,
            extraHotels: {
                extraHotelIds: [],
                enableFiltersForExtraHotels: false,
            },
            packaging: null,
            flexibleSearchRequest: {
                fromDate: '2023-04-13',
                toDate: '2023-05-22',
                alternativeDateSize: 4,
                isFullFlexibleDateSearch: false,
            },
            rankingRequest: {
                isNhaKeywordSearch: false,
                isPulseRankingBoost: false,
            },
            rocketmilesRequestV2: null,
            featuredPulsePropertiesRequest: null,
        },
    },
    ContentSummaryRequest: {
        context: {
            rawUserId: '5c20a0bc-4a50-43f3-8d8e-568dfdfe1d88',
            memberId: 0,
            userOrigin: 'RO',
            locale: 'en-us',
            forceExperimentsByIdNew: [
                {
                    key: 'UMRAH-B2B',
                    value: 'B',
                },
                {
                    key: 'UMRAH-B2C-REGIONAL',
                    value: 'B',
                },
                {
                    key: 'UMRAH-B2C',
                    value: 'Z',
                },
                {
                    key: 'JGCW-204',
                    value: 'B',
                },
                {
                    key: 'JGCW-264',
                    value: 'B',
                },
                {
                    key: 'JGCW-202',
                    value: 'B',
                },
                {
                    key: 'JGCW-299',
                    value: 'B',
                },
            ],
            apo: false,
            searchCriteria: {
                cityId: 12706,
            },
            platform: {
                id: 1,
            },
            storeFrontId: 3,
            cid: '1844104',
            occupancy: {
                numberOfAdults: 1,
                numberOfChildren: 0,
                travelerType: 0,
                checkIn: '2023-04-22T17:36:16.560Z',
            },
            deviceTypeId: 1,
            whiteLabelKey: '',
            correlationId: '',
        },
        summary: {
            highlightedFeaturesOrderPriority: null,
            description: false,
            includeHotelCharacter: true,
        },
        reviews: {
            commentary: null,
            demographics: {
                providerIds: null,
                filter: {
                    defaultProviderOnly: true,
                },
            },
            summaries: {
                providerIds: null,
                apo: true,
                limit: 1,
                travellerType: 0,
            },
            cumulative: {
                providerIds: null,
            },
            filters: null,
        },
        images: {
            page: null,
            maxWidth: 0,
            maxHeight: 0,
            imageSizes: null,
            indexOffset: null,
        },
        rooms: {
            images: null,
            featureLimit: 0,
            filterCriteria: null,
            includeMissing: false,
            includeSoldOut: false,
            includeDmcRoomId: false,
            soldOutRoomCriteria: null,
            showRoomSize: true,
            showRoomFacilities: true,
            showRoomName: false,
        },
        nonHotelAccommodation: true,
        engagement: true,
        highlights: {
            maxNumberOfItems: 0,
            images: {
                imageSizes: [
                    {
                        key: 'full',
                        size: {
                            width: 0,
                            height: 0,
                        },
                    },
                ],
            },
        },
        personalizedInformation: false,
        localInformation: {
            images: null,
        },
        features: null,
        rateCategories: true,
        contentRateCategories: {
            escapeRateCategories: {},
        },
        synopsis: true,
    },
    PricingSummaryRequest: {
        cheapestOnly: true,
        context: {
            isAllowBookOnRequest: true,
            abTests: [
                {
                    testId: 9021,
                    abUser: 'B',
                },
                {
                    testId: 9023,
                    abUser: 'B',
                },
                {
                    testId: 9024,
                    abUser: 'B',
                },
                {
                    testId: 9025,
                    abUser: 'B',
                },
                {
                    testId: 9027,
                    abUser: 'B',
                },
                {
                    testId: 9029,
                    abUser: 'B',
                },
            ],
            clientInfo: {
                cid: 1844104,
                languageId: 1,
                languageUse: 1,
                origin: 'RO',
                platform: 1,
                searchId: 'f49cc40a-4db7-47ef-9f6b-a0a79a12b579',
                storefront: 3,
                userId: '5c20a0bc-4a50-43f3-8d8e-568dfdfe1d88',
                ipAddress: '82.79.161.110',
            },
            experiment: [
                {
                    name: 'UMRAH-B2B',
                    variant: 'B',
                },
                {
                    name: 'UMRAH-B2C-REGIONAL',
                    variant: 'B',
                },
                {
                    name: 'UMRAH-B2C',
                    variant: 'Z',
                },
                {
                    name: 'JGCW-204',
                    variant: 'B',
                },
                {
                    name: 'JGCW-264',
                    variant: 'B',
                },
                {
                    name: 'JGCW-202',
                    variant: 'B',
                },
                {
                    name: 'JGCW-299',
                    variant: 'B',
                },
            ],
            isDebug: false,
            sessionInfo: {
                isLogin: false,
                memberId: 0,
                sessionId: 1,
            },
            packaging: null,
        },
        isSSR: true,
        roomSortingStrategy: null,
        pricing: {
            bookingDate: '2023-04-13T17:36:19.403Z',
            checkIn: '2023-04-22T17:36:16.560Z',
            checkout: '2023-04-23T17:36:16.560Z',
            localCheckInDate: '2023-04-23',
            localCheckoutDate: '2023-04-24',
            currency: 'EUR',
            details: {
                cheapestPriceOnly: false,
                itemBreakdown: false,
                priceBreakdown: false,
            },
            featureFlag: [
                'ClientDiscount',
                'PriceHistory',
                'VipPlatinum',
                'RatePlanPromosCumulative',
                'PromosCumulative',
                'CouponSellEx',
                'MixAndSave',
                'APSPeek',
                'StackChannelDiscount',
                'AutoApplyPromos',
                'EnableAgencySupplyForPackages',
                'EnableCashback',
                'CreditCardPromotionPeek',
                'EnableCofundedCashback',
                'DispatchGoLocalForInternational',
                'EnableGoToTravelCampaign',
            ],
            features: {
                crossOutRate: false,
                isAPSPeek: false,
                isAllOcc: false,
                isApsEnabled: false,
                isIncludeUsdAndLocalCurrency: false,
                isMSE: true,
                isRPM2Included: true,
                maxSuggestions: 0,
                isEnableSupplierFinancialInfo: false,
                isLoggingAuctionData: false,
                newRateModel: false,
                overrideOccupancy: false,
                filterCheapestRoomEscapesPackage: false,
                priusId: 0,
                synchronous: false,
                enableRichContentOffer: true,
                showCouponAmountInUserCurrency: false,
                disableEscapesPackage: false,
                enablePushDayUseRates: false,
                enableDayUseCor: false,
            },
            filters: {
                cheapestRoomFilters: [],
                filterAPO: false,
                ratePlans: [1],
                secretDealOnly: false,
                suppliers: [],
                nosOfBedrooms: [],
            },
            includedPriceInfo: false,
            occupancy: {
                adults: 1,
                children: 0,
                childAges: [],
                rooms: 1,
                childrenTypes: [],
            },
            supplierPullMetadata: {
                requiredPrecheckAccuracyLevel: 0,
            },
            mseHotelIds: [],
            ppLandingHotelIds: [],
            searchedHotelIds: [],
            paymentId: -1,
            externalLoyaltyRequest: null,
        },
        suggestedPrice: 'AllInclusive',
    },
    PriceStreamMetaLabRequest: {
        attributesId: [8, 1, 18, 7, 11, 2, 3],
    },
};
const getPayload = (cityId: string, userInput: IUserInputForCrawling = getRandomUserInput({}), pageNumber = 1) => {
    const { checkIn, checkOut, rooms } = userInput;
    const { adults, children, childAges } = destructureRooms(rooms);

    basePaylaoad.CitySearchRequest.cityId = parseInt(cityId);
    basePaylaoad.CitySearchRequest.searchRequest.searchCriteria.adults = adults;
    basePaylaoad.CitySearchRequest.searchRequest.searchCriteria.checkInDate =
        checkIn.toISOString();
    basePaylaoad.CitySearchRequest.searchRequest.searchCriteria.bookingDate =
        checkIn.toISOString();
    basePaylaoad.CitySearchRequest.searchRequest.searchCriteria.localCheckInDate =
        parseDateToISO(checkIn);
    basePaylaoad.CitySearchRequest.searchRequest.searchCriteria.los = 
        getDateDifferenceInDays(checkIn, checkOut);
    basePaylaoad.CitySearchRequest.searchRequest.searchCriteria.children = children;
    basePaylaoad.CitySearchRequest.searchRequest.searchCriteria.childAges = childAges;
    basePaylaoad.CitySearchRequest.searchRequest.searchCriteria.rooms = rooms.length;
    basePaylaoad.ContentSummaryRequest.context.occupancy.checkIn = checkIn.toISOString();
    basePaylaoad.ContentSummaryRequest.context.occupancy.numberOfAdults = adults;
    basePaylaoad.ContentSummaryRequest.context.occupancy.numberOfChildren = children;
    basePaylaoad.PricingSummaryRequest.pricing.checkIn = checkIn.toISOString();
    basePaylaoad.PricingSummaryRequest.pricing.checkout = checkOut.toISOString();
    basePaylaoad.PricingSummaryRequest.pricing.bookingDate = checkIn.toISOString();
    basePaylaoad.PricingSummaryRequest.pricing.localCheckInDate = parseDateToISO(checkIn);
    basePaylaoad.PricingSummaryRequest.pricing.localCheckoutDate = parseDateToISO(checkOut);

    basePaylaoad.CitySearchRequest.searchRequest.page.pageNumber = pageNumber;

    return basePaylaoad;
};

export const constructGraphQLPayload = (
    id: string,
    userInput: IUserInputForCrawling = getRandomUserInput({}),
    pageNumber = 1,
) => {
    return {
        operationName: 'citySearch',
        variables: getPayload(id, userInput, pageNumber),
        query: graphqlQuery,
    };
};
