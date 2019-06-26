/* eslint-disable semi */
import { of, throwError } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { switchMap, catchError } from 'rxjs/operators';
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

const doRequest = (url, params) => fromFetch(url, params)
  .pipe(
    switchMap(response => {
      const body = parseResponseBody(response);
      return response.ok ? body : throwError(body);
    }),
    catchError(err => {
      return of(err);
    })
  );

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
}
