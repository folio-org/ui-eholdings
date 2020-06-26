import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {
  UPDATE_ROOT_PROXY,
  updateRootProxyFailure,
  updateRootProxySuccess,
} from '../actions';

export default ({ rootProxyApi }) => (action$, store) => {
  return action$
    .filter(action => action.type === UPDATE_ROOT_PROXY)
    .mergeMap(action => {
      const {
        payload: { rootProxy, credentialId },
      } = action;

      return rootProxyApi
        .updateRootProxy(store.getState().okapi, rootProxy, credentialId)
        .map(() => updateRootProxySuccess(rootProxy))
        .catch(errors => Observable.of(updateRootProxyFailure({ errors })));
    });
};
