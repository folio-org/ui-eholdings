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
      return usageConsolidationApi
        .editUsageConsolidation(store.getState().okapi, { data: payload.data }, payload.credentialId)
        .map(() => patchUsageConsolidationSuccess(payload.data))
        .catch(errors => Observable.of(patchUsageConsolidationFailure({ errors })));
    });
};
