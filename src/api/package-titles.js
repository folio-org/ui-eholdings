import { qs } from '../components/utilities';

import {
  getHeaders,
  doRequest,
} from './common';

const API_URL = '/eholdings/packages';

export default {
  getCollection(okapi, packageId, params) {
    const method = 'GET';
    const queryParams = qs.stringify(params);
    const url = `${okapi.url}${API_URL}/${packageId}/resources?${queryParams}`;

    const requestParams = {
      method,
      headers: getHeaders(method, okapi, url),
    };

    return doRequest(url, requestParams);
  },
};
