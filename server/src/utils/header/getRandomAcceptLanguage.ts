import getRandomValueFromArray from "../array/getRandomValueFromArray";

const acceptLanguages = [
    'en-US, en; q=0.9'
]


const rotateAcceptLanguage = () => {
    return getRandomValueFromArray(acceptLanguages);
}

export default rotateAcceptLanguage;