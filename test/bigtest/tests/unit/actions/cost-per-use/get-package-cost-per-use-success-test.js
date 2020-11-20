/* global describe, it */
import { expect } from 'chai';

import {
  GET_PACKAGE_COST_PER_USE_SUCCESS,
  getPackageCostPerUseSuccess,
} from '../../../../../../src/redux/actions';

describe('(action) getPackageCostPerUseSuccess', () => {
  it('should create an action to handle get package cost per use success', () => {
    const payload = { data: 'data' };
    const expectedAction = {
      type: GET_PACKAGE_COST_PER_USE_SUCCESS,
      payload,
    };

    expect(getPackageCostPerUseSuccess(payload)).to.deep.equal(expectedAction);
  });
});
