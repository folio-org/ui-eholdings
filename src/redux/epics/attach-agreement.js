import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import omit from 'lodash/omit';

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
        payload: agreement,
      } = action;

      const state = getState();

      const url = `${state.okapi.url}/erm/sas/${agreement.id}`;

      const requestOptions = {
        headers: getHeaders(state),
        method: 'PUT',
        body: JSON.stringify({
          items:[omit(agreement, ['id'])],
        }),
      };

      const promise = fetch(url, requestOptions)
        .then(response => Promise.all([response.ok, parseResponseBody(response)]))
        .then(([ok, body]) => (ok ? body : Promise.reject(body)));

      return Observable.from(promise)
        .map((currentAgreement) => {
          attachAgreementSuccess();
          return addAgreement(pickAgreementProps(currentAgreement));
        })
        .catch(error => Observable.of(attachAgreementFailure({ error })));
    });
}
