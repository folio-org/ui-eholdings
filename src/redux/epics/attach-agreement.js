import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {
  ATTACH_AGREEMENT,
  attachAgreementSuccess,
  attachAgreementFailure,
  addAgreement,
} from '../actions';

import {
  pickAgreementProps,
} from './common';

export default ({ agreementsApi }) => (action$, store) => {
  const {
    getState,
  } = store;

  const state = getState();

  return action$
    .filter(action => action.type === ATTACH_AGREEMENT)
    .mergeMap(action => {
      const {
        payload: agreement,
      } = action;

      return agreementsApi
        .attachAgreement(state.okapi, agreement)
        .map((currentAgreement) => {
          attachAgreementSuccess();
          return addAgreement(pickAgreementProps(currentAgreement));
        })
        .catch(errors => Observable.of(attachAgreementFailure({ errors })));
    });
};
