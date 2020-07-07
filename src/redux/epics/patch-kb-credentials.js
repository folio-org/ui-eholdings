import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {
  PATCH_KB_CREDENTIALS,
  patchKBCredentialsSuccess,
  patchKBCredentialsFailure,
} from '../actions';

export default ({ knowledgeBaseApi }) => (action$, store) => {
  return action$
    .filter(action => action.type === PATCH_KB_CREDENTIALS)
    .mergeMap(({ payload }) => {
      return knowledgeBaseApi
        .editCredentials(store.getState().okapi, { data: payload.data }, payload.credentialId)
        .map(() => patchKBCredentialsSuccess(payload.data))
        .catch(errors => Observable.of(patchKBCredentialsFailure({ errors })));
    });
};
