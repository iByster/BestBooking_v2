import axios from 'axios';
import { IUserInputForCrawling } from '../../types';
import randomizeHeader from '../../utils/header/randomizeHeader';
import { headers as baseHeaders } from '../headers/headers';
import { constructGraphQLPayload } from '../payload/payload';
import url from 'url';
import querystring from 'querystring';

const apiEndpoint = 'https://www.airbnb.com/api/v3/StaysPdpSections';

const createQueryString = (data: any) => {
    return Object.keys(data).map(key => {
      let val = data[key]
      if (val !== null && typeof val === 'object') val = createQueryString(val)
      return `${key}=${encodeURIComponent(`${val}`.replace(/\s/g, '_'))}`
    }).join('&')
}

const parseData = (data: any) => {
    
}

export const scrapeHotelByIdAndUserInput = async (id: number, userInput: IUserInputForCrawling) => {
    const headers = randomizeHeader(baseHeaders) as any;
    const payload = constructGraphQLPayload(id, userInput);

    console.log(createQueryString(payload));
    
    return axios({
        url: `${apiEndpoint}?${createQueryString(payload)}`,
        // url: apiEndpoint,
        method: 'GET',
        headers: {
            'x-airbnb-api-key': 'd306zoyjsyarp7ifhu67rjxn52tv0t20'
        },
        // data: payload,
    })
} 