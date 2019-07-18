import { Observable } from 'rxjs/Observable';
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
} from './common';

export default ({ agreementsApi }) => (action$, store) => {
  const {
    getState,
  } = store;

  const state = getState();

  return action$
    .filter(action => action.type === GET_AGREEMENTS)
    .mergeMap(action => {
      const {
        payload: {
          refId,
          isLoading,
        },
      } = action;

      return agreementsApi
        .getAll(state.okapi.url, getHeaders(null, state, ''), refId)
        .map(response => getAgreementsSuccess(response))
        .catch(error => Observable.of(getAgreementsFailure({ error, isLoading })));
    });
};
