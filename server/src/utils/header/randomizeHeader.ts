import { BaseHeader } from "../../types"
import rotateAcceptEncodings from "./getRandomAcceptEncoding";
import rotateAcceptLanguage from "./getRandomAcceptLanguage";
import rotateReferer from "./getRandomReferer";
import rotateSecChUa from "./getRandomSecChUa";
import rotateUserAgent from "./getRandomUserAgent"

const randomizeHeader = (header: BaseHeader) => {
    // Rotate base headers
    header["User-Agent"] = rotateUserAgent();
    header.Referer = rotateReferer();
    header["Accept-Encoding"] = rotateAcceptEncodings();
    header["Accept-Language"] = rotateAcceptLanguage();

    // Totate sec-ch-ua headers
    header["sec-ch-ua"] = rotateSecChUa();

    return header;
}

export default randomizeHeader;