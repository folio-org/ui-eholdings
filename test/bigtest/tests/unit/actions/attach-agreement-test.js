/* global describe, it */
import { expect } from 'chai';

import {
  ATTACH_AGREEMENT,
  attachAgreement,
} from '../../../../../src/redux/actions/attach-agreement';

describe('(action) attachAgreement', () => {
  it('should create an action to attach agreement', () => {
    const payload = 'payload';
    const expectedAction = {
      type: ATTACH_AGREEMENT,
      payload,
    };

    expect(attachAgreement(payload)).to.deep.equal(expectedAction);
  });
});
