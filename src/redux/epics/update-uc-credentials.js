import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {
  UPDATE_UC_CREDENTIALS,
  updateUcCredentialsFailure,
  updateUcCredentialsSuccess,
} from '../actions';

export default ({ ucCredentialsApi }) => (action$, store) => {
  return action$
    .filter(action => action.type === UPDATE_UC_CREDENTIALS)
    .mergeMap(action => {
      const { payload } = action;

      return ucCredentialsApi
        .updateUcCredentials(store.getState().okapi, payload)
        .map(updateUcCredentialsSuccess)
        .catch(errors => Observable.of(updateUcCredentialsFailure(errors)));
    });
};
