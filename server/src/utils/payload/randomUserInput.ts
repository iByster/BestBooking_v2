import { IRoom, IUserInputForCrawling } from "../../types/types";
import getRandomNumberBetween from "../number/getRandomNumberInterval";

type Range = {
    min: number;
    max: number;
}

type RandomUserInputOptions = {
    withChildren: boolean;
    nightOfStayRange: Range;
    startingDayOffsetRange: Range;
    numberOfRoomsRange: Range;
    numberOfChildrenRange: Range;
    childAgesRange: Range;
    numberOfAdultsRange: Range;
    monthRange: Range;
}

const DEFAULT_NIGHT_OF_STAY_RANGE: Range = {
    min: 2,
    max: 8,
};

const DEFAULT_MONTH_RANGE: Range = {
    min: 0,
    max: 2,
};

const DEFAULT_STARTING_DAY_OFFSET_RANGE: Range = {
    min: 4,
    max: 25,
};

const DEFAULT_NUMBER_OF_ROOMS_RANGE: Range = {
    min: 1,
    max: 2,
};

const DEFAULT_NUMBER_OF_CHILDREN_RANGE: Range = {
    min: 0,
    max: 2,
};

const DEFAULT_CHILD_AGES_RANGE: Range = {
    min: 1,
    max: 6,
};

const DEFAULT_NUMBER_OF_ADULTS_RANGE: Range = {
    min: 1,
    max: 3,
};

const getRandomUserInput = ({
    nightOfStayRange = DEFAULT_NIGHT_OF_STAY_RANGE,
    monthRange = DEFAULT_MONTH_RANGE,
    startingDayOffsetRange = DEFAULT_STARTING_DAY_OFFSET_RANGE,
    numberOfRoomsRange = DEFAULT_NUMBER_OF_ROOMS_RANGE,
    numberOfChildrenRange = DEFAULT_NUMBER_OF_CHILDREN_RANGE,
    childAgesRange = DEFAULT_CHILD_AGES_RANGE,
    numberOfAdultsRange = DEFAULT_NUMBER_OF_ADULTS_RANGE,
    withChildren = true,
}: Partial<RandomUserInputOptions>): IUserInputForCrawling => {
    const now = new Date();
    const month = getRandomNumberBetween(monthRange.min, monthRange.max);
    const nightsToStay = getRandomNumberBetween(nightOfStayRange.min, nightOfStayRange.max);
    const startingDayOffset = getRandomNumberBetween(startingDayOffsetRange.min, startingDayOffsetRange.max);
    const numberOfRooms = getRandomNumberBetween(numberOfRoomsRange.min, numberOfRoomsRange.max);

    const checkIn = new Date(now);
    checkIn.setMonth(checkIn.getMonth() + month);
    checkIn.setDate(checkIn.getDate() + startingDayOffset);

    const checkOut = new Date(checkIn);
    checkOut.setDate(checkOut.getDate() + nightsToStay);

    const rooms: IRoom[] = [];

    for (let i = 0; i < numberOfRooms; ++i) {
        const numberOfChildren = getRandomNumberBetween(numberOfChildrenRange.min, numberOfChildrenRange.max);
        const childAges: number[] = [];

        if (withChildren) {
            for (let j = 0; j < numberOfChildren; ++j) {
                childAges.push(getRandomNumberBetween(childAgesRange.min, childAgesRange.max));
            }
        }

        rooms.push({
            adults: getRandomNumberBetween(numberOfAdultsRange.min, numberOfAdultsRange.max),
            childAges,
        })
    }

    return {
        checkIn,
        checkOut,
        rooms,
    }
}

export default getRandomUserInput;