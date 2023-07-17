import { useSearchParams } from "react-router-dom";
import { getPayloadFromQueryString } from "../../utils/url/payload";
import { useHotelsQuery } from "../../generated/graphql";
import HotelList from "../../components/HotelList/HotelList";
import HotelCard from "../../components/HotelCard/HotelCard";
import Wrapper from "../../components/Wrapper/Wrapper";
import { Waypoint } from "react-waypoint";
import { useState } from "react";
import LoadingOffers from "../../components/LoadingOffers/LoadingOffers";
import InputBox from "../../components/InputBox/InputBox";

interface IProps {}

const Hotels: React.FC<IProps> = ({}) => {
  const [searchParams] = useSearchParams();
  const [offset, setOffset] = useState(0);
  const { data, fetchMore, networkStatus } = useHotelsQuery({
    variables: {
      userInput: getPayloadFromQueryString(searchParams),
      metadata: {
        limit: 20,
        offset: 0,
      },
    },
    notifyOnNetworkStatusChange: true,
  });

  return (
    <>
      <InputBox variant="search-page" />
      <Wrapper classNames="gap-10 mt-20">
        {!data || !data.getHotels ? (
          <LoadingOffers />
        ) : (
          <>
            {data?.getHotels.main && (
              <>
                <HotelCard variant="main" hotel={data.getHotels.main} />
                <div className="w-[85%] h-1 bg-gray-100"></div>
              </>
            )}
            {data?.getHotels.secondary.map((hotel, i) => {
              return (
              <>
                <HotelCard
                  hotel={hotel}
                  key={hotel.hotelLocationData.hotelId}
                />

                {i === data.getHotels.secondary.length - 1 && (
                  <Waypoint
                    onEnter={() => {
                      if (data.getHotels?.hasMore) {
                        setOffset(offset + 20);
                        return fetchMore({
                          variables: {
                            userInput: getPayloadFromQueryString(searchParams),
                            metadata: {
                              limit: 20,
                              offset: offset,
                            },
                          },
                          updateQuery: (pv: any, { fetchMoreResult }: any) => {
                            if (!fetchMoreResult) {
                              return pv;
                            }

                            return {
                              getHotels: {
                                __typename: "Response",
                                main: [pv.getHotels.main],
                                secondary: [
                                  ...pv.getHotels.secondary,
                                  ...fetchMoreResult.getHotels.secondary,
                                ],
                                hasMore: fetchMoreResult.getHotels.hasMore,
                              },
                            };
                          },
                        });
                      }
                    }}
                  />
                )}
              </>
            )})}
          </>
        )}
        {networkStatus === 3 ? <LoadingOffers /> : null}
        {!data?.getHotels?.hasMore && (
          <div className="bg-gray-200 p-8 font-extrabold mb-10 rounded-full drop-shadow-md">
            That's all the holtels
          </div>
        )}
      </Wrapper>
    </>
  );
};

export default Hotels;
