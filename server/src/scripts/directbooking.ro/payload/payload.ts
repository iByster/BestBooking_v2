import moment from 'moment';
import { IUserInputForCrawling } from '../../../types/types';
import { destructureRooms, getDateDifferenceInDays } from '../../../utils/parse/parseUtils';
import { createQueryString } from '../../../utils/url/createQueryString';

// base payload structure
const baseQueryString = {
    idu: 4009, // hotel id
    tip: 'camere',
    lg: 'en', // language
    nrn: 7, // numar nopti
    ds: '03.02.2023', // check-in
    ad: 2, // adults
    cp: 0, // children,
    vcp1: 0, // varsta copil
    vcp2: 0, // varsta copil
    vcp3: -1, // varsta copil
    tr: '',
    masa: '',
    tipCamera: '',
    ordinea: 1,
    _: 1674837421503
};

// replace payload fields that represents user input fields with a desired one
const getQueryString = (id: string, userInput: IUserInputForCrawling) => {
    const { checkIn, checkOut, rooms } = userInput;
    const { adults, children, childAges } = destructureRooms(rooms);

    baseQueryString.idu = parseInt(id);

    adults
        ? (baseQueryString.ad = adults)
        : (baseQueryString.ad = 0);
    children

        ? (baseQueryString.cp = children)
        : (baseQueryString.cp = 0);

    // ! breaks at more than 3 childs
    baseQueryString.vcp1 = childAges[0] || 0;
    baseQueryString.vcp2 = childAges[1] || 0;
    baseQueryString.vcp3 = childAges[2] || -1;

    moment.locale('ro');
    baseQueryString.ds = moment(checkIn).format('L').replace(/\//g , '.');
    baseQueryString.nrn = getDateDifferenceInDays(checkIn, checkOut);

    return baseQueryString;
};

export const constructQueryStringPayload = (
    id: string,
    userInput: IUserInputForCrawling
) => {
    const queryString = createQueryString(getQueryString(id, userInput));
    return queryString;
};
