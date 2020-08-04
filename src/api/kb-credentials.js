import {
  getHeaders,
  doRequest,
  createUrl,
} from './common';

const API_URL = '/eholdings/kb-credentials';

export default {
  getCollection(okapi) {
    const method = 'GET';
    const url = createUrl(okapi.url, API_URL);

    const params = {
      method,
      headers: getHeaders(method, okapi, url),
    };

    return doRequest(url, params);
  },
  createCredentials(okapi, credentials) {
    const method = 'POST';
    const url = `${okapi.url}${API_URL}`;

    const params = {
      method,
      body: JSON.stringify(credentials),
      headers: getHeaders(method, okapi, url),
    };

    return doRequest(url, params);
  },
  editCredentials(okapi, credentials, id) {
    const method = 'PATCH';
    const url = `${okapi.url}${API_URL}/${id}`;

    const params = {
      method,
      body: JSON.stringify(credentials),
      headers: getHeaders(method, okapi, url),
    };

    return doRequest(url, params);
  },
  deleteCredentials(okapi, credentialsId) {
    const method = 'DELETE';
    const url = `${okapi.url}${API_URL}/${credentialsId}`;

    const params = {
      method,
      headers: getHeaders(method, okapi, url),
    };

    return doRequest(url, params);
  },
};
