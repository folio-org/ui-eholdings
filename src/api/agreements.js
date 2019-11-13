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

const API_URL = '/erm/sass';

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
  return Observable.from(promise)
    .switchMap(async response => {
      const body = await parseResponseBody(response); 
      
      return response.ok ? body : Observable.throw((body));
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
