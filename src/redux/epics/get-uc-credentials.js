import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {
  getUcCredentialsSuccess,
  getUcCredentialsFailure,
  GET_UC_CREDENTIALS,
} from '../actions';

export default ({ ucCredentialsApi }) => (action$, store) => {
  return action$
    .filter(action => action.type === GET_UC_CREDENTIALS)
    .mergeMap(() => ucCredentialsApi
      .getUcCredentials(store.getState().okapi)
      .map(getUcCredentialsSuccess)
      .catch(errors => Observable.of(getUcCredentialsFailure(errors)))
    );
};
