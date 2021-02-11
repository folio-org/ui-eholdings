/* global describe, it */
import { expect } from 'chai';

import {
  GET_USAGE_CONSOLIDATION,
  getUsageConsolidation,
} from '../../../../../../src/redux/actions';

describe('(action) getUsageConsolidation', () => {
  it('should create an action to handle get usage consolidation settings', () => {
    const expectedAction = {
      type: GET_USAGE_CONSOLIDATION,
      payload: '1',
    };

    expect(getUsageConsolidation('1')).to.deep.equal(expectedAction);
  });
});
