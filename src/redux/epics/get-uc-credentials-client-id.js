import { of } from 'rxjs';
import {
  mergeMap,
  filter,
  map,
  catchError,
} from 'rxjs/operators';

import {
  getUcCredentialsClientIdSuccess,
  getUcCredentialsClientIdFailure,
  GET_UC_CREDENTIALS_CLIENT_ID,
} from '../actions';

export default ({ ucCredentialsApi }) => (action$, state$) => {
  return action$.pipe(
    filter(action => action.type === GET_UC_CREDENTIALS_CLIENT_ID),
    mergeMap(() => {
      return ucCredentialsApi
        .getUcCredentialsClientId(state$.value.okapi)
        .pipe(
          map(response => getUcCredentialsClientIdSuccess(response)),
          catchError(errors => of(getUcCredentialsClientIdFailure({ errors })))
        );
    }),
  );
};
