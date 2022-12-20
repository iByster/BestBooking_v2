import getRandomValueFromArray from "../array/getRandomValueFromArray";

const secChUa = [
    '"(Not(A:Brand";v="8", "Chromium";v="98"',
    '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
    '" Not A;Brand";v="99", "Chromium";v="96", "Microsoft Edge";v="96"',
    '"Opera";v="81", " Not;A Brand";v="99", "Chromium";v="95"',
];

const rotateSecChUa = () => {
    return getRandomValueFromArray(secChUa);
}

export default rotateSecChUa;