import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {
  DELETE_ACCESS_TYPE,
  deleteAccessTypeSuccess,
  deleteAccessTypeFailure,
} from '../actions';

export default ({ accessTypesApi }) => (action$, store) => {
  const { getState } = store;
  const state = getState();

  return action$
    .filter(action => action.type === DELETE_ACCESS_TYPE)
    .mergeMap(action => {
      const { payload: id } = action;

      return accessTypesApi
        .deleteAccessType(state.okapi, id)
        .map(() => deleteAccessTypeSuccess(id))
        .catch(errors => Observable.of(deleteAccessTypeFailure({ errors })));
    });
};
