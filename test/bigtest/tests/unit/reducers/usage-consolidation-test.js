/* global describe, it */
import { expect } from 'chai';

import { usageConsolidation } from '../../../../../src/redux/reducers';
import {
  GET_USAGE_CONSOLIDATION_SUCCESS,
  GET_USAGE_CONSOLIDATION_FAILURE,
  GET_USAGE_CONSOLIDATION,
} from '../../../../../src/redux/actions';

describe('(reducer) usageConsolidation', () => {
  it('should return the initial state', () => {
    expect(userGroups(undefined, {})).to.deep.equal({
      isLoading: false,
      hasLoaded: false,
      hasFailed: false,
      items: [],
      errors: [],
    });
  });

  it('should handle GET_USER_GROUPS', () => {
    const actualState = {
      items: [],
      isLoading: false,
    };
    const action = {
      type: GET_USER_GROUPS,
    };
    const expectedState = {
      items: [],
      isLoading: true,
      hasFailed: false,
      hasLoaded: false,
      errors: [],
    };

    expect(userGroups(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle GET_USER_GROUPS_SUCCESS', () => {
    const actualState = {
      items: [],
      isLoading: true,
    };
    const action = {
      type: GET_USER_GROUPS_SUCCESS,
      payload: {
        usergroups: ['item1', 'item2'],
      }
    };
    const expectedState = {
      hasLoaded: true,
      isLoading: false,
      hasFailed: false,
      items: action.payload,
    };

    expect(userGroups(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle GET_USER_GROUPS_FAILURE', () => {
    const actualState = {
      items: [],
      isLoading: true,
    };
    const action = {
      type: GET_USER_GROUPS_FAILURE,
      payload: { title: 'error' }
    };
    const expectedState = {
      items: [],
      isLoading: false,
      hasLoaded: false,
      hasFailed: true,
      errors: [
        { title: 'error' },
      ],
    };

    expect(userGroups(actualState, action)).to.deep.equal(expectedState);
  });
});
