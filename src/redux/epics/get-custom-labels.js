import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {
  getCustomLabelsSuccess,
  getCustomLabelsFailure,
  GET_CUSTOM_LABELS,
} from '../actions';

export default ({ customLabelsApi }) => (action$, store) => {
  const {
    getState,
  } = store;

  const state = getState();

  return action$
    .filter(action => action.type === GET_CUSTOM_LABELS)
    .mergeMap(() => customLabelsApi
      .getAll(state.okapi)
      .map(response => getCustomLabelsSuccess(response))
      .catch(errors => Observable.of(getCustomLabelsFailure({ errors }))));
};
