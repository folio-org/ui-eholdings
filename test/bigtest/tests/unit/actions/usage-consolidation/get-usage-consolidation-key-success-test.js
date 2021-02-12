/* global describe, it */
import { expect } from 'chai';

import {
  GET_USAGE_CONSOLIDATION_KEY_SUCCESS,
  getUsageConsolidationKeySuccess,
} from '../../../../../../src/redux/actions';

describe('(action) getUsageConsolidationKeySuccess', () => {
  it('should create an action to handle get usage consolidation customer key success', () => {
    const payload = { data: 'data' };
    const expectedAction = {
      type: GET_USAGE_CONSOLIDATION_KEY_SUCCESS,
      payload,
    };

    expect(getUsageConsolidationKeySuccess(payload)).to.deep.equal(expectedAction);
  });
});
