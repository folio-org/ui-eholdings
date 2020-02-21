import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {
  updateAccessTypeFailure,
  updateAccessTypeSuccess,
  UPDATE_ACCESS_TYPE,
} from '../actions';

export default ({ accessTypesApi }) => (action$, store) => {
  const { getState } = store;
  const state = getState();

  return action$
    .filter(action => action.type === UPDATE_ACCESS_TYPE)
    .mergeMap(action => {
      const { payload: accessType } = action;

      return accessTypesApi
        .updateAccessType(state.okapi, accessType)
        .map(() => updateAccessTypeSuccess(accessType))
        .catch(errors => Observable.of(updateAccessTypeFailure({ errors })));
    });
};
