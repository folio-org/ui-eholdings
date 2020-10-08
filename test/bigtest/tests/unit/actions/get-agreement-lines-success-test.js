/* global describe, it */
import { expect } from 'chai';

import {
  GET_AGREEMENT_LINES_SUCCESS,
  getAgreementLinesSuccess,
} from '../../../../../src/redux/actions/get-agreement-lines-succes';

describe('(action) getAgreementLinesSuccess', () => {
  it('should create an action to handle get agreement lines success', () => {
    const payload = ['agreementLineId1', 'agreementLineId2'];
    const expectedAction = {
      type: GET_AGREEMENT_LINES_SUCCESS,
      payload,
    };

    expect(getAgreementLinesSuccess(payload)).to.deep.equal(expectedAction);
  });
});
