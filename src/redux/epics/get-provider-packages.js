import { of } from 'rxjs';
import {
  map,
  mergeMap,
  filter,
  catchError,
} from 'rxjs/operators';

import {
  getProviderPackagesSuccess,
  getProviderPackagesFailure,
  GET_PROVIDER_PACKAGES,
} from '../actions';

export default ({ providerPackagesApi }) => (action$, state) => {
  return action$.pipe(
    filter(action => action.type === GET_PROVIDER_PACKAGES),
    mergeMap(action => {
      const {
        payload: {
          providerId,
          params,
        },
      } = action;

      return providerPackagesApi
        .getCollection(state.value.okapi, providerId, params)
        .pipe(
          map(getProviderPackagesSuccess),
          catchError(errors => of(getProviderPackagesFailure({ errors })))
        );
    }),
  );
};
