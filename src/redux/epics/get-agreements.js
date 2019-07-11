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
  GET_AGREEMENTS,
  getAgreementsSuccess,
  getAgreementsFailure,
} from '../actions';

import { getHeaders } from './common';

export default ({ agreementsApi }) => (action$, store) => {
  const {
    getState,
  } = store;

  const state = getState();

  return action$.pipe(
    ofType(GET_AGREEMENTS),
    mergeMap(action => {
      const {
        payload: {
          refId,
          isLoading,
        }
      } = action;

      return agreementsApi
        .getAll(state.okapi.url, getHeaders(state), refId)
        .pipe(
          map(response => getAgreementsSuccess(response)),
          catchError(error => of(getAgreementsFailure({ error, isLoading })))
        );
    })
  );
};
