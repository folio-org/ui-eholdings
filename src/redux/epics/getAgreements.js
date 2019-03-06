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

import { getHeaders } from './common';

const parseResponseBody = (response) => {
  return response.text().then((text) => {
    try { return JSON.parse(text); } catch (e) { return text; }
  });
};

export default function getAgreementsEpic(action$, store) {
  const {
    getState,
  } = store;

  return action$
    .ofType(GET_AGREEMENTS)
    .mergeMap((action) => {
      const {
        payload,
        payload: {
          referenceId,
        },
      } = action;

      const state = getState();
      const method = 'GET';

      const url = `${state.okapi.url}/erm/sas?filters=items.reference=${referenceId}&sort=startDate=desc&stats=true`;

      const requestOptions = {
        headers: getHeaders(state),
        method,
      };

      const promise = fetch(url, requestOptions)
        .then(response => Promise.all([response.ok, parseResponseBody(response)]))
        .then(([ok, body]) => (ok ? body : Promise.reject(body)));

      return Observable
        .from(promise)
        .map(responseBody => getAgreementsSuccess({
          agreements: responseBody,
          ...payload,
        }))
        .catch(error => Observable.of(getAgreementsFailure({ referenceId, error })));
    });
}
