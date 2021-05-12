import ucCredentialsReducer from '../ucCredentials';
import {
  GET_UC_CREDENTIALS,
  GET_UC_CREDENTIALS_FAILURE,
  GET_UC_CREDENTIALS_SUCCESS,
  UPDATE_UC_CREDENTIALS,
  UPDATE_UC_CREDENTIALS_FAILURE,
  UPDATE_UC_CREDENTIALS_SUCCESS,
} from '../../actions';

const state = {
  isPresent: false,
  isLoading: false,
  isFailed: false,
  isUpdated: false,
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

  it('should handle UPDATE_UC_CREDENTIALS action', () => {
    const action = {
      type: UPDATE_UC_CREDENTIALS,
      payload: {

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
