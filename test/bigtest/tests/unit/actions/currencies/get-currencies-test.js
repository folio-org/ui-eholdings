/* global describe, it */
import { expect } from 'chai';

import { 
  GET_CURRENCIES,
  getCurrencies,
} from '../../../../../../src/redux/actions/currencies';

describe('(action) getCurrencies', () => {
  it('should create an action to get currencies', () => {
    const expectedAction = { type: GET_CURRENCIES };

    expect(getCurrencies()).to.deep.equal(expectedAction);
  });
});
