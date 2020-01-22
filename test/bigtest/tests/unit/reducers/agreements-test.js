/* global describe, it */
import { expect } from 'chai';

import { agreements } from '../../../../../src/redux/reducers';
import {
  GET_AGREEMENTS,
  GET_AGREEMENTS_SUCCESS,
  GET_AGREEMENTS_FAILURE,
  ADD_AGREEMENT,
  ATTACH_AGREEMENT_FAILURE,
} from '../../../../../src/redux/actions';

describe('(reducer) agreements', () => {
  it('should return the initial state', () => {
    expect(agreements(undefined, {})).to.deep.equal({
      isLoading: false,
      items: [],
      errors: [],
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
    const actualState = {
      items: ['item3', 'item4', 'item5'],
      isLoading: true,
    };
    const action = {
      type: GET_AGREEMENTS_SUCCESS,
      payload: {
        items: ['item1', 'item2'],
      }
    };
    const expectedState = {
      items: action.payload.items,
      isLoading: false,
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
      payload: { errors: 'error' }
    };
    const expectedState = {
      items: 'items',
      isLoading: false,
      errors: [
        { title: 'error' },
      ],
    };

    expect(agreements(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle ATTACH_AGREEMENT_FAILURE', () => {
    const actualState = {
      isLoading: true,
    };
    const action = {
      type: ATTACH_AGREEMENT_FAILURE,
      payload: { errors: 'error' }
    };
    const expectedState = {
      isLoading: false,
      errors: [
        { title: 'error' },
      ],
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
