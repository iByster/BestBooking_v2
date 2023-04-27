import { Arg, Query, Resolver } from 'type-graphql';
import { Hotel } from '../entities/Hotel';
import HotelPricesService from '../services/HotelPricesService';
import HotelService from '../services/HotelService';
import LocationService from '../services/LocationService';
import {
    HotelContent,
    HotelMetadata,
    HotelsResponse,
    Response,
    UserInput,
} from './GraphqlTypes';

@Resolver()
class HotelResolver {
    private hotelService: HotelService = new HotelService();
    private locationService: LocationService = new LocationService();
    private hotelPricesService: HotelPricesService = new HotelPricesService();

    // TODO add index on hotelName for hotel table
    // TODO add index on all locations for location table
    @Query(() => Response)
    public async getHotels(
        // @Ctx() { req }: MyContext,
        @Arg('userInput') userInput: UserInput,
        @Arg('metadata') metadata: HotelMetadata
    ): Promise<Response> {
        let hotels;
        const response: Response = { secondary: [] };
        const { destination } = userInput;

        if (destination.hotelName) {
            hotels = await this.hotelService.getHotelsByName(
                destination,
                metadata
            );
        } else {
            hotels = await this.hotelService.getHotelsByLocation(
                destination,
                metadata
            );
        }

        const hotelNames = hotels.map((hotel) => hotel.hotelName);

        const maybeMissedHotels = await this.hotelService.enhanceHotelsFound(
            hotelNames
        );
        const enhancedHotels = [...hotels, ...maybeMissedHotels];

        const hotelsUnique: Hotel[] = [];

        enhancedHotels.forEach((hotel) => {
            if (!hotelsUnique.find((unique) => unique.id === hotel.id)) {
                hotelsUnique.push(hotel);
            }
        });

        const hotelIds = hotelsUnique.map((hotel) => hotel.id);

        const locations = await this.locationService.getLocationsByHotels(
            hotelIds
        );
        const hotelPrices =
            (await this.hotelPricesService.getHotelPricesByHotelIds(hotelIds))
            .filter((hotelPrice => !isNaN(hotelPrice.pricePerNight!)));

        const hotelResponse: HotelsResponse[] = [];

        hotelsUnique.map((hotel) => {
            const hotelIndex = hotelResponse.findIndex(
                (res) => res.hotelData.hotelName === hotel.hotelName
            );

            // hotel by name was not added in the response
            if (hotelIndex === -1) {
                let parsedRating: any = null;
                if (hotel?.rating && typeof hotel?.rating === 'string') {
                    parsedRating = JSON.parse(hotel.rating);
                }

                const hotelData: HotelContent = {
                    hotelName: hotel.hotelName,
                    description: hotel.description,
                    imageLinks: [hotel.imageLink ? hotel.imageLink : null],
                    wifi: hotel.wifi,
                    airConditioning: hotel.airConditioning,
                    balcony: hotel.balcony,
                    bathroom: hotel.bathroom,
                    bayView: hotel.bayView,
                    coffeMachine: hotel.coffeMachine,
                    freeParking: hotel.freeParking,
                    kitchen: hotel.kitchen,
                    mountainView: hotel.mountainView,
                    washer: hotel.washer,
                    scores: [
                        {
                            value: {
                                score: parsedRating ? parsedRating.score : null,
                                maxScore: parsedRating
                                    ? parsedRating.maxScore
                                    : null,
                                reviews: hotel.reviews ? hotel.reviews : null,
                            },
                            field: hotel.siteOrigin,
                        },
                    ],
                    links: [
                        {
                            field: hotel.siteOrigin,
                            value: hotel.link.includes(hotel.siteOrigin)
                                ? hotel.link
                                : `${hotel.siteOrigin}${hotel.link}`,
                        },
                    ],
                };
                const locationDataIndex = locations.findIndex(
                    (location) => location.hotelId === hotel.id
                );
                const hotelLocationData = locations[locationDataIndex];

                // locations.splice(locationDataIndex, 1);

                const hotelPricesFilter = hotelPrices.filter(
                    (prices) => prices.hotelId === hotel.id
                );

                const hotelPricesData = [
                    {
                        value: hotelPricesFilter,
                        field: hotel.siteOrigin,
                    },
                ];

                if (
                    destination.hotelName &&
                    hotel.hotelName === destination.hotelName
                ) {
                    response.main = {
                        hotelData,
                        hotelLocationData,
                        hotelPricesData,
                    };
                }

                hotelResponse.push({
                    hotelData,
                    hotelLocationData,
                    hotelPricesData,
                });
            } else {
                const currentHotelLink = hotel.siteOrigin;

                if (
                    !hotelResponse[hotelIndex].hotelData.links.find(
                        (a) => a.value.includes(hotel.link) || a.value === hotel.link
                    )
                ) {
                    if (currentHotelLink === 'https://www.booking.com/') {
                        if (hotel.description) {
                            hotelResponse[hotelIndex].hotelData.description =
                                hotel.description;
                        }
                    }
                    if (hotel.imageLink) {
                        hotelResponse[hotelIndex].hotelData.imageLinks.push(
                            hotel.imageLink
                        );
                    }

                    const scoreIndex = hotelResponse[
                        hotelIndex
                    ].hotelData.scores.findIndex(
                        (h) => (h.field === currentHotelLink)
                    );

                    let parsedRating: any = null;
                    if (hotel?.rating && typeof hotel?.rating === 'string') {
                        parsedRating = JSON.parse(hotel.rating);
                    }

                    // if (scoreIndex !== -1) {
                        hotelResponse[hotelIndex].hotelData.scores.push({
                            field: currentHotelLink,
                            value: {
                                reviews: hotel.reviews ? hotel.reviews : null,
                                maxScore: parsedRating
                                    ? parsedRating.maxScore
                                    : null,
                                score: parsedRating
                                    ? parsedRating.score
                                    : null,
                            },
                        });
                    // }

                    hotelResponse[hotelIndex].hotelData.links.push({
                        field: currentHotelLink,
                        value: hotel.link.includes(hotel.siteOrigin)
                            ? hotel.link
                            : `${hotel.siteOrigin}${hotel.link}`,
                    });
                    hotelResponse[hotelIndex].hotelData.airConditioning =
                        hotelResponse[hotelIndex].hotelData.airConditioning ||
                        hotel.airConditioning;
                    hotelResponse[hotelIndex].hotelData.balcony =
                        hotelResponse[hotelIndex].hotelData.balcony ||
                        hotel.balcony;
                    hotelResponse[hotelIndex].hotelData.bathroom =
                        hotelResponse[hotelIndex].hotelData.bathroom ||
                        hotel.bathroom;
                    hotelResponse[hotelIndex].hotelData.bayView =
                        hotelResponse[hotelIndex].hotelData.bayView ||
                        hotel.bayView;
                    hotelResponse[hotelIndex].hotelData.coffeMachine =
                        hotelResponse[hotelIndex].hotelData.coffeMachine ||
                        hotel.coffeMachine;
                    hotelResponse[hotelIndex].hotelData.wifi =
                        hotelResponse[hotelIndex].hotelData.wifi || hotel.wifi;
                    hotelResponse[hotelIndex].hotelData.freeParking =
                        hotelResponse[hotelIndex].hotelData.freeParking ||
                        hotel.freeParking;
                    hotelResponse[hotelIndex].hotelData.washer =
                        hotelResponse[hotelIndex].hotelData.washer ||
                        hotel.washer;
                    hotelResponse[hotelIndex].hotelData.kitchen =
                        hotelResponse[hotelIndex].hotelData.kitchen ||
                        hotel.kitchen;
                    hotelResponse[hotelIndex].hotelData.mountainView =
                        hotelResponse[hotelIndex].hotelData.mountainView ||
                        hotel.mountainView;
                }

                const hotelPricesFilter = hotelPrices.filter(
                    (prices) => prices.hotelId === hotel.id
                );

                const priceIndex = hotelResponse[
                    hotelIndex
                ].hotelPricesData.findIndex(
                    (h) => h.field === currentHotelLink
                );

                if (priceIndex !== -1) {
                    // console.log('here', hotelPricesFilter);
                    hotelResponse[hotelIndex].hotelPricesData[
                        priceIndex
                    ].value.push(...hotelPricesFilter);
                } else {
                    // console.log('here2', hotelPricesFilter);
                    hotelResponse[hotelIndex].hotelPricesData.push({
                        field: currentHotelLink,
                        value: [...hotelPricesFilter],
                    });
                }
            }
        });

        for (let i = 0; i < hotelResponse.length; ++i) {
            for (let j = 0; j < hotelResponse[i].hotelPricesData.length; ++j) {
                hotelResponse[i].hotelPricesData[j].value.sort((a, b) => {
                    return (
                        new Date(a.from!).getTime() -
                        new Date(b.from!).getTime()
                    );
                });
            }
        }

        response.secondary = hotelResponse;

        return response;
    }
}

export default HotelResolver;
