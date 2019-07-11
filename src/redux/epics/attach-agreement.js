
import {
  of,
} from 'rxjs';

import { ofType } from 'redux-observable';

import {
  map,
  mergeMap,
  catchError,
} from 'rxjs/operators';

import {
  ATTACH_AGREEMENT,
  attachAgreementSuccess,
  attachAgreementFailure,
  addAgreement,
} from '../actions';

import {
  getHeaders,
  pickAgreementProps,
} from './common';

export default ({ agreementsApi }) => (action$, store) => {
  const {
    getState,
  } = store;

  const state = getState();

  return action$.pipe(
    ofType(ATTACH_AGREEMENT),
    mergeMap(action => {
      const {
        payload: agreement,
      } = action;

      return agreementsApi
        .attachAgreement(state.okapi.url, getHeaders(state), agreement)
        .pipe(
          map((currentAgreement) => {
            attachAgreementSuccess();
            return addAgreement(pickAgreementProps(currentAgreement));
          }),
          catchError(error => of(attachAgreementFailure({ error })))
        );
    })
  );
};
