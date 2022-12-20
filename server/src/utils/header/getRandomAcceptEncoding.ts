import getRandomValueFromArray from "../array/getRandomValueFromArray";

const acceptEncodings = [
    'gzip',
    'gzip, compress, br',
    'br;q=1.0, gzip;q=0.8, *;q=0.1',
];

const rotateAcceptEncodings = () => {
    return getRandomValueFromArray(acceptEncodings);
}

export default rotateAcceptEncodings;