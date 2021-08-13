import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {
  getProviderPackagesSuccess,
  getProviderPackagesFailure,
  GET_PROVIDER_PACKAGES,
} from '../actions';

export default ({ providerPackagesApi }) => (action$, store) => {
  return action$
    .filter(action => action.type === GET_PROVIDER_PACKAGES)
    .mergeMap(action => {
      const {
        payload: {
          providerId,
          params,
        },
      } = action;

      return providerPackagesApi
        .getCollection(store.getState().okapi, providerId, params)
        .map(getProviderPackagesSuccess)
        .catch(errors => Observable.of(getProviderPackagesFailure({ errors })));
    });
};
