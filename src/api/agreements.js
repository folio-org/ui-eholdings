import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import { omit } from 'lodash';

import { parseResponseBody } from './common';

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
  getAll: (baseUrl, baseHeaders, refId) => {
    const params = {
      method: 'GET',
      headers: baseHeaders,
    };

    const url = createUrl(baseUrl, refId);

    return doRequest(url, params);
  },
  attachAgreement: (baseUrl, baseHeaders, agreement) => {
    const params = {
      method: 'PUT',
      headers: baseHeaders,
      body: JSON.stringify({
        items:[omit(agreement, ['id'])],
      }),
    };

    const url = `${baseUrl}${API_URL}/${agreement.id}`;

    return doRequest(url, params);
  }
};
