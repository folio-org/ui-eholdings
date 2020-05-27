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
  const { getState } = store;
  const state = getState();

  return action$
    .filter(action => action.type === POST_KB_CREDENTIALS)
    .mergeMap(({ payload }) => {
      return knowledgeBaseApi
        .createCredentials(state.okapi, payload)
        .map(postKBCredentialsSuccess)
        .catch(errors => Observable.of(postKBCredentialsFailure({ errors })));
    });
};
