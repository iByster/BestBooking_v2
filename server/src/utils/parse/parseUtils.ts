import { IRoom } from '../../types';

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

export const parseDateToISO = (date: Date) => {
    return date.toISOString().split('T')[0];
};
