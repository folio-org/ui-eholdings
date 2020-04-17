/* global describe, it */
import { expect } from 'chai';

import { kbCredentialsUsers } from '../../../../../src/redux/reducers';
import {
  GET_KB_CREDENTIALS_USERS,
  GET_KB_CREDENTIALS_USERS_SUCCESS,
  GET_KB_CREDENTIALS_USERS_FAILURE,
  DELETE_KB_CREDENTIALS_USER,
  DELETE_KB_CREDENTIALS_USER_FAILURE,
  DELETE_KB_CREDENTIALS_USER_SUCCESS,
  POST_KB_CREDENTIALS_USER,
  POST_KB_CREDENTIALS_USER_SUCCESS,
  POST_KB_CREDENTIALS_USER_FAILURE,
} from '../../../../../src/redux/actions';

describe('(reducer) kbCredentialsUsers', () => {
  it('should return the initial state', () => {
    expect(kbCredentialsUsers(undefined, {})).to.deep.equal({
      isLoading: false,
      hasLoaded: false,
      hasFailed: false,
      items: [],
      errors: [],
    });
  });

  it('should handle GET_KB_CREDENTIALS_USERS', () => {
    const currentState = {
      isLoading: false,
      hasLoaded: false,
      hasFailed: false,
      items: [],
      errors: [],
    };

    const action = {
      type: GET_KB_CREDENTIALS_USERS,
      payload: { credentialsId: 'a1fjJ' },
    };

    const expectedState = {
      isLoading: true,
      hasLoaded: false,
      hasFailed: false,
      items: [],
      errors: [],
    };
    const actualState = kbCredentialsUsers(currentState, action);

    expect(actualState).to.deep.equal(expectedState);
  });

  it('should handle GET_KB_CREDENTIALS_USERS_SUCCESS', () => {
    const currentState = {
      isLoading: true,
      hasLoaded: false,
      hasFailed: false,
      items: [],
      errors: [],
    };

    const action = {
      type: GET_KB_CREDENTIALS_USERS_SUCCESS,
      payload: { data: ['some user', 'another user'] },
    };

    const expectedState = {
      isLoading: false,
      hasLoaded: true,
      hasFailed: false,
      items: ['some user', 'another user'],
      errors: [],
    };

    const actualState = kbCredentialsUsers(currentState, action);

    expect(actualState).to.deep.equal(expectedState);
  });

  it('should handle GET_KB_CREDENTIALS_USERS_FAILURE', () => {
    const currentState = {
      isLoading: true,
      hasLoaded: false,
      hasFailed: false,
      items: [],
      errors: [],
    };

    const action = {
      type: GET_KB_CREDENTIALS_USERS_FAILURE,
      payload: { title: 'some error' },
    };

    const expectedState = {
      isLoading: false,
      hasLoaded: false,
      hasFailed: true,
      items: [],
      errors: [{ title: 'some error' }],
    };

    const actualState = kbCredentialsUsers(currentState, action);

    expect(actualState).to.deep.equal(expectedState);
  });





  it('should handle POST_KB_CREDENTIALS_USER', () => {
    const actualState = {
      items: [],
      isLoading: false,
    };
    const action = {
      type: POST_KB_CREDENTIALS_USER,
    };
    const expectedState = {
      items: [],
      isLoading: true,
    };

    expect(kbCredentialsUsers(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle POST_KB_CREDENTIALS_USER_SUCCESS', () => {
    const actualState = {
      items: [],
      isLoading: true,
    };
    const action = {
      type: POST_KB_CREDENTIALS_USER_SUCCESS,
      payload: { name: 'joe' },
    };
    const expectedState = {
      items: [{ name: 'joe' }],
      isLoading: false,
    };

    expect(kbCredentialsUsers(actualState, action)).to.deep.equal(expectedState);
  });

  it('should handle POST_KB_CREDENTIALS_USER_FAILURE', () => {
    const actualState = {
      items: [],
      isLoading: true,
    };
    const action = {
      type: POST_KB_CREDENTIALS_USER_FAILURE,
      payload: { title: 'error' },
    };
    const expectedState = {
      items: [],
      isLoading: false,
      hasFailed: true,
      errors: [{ title: 'error' }]
    };

    expect(kbCredentialsUsers(actualState, action)).to.deep.equal(expectedState);
  });





  it('should handle DELETE_KB_CREDENTIALS_USER', () => {
    const currentState = {
      isLoading: false,
      items: [{ name: 'jane', id: '1' }],
    };

    const action = {
      type: DELETE_KB_CREDENTIALS_USER,
      payload: {
        userId: '1',
        credentialsId: 'kredid1'
      },
    };

    const expectedState = {
      isLoading: true,
      items: [{ name: 'jane', id: '1' }],
    };

    const actualState = kbCredentialsUsers(currentState, action);

    expect(actualState).to.deep.equal(expectedState);
  });

  it('should handle DELETE_KB_CREDENTIALS_USER_SUCCESS', () => {
    const currentState = {
      isLoading: true,
      items: [{ name: 'jane', id: '1' }, { name: 'john', id: '2' }],
    };

    const action = {
      type: DELETE_KB_CREDENTIALS_USER_SUCCESS,
      payload: {
        userId: '1',
        credentialsId: 'kredid1'
      },
    };

    const expectedState = {
      isLoading: false,
      items: [{ name: 'john', id: '2' }],
    };

    const actualState = kbCredentialsUsers(currentState, action);

    expect(actualState).to.deep.equal(expectedState);
  });

  it('should handle DELETE_KB_CREDENTIALS_USER_FAILURE', () => {
    const currentState = {
      isLoading: true,
      items: [{ name: 'jane', id: '1' }, { name: 'john', id: '2' }],
    };

    const action = {
      type: DELETE_KB_CREDENTIALS_USER_FAILURE,
      payload: { title: 'some error' },
    };

    const expectedState = {
      isLoading: false,
      hasFailed: true,
      errors: [{ title: 'some error' }],
      items: [{ name: 'jane', id: '1' }, { name: 'john', id: '2' }],
    };

    const actualState = kbCredentialsUsers(currentState, action);

    expect(actualState).to.deep.equal(expectedState);
  });
});
