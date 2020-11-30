/* global describe, it */
import { expect } from 'chai';

import {
  GET_TITLE_COST_PER_USE_FAILURE,
  getTitleCostPerUseFailure,
} from '../../../../../../src/redux/actions';

describe('(action) getTitleCostPerUseFailure', () => {
  it('should create an action to handle get title cost per use failure', () => {
    const payload = { error: 'payload' };
    const expectedAction = {
      type: GET_TITLE_COST_PER_USE_FAILURE,
      payload,
    };

    expect(getTitleCostPerUseFailure(payload)).to.deep.equal(expectedAction);
  });
});
