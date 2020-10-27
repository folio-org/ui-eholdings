/* global describe, it */
import { expect } from 'chai';

import { usageConsolidation } from '../../../../../src/redux/reducers';
import {
  CLEAR_USAGE_CONSOLIDATION_ERRORS,
  GET_USAGE_CONSOLIDATION_FAILURE,
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
    });
  });

  it('should handle GET_USAGE_CONSOLIDATION_FAILURE', () => {
    const actualState = {
      data: {},
      errors: [],
      isLoading: true,
    };
    const action = {
      type: GET_USAGE_CONSOLIDATION_FAILURE,
      payload: { errors: { title: 'error' } },
    };
    const expectedState = {
      data: {},
      isLoading: false,
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
      errors: [],
    };

    expect(usageConsolidation(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle CLEAR_USAGE_CONSOLIDATION_ERRORS', () => {
    const actualState = {
      data: {},
      isLoading: false,
      errors: [{ title: 'error' }],
    };
    const action = {
      type: CLEAR_USAGE_CONSOLIDATION_ERRORS,
    };
    const expectedState = {
      data: {},
      isLoading: false,
      errors: [],
    };

    expect(usageConsolidation(actualState, action)).to.deep.equal(expectedState);
  });
});
