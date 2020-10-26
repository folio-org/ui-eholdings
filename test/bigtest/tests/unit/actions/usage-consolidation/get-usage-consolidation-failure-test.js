/* global describe, it */
import { expect } from 'chai';

import {
  GET_USAGE_CONSOLIDATION_FAILURE,
  getUsageConsolidationFailure,
} from '../../../../../../src/redux/actions';

describe.only('(action) getUsageConsolidationFailure', () => {
  it('should create an action to handle get usage consolidation failure', () => {
    const payload = { error: 'payload' };
    const expectedAction = {
      type: GET_USAGE_CONSOLIDATION_FAILURE,
      payload,
    };

    expect(getUsageConsolidationFailure(payload)).to.deep.equal(expectedAction);
  });
});
