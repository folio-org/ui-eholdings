import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {
  POST_KB_CREDENTIALS,
  postKBCredentialsSuccess,
  postKBCredentialsFailure,
} from '../actions';

export default ({ knowledgeBaseApi }) => (action$, store) => {
  return action$
    .filter(action => action.type === POST_KB_CREDENTIALS)
    .mergeMap(({ payload }) => {
      return knowledgeBaseApi
        .createCredentials(store.getState().okapi, payload)
        .map(postKBCredentialsSuccess)
        .catch(errors => Observable.of(postKBCredentialsFailure({ errors })));
    });
};
