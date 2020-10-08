/* global describe, it */
import { expect } from 'chai';

import {
  GET_AGREEMENT_LINES_FAILURE,
  getAgreementLinesFailure,
} from '../../../../../src/redux/actions/get-agreement-lines-failure';

describe('(action) getAgreementLinesFailure', () => {
  it('should create an action to handle get agreement lines failure', () => {
    const payload = 'payload';
    const expectedAction = {
      type: GET_AGREEMENT_LINES_FAILURE,
      payload,
    };

    expect(getAgreementLinesFailure(payload)).to.deep.equal(expectedAction);
  });
});
