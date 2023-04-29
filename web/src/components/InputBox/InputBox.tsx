import React from "react";
import { handlePredictionInput } from "../../utils/maps/handlePredictionInput";
import Button from "../Button/Button";
import { IRoom } from "../GuestPicker/GuestPicker";
import DateInput from "../Input/DateInput/DateInput";
import DestinationInput from "../Input/DestinationInput/DestinationInput";
import GuestsInput from "../Input/GuestsInput/GuestsInput";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getPayloadFromQueryString, getQueryStringFromPayload } from "../../utils/url/payload";
import Logo from "../Logo/Logo";

interface IProps {
  variant?: "search-page";
}

const InputBox: React.FC<IProps> = ({ variant }) => {
  const [searchParams] = useSearchParams();
  const searchParamsParsed = getPayloadFromQueryString(searchParams);
  const [destination, setDestination] = React.useState(searchParamsParsed?.destination || "");
  const [checkIn, setCheckIn] = React.useState<Date | null>(searchParamsParsed?.checkIn ? new Date(searchParamsParsed?.checkIn) : null);
  const [checkOut, setCheckOut] = React.useState<Date | null>(searchParamsParsed?.checkOut ? new Date(searchParamsParsed?.checkOut) : null);
  const [rooms, setRooms] = React.useState<IRoom[]>((searchParamsParsed.rooms.length > 0 && searchParamsParsed?.rooms) || [
    {
      adults: 2,
      childAges: [],
    },
  ]);
  const [errors, setErrors] = React.useState({
    destination: "",
    checkIn: "",
    checkOut: "",
    childAge: [],
  });
  const navigate = useNavigate();

  const handleCheckInDateChange = (e: any) => {
    setCheckIn(e);
  };

  const handleCheckOutDateChange = (e: any) => {
    setCheckOut(e);
  };

  const validateForm = () => {
    let formValid = true;
    const foundErrors: any = {};
    if (!destination) {
      foundErrors.destination = "Destination is required";
      formValid = false;
    } else {
      foundErrors.destination = "";
    }

    if (!checkIn) {
      foundErrors.checkIn = "Check-in is required";
      formValid = false;
    } else {
      foundErrors.checkIn = "";
    }

    if (!checkOut) {
      foundErrors.checkOut = "Check-out is required";
      formValid = false;
    } else {
      foundErrors.checkOut = "";
    }

    rooms.forEach((room, roomKey) => {
      const { childAges } = room;
      childAges.forEach((childAge, childAgeIndex) => {
        if (childAge === -1) {
          const childAgeError = {
            message: "Please select the child age",
            roomKey,
            childAgeIndex,
          };
          if (foundErrors.childAge) {
            foundErrors.childAge.push(childAgeError);
          } else {
            foundErrors.childAge = [childAgeError];
          }
        } else {
          if (foundErrors.childAge) {
            foundErrors.childAge.filter(
              (ca: any) =>
                ca.roomKey !== roomKey && ca.childAgeIndex !== childAgeIndex
            );
          }
        }
      });
    });

    setErrors({ ...errors, ...foundErrors });

    return formValid;
  };

  const handleDestinationChange = (destination: any) => {
    setDestination(destination);
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const parsedDestination = handlePredictionInput(destination);

    const payload = {
      destination: parsedDestination,
      checkIn: checkIn!,
      checkOut: checkOut!,
      rooms,
    };

    const queryString = getQueryStringFromPayload(payload);

    navigate({
      pathname: "/search",
      search: queryString.toString(),
    });
  };

  return (
    <>
      <form className={`bg-gray-200 lg:h-52 h-96 ${variant === "search-page" ? 'rounded-b-[35px] drop-shadow-md sticky top-0 z-50' : 'rounded-[35px]'} flex flex-col lg:flex-row lg:gap-5 justify-center items-center gap-5 px-7`}>
      {variant && variant === 'search-page' && (<div className="w-72 mr-16"><Logo noBackground /></div>)}
        <DestinationInput
          className="self-center"
          name="destination"
          value={destination}
          placeholder="Enter the destination name..."
          handleChange={handleDestinationChange}
          error={errors.destination}
        />
        <DateInput
          className="self-center"
          name="checkin"
          value={checkIn}
          placeholder="Check-in..."
          minDate={new Date()}
          handleChange={handleCheckInDateChange}
          error={errors.checkIn}
        />
        <DateInput
          className="self-center"
          name="checkout"
          value={checkOut}
          placeholder="Check-out..."
          minDate={checkIn || new Date()}
          handleChange={handleCheckOutDateChange}
          error={errors.checkOut}
        />
        <GuestsInput
          rooms={rooms}
          setRooms={setRooms}
          errors={errors.childAge}
        />
        <Button
          text="Search"
          variant="big"
          type="submit"
          onClick={handleSubmit}
        />
      </form>
    </>
  );
};

export default InputBox;
