import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {
  PATCH_USAGE_CONSOLIDATION,
  patchUsageConsolidationSuccess,
  patchUsageConsolidationFailure,
} from '../actions';

export default ({ usageConsolidationApi }) => (action$, store) => {
  return action$
    .filter(action => action.type === PATCH_USAGE_CONSOLIDATION)
    .mergeMap(({ payload }) => {
      const { credentialsId, data } = payload;

      return usageConsolidationApi
        .patchUsageConsolidation(store.getState().okapi, credentialsId, { data })
        .map(() => patchUsageConsolidationSuccess(data.attributes))
        .catch(errors => Observable.of(patchUsageConsolidationFailure(errors)));
    });
};
