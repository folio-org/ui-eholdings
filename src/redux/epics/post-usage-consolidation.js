import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {
  POST_USAGE_CONSOLIDATION,
  postUsageConsolidationSuccess,
  postUsageConsolidationFailure,
} from '../actions';

export default ({ usageConsolidationApi }) => (action$, store) => {
  return action$
    .filter(action => action.type === POST_USAGE_CONSOLIDATION)
    .mergeMap(({ payload }) => {
      const { credentialsId, data } = payload;

      return usageConsolidationApi
        .postUsageConsolidation(store.getState().okapi, credentialsId, { data })
        .map(postUsageConsolidationSuccess)
        .catch(errors => Observable.of(postUsageConsolidationFailure(errors)));
    });
};
