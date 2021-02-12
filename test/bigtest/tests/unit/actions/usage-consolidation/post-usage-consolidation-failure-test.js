/* global describe, it */
import { expect } from 'chai';

import {
  POST_USAGE_CONSOLIDATION_FAILURE,
  postUsageConsolidationFailure,
} from '../../../../../../src/redux/actions';

describe('(action) postUsageConsolidationFailure', () => {
  it('should create an action to handle post usage consolidation failure', () => {
    const payload = { error: 'payload' };
    const expectedAction = {
      type: POST_USAGE_CONSOLIDATION_FAILURE,
      payload,
    };

    expect(postUsageConsolidationFailure(payload)).to.deep.equal(expectedAction);
  });
});
