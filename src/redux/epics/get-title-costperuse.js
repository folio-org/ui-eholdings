import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {
  GET_TITLE_COST_PER_USE,
  getTitleCostPerUseSuccess,
  getTitleCostPerUseFailure,
} from '../actions';

export default ({ costPerUseApi }) => (action$, store) => {
  return action$
    .filter(action => action.type === GET_TITLE_COST_PER_USE)
    .mergeMap(({ payload: { titleId, filterData } }) => costPerUseApi
      .getTitleCostPerUse(store.getState().okapi, titleId, filterData)
      .map(getTitleCostPerUseSuccess)
      .catch(errors => Observable.of(getTitleCostPerUseFailure({ errors }))));
};
