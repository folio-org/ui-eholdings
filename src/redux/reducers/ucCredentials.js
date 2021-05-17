import {
  GET_UC_CREDENTIALS,
  GET_UC_CREDENTIALS_SUCCESS,
  GET_UC_CREDENTIALS_FAILURE,
  UPDATE_UC_CREDENTIALS,
  UPDATE_UC_CREDENTIALS_SUCCESS,
  UPDATE_UC_CREDENTIALS_FAILURE,
} from '../actions';

import { formatErrors } from '../helpers';

const initialState = {
  isPresent: false,
  isLoading: false,
  isFailed: false,
  isUpdated: false,
  errors: [],
};

const handlers = {
  [GET_UC_CREDENTIALS]: (state) => {
    return {
      ...state,
      isLoading: true,
      errors: [],
    };
  },
  [GET_UC_CREDENTIALS_SUCCESS]: (state, { payload }) => {
    return {
      ...state,
      isPresent: payload,
      isLoading: false,
      isFailed: false,
      errors: [],
    };
  },
  [GET_UC_CREDENTIALS_FAILURE]: (state, { payload }) => {
    return {
      ...state,
      isLoading: false,
      isFailed: true,
      errors: formatErrors(payload.errors),
    };
  },
  [UPDATE_UC_CREDENTIALS]: (state) => {
    return {
      ...state,
      isLoading: true,
      isFailed: false,
      errors: [],
    };
  },
  [UPDATE_UC_CREDENTIALS_FAILURE]: (state, { payload }) => {
    return {
      ...state,
      isLoading: false,
      isFailed: true,
      isUpdated: false,
      errors: formatErrors(payload.errors),
    };
  },
  [UPDATE_UC_CREDENTIALS_SUCCESS]: (state) => {
    return {
      ...state,
      isLoading: false,
      isUpdated: true,
      isFailed: false,
      isPresent: true,
      errors: [],
    };
  },
};

export default function ucCredentials(state, action) {
  const currentState = state || initialState;

  return handlers[action.type]
    ? handlers[action.type](currentState, action)
    : currentState;
}
