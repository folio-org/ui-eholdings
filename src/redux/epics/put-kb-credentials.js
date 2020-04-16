import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {
  PUT_KB_CREDENTIALS,
  putKBCredentialsSuccess,
  putKBCredentialsFailure,
} from '../actions';

export default ({ knowledgeBaseApi }) => (action$, store) => {
  const { getState } = store;
  const state = getState();

  return action$
    .filter(action => action.type === PUT_KB_CREDENTIALS)
    .mergeMap(({ payload }) => {
      return knowledgeBaseApi
        .editCredentials(state.okapi, payload.data, payload.credentialId)
        .map(putKBCredentialsSuccess)
        .catch(errors => Observable.of(putKBCredentialsFailure({ errors })));
    });
};
