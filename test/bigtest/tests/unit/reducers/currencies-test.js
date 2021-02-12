/* global describe, it */
import { expect } from 'chai';

import { currencies } from '../../../../../src/redux/reducers';
import {
  GET_CURRENCIES_FAILURE,
  GET_CURRENCIES_SUCCESS,
} from '../../../../../src/redux/actions';

describe('(reducer) currencies', () => {
  it('should return the initial state', () => {
    expect(currencies(undefined, {})).to.deep.equal({
      errors: [],
      isLoading: false,
      items: [],
    });
  });

  it('should handle GET_CURRENCIES_SUCCESS', () => {
    const actualState = {
      errors: [],
      isLoading: true,
      items: [],
    };
    const action = {
      type: GET_CURRENCIES_SUCCESS,
      payload: { data: ['item1', 'item2'] },
    };
    const expectedState = {
      errors: [],
      isLoading: false,
      items: ['item1', 'item2'],
    };

    expect(currencies(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle GET_CURRENCIES_FAILURE', () => {
    const actualState = {
      errors: [],
      isLoading: true,
      items: [],
    };
    const action = {
      type: GET_CURRENCIES_FAILURE,
      payload: { errors: { title: 'error' } },
    };
    const expectedState = {
      errors: [{ title: 'error' }],
      isLoading: false,
      items: [],
    };

    expect(currencies(actualState, action)).to.deep.equal(expectedState);
  });
});
