/* global describe, it */
import { expect } from 'chai';

import {
  GET_COST_PER_USE,
  getCostPerUse,
} from '../../../../../../src/redux/actions';

describe('(action) getCostPerUse', () => {
  it('should create an action to handle get cost per use of a package', () => {
    const packageId = '123';
    const filterData = { year: 2020 };

    const expectedAction = {
      type: GET_COST_PER_USE,
      payload: { packageId, filterData },
    };

    expect(getCostPerUse(packageId, filterData)).to.deep.equal(expectedAction);
  });
});
