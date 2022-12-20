export const addUserInputToHotel = (
    payload: any,
    { id, adults, children, checkIn, checkOut }: any
) => {
    payload.id = id;
    payload.adults = adults;
    payload.children = children;
    payload.checkIn = checkIn;
    payload.checkOut = checkOut;

};
