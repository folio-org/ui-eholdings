import {
  getHeaders,
  doRequest,
  createUrl,
} from './common';

const API_URL = (credentialId) => `/eholdings/kb-credentials/${credentialId}/proxy-types`;

export default {
  getAll: (okapi, credentialId) => {
    const method = 'GET';
    const url = createUrl(okapi.url, API_URL(credentialId));
    const params = {
      method,
      headers: getHeaders(method, okapi, url),
    };

    return doRequest(url, params);
  },
};
