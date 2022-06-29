import kbCredentialsUsersReducer from '../kb-credentials-users';
import {
  GET_KB_CREDENTIALS_USERS,
  GET_KB_CREDENTIALS_USERS_SUCCESS,
  GET_KB_CREDENTIALS_USERS_FAILURE,
  DELETE_KB_CREDENTIALS_USER,
  DELETE_KB_CREDENTIALS_USER_SUCCESS,
  DELETE_KB_CREDENTIALS_USER_FAILURE,
  POST_KB_CREDENTIALS_USER,
  POST_KB_CREDENTIALS_USER_SUCCESS,
  POST_KB_CREDENTIALS_USER_FAILURE,
} from '../../actions';

const state = {
  isLoading: false,
  hasLoaded: false,
  hasFailed: false,
  items: [],
  errors: [],
};

describe('kbCredentialsUsersReducer', () => {
  it('should handle GET_KB_CREDENTIALS_USERS action', () => {
    const action = { type: GET_KB_CREDENTIALS_USERS };

    expect(kbCredentialsUsersReducer(state, action)).toEqual({
      ...state,
      isLoading: true,
    });
  });

  it('should handle GET_KB_CREDENTIALS_USERS_SUCCESS action', () => {
    const action = {
      type: GET_KB_CREDENTIALS_USERS_SUCCESS,
      payload: {
        data: [{ id: 'user-id' }],
      },
    };

    expect(kbCredentialsUsersReducer(state, action)).toEqual({
      ...state,
      isLoading: false,
      hasLoaded: true,
      items: action.payload.data,
    });
  });

  it('should handle GET_KB_CREDENTIALS_USERS_FAILURE action', () => {
    const action = {
      type: GET_KB_CREDENTIALS_USERS_FAILURE,
      payload: ['error1'],
    };

    expect(kbCredentialsUsersReducer(state, action)).toEqual({
      ...state,
      hasFailed: true,
      errors: [{ title: 'error1' }],
    });
  });

  it('should handle POST_KB_CREDENTIALS_USER action', () => {
    const action = {
      type: POST_KB_CREDENTIALS_USER,
    };

    expect(kbCredentialsUsersReducer(state, action)).toEqual({
      ...state,
      isLoading: true,
      hasLoaded: true,
    });
  });

  it('should handle POST_KB_CREDENTIALS_USER_SUCCESS action', () => {
    const action = { type: POST_KB_CREDENTIALS_USER_SUCCESS };

    expect(kbCredentialsUsersReducer(state, action)).toEqual({
      ...state,
      isLoading: false,
      hasLoaded: true,
    });
  });

  it('should handle POST_KB_CREDENTIALS_USER_FAILURE action', () => {
    const action = {
      type: POST_KB_CREDENTIALS_USER_FAILURE,
      payload: ['error1'],
    };

    expect(kbCredentialsUsersReducer(state, action)).toEqual({
      ...state,
      isLoading: false,
      hasFailed: true,
      errors: [{ title: 'error1' }],
    });
  });

  it('should handle DELETE_KB_CREDENTIALS_USER action', () => {
    const action = {
      type: DELETE_KB_CREDENTIALS_USER,
    };

    expect(kbCredentialsUsersReducer(state, action)).toEqual({
      ...state,
      isLoading: true,
    });
  });

  it('should handle DELETE_KB_CREDENTIALS_USER_SUCCESS action', () => {
    const stateWithItems = {
      ...state,
      items: [{
        id: 'id-1',
      }, {
        id: 'id-2',
      }],
    };
    const action = {
      type: DELETE_KB_CREDENTIALS_USER_SUCCESS,
      payload: { userId: 'id-1' },
    };

    expect(kbCredentialsUsersReducer(stateWithItems, action)).toEqual({
      ...state,
      isLoading: false,
      items: [{ id: 'id-2' }],
    });
  });

  it('should handle DELETE_KB_CREDENTIALS_USER_FAILURE action', () => {
    const action = {
      type: DELETE_KB_CREDENTIALS_USER_FAILURE,
      payload: ['error1'],
    };

    expect(kbCredentialsUsersReducer(state, action)).toEqual({
      ...state,
      isLoading: false,
      hasFailed: true,
      errors: [{ title: 'error1' }],
    });
  });

  describe('when handle other action', () => {
    const action = { type: 'OTHER_ACTION' };

    it('should return current state', () => {
      expect(kbCredentialsUsersReducer(state, action)).toEqual(state);
    });

    describe('when state is empty', () => {
      it('should return current state', () => {
        expect(kbCredentialsUsersReducer(null, action)).toEqual(state);
      });
    });
  });
});
