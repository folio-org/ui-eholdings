import { pick } from 'lodash';
import {
  getHeaders,
  doRequest,
  createUrl,
} from './common';

const API_URL = '/eholdings/access-types';
const CREDENTIALS_API_URL = credentialId => `/eholdings/kb-credentials/${credentialId}/access-types`;

export default {
  getAll: (okapi, credentialId) => {
    const method = 'GET';
    const url = createUrl(okapi.url, credentialId ? CREDENTIALS_API_URL(credentialId) : API_URL);
    const params = {
      method,
      headers: getHeaders(method, okapi, url),
    };

    return doRequest(url, params);
  },
  attachAccessType: (okapi, accessType, credentialId) => {
    const method = 'POST';
    const url = `${okapi.url}${credentialId ? CREDENTIALS_API_URL(credentialId) : API_URL}`;
    const params = {
      method,
      headers: getHeaders(method, okapi, url),
      body: JSON.stringify(accessType),
    };

    return doRequest(url, params);
  },
  deleteAccessType: (okapi, accessType, credentialId) => {
    const method = 'DELETE';
    const url = `${okapi.url}${credentialId ? CREDENTIALS_API_URL(credentialId) : API_URL}/${accessType.id}`;
    const params = {
      method,
      headers: getHeaders(method, okapi, url),
    };

    return doRequest(url, params);
  },
  updateAccessType: (okapi, accessType, credentialId) => {
    const method = 'PUT';
    const url = `${okapi.url}${credentialId ? CREDENTIALS_API_URL(credentialId) : API_URL}/${accessType.id}`;
    const params = {
      method,
      headers: getHeaders(method, okapi, url),
      body: JSON.stringify(pick(accessType, ['type', 'attributes'])),
    };

    return doRequest(url, params);
  },
};
