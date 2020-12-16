/* global describe, it */
import { expect } from 'chai';

import { costPerUse } from '../../../../../src/redux/reducers';
import {
  GET_COST_PER_USE,
  GET_COST_PER_USE_SUCCESS,
  GET_COST_PER_USE_FAILURE,
  GET_COST_PER_USE_PACKAGE_TITLES,
  GET_COST_PER_USE_PACKAGE_TITLES_SUCCESS,
  GET_COST_PER_USE_PACKAGE_TITLES_FAILURE,
} from '../../../../../src/redux/actions';

describe('(reducer) costPerUse', () => {
  it('should return the initial state', () => {
    expect(costPerUse(undefined, {})).to.deep.equal({
      data: {},
      errors: [],
      isLoading: false,
      isLoaded: false,
      isFailed: false,
      isPackageTitlesLoading: false,
      isPackageTitlesLoaded: false,
      isPackageTitlesFailed: false,
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
      payload: {
        type: 'testCostPerUse',
        costPerUse: 0.4,
      },
    };
    const expectedState = {
      data: {
        testCostPerUse: {
          type: 'testCostPerUse',
          costPerUse: 0.4,
        },
      },
      isLoading: false,
      isLoaded: true,
      isFailed: false,
      errors: [],
    };

    expect(costPerUse(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle GET_COST_PER_USE_PACKAGE_TITLES', () => {
    const actualState = {
      data: {},
      errors: [],
      isLoading: false,
      isLoaded: true,
      isFailed: false,
    };
    const action = { type: GET_COST_PER_USE_PACKAGE_TITLES };
    const expectedState = {
      data: {},
      errors: [],
      isLoading: false,
      isLoaded: true,
      isFailed: false,
      isPackageTitlesLoading: true,
      isPackageTitlesLoaded: false,
      isPackageTitlesFailed: false,
    };

    expect(costPerUse(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle GET_COST_PER_USE_PACKAGE_TITLES_FAILURE', () => {
    const actualState = {
      data: {},
      errors: [],
      isPackageTitlesLoading: true,
      isPackageTitlesLoaded: false,
      isPackageTitlesFailed: false,
    };
    const action = {
      type: GET_COST_PER_USE_PACKAGE_TITLES_FAILURE,
      payload: { errors: { title: 'error' } },
    };
    const expectedState = {
      data: {},
      isPackageTitlesLoading: false,
      isPackageTitlesLoaded: false,
      isPackageTitlesFailed: true,
      errors: [{ title: 'error' }],
    };

    expect(costPerUse(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle GET_COST_PER_USE_PACKAGE_TITLES_SUCCESS', () => {
    const actualState = {
      data: {
        packageCostPerUse: { unchangedData: true },
        testCostPerUse: {
          type: 'testCostPerUse',
          attributes: {
            resources: [{
              id: 'some-initial-resource-id',
            }],
            meta: '123',
          },
        }
      },
      errors: [],
      isPackageTitlesLoading: true,
      isPackageTitlesLoaded: false,
      isPackageTitlesFailed: false,
    };
    const action = {
      type: GET_COST_PER_USE_PACKAGE_TITLES_SUCCESS,
      payload: {
        data: {
          type: 'testCostPerUse',
          attributes: {
            resources: [{
              id: 'some-resource-id',
            }],
            meta: '123',
          }
        },
        loadMore: true,
      },
    };
    const expectedState = {
      data: {
        packageCostPerUse: { unchangedData: true },
        testCostPerUse: {
          type: 'testCostPerUse',
          attributes: {
            resources: [{
              id: 'some-initial-resource-id',
            }, {
              id: 'some-resource-id',
            }],
            meta: '123',
          }
        },
      },
      isPackageTitlesLoading: false,
      isPackageTitlesLoaded: true,
      isPackageTitlesFailed: false,
      errors: [],
    };

    expect(costPerUse(actualState, action)).to.deep.equal(expectedState);
  });
});
