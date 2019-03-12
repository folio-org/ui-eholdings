/* global describe, it */
import { expect } from 'chai';

import {
  ATTACH_AGREEMENT_FAILURE,
  attachAgreementFailure,
} from '../../../../../src/redux/actions/attach-agreement-failure';

describe('(action) attachAgreementFailure', () => {
  it('should create an action to handle attach agreement failure', () => {
    const payload = 'payload';
    const expectedAction = {
      type: ATTACH_AGREEMENT_FAILURE,
      payload,
    };

    expect(attachAgreementFailure(payload)).to.deep.equal(expectedAction);
  });
});
