import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {
  ATTACH_ACCESS_TYPE,
  attachAccessTypeSuccess,
  attachAccessTypeFailure,
  addAccessType,
} from '../actions';

export default ({ accessTypesApi }) => (action$, store) => {
  const { getState } = store;
  const state = getState();

  return action$
    .filter(action => action.type === ATTACH_ACCESS_TYPE)
    .mergeMap(action => {
      const { payload: accessType } = action;

      return accessTypesApi
        .attachAccessType(state.okapi, accessType)
        .map(response => {
          attachAccessTypeSuccess();
          return addAccessType(response);
        })
        .catch(errors => Observable.of(attachAccessTypeFailure({ errors })));
    });
};
