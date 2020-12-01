/* global describe, it */
import { expect } from 'chai';

import {
  GET_TITLE_COST_PER_USE,
  getTitleCostPerUse,
} from '../../../../../../src/redux/actions';

describe('(action) getTitleCostPerUse', () => {
  it('should create an action to handle get cost per use of a title', () => {
    const titleId = '123';
    const filterData = { year: 2020 };

    const expectedAction = {
      type: GET_TITLE_COST_PER_USE,
      payload: { titleId, filterData },
    };

    expect(getTitleCostPerUse(titleId, filterData)).to.deep.equal(expectedAction);
  });
});
