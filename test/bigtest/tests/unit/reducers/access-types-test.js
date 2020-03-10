/* global describe, it */
import { expect } from 'chai';

import { accessTypes } from '../../../../../src/redux/reducers';
import {
  GET_ACCESS_TYPES,
  GET_ACCESS_TYPES_SUCCESS,
  GET_ACCESS_TYPES_FAILURE,
  ADD_ACCESS_TYPE,
  ATTACH_ACCESS_TYPE_FAILURE,
  UPDATE_ACCESS_TYPE_SUCCESS,
  UPDATE_ACCESS_TYPE,
  UPDATE_ACCESS_TYPE_FAILURE,
  DELETE_ACCESS_TYPE,
  DELETE_ACCESS_TYPE_FAILURE,
  DELETE_ACCESS_TYPE_SUCCESS,
  CONFIRM_DELETE_ACCESS_TYPE,
} from '../../../../../src/redux/actions';

describe('(reducer) accessTypes', () => {
  it('should return the initial state', () => {
    expect(accessTypes(undefined, {})).to.deep.equal({
      isLoading: false,
      items: {},
      errors: [],
      isDeleted: false,
    });
  });

  it('should handle GET_ACCESS_TYPES', () => {
    const actualState = {
      items: {},
      isLoading: false,
    };
    const action = { type: GET_ACCESS_TYPES };
    const expectedState = {
      items: {},
      isLoading: true,
    };

    expect(accessTypes(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle GET_ACCESS_TYPES_SUCCESS', () => {
    const actualState = {
      items: {},
      isLoading: true,
    };
    const action = {
      type: GET_ACCESS_TYPES_SUCCESS,
      payload: {
        accessTypes: { data: ['item1', 'item2'] },
      },
    };
    const expectedState = {
      items: { data: ['item1', 'item2'] },
      isLoading: false,
    };

    expect(accessTypes(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle GET_ACCESS_TYPES_FAILURE', () => {
    const actualState = {
      items: {},
      isLoading: true,
    };
    const action = {
      type: GET_ACCESS_TYPES_FAILURE,
      payload: { errors: 'error' },
    };
    const expectedState = {
      items: {},
      isLoading: false,
      errors: [{ title: 'error' }],
    };

    expect(accessTypes(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle ATTACH_ACCESS_TYPE_FAILURE', () => {
    const actualState = { isLoading: true };
    const action = {
      type: ATTACH_ACCESS_TYPE_FAILURE,
      payload: { errors: 'error' },
    };
    const expectedState = {
      isLoading: false,
      errors: [{ title: 'error' }],
    };

    expect(accessTypes(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle ADD_ACCESS_TYPE pushing new access type', () => {
    const actualState = {
      items: {
        data: [
          { id: 1 },
          { id: 2 },
        ],
      },
    };
    const action = {
      type: ADD_ACCESS_TYPE,
      payload: { id: 5 },
    };
    const expectedState = {
      items: {
        data: [
          { id: 1 },
          { id: 2 },
          { id: 5 },
        ],
      }
    };

    expect(accessTypes(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle ADD_ACCESS_TYPE returning the prev state if such access type exists', () => {
    const actualState = {
      items: {
        data: [
          { id: 1 },
          { id: 2 }
        ],
      },
    };
    const action = {
      type: ADD_ACCESS_TYPE,
      payload: { id: 1 },
    };
    const expectedState = {
      items: {
        data: [
          { id: 1 },
          { id: 2 },
        ],
      },
    };

    expect(accessTypes(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle UPDATE_ACCESS_TYPE_FAILURE', () => {
    const actualState = { isLoading: true };
    const action = {
      type: UPDATE_ACCESS_TYPE_FAILURE,
      payload: { errors: 'error' },
    };
    const expectedState = {
      isLoading: false,
      errors: [{ title: 'error' }],
    };

    expect(accessTypes(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle UPDATE_ACCESS_TYPE pushing updated access type', () => {
    const actualState = { isLoading: false };
    const action = {
      type: UPDATE_ACCESS_TYPE,
      payload: { id: 1 },
    };
    const expectedState = { isLoading: true };

    expect(accessTypes(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle UPDATE_ACCESS_TYPE_SUCCESS', () => {
    const actualState = {
      isLoading: true,
      items: {
        data: [{
          id: 7,
          type: 'accessType',
          attributes: {
            name: 'Jack Sparrow',
            description: 'Pirate',
          },
        }],
      }
    };
    const action = {
      type: UPDATE_ACCESS_TYPE_SUCCESS,
      payload: {
        id: 7,
        type: 'accessType',
        attributes: {
          name: 'Captain Jack Sparrow',
          description: 'Pirate',
        },
      },
    };
    const expectedState = {
      isLoading: false,
      items: {
        data: [{
          id: 7,
          type: 'accessType',
          attributes: {
            name: 'Captain Jack Sparrow',
            description: 'Pirate',
          },
        }],
      },
    };

    expect(accessTypes(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle DELETE_ACCESS_TYPE deleting access type', () => {
    const actualState = { isLoading: false };
    const action = {
      type: DELETE_ACCESS_TYPE,
      payload: { id: 1 },
    };
    const expectedState = { isLoading: true };

    expect(accessTypes(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle DELETE_ACCESS_TYPE_FAILURE', () => {
    const actualState = { isLoading: true };
    const action = {
      type: DELETE_ACCESS_TYPE_FAILURE,
      payload: { errors: 'error' },
    };
    const expectedState = {
      isLoading: false,
      errors: [{ title: 'error' }],
      isDeleted: false,
    };

    expect(accessTypes(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle DELETE_ACCESS_TYPE_SUCCESS', () => {
    const actualState = {
      isLoading: true,
      items: {
        data: [{
          id: 4,
          type: 'accessType',
          attributes: {
            name: 'type',
            description: 'description of type',
          },
        }],
      },
      isDeleted: false,
    };
    const action = {
      type: DELETE_ACCESS_TYPE_SUCCESS,
      payload: { id: 4 },
    };
    const expectedState = {
      isLoading: false,
      items: { data: [] },
      isDeleted: true,
    };

    expect(accessTypes(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle CONFIRM_DELETE_ACCESS_TYPE', () => {
    const actualState = {
      isLoading: true,
      items: {
        data: [],
      },
      isDeleted: true,
    };
    const action = {
      type: CONFIRM_DELETE_ACCESS_TYPE,
    };
    const expectedState = {
      isLoading: true,
      items: { data: [] },
      isDeleted: false,
    };

    expect(accessTypes(actualState, action)).to.deep.equal(expectedState);
  });
});
