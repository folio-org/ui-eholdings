/* global describe, it */
import { expect } from 'chai';

import {
  POST_USAGE_CONSOLIDATION,
  postUsageConsolidation,
} from '../../../../../../src/redux/actions';

describe('(action) postUsageConsolidation', () => {
  it('should create an action to handle post usage consolidation', () => {
    const payload = 'payload';
    const expectedAction = {
      type: POST_USAGE_CONSOLIDATION,
      payload,
    };

    expect(postUsageConsolidation(payload)).to.deep.equal(expectedAction);
  });
});
