import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  Tooltip,
} from "@material-tailwind/react";
import React, { useState } from "react";
import { MdLocationPin } from "react-icons/md";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import {
  AGODA_COM,
  BOOKING_COM,
  DIRECT_BOOKING_RO,
  ESKY_RO,
} from "../../constants";
import {
  destructureRooms,
  extractMainScore,
  getLocationString,
  parseDateToISO,
} from "../../utils/parse/parseUtils";
import Facilities from "../Facilities/Facilities";
import HotelPrice from "../HotelPrice/HotelPrice";
import Rating from "../Rating/Rating";
import HotelPricesScatterChart from "../ScatterChart/HotelPricesScatterChart";

interface IProps {
  hotel: any;
}

function Icon({ id, open }: { id: number; open: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`${
        id === open ? "rotate-180" : ""
      } h-10 w-10 transition-transform`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={3}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

const CustomChartToolTip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const hotelPrice = payload[0].payload;

    const { pricePerNight, description, from, to, rooms } = hotelPrice;

    const roomsParse = JSON.parse(rooms);
    const { adults, children } = destructureRooms(roomsParse);

    return (
      <div className="bg-gray-300 p-3 rounded-md">
        <p className="font-extrabold">{description}</p>
        <p>
          Price per night:{" "}
          <span className="font-extrabold">{pricePerNight.toFixed(2)}</span>
        </p>
        <p>From: {parseDateToISO(new Date(from))}</p>
        <p>To: {parseDateToISO(new Date(to))}</p>
        <p>
          Guests: {adults} adults, {children} children, {roomsParse.length}{" "}
          rooms
        </p>
      </div>
    );
  }

  return null;
};

