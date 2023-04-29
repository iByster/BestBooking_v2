import { useState } from "react";
import { VscAdd, VscChromeMinimize } from "react-icons/vsc";
import ChildAgeSelect from "../../components/Select/ChildAgeSelect";

interface IProps {
  rooms: IRoom[];
  setRooms(rooms: IRoom[]): void;
  errors: { message: string, roomKey: number, childAgeIndex: number }[];
}

export interface IRoom {
  adults: number;
  childAges: number[];
}

const GuestsPicker: React.FC<IProps> = ({ rooms, setRooms, errors }) => {
  const handleRoomAdultIncrement = (roomKey: number) => {
    const newRooms = [...rooms];
    newRooms[roomKey].adults++;
    setRooms(newRooms);
  };

  const handleRoomAdultDecriment = (roomKey: number) => {
    const newRooms = [...rooms];
    if (newRooms[roomKey].adults > 1) {
      newRooms[roomKey].adults--;
      setRooms(newRooms);
    }
  };

  const handleRoomChildrenIncrement = (roomKey: number) => {
    const newRooms = [...rooms];
    newRooms[roomKey].childAges.push(-1);
    setRooms(newRooms);
  };

  const handleRoomChildrenDecriment = (roomKey: number) => {
    const newRooms = [...rooms];
    if (newRooms[roomKey].childAges.length > 0) {
      newRooms[roomKey].childAges.pop();
      setRooms(newRooms);
    }
  };

  const handleRemoveRoom = (e: React.MouseEvent<HTMLButtonElement>, roomKey: number) => {
    e.preventDefault();
    const newRooms = [...rooms];
    newRooms.splice(roomKey, 1);

    setRooms(newRooms);
  };

  const handleAddNewRoom = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const newRooms = [...rooms];
    const newRoom = {
      adults: 1,
      childAges: [],
    };

    newRooms.push(newRoom);
    setRooms(newRooms);
  };

  const adultsRow = (adults: number, roomKey: number) => {
    return (
      <div className="flex flex-row gap-28">
        <div className="w-20">
          <p>Adults</p>
        </div>
        <div className="flex flex-row gap-4">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-gray-200 border border-gray-200"
            onClick={() => handleRoomAdultIncrement(roomKey)}
          >
            <VscAdd />
          </div>
          {adults}
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-gray-200 border border-gray-200"
            onClick={() => handleRoomAdultDecriment(roomKey)}
          >
            <VscChromeMinimize />
          </div>
        </div>
      </div>
    );
  };

  const childrenRow = (childAges: number[], roomKey: number) => {
    return (
      <div className="flex flex-row gap-28">
        <div className="w-20">
          <p>Children</p>
        </div>
        <div className="flex flex-row gap-4">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-gray-200 border border-gray-200"
            onClick={() => handleRoomChildrenIncrement(roomKey)}
          >
            <VscAdd />
          </div>
          {childAges.length}
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-gray-200 border border-gray-200"
            onClick={() => handleRoomChildrenDecriment(roomKey)}
          >
            <VscChromeMinimize />
          </div>
        </div>
      </div>
    );
  };

  
  const handleAgeChange = (childAgeKey: number, roomKey: number, age: string | undefined) => {
    const newRooms = [...rooms];
    newRooms[roomKey].childAges[childAgeKey] = age ? parseInt(age) : -1;
    setRooms(newRooms);
  }

  const childAgesRow = (childAges: number[], roomKey: number, errors: { message: string, roomKey: number, childAgeIndex: number }[]) => {
    return childAges.map((childAge: number, id: number) => {
      if (childAge !== -1) {
        return <ChildAgeSelect childId={id} age={childAge} handleAgeChange={handleAgeChange} roomKey={roomKey} key={id}/>;
      } else {
        const errorMessage = errors.find(error => error.childAgeIndex === id && error.roomKey === roomKey)?.message;
        return <ChildAgeSelect childId={id} handleAgeChange={handleAgeChange} roomKey={roomKey} key={id}  error={errorMessage} />;
      }
    });
  };

  return (
    <div className="border border-black w-80 flex flex-col gap-5 bg-white mt-1 pt-4">
      {rooms &&
        rooms.map((room: IRoom, key: number) => {
          return (
            <div className="mx-auto flex flex-col gap-5" key={key}>
              <h2 className="font-extrabold">Room {key + 1}</h2>
              <hr />
              {adultsRow(room.adults, key)}
              {childrenRow(room.childAges, key)}
              {room.childAges &&
                room.childAges.length > 0 &&
                childAgesRow(room.childAges, key, errors)}

              {rooms.length > 1 && (
                <button
                  className="hover:bg-gray-200 w-32 h-8 ml-auto"
                  onClick={(e) => handleRemoveRoom(e, key)}
                >
                  <p className="font-bold text-dark-gold">Remove room</p>
                </button>
              )}
            </div>
          );
        })}
      <button
        className="hover:bg-gray-200 w-52 h-8 ml-auto mr-6"
        onClick={handleAddNewRoom}
      >
        <p className="font-bold text-dark-gold">Add another room</p>
      </button>
    </div>
  );
};

export default GuestsPicker;
