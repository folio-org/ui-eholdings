import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {
  getAccessTypesSuccess,
  getAccessTypesFailure,
  GET_ACCESS_TYPES,
} from '../actions';

export default ({ accessTypesApi }) => (action$, store) => {
  const { getState } = store;
  const state = getState();

  return action$
    .filter(action => action.type === GET_ACCESS_TYPES)
    .mergeMap(() => accessTypesApi
      .getAll(state.okapi)
      .map(response => getAccessTypesSuccess(response))
      .catch(errors => Observable.of(getAccessTypesFailure({ errors }))));
};
