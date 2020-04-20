/* global describe, it */
import { expect } from 'chai';

import { kbCredentials } from '../../../../../src/redux/reducers';
import {
  GET_KB_CREDENTIALS,
  GET_KB_CREDENTIALS_SUCCESS,
  GET_KB_CREDENTIALS_FAILURE,
  POST_KB_CREDENTIALS,
  POST_KB_CREDENTIALS_SUCCESS,
  POST_KB_CREDENTIALS_FAILURE,
  PUT_KB_CREDENTIALS,
  CONFIRM_PUT_KB_CREDENTIALS,
  PUT_KB_CREDENTIALS_SUCCESS,
  PUT_KB_CREDENTIALS_FAILURE,
  DELETE_KB_CREDENTIALS,
  DELETE_KB_CREDENTIALS_SUCCESS,
  DELETE_KB_CREDENTIALS_FAILURE,
} from '../../../../../src/redux/actions';

describe('(reducer) kbCredentials', () => {
  it('should return the initial state', () => {
    expect(kbCredentials(undefined, {})).to.deep.equal({
      isLoading: false,
      isUpdating: false,
      hasLoaded: false,
      hasFailed: false,
      hasSaved: false,
      hasUpdated: false,
      items: [],
      errors: [],
    });
  });

  it('should handle GET_KB_CREDENTIALS', () => {
    const actualState = {
      items: [],
      isLoading: false,
    };
    const action = {
      type: GET_KB_CREDENTIALS,
    };
    const expectedState = {
      items: [],
      isLoading: true,
      hasLoaded: false,
    };

    expect(kbCredentials(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle GET_KB_CREDENTIALS_SUCCESS', () => {
    const actualState = {
      items: [],
      isLoading: true,
    };
    const action = {
      type: GET_KB_CREDENTIALS_SUCCESS,
      payload: {
        data: ['item1', 'item2'],
      }
    };
    const expectedState = {
      hasLoaded: true,
      isLoading: false,
      items: action.payload.data,
    };

    expect(kbCredentials(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle GET_KB_CREDENTIALS_FAILURE', () => {
    const actualState = {
      items: [],
      isLoading: true,
    };
    const action = {
      type: GET_KB_CREDENTIALS_FAILURE,
      payload: { errors: 'error' }
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

    expect(kbCredentials(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle POST_KB_CREDENTIALS', () => {
    const actualState = {
      items: [],
      isLoading: false,
    };
    const action = {
      type: POST_KB_CREDENTIALS,
    };
    const expectedState = {
      items: [],
      isLoading: true,
      hasLoaded: false,
      hasFailed: false,
    };

    expect(kbCredentials(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle POST_KB_CREDENTIALS_SUCCESS', () => {
    const actualState = {
      isLoading: true,
      hasSaved: false,
      items: [],
    };
    const action = {
      type: POST_KB_CREDENTIALS_SUCCESS,
      payload: {
        title: 'creds'
      }
    };
    const expectedState = {
      isLoading: false,
      hasLoaded: true,
      hasFailed: false,
      hasSaved: true,
      items: [
        { title: 'creds' },
      ],
    };

    expect(kbCredentials(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle POST_KB_CREDENTIALS_FAILURE', () => {
    const actualState = {
      isLoading: true,
      items: [],
    };
    const action = {
      type: POST_KB_CREDENTIALS_FAILURE,
      payload: { errors: ['error'] },
    };
    const expectedState = {
      isLoading: false,
      hasLoaded: false,
      hasFailed: true,
      hasSaved: false,
      items: [],
      errors: [
        { title: 'error' },
      ]
    };

    expect(kbCredentials(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle PUT_KB_CREDENTIALS', () => {
    const actualState = {
      isLoading: false,
      isUpdating: false,
      items: [],
    };
    const action = {
      type: PUT_KB_CREDENTIALS,
      payload: { title: 'random' },
    };
    const expectedState = {
      items: [],
      isLoading: true,
      isUpdating: true,
      hasLoaded: false,
      hasFailed: false,
    };

    expect(kbCredentials(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle CONFIRM_PUT_KB_CREDENTIALS', () => {
    const actualState = {
      hasUpdated: true,
      isLoading: false,
    };
    const action = {
      type: CONFIRM_PUT_KB_CREDENTIALS,
    };
    const expectedState = {
      isLoading: false,
      hasUpdated: false,
    };

    expect(kbCredentials(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle PUT_KB_CREDENTIALS_SUCCESS', () => {
    const actualState = {
      isLoading: true,
      isUpdating: true,
      items: [],
    };
    const action = {
      type: PUT_KB_CREDENTIALS_SUCCESS,
    };
    const expectedState = {
      isLoading: false,
      isUpdating: false,
      hasLoaded: true,
      hasFailed: false,
      hasUpdated: true,
      items: [],
    };

    expect(kbCredentials(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle PUT_KB_CREDENTIALS_FAILURE', () => {
    const actualState = {
      isLoading: true,
      isUpdating: true,
    };
    const action = {
      type: PUT_KB_CREDENTIALS_FAILURE,
      payload: { errors: 'error' }
    };
    const expectedState = {
      isLoading: false,
      isUpdating: false,
      hasLoaded: false,
      hasFailed: true,
      hasUpdated: false,
      errors: [
        { title: 'error' },
      ]
    };

    expect(kbCredentials(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle DELETE_KB_CREDENTIALS', () => {
    const actualState = {
      isLoading: false,
    };
    const action = {
      type: DELETE_KB_CREDENTIALS,
      payload: { id: '1' }
    };
    const expectedState = {
      isLoading: true,
      hasLoaded: false,
      hasFailed: false,
    };

    expect(kbCredentials(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle DELETE_KB_CREDENTIALS_SUCCESS', () => {
    const actualState = {
      isLoading: true,
      items: [{ id: '2' }, { id: '3' }],
    };
    const action = {
      type: DELETE_KB_CREDENTIALS_SUCCESS,
      payload: { id: '2' },
    };
    const expectedState = {
      isLoading: false,
      hasLoaded: true,
      hasFailed: false,
      items: [{ id: '3' }],
    };

    expect(kbCredentials(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle DELETE_KB_CREDENTIALS_FAILURE', () => {
    const actualState = {
      isLoading: true,
    };
    const action = {
      type: DELETE_KB_CREDENTIALS_FAILURE,
      payload: { errors: 'error' }
    };
    const expectedState = {
      isLoading: false,
      hasLoaded: false,
      hasFailed: true,
      errors: [
        { title: 'error' }
      ]
    };

    expect(kbCredentials(actualState, action)).to.deep.equal(expectedState);
  });
});
