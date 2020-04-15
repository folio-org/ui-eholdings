import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {
  POST_KB_CREDENTIALS_USER,
  postKBCredentialsUserSuccess,
  postKBCredentialsUserFailure,
} from '../actions';

export default ({ kbCredentialsUsersApi }) => (action$, store) => {
  const { getState } = store;

  const state = getState();

  return action$
    .filter(action => action.type === POST_KB_CREDENTIALS_USER)
    .mergeMap(({ payload }) => {
      const { credentialsId, userData } = payload;

      return kbCredentialsUsersApi
        .assignUser(state.okapi, credentialsId, userData)
        .map(postKBCredentialsUserSuccess)
        .catch(errors => Observable.of(postKBCredentialsUserFailure(errors)));
    });
};
