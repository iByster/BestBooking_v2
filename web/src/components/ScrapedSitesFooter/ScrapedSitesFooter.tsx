import BookingLogo from "./logos/booking.png";
import AgodaLogo from "./logos/agoda.png";
import HotelsLogo from "./logos/hotels.png";
import TripLogo from "./logos/trip.png";
import AccorLogo from "./logos/accor.png";
import VrboLogo from "./logos/vrbo.png";
import ThreeDots from "./logos/3dots.png";

interface IProps {}

const ScrapedSitesFooter: React.FC<IProps> = ({}) => {
  return (
    <div className="flex flex-col w-full mt-20">
      <div className="mb-10">
        <p className="font-black text-lg">We compare multiple booking sites simultaneously:</p>
      </div>
      <div className="flex flex-row justify-between">
        <img src={BookingLogo} className="object-contain" />
        <img src={AgodaLogo} className="object-contain" />
        <img src={AccorLogo} className="object-contain" />
        <img src={TripLogo} className="object-contain" />
        <img src={VrboLogo} className="object-contain" />
        <img src={HotelsLogo} className="object-contain" />
        <img src={ThreeDots} className="object-contain" />
      </div>
    </div>
  );
};

export default ScrapedSitesFooter;
