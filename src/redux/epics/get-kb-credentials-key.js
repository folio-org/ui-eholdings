import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {
  GET_KB_CREDENTIALS_KEY,
  getKbCredentialsKeySuccess,
  getKbCredentialsKeyFailure,
} from '../actions';

export default ({ knowledgeBaseApi }) => (action$, store) => {
  return action$
    .filter(action => action.type === GET_KB_CREDENTIALS_KEY)
    .mergeMap((action) => {
      const {
        payload: credentialId,
      } = action;

      return knowledgeBaseApi
        .getCredentialsKey(store.getState().okapi, credentialId)
        .map(getKbCredentialsKeySuccess)
        .catch(errors => Observable.of(getKbCredentialsKeyFailure({ errors })));
    });
};
