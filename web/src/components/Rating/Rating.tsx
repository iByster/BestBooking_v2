import { convertRatingToScale10 } from "../../utils/parse/parseUtils";

interface IProps {
  score: number;
  maxScore: number;
  reviews: string;
  site: string;
}

const Rating: React.FC<IProps> = ({ score, maxScore, reviews, site }) => {
  const ratingScaled = convertRatingToScale10(score, maxScore);

  const getStyle = () => {
    if (!ratingScaled) {
      return "bg-red-400 text-white";
    }

    if (ratingScaled < 4) {
      // red
      return "bg-red-400 text-white";
    } else if (ratingScaled >= 4 && ratingScaled <= 7) {
      // yellow
      return "bg-yellow-500 text-black";
    } else {
      // green
      return "bg-light-green-600 text-white";
    }
  };

  function getRatingText() {
    if (ratingScaled >= 9) {
      return "Excellent";
    } else if (ratingScaled >= 7.5) {
      return "Very good";
    } else if (ratingScaled >= 6.5) {
      return "Good";
    } else if (ratingScaled >= 5) {
      return "Average";
    } else if (ratingScaled >= 3) {
      return "Below average";
    } else {
      return "Poor";
    }
  }

  const getText = () => {};

  return (
    <div className={`flex flex-row text-sm gap-3 items-center`}>
      <div className={`rounded-3xl ${getStyle()} text-center py-[8px] px-3 min-w-[20px] ${ratingScaled ? 'w-14' : 'w-28'}`}>
        <span className="">{score || "No rating"}</span>
      </div>
      <span>{`${getRatingText()}, ${reviews ? reviews + ' reviews' : '0 reviews'}`}</span>
    </div>
  );
};

export default Rating;
