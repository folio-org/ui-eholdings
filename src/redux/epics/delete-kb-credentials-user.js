import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {
  DELETE_KB_CREDENTIALS_USER,
  deleteKBCredentialsUserSuccess,
  deleteKBCredentialsUserFailure,
} from '../actions';

export default ({ kbCredentialsUsersApi }) => (action$, store) => {
  return action$
    .filter(action => action.type === DELETE_KB_CREDENTIALS_USER)
    .mergeMap(({ payload }) => {
      const { credentialsId, userId } = payload;

      return kbCredentialsUsersApi
        .unassignUser(store.getState().okapi, credentialsId, userId)
        .map(() => deleteKBCredentialsUserSuccess(userId))
        .catch(errors => Observable.of(deleteKBCredentialsUserFailure({ errors })));
    });
};
