import { IRoom } from "../../components/GuestPicker/GuestPicker";
import { Location } from "../../generated/graphql";
import { Destination } from "../url/payload";

export const parseDateToISO = (date: Date) => {
  return date.toISOString().split("T")[0];
};

export const destructureRooms = (rooms: IRoom[]) => {
  const adults = rooms.reduce((a, b) => a + b.adults, 0);
  const children = rooms.reduce((a, b) => a + b.childAges.length, 0);
  const childAges = rooms
    .map((r) => {
      return r.childAges;
    })
    .flat();

  return { adults, childAges, children };
};

export const getLocationString = (destination: Location) => {
  const { area, country, locationName, region } = destination;

  const res = [];

  res.push(locationName);

  if (area) {
    res.push(area);
  } else if (region) {
    res.push(region);
  }

  res.push(country);

  return res.join(', ');
};

export const convertRatingToScale10 = (rating: number, maxRating: number) => {
  const newMaxRating = 10;
  return (rating / maxRating) * newMaxRating;
};

export const extractMainScore = (scores: any[]) => {
  return (
    scores.find(
      (score) => score.value.score !== null && score.value.review != null
    ) || scores.find((score) => score.value.score !== null)
  );
};
