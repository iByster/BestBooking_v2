import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
};

export type Destination = {
  area?: InputMaybe<Scalars['String']>;
  country: Scalars['String'];
  hotelName?: InputMaybe<Scalars['String']>;
  locationName: Scalars['String'];
  region?: InputMaybe<Scalars['String']>;
  terms?: InputMaybe<Array<Scalars['String']>>;
};

export type HotelContent = {
  __typename?: 'HotelContent';
  airConditioning?: Maybe<Scalars['Boolean']>;
  balcony?: Maybe<Scalars['Boolean']>;
  bathroom?: Maybe<Scalars['Boolean']>;
  bayView?: Maybe<Scalars['Boolean']>;
  coffeMachine?: Maybe<Scalars['Boolean']>;
  description?: Maybe<Scalars['String']>;
  freeParking?: Maybe<Scalars['Boolean']>;
  hotelName: Scalars['String'];
  imageLinks: Array<Scalars['String']>;
  kitchen?: Maybe<Scalars['Boolean']>;
  links: Array<Links>;
  mountainView?: Maybe<Scalars['Boolean']>;
  scores: Array<Scores>;
  washer?: Maybe<Scalars['Boolean']>;
  wifi?: Maybe<Scalars['Boolean']>;
};

export type HotelMetadata = {
  limit: Scalars['Int'];
  offset?: InputMaybe<Scalars['Float']>;
};

export type HotelPrice = {
  __typename?: 'HotelPrice';
  cleaningFee?: Maybe<Scalars['Float']>;
  currency?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  from?: Maybe<Scalars['DateTime']>;
  hotelId: Scalars['String'];
  pricePerNight?: Maybe<Scalars['Float']>;
  pricePerRoom?: Maybe<Scalars['Float']>;
  rooms?: Maybe<Scalars['String']>;
  serviceFee?: Maybe<Scalars['Float']>;
  taxes?: Maybe<Scalars['Float']>;
  to?: Maybe<Scalars['DateTime']>;
};

export type HotelPricesData = {
  __typename?: 'HotelPricesData';
  hotelPricesGraph: Array<HotelPricesGraph>;
  hotelPricesMain: Array<HotelPricesMain>;
};

export type HotelPricesGraph = {
  __typename?: 'HotelPricesGraph';
  field: Scalars['String'];
  value: Array<HotelPrice>;
};

export type HotelPricesMain = {
  __typename?: 'HotelPricesMain';
  field: Scalars['String'];
  value: HotelPrice;
};

export type HotelsResponse = {
  __typename?: 'HotelsResponse';
  hotelData: HotelContent;
  hotelLocationData: Location;
  hotelPricesData: HotelPricesData;
};

export type Links = {
  __typename?: 'Links';
  field: Scalars['String'];
  value: Scalars['String'];
};

export type Location = {
  __typename?: 'Location';
  address?: Maybe<Scalars['String']>;
  area?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  hotelId: Scalars['String'];
  lat?: Maybe<Scalars['Float']>;
  locationName: Scalars['String'];
  lon?: Maybe<Scalars['Float']>;
  region?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  getHotels: Response;
};


export type QueryGetHotelsArgs = {
  metadata: HotelMetadata;
  userInput: UserInput;
};

export type Response = {
  __typename?: 'Response';
  hasMore?: Maybe<Scalars['Boolean']>;
  main?: Maybe<HotelsResponse>;
  secondary: Array<HotelsResponse>;
};

export type RoomInput = {
  adults: Scalars['Float'];
  childAges: Array<Scalars['Int']>;
};

export type Score = {
  __typename?: 'Score';
  maxScore?: Maybe<Scalars['Float']>;
  reviews?: Maybe<Scalars['String']>;
  score?: Maybe<Scalars['Float']>;
};

export type Scores = {
  __typename?: 'Scores';
  field: Scalars['String'];
  value: Score;
};

export type UserInput = {
  checkIn: Scalars['DateTime'];
  checkOut: Scalars['DateTime'];
  destination: Destination;
  rooms: Array<RoomInput>;
};

export type HotelsQueryVariables = Exact<{
  userInput: UserInput;
  metadata: HotelMetadata;
}>;


