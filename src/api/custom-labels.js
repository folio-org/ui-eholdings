import {
  getHeaders,
  doRequest,
  createUrl,
} from './common';

const API_URL = '/eholdings/custom-labels';

export default {
  getAll: (okapi) => {
    const method = 'GET';
    const url = createUrl(okapi.url, API_URL);

    const params = {
      method,
      headers: getHeaders(method, okapi, url),
    };

    return doRequest(url, params);
  }
};
