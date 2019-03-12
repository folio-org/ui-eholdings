/* global describe, it */
import { expect } from 'chai';

import {
  ATTACH_AGREEMENT_SUCCESS,
  attachAgreementSuccess,
} from '../../../../../src/redux/actions/attach-agreement-success';

describe('(action) attachAgreementSuccess', () => {
  it('should create an action to handle attach agreement success', () => {
    const expectedAction = {
      type: ATTACH_AGREEMENT_SUCCESS,
    };

    expect(attachAgreementSuccess()).to.deep.equal(expectedAction);
  });
});
