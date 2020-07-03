import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {
  GET_USER_GROUPS,
  getUserGroupsSuccess,
  getUserGroupsFailure,
} from '../actions';

export default ({ userGroupsApi }) => (action$, store) => {
  return action$
    .filter(action => action.type === GET_USER_GROUPS)
    .mergeMap(() => userGroupsApi
      .getAll(store.getState().okapi)
      .map(getUserGroupsSuccess)
      .catch(errors => Observable.of(getUserGroupsFailure({ errors }))));
};
