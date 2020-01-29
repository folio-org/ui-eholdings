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
  },
  updateCustomLabels: (okapi, customLabels) => {
    const method = 'PUT';
    const url = `${okapi.url}${API_URL}`;

    const params = {
      method,
      headers: getHeaders(method, okapi, url),
      body: JSON.stringify({ data: customLabels, }),
    };

    return doRequest(url, params);
  }
};
