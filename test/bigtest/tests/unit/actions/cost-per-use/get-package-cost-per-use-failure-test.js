/* global describe, it */
import { expect } from 'chai';

import {
  GET_COST_PER_USE_FAILURE,
  getCostPerUseFailure,
} from '../../../../../../src/redux/actions';

describe('(action) getCostPerUseFailure', () => {
  it('should create an action to handle get package cost per use failure', () => {
    const payload = { error: 'payload' };
    const expectedAction = {
      type: GET_COST_PER_USE_FAILURE,
      payload,
    };

    expect(getCostPerUseFailure(payload)).to.deep.equal(expectedAction);
  });
});
