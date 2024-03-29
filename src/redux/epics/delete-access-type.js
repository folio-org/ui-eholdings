import { of } from 'rxjs';
import {
  mergeMap,
  filter,
  map,
  catchError,
} from 'rxjs/operators';

import {
  DELETE_ACCESS_TYPE,
  deleteAccessTypeSuccess,
  deleteAccessTypeFailure,
} from '../actions';

export default ({ accessTypesApi }) => (action$, state$) => {
  return action$
    .pipe(
      filter(action => action.type === DELETE_ACCESS_TYPE),
      mergeMap(action => {
        const { payload: { accessType, credentialId } } = action;

        return accessTypesApi
          .deleteAccessType(state$.value.okapi, accessType, credentialId)
          .pipe(
            map(() => deleteAccessTypeSuccess(accessType.id)),
            catchError(({ errors }) => of(deleteAccessTypeFailure({
              errors,
              accessTypeId: accessType.id
            })))
          );
      }),
    );
};
