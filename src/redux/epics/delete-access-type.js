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
  return action$
    .filter(action => action.type === DELETE_ACCESS_TYPE)
    .mergeMap(action => {
      const { payload: { accessType, credentialId } } = action;

      return accessTypesApi
        .deleteAccessType(store.getState().okapi, accessType, credentialId)
        .map(() => deleteAccessTypeSuccess(accessType.id))
        .catch(({ errors }) => Observable.of(deleteAccessTypeFailure({
          errors,
          accessTypeId: accessType.id
        })));
    });
};
