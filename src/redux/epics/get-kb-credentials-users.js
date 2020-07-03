import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {
  GET_KB_CREDENTIALS_USERS,
  getKBCredentialsUsersSuccess,
  getKBCredentialsUsersFailure,
} from '../actions';

export default ({ kbCredentialsUsersApi }) => (action$, store) => {
  return action$
    .filter(action => action.type === GET_KB_CREDENTIALS_USERS)
    .mergeMap(({ payload: { credentialsId } }) => kbCredentialsUsersApi
      .getCollection(store.getState().okapi, credentialsId)
      .map(getKBCredentialsUsersSuccess)
      .catch(errors => Observable.of(getKBCredentialsUsersFailure({ errors }))));
};
