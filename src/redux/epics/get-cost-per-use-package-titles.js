import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {
  GET_COST_PER_USE_PACKAGE_TITLES,
  getCostPerUsePackageTitlesSuccess,
  getCostPerUsePackageTitlesFailure,
} from '../actions';

export default ({ costPerUseApi }) => (action$, store) => {
  return action$
    .filter(action => action.type === GET_COST_PER_USE_PACKAGE_TITLES)
    .mergeMap(({ payload: { id, filterData } }) => costPerUseApi
      .getCostPerUsePackageTitles(store.getState().okapi, id, filterData)
      .map(getCostPerUsePackageTitlesSuccess)
      .catch(errors => Observable.of(getCostPerUsePackageTitlesFailure({ errors }))));
};
