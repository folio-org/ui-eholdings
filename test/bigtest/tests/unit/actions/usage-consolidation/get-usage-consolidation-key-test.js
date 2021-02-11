/* global describe, it */
import { expect } from 'chai';

import {
  GET_USAGE_CONSOLIDATION_KEY,
  getUsageConsolidationKey,
} from '../../../../../../src/redux/actions';

describe('(action) getUsageConsolidationKey', () => {
  it('should create an action to handle get usage consolidation customer key', () => {
    const expectedAction = {
      type: GET_USAGE_CONSOLIDATION_KEY,
      payload: '1',
    };

    expect(getUsageConsolidationKey('1')).to.deep.equal(expectedAction);
  });
});
