/* global describe, it */
import { expect } from 'chai';

import {
  DELETE_AGREEMENT_LINES_FAILURE,
  deleteAgreementLinesFailure,
} from '../../../../../src/redux/actions/delete-agreement-lines-failure';

describe('(action) deleteAgreementLinesFailure', () => {
  it('should create an action to handle delete agreement lines failure', () => {
    const payload = 'payload';
    const expectedAction = {
      type: DELETE_AGREEMENT_LINES_FAILURE,
      payload,
    };

    expect(deleteAgreementLinesFailure(payload)).to.deep.equal(expectedAction);
  });
});
