import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {
  GET_COST_PER_USE,
  getCostPerUseSuccess,
  getCostPerUseFailure,
} from '../actions';

export default ({ costPerUseApi }) => (action$, store) => {
  return action$
    .filter(action => action.type === GET_COST_PER_USE)
    .mergeMap(({ payload: { listType, id, filterData } }) => costPerUseApi
      .getCostPerUse(store.getState().okapi, listType, id, filterData)
      .map((payload) => {
        const payloadWithRelevantPublisher = {
          ...payload,
          attributes: {
            ...payload.attributes,
            analysis: payload.attributes.analysis[`${filterData.platformType}Platforms`],
          },
        };

        return getCostPerUseSuccess(payloadWithRelevantPublisher);
      })
      .catch(errors => Observable.of(getCostPerUseFailure({ errors }))));
};
