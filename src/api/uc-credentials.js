import {
  getHeaders,
  doRequest,
} from './common';

const API_URL = '/eholdings/uc-credentials';

export default {
  getUcCredentials: (okapi) => {
    const method = 'GET';
    const url = `${okapi.url}${API_URL}`;
    const params = {
      method,
      headers: getHeaders(method, okapi, url),
    };

    return doRequest(url, params);
  },
  getUcCredentialsClientId: (okapi) => {
    const method = 'GET';
    const url = `${okapi.url}${API_URL}/clientId`;
    const params = {
      method,
      headers: getHeaders(method, okapi, url),
    };

    return doRequest(url, params);
  },
  getUcCredentialsClientSecret: (okapi) => {
    const method = 'GET';
    const url = `${okapi.url}${API_URL}/clientSecret`;
    const params = {
      method,
      headers: getHeaders(method, okapi, url),
    };

    return doRequest(url, params);
  },
  updateUcCredentials: (okapi, data) => {
    const method = 'PUT';
    const url = `${okapi.url}${API_URL}`;
    const params = {
      method,
      headers: getHeaders(method, okapi, url),
      body: JSON.stringify(data),
    };

    return doRequest(url, params);
  },
};
