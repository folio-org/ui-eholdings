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
    .mergeMap(({ payload: { id, filterData, loadMore } }) => costPerUseApi
      .getPackageTitlesCostPerUse(store.getState().okapi, id, filterData)
      .map((payload) => {
        const costPerUseData = {
          type: 'packageTitleCostPerUse',
          attributes: {
            resources: payload.data,
            meta: payload.meta,
            parameters: payload.parameters,
          },
        };

        return getCostPerUsePackageTitlesSuccess(costPerUseData, loadMore);
      })
      .catch(errors => Observable.of(getCostPerUsePackageTitlesFailure({ errors }))));
};
