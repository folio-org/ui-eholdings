import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {
  ATTACH_AGREEMENT,
  getAgreements,
  attachAgreementFailure,
} from '../actions';

import { getHeaders } from './common';

const parseResponseBody = (response) => {
  return response.text().then((text) => {
    try { return JSON.parse(text); } catch (e) { return text; }
  });
};

export default function attachAgreementEpic(action$, store) {
  const {
    getState,
  } = store;

  return action$
    .ofType(ATTACH_AGREEMENT)
    .mergeMap((action) => {
      const {
        payload,
      } = action;

      const state = getState();
      const PUT = 'PUT';

      const url = `${state.okapi.url}/erm/sas/${payload.id}`;

      const requestOptions = {
        headers: getHeaders(state),
        method: PUT,
        body: {
          items:[
            {
              type: 'external',
              authority: 'EKB',
              reference: payload.referenceId,
              label: payload.name,
            }
          ],
        },
      };

      const promise = fetch(url, requestOptions)
        .then(response => Promise.all([response.ok, parseResponseBody(response)]))
        .then(([ok, body]) => (ok ? body : Promise.reject(body)));

      return Observable.from(promise)
        .map(() => getAgreements({ referenceId: payload.referenceId }))
        .catch(error => Observable.of(attachAgreementFailure(error)));
    });
}
