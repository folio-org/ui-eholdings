import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {
  getRootProxySuccess,
  getRootProxyFailure,
  GET_ROOT_PROXY,
} from '../actions';

export default ({ rootProxyApi }) => (action$, store) => {
  return action$
    .filter(action => action.type === GET_ROOT_PROXY)
    .mergeMap(action => {
      const {
        payload: credentialId,
      } = action;

      return rootProxyApi
        .get(store.getState().okapi, credentialId)
        .map(response => getRootProxySuccess(response))
        .catch(errors => Observable.of(getRootProxyFailure({ errors })));
    });
};
