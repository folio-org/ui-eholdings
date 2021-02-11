import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {
  GET_COST_PER_USE,
  getCostPerUseSuccess,
  getCostPerUseFailure,
} from '../actions';
import { costPerUseTypes } from '../../constants';

export default ({ costPerUseApi }) => (action$, store) => {
  return action$
    .filter(action => action.type === GET_COST_PER_USE)
    .mergeMap(({ payload: { listType, id, filterData } }) => costPerUseApi
      .getCostPerUse(store.getState().okapi, listType, id, filterData)
      .map((payload) => {
        let costPerUseData = payload;

        if (payload.type !== costPerUseTypes.TITLE_COST_PER_USE) {
          costPerUseData = {
            ...payload,
            attributes: {
              ...payload.attributes,
              analysis: payload.attributes.analysis[`${filterData.platformType}Platforms`],
            },
          };
        }

        return getCostPerUseSuccess(costPerUseData);
      })
      .catch(errors => Observable.of(getCostPerUseFailure({ errors }))));
};
