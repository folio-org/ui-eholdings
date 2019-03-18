/* global describe, it */
import { expect } from 'chai';

import {
  ADD_AGREEMENT,
  addAgreement,
} from '../../../../../src/redux/actions/add-agreement';

describe('(action) addAgreement', () => {
  it('should create an action to add an agreement', () => {
    const payload = 'payload';
    const expectedAction = {
      type: ADD_AGREEMENT,
      payload,
    };

    expect(addAgreement(payload)).to.deep.equal(expectedAction);
  });
});
