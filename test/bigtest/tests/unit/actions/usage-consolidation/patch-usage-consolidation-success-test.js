/* global describe, it */
import { expect } from 'chai';

import {
  PATCH_USAGE_CONSOLIDATION_SUCCESS,
  patchUsageConsolidationSuccess,
} from '../../../../../../src/redux/actions';

describe('(action) patchUsageConsolidationSuccess', () => {
  it('should create an action to handle patch usage consolidation success', () => {
    const payload = { data: 'data' };
    const expectedAction = {
      type: PATCH_USAGE_CONSOLIDATION_SUCCESS,
      payload,
    };

    expect(patchUsageConsolidationSuccess(payload)).to.deep.equal(expectedAction);
  });
});
