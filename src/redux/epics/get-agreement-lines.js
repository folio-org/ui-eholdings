import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {
  UNASSIGN_AGREEMENT,
  getAgreementLinesFailure,
  getAgreementLinesSuccess,
} from '../actions';

export default ({ agreementsApi }) => (action$, store) => {
  return action$
    .filter(action => action.type === UNASSIGN_AGREEMENT)
    .mergeMap(action => {
      const { payload: { id: agreementId } } = action;
      const {
        okapi,
        eholdings: { data: { agreements: { refId } } },
      } = store.getState();

      return agreementsApi
        .getAgreementLines(okapi, agreementId, refId)
        .map(agreementLines => {
          const agreementLinesIds = agreementLines.map(({ id }) => id);

          return getAgreementLinesSuccess(agreementLinesIds);
        })
        .catch(errors => Observable.of(getAgreementLinesFailure({ errors })));
    });
};
