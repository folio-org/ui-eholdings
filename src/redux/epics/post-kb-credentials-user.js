import { of } from 'rxjs';
import {
  mergeMap,
  filter,
  map,
  catchError,
} from 'rxjs/operators';

import {
  POST_KB_CREDENTIALS_USER,
  postKBCredentialsUserSuccess,
  postKBCredentialsUserFailure,
  getKBCredentialsUsers,
} from '../actions';

export default ({ kbCredentialsUsersApi }) => (action$, state$) => {
  return action$.pipe(
    filter(action => action.type === POST_KB_CREDENTIALS_USER),
    mergeMap(({ payload }) => {
      const { credentialsId, userData } = payload;

      return kbCredentialsUsersApi
        .assignUser(state$.value.okapi, credentialsId, userData)
        .pipe(
          map(postKBCredentialsUserSuccess),
          map(() => getKBCredentialsUsers(credentialsId)),
          catchError(errors => of(postKBCredentialsUserFailure(errors))),
        );
    }),
  );
};
