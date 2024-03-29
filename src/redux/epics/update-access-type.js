import { of } from 'rxjs';
import {
  mergeMap,
  filter,
  map,
  catchError,
} from 'rxjs/operators';

import {
  updateAccessTypeFailure,
  updateAccessTypeSuccess,
  UPDATE_ACCESS_TYPE,
} from '../actions';

export default ({ accessTypesApi }) => (action$, state$) => {
  return action$
    .pipe(
      filter(action => action.type === UPDATE_ACCESS_TYPE),
      mergeMap(action => {
        const { payload: { accessType, credentialId } } = action;

        return accessTypesApi
          .updateAccessType(state$.value.okapi, accessType, credentialId)
          .pipe(
            map(() => updateAccessTypeSuccess(accessType)),
            catchError(errors => of(updateAccessTypeFailure({ errors })))
          );
      }),
    );
};
