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
  return action$
    .filter(action => action.type === PUT_KB_CREDENTIALS)
    .mergeMap(({ payload }) => {
      return knowledgeBaseApi
        .editCredentials(store.getState().okapi, { data: payload.data }, payload.credentialId)
        .map(() => putKBCredentialsSuccess(payload.data))
        .catch(errors => Observable.of(putKBCredentialsFailure({ errors })));
    });
};
