import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {
  GET_CURRENCIES,
  getCurrenciesSuccess,
  getCurrenciesFailure,
} from '../actions';

export default ({ currenciesApi }) => (action$, store) => {
  return action$
    .filter(action => action.type === GET_CURRENCIES)
    .mergeMap(() => {
      return currenciesApi
        .getAll(store.getState().okapi)
        .map(getCurrenciesSuccess)
        .catch(errors => Observable.of(getCurrenciesFailure({ errors })));
    });
};
