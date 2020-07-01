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
  return action$
    .filter(action => action.type === GET_ACCESS_TYPES)
    .mergeMap(({ payload: credentialId }) => accessTypesApi
      .getAll(store.getState().okapi, credentialId)
      .map(response => getAccessTypesSuccess(response))
      .catch(errors => Observable.of(getAccessTypesFailure({ errors }))));
};
