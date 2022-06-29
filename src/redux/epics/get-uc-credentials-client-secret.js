import { of } from 'rxjs';
import {
  mergeMap,
  filter,
  map,
  catchError,
} from 'rxjs/operators';

import {
  getUcCredentialsClientSecretSuccess,
  getUcCredentialsClientSecretFailure,
  GET_UC_CREDENTIALS_CLIENT_SECRET,
} from '../actions';

export default ({ ucCredentialsApi }) => (action$, state$) => {
  return action$.pipe(
    filter(action => action.type === GET_UC_CREDENTIALS_CLIENT_SECRET),
    mergeMap(() => {
      return ucCredentialsApi
        .getUcCredentialsClientSecret(state$.value.okapi)
        .pipe(
          map(response => getUcCredentialsClientSecretSuccess(response)),
          catchError(errors => of(getUcCredentialsClientSecretFailure(errors)))
        );
    }),
  );
};
