import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {
  deleteAgreementLinesSuccess,
  deleteAgreementLinesFailure,
  GET_AGREEMENT_LINES_SUCCESS,
} from '../actions';

export default ({ agreementsApi }) => (action$, store) => {
  return action$
    .filter(action => action.type === GET_AGREEMENT_LINES_SUCCESS)
    .mergeMap(({ payload }) => {
      const {
        okapi,
        eholdings: { data: { agreements: { unassignedAgreement } } },
      } = store.getState();

      const items = payload.map(id => ({ id, _delete: true }));

      const agreement = { 
        ...unassignedAgreement,
        items,
      };

      return agreementsApi
        .deleteAgreementLines(okapi, agreement)
        .map(() => deleteAgreementLinesSuccess())
        .catch(errors => Observable.of(deleteAgreementLinesFailure({ errors })));
    });
};
