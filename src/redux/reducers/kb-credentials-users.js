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
  CLEAR_KB_CREDENTIALS_USER,
} from '../actions';

import { formatErrors } from '../helpers';

const initialState = {
  isLoading: false,
  hasLoaded: false,
  hasFailed: false,
  items: [],
  errors: [],
};

const handlers = {
  [GET_KB_CREDENTIALS_USERS]: state => ({
    ...state,
    isLoading: true,
    hasLoaded: false,
    hasFailed: false,
    errors: [],
  }),
  [GET_KB_CREDENTIALS_USERS_SUCCESS]: (state, action) => ({
    ...state,
    isLoading: false,
    hasLoaded: true,
    hasFailed: false,
    items: action.payload.data,
  }),
  [GET_KB_CREDENTIALS_USERS_FAILURE]: (state, action) => ({
    ...state,
    isLoading: false,
    hasLoaded: false,
    hasFailed: true,
    errors: formatErrors(action.payload),
  }),
  [POST_KB_CREDENTIALS_USER]: state => ({
    ...state,
    hasLoaded: true,
    isLoading: true,
  }),
  [POST_KB_CREDENTIALS_USER_SUCCESS]: (state) => ({
    ...state,
    isLoading: false,
    hasLoaded: true,
  }),
  [POST_KB_CREDENTIALS_USER_FAILURE]: (state, action) => ({
    ...state,
    isLoading: false,
    hasFailed: true,
    errors: formatErrors(action.payload),
  }),
  [DELETE_KB_CREDENTIALS_USER]: state => ({
    ...state,
    isLoading: true,
  }),
  [DELETE_KB_CREDENTIALS_USER_SUCCESS]: (state, action) => ({
    ...state,
    isLoading: false,
    items: state.items.filter(user => user.id !== action.payload.userId),
  }),
  [DELETE_KB_CREDENTIALS_USER_FAILURE]: (state, action) => ({
    ...state,
    isLoading: false,
    hasFailed: true,
    errors: formatErrors(action.payload),
  }),
  [CLEAR_KB_CREDENTIALS_USER]: () => ({
    ...initialState,
  }),
};
export default function kbCredentialsUsers(state, action) {
  const currentState = state || initialState;

  return handlers[action.type]
    ? handlers[action.type](currentState, action)
    : currentState;
}
