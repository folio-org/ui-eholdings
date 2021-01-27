/* global describe, it */
import { expect } from 'chai';

import { usageConsolidation } from '../../../../../src/redux/reducers';
import {
  CLEAR_USAGE_CONSOLIDATION_ERRORS,
  GET_USAGE_CONSOLIDATION_FAILURE,
  GET_USAGE_CONSOLIDATION,
  GET_USAGE_CONSOLIDATION_KEY,
  GET_USAGE_CONSOLIDATION_KEY_SUCCESS,
  GET_USAGE_CONSOLIDATION_KEY_FAILURE,
  PATCH_USAGE_CONSOLIDATION_FAILURE,
  PATCH_USAGE_CONSOLIDATION_SUCCESS,
  POST_USAGE_CONSOLIDATION_FAILURE,
  POST_USAGE_CONSOLIDATION_SUCCESS,
} from '../../../../../src/redux/actions';

describe('(reducer) usageConsolidation', () => {
  it('should return the initial state', () => {
    expect(usageConsolidation(undefined, {})).to.deep.equal({
      data: {},
      errors: [],
      isLoading: false,
      isLoaded: false,
      isFailed: false,
      hasSaved: false,
      isKeyLoading: false,
      isKeyLoaded: false,
      isKeyFailed: false,
    });
  });

  it('should handle GET_USAGE_CONSOLIDATION', () => {
    const actualState = {
      data: {},
      errors: [],
      isLoading: false,
    };
    const action = { type: GET_USAGE_CONSOLIDATION };
    const expectedState = {
      data: {},
      errors: [],
      isLoading: true,
      isLoaded: false,
      isFailed: false,
      hasSaved: false,
    };

    expect(usageConsolidation(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle GET_USAGE_CONSOLIDATION_FAILURE', () => {
    const actualState = {
      data: {},
      errors: [],
      isLoading: true,
      isKeyLoading: false,
      isKeyLoaded: false,
      isKeyFailed: false,
    };
    const action = {
      type: GET_USAGE_CONSOLIDATION_FAILURE,
      payload: { errors: { title: 'error' } },
    };
    const expectedState = {
      data: {},
      isLoading: false,
      isLoaded: false,
      isFailed: true,
      isKeyLoading: false,
      isKeyLoaded: false,
      isKeyFailed: false,
      hasSaved: false,
      errors: [{ title: 'error' }],
    };

    expect(usageConsolidation(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle GET_USAGE_CONSOLIDATION_KEY', () => {
    const actualState = {
      data: {},
      errors: [],
      isKeyLoading: false,
      isKeyLoaded: false,
      isKeyFailed: false,
    };
    const action = { type: GET_USAGE_CONSOLIDATION_KEY };
    const expectedState = {
      data: {},
      errors: [],
      isKeyLoading: true,
      isKeyLoaded: false,
      isKeyFailed: false,
    };

    expect(usageConsolidation(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle GET_USAGE_CONSOLIDATION_KEY_SUCCESS', () => {
    const actualState = {
      data: {
        customerKey: '****',
        customerId: '5678',
      },
      errors: [],
      isKeyLoading: true,
    };
    const action = {
      type: GET_USAGE_CONSOLIDATION_KEY_SUCCESS,
      payload: {
        attributes: {
          customerKey: '1234',
        },
      },
    };
    const expectedState = {
      data: {
        customerKey: '1234',
        customerId: '5678',
      },
      isKeyLoading: false,
      isKeyLoaded: true,
      isKeyFailed: false,
      errors: [],
    };

    expect(usageConsolidation(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle GET_USAGE_CONSOLIDATION_KEY_FAILURE', () => {
    const actualState = {
      data: {},
      errors: [],
      isKeyLoading: true,
    };
    const action = {
      type: GET_USAGE_CONSOLIDATION_KEY_FAILURE,
      payload: { errors: { title: 'error' } },
    };
    const expectedState = {
      data: {},
      isKeyLoading: false,
      isKeyLoaded: false,
      isKeyFailed: true,
      errors: [{ title: 'error' }],
    };

    expect(usageConsolidation(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle POST_USAGE_CONSOLIDATION_FAILURE', () => {
    const actualState = {
      data: {},
      errors: [],
      isLoading: true,
    };
    const action = {
      type: POST_USAGE_CONSOLIDATION_FAILURE,
      payload: { errors: { title: 'error' } },
    };
    const expectedState = {
      data: {},
      isLoading: false,
      isLoaded: false,
      isFailed: true,
      hasSaved: false,
      errors: [{ title: 'error' }],
    };

    expect(usageConsolidation(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle POST_USAGE_CONSOLIDATION_SUCCESS', () => {
    const actualState = {
      data: {},
      errors: [],
      isLoading: true,
    };
    const action = {
      type: POST_USAGE_CONSOLIDATION_SUCCESS,
      payload: { customreKey: 'customerKey' },
    };
    const expectedState = {
      data: { customreKey: 'customerKey' },
      isLoading: false,
      isLoaded: true,
      isFailed: false,
      hasSaved: true,
      errors: [],
    };

    expect(usageConsolidation(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle PATCH_USAGE_CONSOLIDATION_FAILURE', () => {
    const actualState = {
      data: {},
      errors: [],
      isLoading: true,
    };
    const action = {
      type: PATCH_USAGE_CONSOLIDATION_FAILURE,
      payload: { errors: { title: 'error' } },
    };
    const expectedState = {
      data: {},
      isLoading: false,
      isLoaded: false,
      isFailed: true,
      hasSaved: false,
      errors: [{ title: 'error' }],
    };

    expect(usageConsolidation(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle PATCH_USAGE_CONSOLIDATION_SUCCESS', () => {
    const actualState = {
      data: {},
      errors: [],
      isLoading: true,
    };
    const action = {
      type: PATCH_USAGE_CONSOLIDATION_SUCCESS,
      payload: { customreKey: 'customerKey' },
    };
    const expectedState = {
      data: { customreKey: 'customerKey' },
      isLoading: false,
      isLoaded: true,
      isFailed: false,
      hasSaved: true,
      errors: [],
    };

    expect(usageConsolidation(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle CLEAR_USAGE_CONSOLIDATION_ERRORS', () => {
    const actualState = {
      data: {},
      isLoading: false,
      isLoaded: false,
      isFailed: true,
      hasSaved: false,
      errors: [{ title: 'error' }],
    };
    const action = {
      type: CLEAR_USAGE_CONSOLIDATION_ERRORS,
    };
    const expectedState = {
      data: {},
      isLoading: false,
      isLoaded: false,
      isFailed: true,
      hasSaved: false,
      errors: [],
    };

    expect(usageConsolidation(actualState, action)).to.deep.equal(expectedState);
  });
});
