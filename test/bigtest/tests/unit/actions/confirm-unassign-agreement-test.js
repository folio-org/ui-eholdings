/* global describe, it */
import { expect } from 'chai';

import {
  CONFIRM_UNASSIGN_AGREEMENT,
  confirmUnassignAgreement,
} from '../../../../../src/redux/actions/confirm-unassign-agreement';

describe('(action) confirmUnassignAgreement', () => {
  it('should create an action to confirm unassign agreement', () => {
    const expectedAction = { type: CONFIRM_UNASSIGN_AGREEMENT };

    expect(confirmUnassignAgreement()).to.deep.equal(expectedAction);
  });
});
