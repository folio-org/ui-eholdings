/* global describe, it */
import { expect } from 'chai';

import {
  PATCH_USAGE_CONSOLIDATION_FAILURE,
  patchUsageConsolidationFailure,
} from '../../../../../../src/redux/actions';

describe('(action) patchUsageConsolidationFailure', () => {
  it('should create an action to handle patch usage consolidation failure', () => {
    const payload = { error: 'payload' };
    const expectedAction = {
      type: PATCH_USAGE_CONSOLIDATION_FAILURE,
      payload,
    };

    expect(patchUsageConsolidationFailure(payload)).to.deep.equal(expectedAction);
  });
});
