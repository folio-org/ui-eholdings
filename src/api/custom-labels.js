import {
  getHeaders,
  doRequest,
  createUrl,
} from './common';

const API_URL = (credentialId) => `/eholdings/kb-credentials/${credentialId}/custom-labels`;

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
  updateCustomLabels: (okapi, customLabels, credentialId) => {
    const method = 'PUT';
    const url = `${okapi.url}${API_URL(credentialId)}`;

    const params = {
      method,
      headers: getHeaders(method, okapi, url),
      body: JSON.stringify({ data: customLabels, }),
    };

    return doRequest(url, params);
  }
};
