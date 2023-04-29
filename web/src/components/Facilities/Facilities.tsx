import {
  FaBath,
  FaCoffee,
  FaMountain,
  FaParking,
  FaWifi,
} from "react-icons/fa";
import { MdAir, MdBalcony, MdBeachAccess } from "react-icons/md";
import { TbToolsKitchen2, TbWashMachine } from "react-icons/tb";

interface IProps {
  hotelData: any;
}

const Facilities: React.FC<IProps> = ({ hotelData }) => {
  const {
    airConditioning,
    balcony,
    bathroom,
    bayView,
    coffeMachine,
    freeParking,
    kitchen,
    washer,
    wifi,
    mountainView,
  } = hotelData;

  return (
    <div className="flex flex-row gap-5 text-center items-center ml-5">
      {airConditioning && (
        <div className="w-20 h-14">
          <MdAir size={30} className="mx-auto" />
          <p className="text-xs">Air conditioning</p>
        </div>
      )}
      {freeParking && (
        <div className="w-20 h-14">
          <FaParking size={30} className="mx-auto" />
          <p className="text-xs">Free parking</p>
        </div>
      )}
      {wifi && (
        <div className="w-20 h-14">
          <FaWifi size={30} className="mx-auto" />
          <p className="text-xs">Free wifi</p>
        </div>
      )}
      {coffeMachine && (
        <div className="w-20 h-14">
          <FaCoffee size={30} className="mx-auto" />
          <p className="text-xs">Coffe machine</p>
        </div>
      )}
      {kitchen && (
        <div className="w-20 h-14">
          <TbToolsKitchen2 size={30} className="mx-auto" />
          <p className="text-xs">Kitchen</p>
        </div>
      )}
      {bathroom && (
        <div className="w-20 h-14">
          <FaBath size={30} className="mx-auto" />
          <p className="text-xs">Private bathroom</p>
        </div>
      )}
      {washer && (
        <div className="w-20 h-14">
          <TbWashMachine size={30} className="mx-auto" />
          <p className="text-xs">Washer</p>
        </div>
      )}
      {balcony && (
        <div className="w-20 h-14">
          <MdBalcony size={30} className="mx-auto" />
          <p className="text-xs">Balcony</p>
        </div>
      )}
      {mountainView && (
        <div className="w-20 h-14">
          <FaMountain size={30} className="mx-auto" />
          <p className="text-xs">Mountain view</p>
        </div>
      )}
      {bayView && (
        <div className="w-20 h-14">
          <MdBeachAccess size={30} className="mx-auto" />
          <p className="text-xs">Bay view</p>
        </div>
      )}
    </div>
  );
};

export default Facilities;
