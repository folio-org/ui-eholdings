/* global describe, it */
import { expect } from 'chai';

import {
  GET_USAGE_CONSOLIDATION_SUCCESS,
  getUsageConsolidationSuccess,
} from '../../../../../../src/redux/actions';

describe('(action) getUsageConsolidationSuccess', () => {
  it('should create an action to handle get usage consolidation success', () => {
    const payload = { data: 'data' };
    const expectedAction = {
      type: GET_USAGE_CONSOLIDATION_SUCCESS,
      payload,
    };

    expect(getUsageConsolidationSuccess(payload)).to.deep.equal(expectedAction);
  });
});
