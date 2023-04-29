interface IProps {
  color: "green" | "yellow" | "red" | "before-red" | "before-yellow";
  hotelPrice: any;
  site: string;
  link: string;
}

const HotelPrice: React.FC<IProps> = ({ color, hotelPrice, site, link }) => {
  const getColor = () => {
    if (color === "green") {
      return "bg-green-200";
    }

    if (color === "yellow") {
      return "bg-amber-200";
    }

    return "bg-deep-orange-300";
  };

  const getSite = () => {
    if (color === "green") {
      return (
        <p>
          <span className="font-extrabold ">Best prices: </span>
          {site.replace(/^https?:\/\//i, "").split("/")[0]}
        </p>
      );
    }

    return <p>{site.replace(/^https?:\/\//i, "").split("/")[0]}</p>;
  };

  return (
    <a href={link} target="_blank" >
      <div className={`${getColor()} w-72 p-3 rounded-xl`}>
        <p className="text-xs mb-3">{getSite()}</p>
        <p className="text-xl">{`${
          hotelPrice.pricePerNight ? hotelPrice.pricePerNight.toFixed(2) : ""
        } ${hotelPrice.currency}`} <span className="text-xs">/night</span></p>
      </div>
    </a>
  );
};

export default HotelPrice;
