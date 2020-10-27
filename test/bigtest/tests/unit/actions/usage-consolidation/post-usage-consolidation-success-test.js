/* global describe, it */
import { expect } from 'chai';

import {
  POST_USAGE_CONSOLIDATION_SUCCESS,
  postUsageConsolidationSuccess,
} from '../../../../../../src/redux/actions';

describe('(action) postUsageConsolidationSuccess', () => {
  it('should create an action to handle post usage consolidation success', () => {
    const payload = { data: 'data' };
    const expectedAction = {
      type: POST_USAGE_CONSOLIDATION_SUCCESS,
      payload,
    };

    expect(postUsageConsolidationSuccess(payload)).to.deep.equal(expectedAction);
  });
});
