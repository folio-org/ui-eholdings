import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
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
  return Observable.from(fetch(url, params))
    .switchMap(response => {
      const body = parseResponseBody(response);
      return response.ok ? body : Observable.throw(body);
    })
    .catch(err => {
      return Observable.of(err);
    });
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