/* global describe, it */
import { expect } from 'chai';

import {
  POST_USAGE_CONSOLIDATION_SUCCESS,
  postUsageConsolidationSuccess,
} from '../../../../../../src/redux/actions';

describe('(action) postUsageConsolidationSuccess', () => {
  it('should create an action to handle post usage consolidation success', () => {
    const expectedAction = {
      type: POST_USAGE_CONSOLIDATION_SUCCESS,
    };

    expect(postUsageConsolidationSuccess()).to.deep.equal(expectedAction);
  });
});
