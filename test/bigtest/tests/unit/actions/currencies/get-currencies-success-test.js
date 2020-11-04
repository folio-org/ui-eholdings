/* global describe, it */
import { expect } from 'chai';

import {
  GET_CURRENCIES_SUCCESS,
  getCurrenciesSuccess,
} from '../../../../../../src/redux/actions/currencies';

describe('(action) getCurrenciesSuccess', () => {
  it('should create an action to get currencies success', () => {
    const payload = { items: ['USD', 'UAH'] };
    const expectedAction = {
      type: GET_CURRENCIES_SUCCESS,
      payload,
    };

    expect(getCurrenciesSuccess(payload)).to.deep.equal(expectedAction);
  });
});
