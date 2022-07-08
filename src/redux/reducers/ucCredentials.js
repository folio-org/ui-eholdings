import {
  GET_UC_CREDENTIALS,
  GET_UC_CREDENTIALS_SUCCESS,
  GET_UC_CREDENTIALS_FAILURE,
  GET_UC_CREDENTIALS_CLIENT_ID,
  GET_UC_CREDENTIALS_CLIENT_ID_SUCCESS,
  GET_UC_CREDENTIALS_CLIENT_ID_FAILURE,
  GET_UC_CREDENTIALS_CLIENT_SECRET,
  GET_UC_CREDENTIALS_CLIENT_SECRET_SUCCESS,
  GET_UC_CREDENTIALS_CLIENT_SECRET_FAILURE,
  UPDATE_UC_CREDENTIALS,
  UPDATE_UC_CREDENTIALS_SUCCESS,
  UPDATE_UC_CREDENTIALS_FAILURE,
} from '../actions';

import { formatErrors } from '../helpers';

const initialState = {
  isPresent: false,
  isLoading: false,
  isFailed: false,
  isClientIdLoading: false,
  isClientIdLoaded: false,
  isClientIdFailed: false,
  isClientSecretLoading: false,
  isClientSecretLoaded: false,
  isClientSecretFailed: false,
  isUpdated: false,
  data: {},
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
  [GET_UC_CREDENTIALS_CLIENT_ID]: state => ({
    ...state,
    isClientIdLoading: true,
    isClientIdLoaded: false,
    isClientIdFailed: false,
  }),
  [GET_UC_CREDENTIALS_CLIENT_ID_SUCCESS]: (state, { payload }) => ({
    ...state,
    isClientIdLoading: false,
    isClientIdLoaded: true,
    isClientIdFailed: false,
    data: {
      ...state.data,
      clientId: payload,
    },
  }),
  [GET_UC_CREDENTIALS_CLIENT_ID_FAILURE]: (state, { payload }) => ({
    ...state,
    isClientIdLoading: false,
    isClientIdLoaded: false,
    isClientIdFailed: true,
    errors: formatErrors(payload.errors),
  }),
  [GET_UC_CREDENTIALS_CLIENT_SECRET]: state => ({
    ...state,
    isClientSecretLoading: true,
    isClientSecretLoaded: false,
    isClientSecretFailed: false,
  }),
  [GET_UC_CREDENTIALS_CLIENT_SECRET_SUCCESS]: (state, { payload }) => ({
    ...state,
    isClientSecretLoading: false,
    isClientSecretLoaded: true,
    isClientSecretFailed: false,
    data: {
      ...state.data,
      clientSecret: payload,
    },
  }),
  [GET_UC_CREDENTIALS_CLIENT_SECRET_FAILURE]: (state, { payload }) => ({
    ...state,
    isClientSecretLoading: false,
    isClientSecretLoaded: false,
    isClientSecretFailed: true,
    errors: formatErrors(payload.errors),
  }),
  [UPDATE_UC_CREDENTIALS]: (state, { payload }) => {
    const {
      attributes,
    } = payload;

    return {
      ...state,
      data: attributes,
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
