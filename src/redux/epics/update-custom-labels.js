import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {
  UPDATE_CUSTOM_LABELS,
  updateCustomLabelsFailure,
  updateCustomLabelsSuccess,
} from '../actions';

export default ({ customLabelsApi }) => (action$, store) => {
  const {
    getState,
  } = store;

  const state = getState();

  return action$
    .filter(action => action.type === UPDATE_CUSTOM_LABELS)
    .mergeMap(action => {
      const {
        payload: customLabel,
      } = action;

      return customLabelsApi
        .updateCustomLabels(state.okapi, customLabel)
        .map(updateCustomLabelsSuccess)
        .catch(errors => Observable.of(updateCustomLabelsFailure({ errors })));
    });
};
