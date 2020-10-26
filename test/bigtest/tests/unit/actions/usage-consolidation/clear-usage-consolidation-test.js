/* global describe, it */
import { expect } from 'chai';

import {
  CLEAR_USAGE_CONSOLIDATION_ERRORS,
  clearUsageConsolidationErrors,
} from '../../../../../../src/redux/actions';

describe('(action) clearUsageConsolidationErrors', () => {
  it('should create an action to handle clear usage consolidation errors', () => {
    const expectedAction = {
      type: CLEAR_USAGE_CONSOLIDATION_ERRORS,
    };

    expect(clearUsageConsolidationErrors()).to.deep.equal(expectedAction);
  });
});
