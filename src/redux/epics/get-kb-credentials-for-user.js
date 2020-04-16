import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {
  GET_USERS_KB_CREDENTIALS,
  getUsersKbCredentialsSuccess,
  getUsersKbCredentialsFailure,
} from '../actions';

export default ({ kbCredentialsUsersApi }) => (action$, store) => {
  const { getState } = store;

  const state = getState();

  return action$
    .filter(action => action.type === GET_USERS_KB_CREDENTIALS)
    .mergeMap(() => kbCredentialsUsersApi
      .getCredentialsForUser(state.okapi)
      .map(getUsersKbCredentialsSuccess)
      .catch(errors => Observable.of(getUsersKbCredentialsFailure({ errors }))));
};
