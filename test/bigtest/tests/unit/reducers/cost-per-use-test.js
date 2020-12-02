/* global describe, it */
import { expect } from 'chai';

import { costPerUse } from '../../../../../src/redux/reducers';
import {
  GET_COST_PER_USE,
  GET_COST_PER_USE_SUCCESS,
  GET_COST_PER_USE_FAILURE,
} from '../../../../../src/redux/actions';

describe('(reducer) costPerUse', () => {
  it('should return the initial state', () => {
    expect(costPerUse(undefined, {})).to.deep.equal({
      errors: [],
      isLoading: false,
      isLoaded: false,
      isFailed: false,
    });
  });

  it('should handle GET_COST_PER_USE', () => {
    const actualState = {
      data: {},
      errors: [],
      isLoading: false,
    };
    const action = { type: GET_COST_PER_USE };
    const expectedState = {
      data: {},
      errors: [],
      isLoading: true,
      isLoaded: false,
      isFailed: false,
    };

    expect(costPerUse(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle GET_COST_PER_USE_FAILURE', () => {
    const actualState = {
      data: {},
      errors: [],
      isLoading: true,
    };
    const action = {
      type: GET_COST_PER_USE_FAILURE,
      payload: { errors: { title: 'error' } },
    };
    const expectedState = {
      data: {},
      isLoading: false,
      isLoaded: false,
      isFailed: true,
      errors: [{ title: 'error' }],
    };

    expect(costPerUse(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle GET_COST_PER_USE_SUCCESS', () => {
    const actualState = {
      data: {},
      errors: [],
      isLoading: true,
    };
    const action = {
      type: GET_COST_PER_USE_SUCCESS,
      payload: { costPerUse: 0.4 },
    };
    const expectedState = {
      data: { costPerUse: 0.4 },
      isLoading: false,
      isLoaded: true,
      isFailed: false,
      errors: [],
    };

    expect(costPerUse(actualState, action)).to.deep.equal(expectedState);
  });
});
