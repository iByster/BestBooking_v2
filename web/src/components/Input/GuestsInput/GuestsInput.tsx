import { FiUsers } from "react-icons/fi";
import Popper from "../../Popper/Popper";
import Input from "../Input";
import GuestsPicker, { IRoom } from "../../GuestPicker/GuestPicker";
import useOutsideClick from "../../../hooks/useOutsideClick";
import { useRef, useState } from "react";

interface IProps {
  rooms: IRoom[];
  setRooms(rooms: IRoom[]): void;
}

const GuestsInput: React.FC<IProps> = ({ rooms, setRooms }) => {
  const destructureRooms = (rooms: IRoom[]) => {
    const adults = rooms.reduce((a, b) => a + b.adults, 0);
    const children = rooms.reduce((a, b) => a + b.childAges.length, 0);
    const childAges = rooms
      .map((r) => {
        return r.childAges;
      })
      .flat();

    return { adults, childAges, children };
  };

  const getNumberOfTravellers = (rooms: IRoom[]) => {
    const { adults, children } = destructureRooms(rooms);

    return adults + children;
  };

  return (
    <Popper
      trigger={
        <div>
          <Input
            className="self-center"
            name="guests"
            value={`${getNumberOfTravellers(rooms)} travellers, ${
              rooms.length
            } rooms`}
            placeholder="Guests..."
            readOnly
            icon={<FiUsers size={25} color="gray" />}
          />
        </div>
      }
      placement="bottom"
    >
      <GuestsPicker rooms={rooms} setRooms={setRooms} />
    </Popper>
  );
};

export default GuestsInput;
