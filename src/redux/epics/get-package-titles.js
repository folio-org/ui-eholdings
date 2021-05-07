import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {
  getPackageTitlesSuccess,
  getPackageTitlesFailure,
  GET_PACKAGE_TITLES,
} from '../actions';

export default ({ packageTitlesApi }) => (action$, store) => {
  return action$
    .filter(action => action.type === GET_PACKAGE_TITLES)
    .mergeMap(action => {
      const {
        payload: {
          packageId,
          params,
        },
      } = action;

      return packageTitlesApi
        .getCollection(store.getState().okapi, packageId, params)
        .map(getPackageTitlesSuccess)
        .catch(errors => Observable.of(getPackageTitlesFailure({ errors })));
    });
};
