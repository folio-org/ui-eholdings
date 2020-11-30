/* global describe, it */
import { expect } from 'chai';

import {
  GET_TITLE_COST_PER_USE_SUCCESS,
  getTitleCostPerUseSuccess,
} from '../../../../../../src/redux/actions';

describe'(action) getTitleCostPerUseSuccess', () => {
  it('should create an action to handle get title cost per use success', () => {
    const payload = { data: 'data' };
    const expectedAction = {
      type: GET_TITLE_COST_PER_USE_SUCCESS,
      payload,
    };

    expect(getTitleCostPerUseSuccess(payload)).to.deep.equal(expectedAction);
  });
});
