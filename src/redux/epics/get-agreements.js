import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {
  GET_AGREEMENTS,
  getAgreementsSuccess,
  getAgreementsFailure,
} from '../actions';

export default ({ agreementsApi }) => (action$, store) => {
  const {
    getState,
  } = store;

  const state = getState();

  return action$
    .filter(action => action.type === GET_AGREEMENTS)
    .mergeMap(action => {
      const {
        payload: {
          refId,
        },
      } = action;

      return agreementsApi
        .getAll(state.okapi, refId)
        .map(response => getAgreementsSuccess(response))
        .catch(errors => Observable.of(getAgreementsFailure({ errors })));
    });
};
