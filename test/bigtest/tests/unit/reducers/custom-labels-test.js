/* global describe, it */
import { expect } from 'chai';

import { customLabels } from '../../../../../src/redux/reducers';
import {
  GET_CUSTOM_LABELS,
  GET_CUSTOM_LABELS_SUCCESS,
  GET_CUSTOM_LABELS_FAILURE,
  UPDATE_CUSTOM_LABELS,
  UPDATE_CUSTOM_LABELS_FAILURE,
  UPDATE_CUSTOM_LABELS_SUCCESS,
  CONFIRM_UPDATE_CUSTOM_LABELS,
} from '../../../../../src/redux/actions';

describe('(reducer) custom labels', () => {
  it('should return the initial state', () => {
    expect(customLabels(undefined, {})).to.deep.equal({
      isLoading: false,
      isUpdated: false,
      items: {},
      errors: [],
    });
  });

  it('should handle GET_CUSTOM_LABELS', () => {
    const actualState = {
      isLoading: false,
    };
    const action = {
      type: GET_CUSTOM_LABELS,
    };
    const expectedState = {
      isLoading: true,
    };

    expect(customLabels(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle GET_CUSTOM_LABELS_SUCCESS', () => {
    const actualState = {
      items: { items: {} },
      isLoading: true,
    };
    const action = {
      type: GET_CUSTOM_LABELS_SUCCESS,
      payload: {
        customLabels: {
          data: 'data',
          meta: 'meta',
        },
      }
    };
    const expectedState = {
      isLoading: false,
      items: action.payload.customLabels,
    };

    expect(customLabels(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle GET_CUSTOM_LABELS_FAILURE', () => {
    const actualState = {
      items: 'items',
      isLoading: true,
    };
    const action = {
      type: GET_CUSTOM_LABELS_FAILURE,
      payload: { errors: 'error' }
    };
    const expectedState = {
      items: 'items',
      isLoading: false,
      errors: [
        { title: 'error' },
      ],
    };

    expect(customLabels(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle UPDATE_CUSTOM_LABELS_FAILURE', () => {
    const actualState = {
      isLoading: true,
    };
    const action = {
      type: UPDATE_CUSTOM_LABELS_FAILURE,
      payload: { errors: 'error' }
    };
    const expectedState = {
      isLoading: false,
      errors: [
        { title: 'error' },
      ],
    };

    expect(customLabels(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle UPDATE_CUSTOM_LABELS pushing updated custom labels', () => {
    const actualState = {
      items: {},
    };
    const action = {
      type: UPDATE_CUSTOM_LABELS,
      payload: {
        id: 5,
      }
    };
    const expectedState = {
      items: {
        data: { id: 5 },
      },
    };

    expect(customLabels(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle UPDATE_CUSTOM_LABELS_SUCCESS', () => {
    const actualState = {
      isUpdated: false,
    };
    const action = {
      type: UPDATE_CUSTOM_LABELS_SUCCESS,
    };
    const expectedState = {
      isUpdated: true,
    };

    expect(customLabels(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle CONFIRM_UPDATE_CUSTOM_LABELS', () => {
    const actualState = {
      isUpdated: true,
    };
    const action = {
      type: CONFIRM_UPDATE_CUSTOM_LABELS,
    };
    const expectedState = {
      isUpdated: false,
    };

    expect(customLabels(actualState, action)).to.deep.equal(expectedState);
  });
});
