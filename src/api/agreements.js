import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { omit } from 'lodash';

import {
  parseResponseBody,
  getHeaders,
} from './common';

const API_URL = '/erm/sas';

const createUrl = (baseUrl, refId) => {
  const url = new URL(`${baseUrl}${API_URL}`);
  const searchParams = {
    filters: `items.reference=${refId}`,
    sort: 'startDate;desc',
  };

  Object.keys(searchParams).forEach((paramName) => {
    url.searchParams.append(paramName, searchParams[paramName]);
  });

  return url;
};

const doRequest = (url, params) => {
  const promise = fetch(url, params)
    .then(response => Promise.all([response.ok, parseResponseBody(response)]))
    .then(([ok, body]) => (ok ? body : Promise.reject(body)));
  
  return Observable.from(promise)
};

export default {
  getAll: (okapi, refId) => {
    const method = 'GET';
    const url = createUrl(okapi.url, refId);

    const params = {
      method,
      headers: getHeaders(method, okapi, url),
    };

    return doRequest(url, params);
  },
  attachAgreement: (okapi, agreement) => {
    const method = 'PUT';
    const url = `${okapi.url}${API_URL}/${agreement.id}`;

    const params = {
      method,
      headers: getHeaders(method, okapi, url),
      body: JSON.stringify({
        items:[omit(agreement, ['id'])],
      }),
    };

    return doRequest(url, params);
  }
};
