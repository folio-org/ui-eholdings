/* global describe, it */
import { expect } from 'chai';

import {
  UNASSIGN_AGREEMENT,
  unassignAgreement,
} from '../../../../../src/redux/actions/unassign-agreement';

describe('(action) unassignAgreement', () => {
  it('should create an action to unassign agreement', () => {
    const expectedAction = {
      type: UNASSIGN_AGREEMENT,
      payload: '1',
    };

    expect(unassignAgreement('1')).to.deep.equal(expectedAction);
  });
});
