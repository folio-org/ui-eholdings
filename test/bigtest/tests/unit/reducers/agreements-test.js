/* global describe, beforeEach, it */
import { expect } from 'chai';

import agreements from '../../../../../src/redux/reducers';
import {
  GET_AGREEMENTS,
  GET_AGREEMENTS_SUCCESS,
  GET_AGREEMENTS_FAILURE,
} from '../../../../../src/redux/actions';

describe('(reducer) agreements', () => {
  it('should return the initial state', () => {
    expect(agreements(undefined, {})).to.deep.equal({});
  });

  it('should handle GET_AGREEMENTS', () => {
    const actualState = {
      123: {
        results: 'results',
        quantity: 2,
        isLoading: false,
      }
    };
    const action = {
      type: GET_AGREEMENTS,
      payload: {
        referenceId: '123',
        isLoading: true,
      }
    };
    const expectedState = {
      123: {
        results: 'results',
        quantity: 2,
        isLoading: true,
      },
    };

    expect(agreements(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle GET_AGREEMENTS_SUCCESS', () => {
    const actualState = {};
    const action = {
      type: GET_AGREEMENTS_SUCCESS,
      payload: {
        referenceId: '123',
        isLoading: false,
        agreements: {
          results: 'results',
        },
      }
    };
    const expectedState = {
      123: {
        isLoading: false,
        results: 'results',
      },
    };

    expect(agreements(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle GET_AGREEMENTS_FAILURE', () => {
    const actualState = {
      123: {
        results: 'results',
        isLoading: true,
      }
    };
    const action = {
      type: GET_AGREEMENTS_FAILURE,
      payload: {
        referenceId: '123',
        isLoading: false,
        error: 'error',
      }
    };
    const expectedState = {
      123: {
        results: 'results',
        isLoading: false,
        error: 'error',
      },
    };

    expect(agreements(actualState, action)).to.deep.equal(expectedState);
  });
});
