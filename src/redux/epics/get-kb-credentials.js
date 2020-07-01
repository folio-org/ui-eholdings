import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {
  GET_KB_CREDENTIALS,
  getKbCredentialsSuccess,
  getKbCredentialsFailure,
} from '../actions';

export default ({ knowledgeBaseApi }) => (action$, store) => {
  return action$
    .filter(action => action.type === GET_KB_CREDENTIALS)
    .mergeMap(() => knowledgeBaseApi
      .getCollection(store.getState().okapi)
      .map(getKbCredentialsSuccess)
      .catch(errors => Observable.of(getKbCredentialsFailure({ errors }))));
};
