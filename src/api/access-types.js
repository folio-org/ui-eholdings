import { pick } from 'lodash';
import {
  getHeaders,
  doRequest,
  createUrl,
} from './common';

const API_URL = '/eholdings/access-types';

export default {
  getAll: okapi => {
    const method = 'GET';
    const url = createUrl(okapi.url, API_URL);
    const params = {
      method,
      headers: getHeaders(method, okapi, url),
    };

    return doRequest(url, params);
  },
  attachAccessType: (okapi, accessType) => {
    const method = 'POST';
    const url = `${okapi.url}${API_URL}`;
    const params = {
      method,
      headers: getHeaders(method, okapi, url),
      body: JSON.stringify(accessType),
    };

    return doRequest(url, params);
  },
  deleteAccessType: (okapi, accessType) => {
    const method = 'DELETE';
    const url = `${okapi.url}${API_URL}/${accessType.id}`;
    const params = {
      method,
      headers: getHeaders(method, okapi, url),
    };

    return doRequest(url, params);
  },
  updateAccessType: (okapi, accessType) => {
    const method = 'PUT';
    const url = `${okapi.url}${API_URL}/${accessType.id}`;
    const params = {
      method,
      headers: getHeaders(method, okapi, url),
      body: JSON.stringify(pick(accessType, ['type', 'attributes'])),
    };

    return doRequest(url, params);
  },
};
