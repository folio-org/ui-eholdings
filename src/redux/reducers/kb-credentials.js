import {
  GET_KB_CREDENTIALS,
  GET_KB_CREDENTIALS_SUCCESS,
  GET_KB_CREDENTIALS_FAILURE,
  POST_KB_CREDENTIALS,
  POST_KB_CREDENTIALS_SUCCESS,
  POST_KB_CREDENTIALS_FAILURE,
  DELETE_KB_CREDENTIALS,
  DELETE_KB_CREDENTIALS_SUCCESS,
  DELETE_KB_CREDENTIALS_FAILURE,
  PUT_KB_CREDENTIALS,
  CONFIRM_PUT_KB_CREDENTIALS,
  CONFIRM_POST_KB_CREDENTIALS,
  PUT_KB_CREDENTIALS_SUCCESS,
  PUT_KB_CREDENTIALS_FAILURE,
} from '../actions';

import { formatErrors } from '../helpers';

const initialState = {
  isLoading: false,
  isUpdating: false,
  hasLoaded: false,
  hasFailed: false,
  hasUpdated: false,
  hasSaved: false,
  items: [],
  errors: [],
};

const handlers = {
  [GET_KB_CREDENTIALS]: state => ({
    ...state,
    isLoading: true,
    hasLoaded: false,
  }),

  [GET_KB_CREDENTIALS_SUCCESS]: (state, action) => ({
    ...state,
    isLoading: false,
    hasLoaded: true,
    items: action.payload.data,
  }),

  [GET_KB_CREDENTIALS_FAILURE]: (state, action) => {
    const { payload: { errors } } = action;

    return {
      ...state,
      isLoading: false,
      hasLoaded: false,
      hasFailed: true,
      errors: formatErrors(errors),
    };
  },

  [POST_KB_CREDENTIALS]: state => ({
    ...state,
    isLoading: true,
    hasLoaded: false,
    hasFailed: false,
  }),

  [CONFIRM_POST_KB_CREDENTIALS]: state => ({
    ...state,
    hasSaved: false,
  }),

  [POST_KB_CREDENTIALS_SUCCESS]: (state, action) => {
    const { payload } = action;

    return {
      ...state,
      isLoading: false,
      hasLoaded: true,
      hasFailed: false,
      hasSaved: true,
      items: [
        ...state.items,
        payload,
      ]
    };
  },

  [POST_KB_CREDENTIALS_FAILURE]: (state, action) => {
    const { payload: { errors } } = action;

    return {
      ...state,
      isLoading: false,
      hasLoaded: false,
      hasFailed: true,
      hasSaved: false,
      errors: formatErrors(errors),
    };
  },

  [PUT_KB_CREDENTIALS]: state => ({
    ...state,
    isLoading: true,
    isUpdating: true,
    hasLoaded: false,
    hasFailed: false,
  }),

  [CONFIRM_PUT_KB_CREDENTIALS]: state => ({
    ...state,
    hasUpdated: false,
  }),

  [PUT_KB_CREDENTIALS_SUCCESS]: state => ({
    ...state,
    isLoading: false,
    isUpdating: false,
    hasLoaded: true,
    hasFailed: false,
    hasUpdated: true,
  }),

  [PUT_KB_CREDENTIALS_FAILURE]: (state, action) => {
    const { payload: { errors } } = action;

    return {
      ...state,
      isLoading: false,
      isUpdating: false,
      hasLoaded: false,
      hasFailed: true,
      hasUpdated: false,
      errors: formatErrors(errors),
    };
  },

  [DELETE_KB_CREDENTIALS]: state => ({
    ...state,
    isLoading: true,
    hasLoaded: false,
    hasFailed: false,
  }),

  [DELETE_KB_CREDENTIALS_SUCCESS]: (state, action) => {
    const { id } = action.payload;
    const { items } = state;

    return {
      ...state,
      isLoading: false,
      hasLoaded: true,
      hasFailed: false,
      items: items.reduce((acc, item) => (item.id !== id ? [...acc, item] : acc), []),
    };
  },

  [DELETE_KB_CREDENTIALS_FAILURE]: (state, action) => {
    const { payload: { errors } } = action;

    return {
      ...state,
      isLoading: false,
      hasLoaded: false,
      hasFailed: true,
      errors: formatErrors(errors),
    };
  },
};

export default function kbCredentials(state, action) {
  const currentState = state || initialState;

  return handlers[action.type]
    ? handlers[action.type](currentState, action)
    : currentState;
}
