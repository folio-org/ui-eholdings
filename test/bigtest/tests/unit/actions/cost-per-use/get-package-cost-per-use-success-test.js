/* global describe, it */
import { expect } from 'chai';

import {
  GET_COST_PER_USE_SUCCESS,
  getCostPerUseSuccess,
} from '../../../../../../src/redux/actions';

describe('(action) getCostPerUseSuccess', () => {
  it('should create an action to handle get package cost per use success', () => {
    const payload = { data: 'data' };
    const expectedAction = {
      type: GET_COST_PER_USE_SUCCESS,
      payload,
    };

    expect(getCostPerUseSuccess(payload)).to.deep.equal(expectedAction);
  });
});
