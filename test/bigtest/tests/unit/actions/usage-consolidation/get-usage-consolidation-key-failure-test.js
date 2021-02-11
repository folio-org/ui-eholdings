/* global describe, it */
import { expect } from 'chai';

import {
  GET_USAGE_CONSOLIDATION_KEY_FAILURE,
  getUsageConsolidationKeyFailure,
} from '../../../../../../src/redux/actions';

describe('(action) getUsageConsolidationKeyFailure', () => {
  it('should create an action to handle get usage consolidation customer key failure', () => {
    const payload = { error: 'payload' };
    const expectedAction = {
      type: GET_USAGE_CONSOLIDATION_KEY_FAILURE,
      payload,
    };

    expect(getUsageConsolidationKeyFailure(payload)).to.deep.equal(expectedAction);
  });
});
