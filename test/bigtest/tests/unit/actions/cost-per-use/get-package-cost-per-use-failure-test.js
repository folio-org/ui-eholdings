/* global describe, it */
import { expect } from 'chai';

import {
  GET_PACKAGE_COST_PER_USE_FAILURE,
  getPackageCostPerUseFailure,
} from '../../../../../../src/redux/actions';

describe('(action) getPackageCostPerUseFailure', () => {
  it('should create an action to handle get package cost per use failure', () => {
    const payload = { error: 'payload' };
    const expectedAction = {
      type: GET_PACKAGE_COST_PER_USE_FAILURE,
      payload,
    };

    expect(getPackageCostPerUseFailure(payload)).to.deep.equal(expectedAction);
  });
});
