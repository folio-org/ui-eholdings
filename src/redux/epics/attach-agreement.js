import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {
  ATTACH_AGREEMENT,
  attachAgreementSuccess,
  attachAgreementFailure,
  addAgreement,
} from '../actions';

import {
  getHeaders,
  parseResponseBody,
  pickAgreementProps,
} from './common';

export default function attachAgreement(action$, store) {
  const {
    getState,
  } = store;

  return action$
    .ofType(ATTACH_AGREEMENT)
    .mergeMap((action) => {
      const {
        payload: {
          isLoading,
          id,
          referenceId,
          name,
        },
      } = action;

      const state = getState();

      const url = `${state.okapi.url}/erm/sas/${id}`;

      const requestOptions = {
        headers: getHeaders(state),
        method: 'PUT',
        body: JSON.stringify({
          items:[
            {
              type: 'external',
              authority: 'EKB',
              reference: referenceId,
              label: name,
            }
          ],
        }),
      };

      const promise = fetch(url, requestOptions)
        .then(response => Promise.all([response.ok, parseResponseBody(response)]))
        .then(([ok, body]) => (ok ? body : Promise.reject(body)));

      return Observable.from(promise)
        .map((agreement) => {
          attachAgreementSuccess();
          return addAgreement(pickAgreementProps(agreement));
        })
        .catch(error => Observable.of(attachAgreementFailure({ error, isLoading })));
    });
}
