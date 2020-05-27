/* global describe, it */
import { expect } from 'chai';

import { rootProxy } from '../../../../../src/redux/reducers';
import {
  GET_ROOT_PROXY,
  GET_ROOT_PROXY_SUCCESS,
  GET_ROOT_PROXY_FAILURE,
  UPDATE_ROOT_PROXY,
  UPDATE_ROOT_PROXY_SUCCESS,
  UPDATE_ROOT_PROXY_FAILURE,
  CONFIRM_UPDATE_ROOT_PROXY,
} from '../../../../../src/redux/actions';

describe('(reducer) root proxy', () => {
  it('should return the initial state', () => {
    expect(rootProxy(undefined, {})).to.deep.equal({
      isLoading: false,
      isFailed: false,
      data: {},
      errors: [],
      isUpdated: false,
    });
  });

  it('should handle GET_ROOT_PROXY', () => {
    const actualState = {
      isLoading: false,
    };
    const action = {
      type: GET_ROOT_PROXY,
    };
    const expectedState = {
      isLoading: true,
    };

    expect(rootProxy(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle GET_ROOT_PROXY_SUCCESS', () => {
    const actualState = {
      data: {},
      isLoading: true,
    };
    const action = {
      type: GET_ROOT_PROXY_SUCCESS,
      payload: {
        data: {
          id: 'root-proxy',
        },
      },
    };
    const expectedState = {
      isLoading: false,
      isFailed: false,
      data: action.payload.data,
    };

    expect(rootProxy(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle GET_ROOT_PROXY_FAILURE', () => {
    const actualState = {
      data: {
        id: 'root-proxy',
      },
      isLoading: true,
    };
    const action = {
      type: GET_ROOT_PROXY_FAILURE,
      payload: { errors: 'error' }
    };
    const expectedState = {
      data: {
        id: 'root-proxy',
      },
      isLoading: false,
      isFailed: true,
      errors: [
        { title: 'error' },
      ],
    };

    expect(rootProxy(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle UPDATE_ROOT_PROXY_FAILURE', () => {
    const actualState = {
      isLoading: true,
    };
    const action = {
      type: UPDATE_ROOT_PROXY_FAILURE,
      payload: { errors: 'error' }
    };
    const expectedState = {
      isLoading: false,
      isFailed: true,
      errors: [
        { title: 'error' },
      ],
    };

    expect(rootProxy(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle UPDATE_ROOT_PROXY pushing updated root proxy', () => {
    const actualState = {
      isLoading: false,
      isFailed: true,
    };
    const action = {
      type: UPDATE_ROOT_PROXY,
    };
    const expectedState = {
      isLoading: true,
      isFailed: false,
    };

    expect(rootProxy(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle UPDATE_ROOT_PROXY_SUCCESS', () => {
    const actualState = {
      isUpdated: false,
    };
    const action = {
      type: UPDATE_ROOT_PROXY_SUCCESS,
      payload: {
        id: 'root-proxy',
      },
    };
    const expectedState = {
      isLoading: false,
      isFailed: false,
      isUpdated: true,
      data: {
        id: 'root-proxy',
      },
    };

    expect(rootProxy(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle CONFIRM_UPDATE_ROOT_PROXY', () => {
    const actualState = {
      isUpdated: true,
    };
    const action = {
      type: CONFIRM_UPDATE_ROOT_PROXY,
    };
    const expectedState = {
      isUpdated: false,
    };

    expect(rootProxy(actualState, action)).to.deep.equal(expectedState);
  });
});
