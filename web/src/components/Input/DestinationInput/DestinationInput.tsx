import { ReactNode, useRef, useState } from "react";
import { usePlacesWidget } from "react-google-autocomplete";
import { BiSearchAlt } from "react-icons/bi";
import { FaHotel } from "react-icons/fa";
import { MdLocationPin } from "react-icons/md";
import Input from "../Input";
import useGoogle from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import Popper from "../../Popper/Popper";

interface IProps {
  type?: string;
  className?: string;
  value: any;
  name: string;
  handleChange(e: any): void;
  placeholder?: string;
  error: string;
}

const DestinationInput: React.FC<IProps> = ({
  value,
  className,
  placeholder,
  handleChange,
  error,
}) => {
  const { placePredictions, getPlacePredictions, isPlacePredictionsLoading } =
    useGoogle({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    });
  const [predictionsOpen, setPredictionsOpen] = useState(false);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const place = e.target.value;
    getPlacePredictions({ input: place });
    handleChange(place);
  };

  const handleOptionSelect = (prediction: any) => {
    handleChange(prediction);
    setPredictionsOpen(false);
  };

  const handleOpenPredictions = () => {
    setPredictionsOpen(true);
  };

  return (
    <div className="h-12 relative">
      <div onClick={handleOpenPredictions}>
        <Input
          // ref={ref}
          className={`${className}`}
          name="destination"
          value={value.description}
          placeholder={placeholder || "Enter the destination name..."}
          icon={<BiSearchAlt size={25} color="gray" />}
          handleChange={onInputChange}
          error={error}
          autoComplete="off"
          // onFocus={handleInputFocus}
        />
      </div>
      {(!isPlacePredictionsLoading &&
        placePredictions &&
        placePredictions.length &&
        predictionsOpen && (
          <ul className="bg-white p-2 rounded-md shadow-md absolute w-80 z-50">
            <div>
              {placePredictions.map((prediction, key) => (
                <li
                  key={key}
                  className="cursor-pointer py-1 px-2 hover:bg-gray-100 flex flex-row border-b-gray-500-200 border-b-2"
                  onClick={() => handleOptionSelect(prediction)}
                >
                  <div className="mr-4 my-auto w-5">
                    {prediction.types.includes("establishment") ? (
                      <FaHotel color="gray" />
                    ) : (
                      <MdLocationPin size={23} color="gray" />
                    )}
                  </div>
                  <p className="text-sm ">{prediction.description}</p>
                </li>
              ))}
            </div>
          </ul>
        )) || <></>}
    </div>
  );
};

export default DestinationInput;
