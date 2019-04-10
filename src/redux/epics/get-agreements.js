import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {
  GET_AGREEMENTS,
  getAgreementsSuccess,
  getAgreementsFailure,
} from '../actions';

import {
  getHeaders,
  parseResponseBody,
  pickAgreementProps,
} from './common';

const createUrl = (baseUrl, refId) => {
  const url = new URL(`${baseUrl}/erm/sas`);
  const searchParams = {
    filters: `items.reference=${refId}`,
    sort: 'startDate;desc',
  };

  Object.keys(searchParams).forEach((paramName) => {
    url.searchParams.append(paramName, searchParams[paramName]);
  });

  return url;
};

export default function getAgreements(action$, store) {
  const {
    getState,
  } = store;

  return action$
    .ofType(GET_AGREEMENTS)
    .mergeMap((action) => {
      const {
        payload: {
          refId,
          isLoading,
        },
      } = action;

      const state = getState();
      const method = 'GET';

      const requestOptions = {
        headers: getHeaders(state),
        method,
      };

      const url = createUrl(state.okapi.url, refId);

      const promise = fetch(url, requestOptions)
        .then(response => Promise.all([response.ok, parseResponseBody(response)]))
        .then(([ok, body]) => (ok ? body : Promise.reject(body)));

      return Observable
        .from(promise)
        .map(agreements => getAgreementsSuccess({
          items: agreements.map(pickAgreementProps),
          isLoading,
        }))
        .catch(error => Observable.of(getAgreementsFailure({ error, isLoading })));
    });
}
