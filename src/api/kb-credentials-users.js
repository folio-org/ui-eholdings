import {
  getHeaders,
  doRequest,
} from './common';

const API_URL = '/eholdings/kb-credentials';

export default {
  getCollection(okapi, credsId) {
    const method = 'GET';
    const url = `${okapi.url}${API_URL}/${credsId}/users`;

    const params = {
      method,
      headers: getHeaders(method, okapi, url),
    };

    return doRequest(url, params);
  },
  getCredentialsForUser(okapi) {
    const method = 'GET';
    const url = `${okapi.url}/eholdings/user-kb-credential`;

    const params = {
      method,
      headers: getHeaders(method, okapi, url),
    };

    return doRequest(url, params);
  },
  assignUser(okapi, credsId, userData) {
    const method = 'POST';
    const url = `${okapi.url}${API_URL}/${credsId}/users`;

    const params = {
      method,
      body: JSON.stringify(userData),
      headers: getHeaders(method, okapi, url),
    };

    return doRequest(url, params);
  },
  unassignUser(okapi, credsId, userId) {
    const method = 'DELETE';
    const url = `${okapi.url}${API_URL}/${credsId}/users/${userId}`;

    const params = {
      method,
      headers: getHeaders(method, okapi, url),
    };

    return doRequest(url, params);
  },
};
