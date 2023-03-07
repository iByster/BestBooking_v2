import { IRoom } from "../../types/types";

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

export const escapeJson = (json: string) => {
    return json
        .replace(/\\n/g, "\\n")
        .replace(/\\'/g, "\\'")
        .replace(/\\"/g, '\\"')
        .replace(/\\&/g, "\\&")
        .replace(/\\r/g, "\\r")
        .replace(/\\t/g, "\\t")
        .replace(/\\b/g, "\\b")
        .replace(/\\f/g, "\\f");
}

// return: yyyy-mm-dd
export const parseDateToISO = (date: Date) => {
    return date.toISOString().split('T')[0];
};

export const parseDateToConcatString = (date: Date) => {
    return parseDateToISO(date).split('-').join('');
}

export const getDateDifferenceInDays = (from: Date, to: Date) => {
    const diffTime = Math.abs(to.getTime() - from.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays;
};

export function extractNumbers(string: string | undefined | null): number[] | null {

    if (!string) {
        return null;
    }
    // Use a regular expression to find all numbers in the string
    const numbers = string.match(/\d+(,\d+)*(\.\d+)?/g);
    if (!numbers) {
        return [];
    }
    // Convert the numbers to integers and return the list
    return numbers.map(number => parseInt(number.replace(',', '')));
}