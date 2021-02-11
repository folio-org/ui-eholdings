import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {
  getUsageConsolidationKeySuccess,
  getUsageConsolidationKeyFailure,
  GET_USAGE_CONSOLIDATION_KEY,
} from '../actions';

export default ({ usageConsolidationApi }) => (action$, store) => {
  return action$
    .filter(action => action.type === GET_USAGE_CONSOLIDATION_KEY)
    .mergeMap(action => {
      const {
        payload: credentialId,
      } = action;

      return usageConsolidationApi
        .getUsageConsolidationKey(store.getState().okapi, credentialId)
        .map(response => getUsageConsolidationKeySuccess(response))
        .catch(errors => Observable.of(getUsageConsolidationKeyFailure({ errors })));
    });
};
