export function getRandomValueFromArray<T>(array: T[]) {
    return array[Math.floor((Math.random() * array.length))];
}

export default getRandomValueFromArray;