const HotelCard: React.FC<IProps> = ({ hotel }) => {
  const [openCard, setOpenCard] = useState(0);
  const { hotelLocationData, hotelData, hotelPricesData } = hotel;
  const { hotelName, imageLinks, scores, links, description } = hotelData;
  const { hotelPricesMain, hotelPricesGraph } = hotelPricesData;
  const hotelPriceMainSorted = [...hotelPricesMain]?.sort(
    (a: any, b: any) => a.value.pricePerNight - b.value.pricePerNight
  );
  const hotelPricesMainFirstPart = hotelPriceMainSorted.slice(0, 2);
  const hotelPricesMainSecondPart = hotelPriceMainSorted.slice(2);
  const mainScore = extractMainScore(scores);
  const { address, lat, lon } = hotelLocationData;

  const handleOpenCard = (value: number) => {
    setOpenCard(openCard === value ? 0 : value);
  };

  const getChartColorBySiteName = (site: string) => {
    if (site.includes(BOOKING_COM)) {
      return "#065d9e";
    }

    if (site.includes(ESKY_RO)) {
      return "#149DAC";
    }

    if (site.includes(DIRECT_BOOKING_RO)) {
      return "#82ca9d";
    }

    if (site.includes(AGODA_COM)) {
      return "#b21717";
    }
  };

  return (
    <div className="bg-gray-200 w-3/4 rounded-3xl drop-shadow-md">
      <Accordion
        className=""
        open={openCard === 1}
        icon={
          <Tooltip content="Check graphics">
            <div
              onClick={() => handleOpenCard(1)}
              className="cursor-pointer w-16"
            >
              <Icon id={1} open={openCard} />
            </div>
          </Tooltip>
        }
      >
        <AccordionHeader className="border-none h-[18rem] cursor-default justify-start">
          <div className="w-72">
            <Slide autoplay={false}>
              {imageLinks &&
                imageLinks.map((image: string, key: number) => (
                  <div key={key} className="h-[18rem] w-96">
                    <img
                      src={image}
                      className="object-cover w-72 h-[18rem] rounded-l-3xl"
                    />
                  </div>
                ))}
            </Slide>
          </div>
          <div className="ml-10 font-bold w-[60%] text-left flex flex-col gap-4">
            <p>{hotelName}</p>
            <a href={`http://maps.google.com/?ie=UTF8&hq=&ll=${lat},${lon}&z=70`} target="_blank">
              <div className="flex flex-row cursor-pointer">
                <MdLocationPin size={25} color="black" className="mr-2" />
                <span className=" text-xs my-auto">
                  {address ? address : getLocationString(hotelLocationData)}
                </span>
              </div>
            </a>
            <Rating
              maxScore={mainScore?.value?.maxScore}
              score={mainScore?.value?.score}
              reviews={mainScore?.value?.reviews}
              site={mainScore?.field}
            />
            <div className="flex flex-row gap-5">
              {hotelPricesMainFirstPart &&
                hotelPricesMainFirstPart.map(
                  (hotelPrice: any, index: number) => {
                    if (index === 0) {
                      return (
                        <HotelPrice
                          link={
                            links.find(
                              (link: any) => link.field === hotelPrice.field
                            ).value
                          }
                          color="green"
                          hotelPrice={hotelPrice.value}
                          site={hotelPrice.field}
                        />
                      );
                    }
                    if (index === 1) {
                      return (
                        <HotelPrice
                          link={
                            links.find(
                              (link: any) => link.field === hotelPrice.field
                            ).value
                          }
                          color="yellow"
                          hotelPrice={hotelPrice.value}
                          site={hotelPrice.field}
                        />
                      );
                    }

                    return (
                      <HotelPrice
                        link={
                          links.find(
                            (link: any) => link.field === hotelPrice.field
                          ).value
                        }
                        color="red"
                        hotelPrice={hotelPrice.value}
                        site={hotelPrice.field}
                      />
                    );
                  }
                )}
            </div>
          </div>
        </AccordionHeader>
        <AccordionBody>
          <div className="p-4 flex flex-col gap-5">
            {hotelPricesMainSecondPart &&
              hotelPricesMainSecondPart.length > 0 && (
                <>
                  <p className="font-extrabold text-md">Other prices:</p>
                  <div className="font-extrabold flex flex-row gap-5 ml-5">
                    {hotelPricesMainSecondPart.map(
                      (hotelPrice: any, index: number) => {
                        if (hotelPricesMainSecondPart.length > 2) {
                          if (index === 0) {
                            return (
                              <HotelPrice
                                color="before-yellow"
                                hotelPrice={hotelPrice.value}
                                site={hotelPrice.field}
                                link={
                                  links.find(
                                    (link: any) =>
                                      link.field === hotelPrice.field
                                  ).value
                                }
                              />
                            );
                          }
                          if (index === 1) {
                            return (
                              <HotelPrice
                                color="red"
                                hotelPrice={hotelPrice.value}
                                site={hotelPrice.field}
                                link={
                                  links.find(
                                    (link: any) =>
                                      link.field === hotelPrice.field
                                  ).value
                                }
                              />
                            );
                          }
                        }
                        return (
                          <HotelPrice
                            color="red"
                            hotelPrice={hotelPrice.value}
                            site={hotelPrice.field}
                            link={
                              links.find(
                                (link: any) => link.field === hotelPrice.field
                              ).value
                            }
                          />
                        );
                      }
                    )}
                  </div>
                </>
              )}
            <div>
              <p className="font-extrabold text-md mb-4">Description: </p>
              <p className="ml-5 text-md">{description}</p>
            </div>
            <div>
              <p className="font-extrabold text-md mb-4">Facilities: </p>
              <Facilities hotelData={hotelData} />
            </div>
            {hotelPricesGraph && hotelPricesGraph.length > 0 && (
              <div className="flex flex-col h-[500px]">
                <p className="font-extrabold text-md mb-6">Price over time: </p>
                <HotelPricesScatterChart hotelPricesGraph={hotelPricesGraph} />
              </div>
            )}
          </div>
        </AccordionBody>
      </Accordion>
    </div>
  );
};

export default HotelCard;
