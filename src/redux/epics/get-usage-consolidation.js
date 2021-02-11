import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {
  getUsageConsolidationSuccess,
  getUsageConsolidationFailure,
  GET_USAGE_CONSOLIDATION,
} from '../actions';

export default ({ usageConsolidationApi }) => (action$, store) => {
  return action$
    .filter(action => action.type === GET_USAGE_CONSOLIDATION)
    .mergeMap(action => {
      const {
        payload: credentialId,
      } = action;

      return usageConsolidationApi
        .getUsageConsolidation(store.getState().okapi, credentialId)
        .map(response => getUsageConsolidationSuccess(response))
        .catch(errors => Observable.of(getUsageConsolidationFailure({ errors })));
    });
};