export type HotelsQuery = { __typename?: 'Query', getHotels: { __typename?: 'Response', hasMore?: boolean | null, main?: { __typename?: 'HotelsResponse', hotelLocationData: { __typename?: 'Location', hotelId: string, locationName: string, lat?: number | null, lon?: number | null, country?: string | null, area?: string | null, address?: string | null, region?: string | null }, hotelData: { __typename?: 'HotelContent', hotelName: string, description?: string | null, imageLinks: Array<string>, wifi?: boolean | null, kitchen?: boolean | null, washer?: boolean | null, bayView?: boolean | null, mountainView?: boolean | null, freeParking?: boolean | null, balcony?: boolean | null, bathroom?: boolean | null, airConditioning?: boolean | null, coffeMachine?: boolean | null, links: Array<{ __typename?: 'Links', field: string, value: string }>, scores: Array<{ __typename?: 'Scores', field: string, value: { __typename?: 'Score', score?: number | null, maxScore?: number | null, reviews?: string | null } }> }, hotelPricesData: { __typename?: 'HotelPricesData', hotelPricesMain: Array<{ __typename?: 'HotelPricesMain', field: string, value: { __typename?: 'HotelPrice', pricePerNight?: number | null, pricePerRoom?: number | null, cleaningFee?: number | null, currency?: string | null, serviceFee?: number | null, date?: any | null, from?: any | null, to?: any | null, taxes?: number | null, description?: string | null, rooms?: string | null } }>, hotelPricesGraph: Array<{ __typename?: 'HotelPricesGraph', field: string, value: Array<{ __typename?: 'HotelPrice', pricePerNight?: number | null, pricePerRoom?: number | null, cleaningFee?: number | null, currency?: string | null, serviceFee?: number | null, date?: any | null, from?: any | null, to?: any | null, taxes?: number | null, description?: string | null, rooms?: string | null }> }> } } | null, secondary: Array<{ __typename?: 'HotelsResponse', hotelLocationData: { __typename?: 'Location', hotelId: string, locationName: string, lat?: number | null, lon?: number | null, country?: string | null, area?: string | null, address?: string | null, region?: string | null }, hotelData: { __typename?: 'HotelContent', hotelName: string, description?: string | null, imageLinks: Array<string>, wifi?: boolean | null, kitchen?: boolean | null, washer?: boolean | null, bayView?: boolean | null, mountainView?: boolean | null, freeParking?: boolean | null, balcony?: boolean | null, bathroom?: boolean | null, airConditioning?: boolean | null, coffeMachine?: boolean | null, links: Array<{ __typename?: 'Links', field: string, value: string }>, scores: Array<{ __typename?: 'Scores', field: string, value: { __typename?: 'Score', score?: number | null, maxScore?: number | null, reviews?: string | null } }> }, hotelPricesData: { __typename?: 'HotelPricesData', hotelPricesMain: Array<{ __typename?: 'HotelPricesMain', field: string, value: { __typename?: 'HotelPrice', pricePerNight?: number | null, pricePerRoom?: number | null, cleaningFee?: number | null, currency?: string | null, serviceFee?: number | null, date?: any | null, from?: any | null, to?: any | null, taxes?: number | null, description?: string | null, rooms?: string | null } }>, hotelPricesGraph: Array<{ __typename?: 'HotelPricesGraph', field: string, value: Array<{ __typename?: 'HotelPrice', pricePerNight?: number | null, pricePerRoom?: number | null, cleaningFee?: number | null, currency?: string | null, serviceFee?: number | null, date?: any | null, from?: any | null, to?: any | null, taxes?: number | null, description?: string | null, rooms?: string | null }> }> } }> } };


export const HotelsDocument = gql`
    query Hotels($userInput: UserInput!, $metadata: HotelMetadata!) {
  getHotels(userInput: $userInput, metadata: $metadata) {
    main {
      hotelLocationData {
        hotelId
        locationName
        lat
        lon
        country
        area
        address
        region
      }
      hotelData {
        hotelName
        links {
          field
          value
        }
        description
        scores {
          field
          value {
            score
            maxScore
            reviews
          }
        }
        imageLinks
        wifi
        kitchen
        washer
        bayView
        mountainView
        freeParking
        balcony
        bathroom
        airConditioning
        coffeMachine
      }
      hotelPricesData {
        hotelPricesMain {
          field
          value {
            pricePerNight
            pricePerRoom
            cleaningFee
            currency
            serviceFee
            date
            from
            to
            taxes
            description
            rooms
          }
        }
        hotelPricesGraph {
          field
          value {
            pricePerNight
            pricePerRoom
            cleaningFee
            currency
            serviceFee
            date
            from
            to
            taxes
            description
            rooms
          }
        }
      }
    }
    secondary {
      hotelLocationData {
        hotelId
        locationName
        lat
        lon
        country
        area
        address
        region
      }
      hotelData {
        hotelName
        links {
          field
          value
        }
        description
        scores {
          field
          value {
            score
            maxScore
            reviews
          }
        }
        imageLinks
        wifi
        kitchen
        washer
        bayView
        mountainView
        freeParking
        balcony
        bathroom
        airConditioning
        coffeMachine
      }
      hotelPricesData {
        hotelPricesMain {
          field
          value {
            pricePerNight
            pricePerRoom
            cleaningFee
            currency
            serviceFee
            date
            from
            to
            taxes
            description
            rooms
          }
        }
        hotelPricesGraph {
          field
          value {
            pricePerNight
            pricePerRoom
            cleaningFee
            currency
            serviceFee
            date
            from
            to
            taxes
            description
            rooms
          }
        }
      }
    }
    hasMore
  }
}
    `;

/**
 * __useHotelsQuery__
 *
 * To run a query within a React component, call `useHotelsQuery` and pass it any options that fit your needs.
 * When your component renders, `useHotelsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHotelsQuery({
 *   variables: {
 *      userInput: // value for 'userInput'
 *      metadata: // value for 'metadata'
 *   },
 * });
 */
export function useHotelsQuery(baseOptions: Apollo.QueryHookOptions<HotelsQuery, HotelsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<HotelsQuery, HotelsQueryVariables>(HotelsDocument, options);
      }
export function useHotelsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HotelsQuery, HotelsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<HotelsQuery, HotelsQueryVariables>(HotelsDocument, options);
        }
export type HotelsQueryHookResult = ReturnType<typeof useHotelsQuery>;
export type HotelsLazyQueryHookResult = ReturnType<typeof useHotelsLazyQuery>;
export type HotelsQueryResult = Apollo.QueryResult<HotelsQuery, HotelsQueryVariables>;