import { of } from 'rxjs';
import {
  mergeMap,
  filter,
  map,
  catchError,
} from 'rxjs/operators';

import {
  GET_COST_PER_USE_PACKAGE_TITLES,
  getCostPerUsePackageTitlesSuccess,
  getCostPerUsePackageTitlesFailure,
} from '../actions';

import { fillOffsetWithNull } from './common';

export default ({ costPerUseApi }) => (action$, state$) => {
  return action$.pipe(
    filter(action => action.type === GET_COST_PER_USE_PACKAGE_TITLES),
    mergeMap(({ payload: { id, filterData } }) => {
      return costPerUseApi
        .getPackageTitlesCostPerUse(state$.value.okapi, id, filterData)
        .pipe(
          map((payload) => {
            const offset = (filterData.page - 1) * filterData.pageSize || 0;

            const costPerUseData = {
              type: 'packageTitleCostPerUse',
              attributes: {
                resources: fillOffsetWithNull(offset, payload.data),
                meta: payload.meta,
                parameters: payload.parameters,
              },
            };

            return getCostPerUsePackageTitlesSuccess(costPerUseData);
          }),
          catchError(errors => of(getCostPerUsePackageTitlesFailure({ errors })))
        );
    }),
  );
};
