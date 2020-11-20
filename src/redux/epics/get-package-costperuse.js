import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {
  GET_PACKAGE_COST_PER_USE,
  getPackageCostPerUseSuccess,
  getPackageCostPerUseFailure,
} from '../actions';

export default ({ costPerUseApi }) => (action$, store) => {
  return action$
    .filter(action => action.type === GET_PACKAGE_COST_PER_USE)
    .mergeMap(({ payload: { packageId, filterData } }) => costPerUseApi
      .getPackageCostPerUse(store.getState().okapi, packageId, filterData)
      .map((payload) => {
        const payloadWithRelevantPublisher = {
          ...payload,
          attributes: {
            ...payload.attributes,
            analysis: payload.attributes.analysis[`${filterData.platformType}Platforms`],
          },
        };

        return getPackageCostPerUseSuccess(payloadWithRelevantPublisher);
      })
      .catch(errors => Observable.of(getPackageCostPerUseFailure({ errors }))));
};
