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
        .map((response) => {
          return patchKBCredentialsSuccess({
            // here we're using data that comes from the form but not the response
            // because the response sends api key in an encrypted format. this differs from the
            // actual value of the key in form.
            // this difference causes the form to become dirty right after the update
            // But we still need the actual metadata from response so we're adding it here
            ...payload.data,
            meta: response.data.meta,
          });
        })
        .catch(errors => Observable.of(patchKBCredentialsFailure({ errors })));
    });
};
