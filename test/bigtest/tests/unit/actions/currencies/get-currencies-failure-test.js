/* global describe, it */
import { expect } from 'chai';

import {
  GET_CURRENCIES_FAILURE,
  getCurrenciesFailure,
} from '../../../../../../src/redux/actions/currencies';

describe('(action) getCurrenciesFailure', () => {
  it('should create an action to get currencies failure', () => {
    const payload = { error: 'error' };
    const expectedAction = {
      type: GET_CURRENCIES_FAILURE,
      payload,
    };

    expect(getCurrenciesFailure(payload)).to.deep.equal(expectedAction);
  });
});
