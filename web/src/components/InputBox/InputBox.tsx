import React from "react";
import Input from "../Input/Input";
import { BiSearchAlt } from "react-icons/bi";
import { FiUsers } from "react-icons/fi";
import { VscCalendar } from "react-icons/vsc";
import Button from "../Button/Button";
import DateInput from "../Input/DateInput/DateInput";
import DestinationInput from "../Input/DestinationInput/DestinationInput";
import { IRoom } from "../GuestPicker/GuestPicker";
import GuestsInput from "../Input/GuestsInput/GuestsInput";

interface IProps {}

const InputBox: React.FC<IProps> = ({}) => {
  const [destination, setDestination] = React.useState("");
  const [checkIn, setCheckIn] = React.useState<Date | null>(null);
  const [checkOut, setCheckOut] = React.useState<Date | null>(null);
  const [rooms, setRooms] = React.useState<IRoom[]>([
    {
      adults: 2,
      childAges: []
    }
  ]);

  const handleCheckInDateChange = (e: any) => {
    console.log(e);
    setCheckIn(e);
  }

  const handleCheckOutDateChange = (e: any) => {
    setCheckOut(e);
  }

  const handleDestinationChange = (destination: any) => {
    setDestination(destination);
  }

  return (
    <form className="bg-gray-200 lg:h-52 h-96 rounded-[35px] flex flex-col lg:flex-row lg:gap-5 justify-center items-center gap-5 px-7">
      <DestinationInput
        className="self-center"
        name="destination"
        value={destination}
        placeholder="Enter the destination name..."
        handleChange={handleDestinationChange}
        // icon={<BiSearchAlt size={25} color="gray" />}
      />
      <DateInput
        className="self-center"
        name="checkin"
        value={checkIn}
        placeholder="Check-in..."
        minDate={new Date()}
        handleChange={handleCheckInDateChange}
      />
      <DateInput
        className="self-center"
        name="checkout"
        value={checkOut}
        placeholder="Check-out..."
        minDate={checkIn || new Date()}
        handleChange={handleCheckOutDateChange}
      />
      <GuestsInput rooms={rooms} setRooms={setRooms} />
      <Button text="Search" variant="big" type="submit"/>
    </form>
  );
};

export default InputBox;