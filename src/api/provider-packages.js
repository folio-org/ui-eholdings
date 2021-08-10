import { qs } from '../components/utilities';

import {
  getHeaders,
  doRequest,
} from './common';

const API_URL = '/eholdings/providers';

export default {
  getCollection(okapi, providerId, params) {
    const method = 'GET';
    const queryParams = qs.stringify(params);
    const url = `${okapi.url}${API_URL}/${providerId}/packages?${queryParams}`;

    const requestParams = {
      method,
      headers: getHeaders(method, okapi, url),
    };

    return doRequest(url, requestParams);
  },
};
