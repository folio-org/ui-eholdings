/* global describe, it */
import { expect } from 'chai';

import {
  GET_COST_PER_USE,
  getCostPerUse,
} from '../../../../../../src/redux/actions';

describe('(action) getCostPerUse', () => {
  it('should create an action to handle get cost per use of a package', () => {
    const listType = 'package';
    const id = '123';
    const filterData = { year: 2020 };

    const expectedAction = {
      type: GET_COST_PER_USE,
      payload: {
        listType,
        id,
        filterData,
      },
    };

    expect(getCostPerUse(listType, id, filterData)).to.deep.equal(expectedAction);
  });
});
