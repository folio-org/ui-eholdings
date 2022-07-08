import ucCredentialsReducer from '../ucCredentials';
import {
  GET_UC_CREDENTIALS,
  GET_UC_CREDENTIALS_FAILURE,
  GET_UC_CREDENTIALS_SUCCESS,
  GET_UC_CREDENTIALS_CLIENT_ID,
  GET_UC_CREDENTIALS_CLIENT_ID_FAILURE,
  GET_UC_CREDENTIALS_CLIENT_ID_SUCCESS,
  GET_UC_CREDENTIALS_CLIENT_SECRET,
  GET_UC_CREDENTIALS_CLIENT_SECRET_FAILURE,
  GET_UC_CREDENTIALS_CLIENT_SECRET_SUCCESS,
  UPDATE_UC_CREDENTIALS,
  UPDATE_UC_CREDENTIALS_FAILURE,
  UPDATE_UC_CREDENTIALS_SUCCESS,
} from '../../actions';

const state = {
  isPresent: false,
  isLoading: false,
  isFailed: false,
  isUpdated: false,
  isClientIdLoading: false,
  isClientIdFailed: false,
  isClientIdLoaded: false,
  isClientSecretLoading: false,
  isClientSecretFailed: false,
  isClientSecretLoaded: false,
  data: {},
  errors: [],
};

describe('ucCredentialsReducer', () => {
  it('should handle GET_UC_CREDENTIALS action', () => {
    const action = { type: GET_UC_CREDENTIALS };

    expect(ucCredentialsReducer(state, action)).toEqual({
      ...state,
      isLoading: true,
    });
  });

  it('should handle GET_UC_CREDENTIALS_SUCCESS action', () => {
    const action = {
      type: GET_UC_CREDENTIALS_SUCCESS,
      payload: true,
    };

    expect(ucCredentialsReducer(state, action)).toEqual({
      ...state,
      isPresent: action.payload,
    });
  });

  it('should handle GET_UC_CREDENTIALS_FAILURE action', () => {
    const action = {
      type: GET_UC_CREDENTIALS_FAILURE,
      payload: { errors: ['error1'] },
    };

    expect(ucCredentialsReducer(state, action)).toEqual({
      ...state,
      isFailed: true,
      errors: [{ title: 'error1' }],
    });
  });

  it('should handle GET_UC_CREDENTIALS_CLIENT_ID action', () => {
    const action = { type: GET_UC_CREDENTIALS_CLIENT_ID };

    expect(ucCredentialsReducer(state, action)).toEqual({
      ...state,
      isClientIdLoading: true,
    });
  });

  it('should handle GET_UC_CREDENTIALS_CLIENT_ID_SUCCESS action', () => {
    const action = {
      type: GET_UC_CREDENTIALS_CLIENT_ID_SUCCESS,
      payload: 'client-id',
    };

    expect(ucCredentialsReducer(state, action)).toEqual({
      ...state,
      isClientIdLoading: false,
      isClientIdFailed: false,
      isClientIdLoaded: true,
      data: {
        clientId: 'client-id',
      },
    });
  });

  it('should handle GET_UC_CREDENTIALS_CLIENT_ID_FAILURE action', () => {
    const action = {
      type: GET_UC_CREDENTIALS_CLIENT_ID_FAILURE,
      payload: { errors: ['client-id-error'] },
    };

    expect(ucCredentialsReducer(state, action)).toEqual({
      ...state,
      isClientIdLoading: false,
      isClientIdFailed: true,
      isClientIdLoaded: false,
      errors: [{ title: 'client-id-error' }],
    });
  });

  it('should handle GET_UC_CREDENTIALS_CLIENT_SECRET action', () => {
    const action = { type: GET_UC_CREDENTIALS_CLIENT_SECRET };

    expect(ucCredentialsReducer(state, action)).toEqual({
      ...state,
      isClientSecretLoading: true,
    });
  });

  it('should handle GET_UC_CREDENTIALS_CLIENT_SECRET_SUCCESS action', () => {
    const action = {
      type: GET_UC_CREDENTIALS_CLIENT_SECRET_SUCCESS,
      payload: 'client-secret',
    };

    expect(ucCredentialsReducer(state, action)).toEqual({
      ...state,
      isClientSecretLoading: false,
      isClientSecretFailed: false,
      isClientSecretLoaded: true,
      data: {
        clientSecret: 'client-secret',
      },
    });
  });

  it('should handle GET_UC_CREDENTIALS_CLIENT_SECRET_FAILURE action', () => {
    const action = {
      type: GET_UC_CREDENTIALS_CLIENT_SECRET_FAILURE,
      payload: { errors: ['client-id-error'] },
    };

    expect(ucCredentialsReducer(state, action)).toEqual({
      ...state,
      isClientSecretLoading: false,
      isClientSecretFailed: true,
      isClientSecretLoaded: false,
      errors: [{ title: 'client-id-error' }],
    });
  });

  it('should handle UPDATE_UC_CREDENTIALS action', () => {
    const action = {
      type: UPDATE_UC_CREDENTIALS,
      payload: {
        attributes: {},
      }
    };

    expect(ucCredentialsReducer(state, action)).toEqual({
      ...state,
      isLoading: true,
    });
  });

  it('should handle UPDATE_UC_CREDENTIALS_SUCCESS action', () => {
    const action = { type: UPDATE_UC_CREDENTIALS_SUCCESS };

    expect(ucCredentialsReducer(state, action)).toEqual({
      ...state,
      isUpdated: true,
      isPresent: true,
    });
  });

  it('should handle UPDATE_UC_CREDENTIALS_FAILURE action', () => {
    const action = {
      type: UPDATE_UC_CREDENTIALS_FAILURE,
      payload: { errors: ['error1'] },
    };

    expect(ucCredentialsReducer(state, action)).toEqual({
      ...state,
      isFailed: true,
      errors: [{ title: 'error1' }],
    });
  });

  describe('when handle other action', () => {
    const action = { type: 'OTHER_ACTION' };

    it('should return current state', () => {
      expect(ucCredentialsReducer(state, action)).toEqual(state);
    });

    describe('when state is empty', () => {
      it('should return current state', () => {
        expect(ucCredentialsReducer(null, action)).toEqual(state);
      });
    });
  });
});
