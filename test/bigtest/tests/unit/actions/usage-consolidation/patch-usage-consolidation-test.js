/* global describe, it */
import { expect } from 'chai';

import {
  PATCH_USAGE_CONSOLIDATION,
  patchUsageConsolidation,
} from '../../../../../../src/redux/actions';

describe('(action) patchUsageConsolidation', () => {
  it('should create an action to handle patch usage consolidation', () => {
    const payload = 'payload';
    const expectedAction = {
      type: PATCH_USAGE_CONSOLIDATION,
      payload,
    };

    expect(patchUsageConsolidation(payload)).to.deep.equal(expectedAction);
  });
});
