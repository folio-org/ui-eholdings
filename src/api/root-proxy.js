import {
  getHeaders,
  doRequest,
  createUrl,
} from './common';

const API_URL = (credentialId) => `/eholdings/kb-credentials/${credentialId}/root-proxy`;

export default {
  get: (okapi, credentialId) => {
    const method = 'GET';
    const url = createUrl(okapi.url, API_URL(credentialId));

    const params = {
      method,
      headers: getHeaders(method, okapi, url),
    };

    return doRequest(url, params);
  },
  updateRootProxy: (okapi, rootProxy, credentialId) => {
    const method = 'PUT';
    const url = `${okapi.url}${API_URL(credentialId)}`;

    const params = {
      method,
      headers: getHeaders(method, okapi, url),
      body: JSON.stringify({ data: rootProxy, }),
    };

    return doRequest(url, params);
  }
};
