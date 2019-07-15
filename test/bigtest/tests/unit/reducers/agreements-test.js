/* global describe, it */
import { expect } from 'chai';

import agreements from '../../../../../src/redux/reducers';
import {
  GET_AGREEMENTS,
  GET_AGREEMENTS_SUCCESS,
  GET_AGREEMENTS_FAILURE,
  ADD_AGREEMENT,
} from '../../../../../src/redux/actions';

describe('(reducer) agreements', () => {
  it('should return the initial state', () => {
    expect(agreements(undefined, {})).to.deep.equal({
      isLoading: false,
      items: [],
      error: null,
    });
  });

  it('should handle GET_AGREEMENTS', () => {
    const actualState = {
      items: 'items',
      isLoading: false,
    };
    const action = {
      type: GET_AGREEMENTS,
      payload: {
        referenceId: '123',
        isLoading: true,
      }
    };
    const expectedState = {
      items: 'items',
      isLoading: true,
      referenceId: '123',
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
        items: 'items',
      }
    };
    const expectedState = {
      items: 'items',
      isLoading: false,
      referenceId: '123',
    };

    expect(agreements(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle GET_AGREEMENTS_FAILURE', () => {
    const actualState = {
      items: 'items',
      isLoading: true,
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
      items: 'items',
      isLoading: false,
      error: 'error',
      referenceId: '123',
    };

    expect(agreements(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle ADD_AGREEMENT pushing new agreement', () => {
    const actualState = {
      items: [
        { id: 1 },
        { id: 2 }
      ],
    };
    const action = {
      type: ADD_AGREEMENT,
      payload: {
        id: 5,
      }
    };
    const expectedState = {
      items: [
        { id: 1 },
        { id: 2 },
        { id: 5 },
      ],
    };

    expect(agreements(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle ADD_AGREEMENT returning the prev state if such agreement exists', () => {
    const actualState = {
      items: [
        { id: 1, data: 'data1' },
        { id: 2, data: 'data2' }
      ],
    };
    const action = {
      type: ADD_AGREEMENT,
      payload: {
        id: 1,
      }
    };
    const expectedState = {
      items: [
        { id: 1, data: 'data1' },
        { id: 2, data: 'data2' },
      ],
    };

    expect(agreements(actualState, action)).to.deep.equal(expectedState);
  });
});
