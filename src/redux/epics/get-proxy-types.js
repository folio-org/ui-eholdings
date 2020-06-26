import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {
  GET_PROXY_TYPES,
  getProxyTypesSuccess,
  getProxyTypesFailure,
} from '../actions';

export default ({ proxyTypesApi }) => (action$, store) => {
  return action$
    .filter(action => action.type === GET_PROXY_TYPES)
    .mergeMap(action => {
      const { payload: credentialId } = action;

      return proxyTypesApi
        .getAll(store.getState().okapi, credentialId)
        .map(getProxyTypesSuccess)
        .catch(errors => Observable.of(getProxyTypesFailure({ errors })));
    });
};
