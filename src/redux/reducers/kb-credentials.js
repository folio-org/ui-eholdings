import {
  GET_KB_CREDENTIALS,
  GET_KB_CREDENTIALS_SUCCESS,
  GET_KB_CREDENTIALS_FAILURE,
  GET_KB_CREDENTIALS_KEY,
  GET_KB_CREDENTIALS_KEY_SUCCESS,
  POST_KB_CREDENTIALS,
  POST_KB_CREDENTIALS_SUCCESS,
  POST_KB_CREDENTIALS_FAILURE,
  DELETE_KB_CREDENTIALS,
  DELETE_KB_CREDENTIALS_SUCCESS,
  DELETE_KB_CREDENTIALS_FAILURE,
  PATCH_KB_CREDENTIALS,
  CONFIRM_PATCH_KB_CREDENTIALS,
  CONFIRM_POST_KB_CREDENTIALS,
  CONFIRM_DELETE_KB_CREDENTIALS,
  PATCH_KB_CREDENTIALS_SUCCESS,
  PATCH_KB_CREDENTIALS_FAILURE,
} from '../actions';

import { formatErrors } from '../helpers';

const initialState = {
  isLoading: false,
  isUpdating: false,
  hasLoaded: false,
  isKeyLoading: false,
  hasKeyLoaded: false,
  hasFailed: false,
  hasKeyFailed: false,
  hasUpdated: false,
  hasSaved: false,
  hasDeleted: false,
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

  [GET_KB_CREDENTIALS_KEY]: (state) => ({
    ...state,
    isKeyLoading: true,
    hasKeyLoaded: false,
  }),

  [GET_KB_CREDENTIALS_KEY_SUCCESS]: (state, action) => ({
    ...state,
    isKeyLoading: false,
    hasKeyLoaded: true,
    items: state.items.map(kbCredential => {
      return kbCredential.id === action.payload.id
        ? {
          ...kbCredential,
          attributes: {
            ...kbCredential.attributes,
            ...action.payload.attributes,
          },
          meta: {
            ...kbCredential.meta,
            isKeyLoaded: true,
          }
        }
        : kbCredential;
    }),
  }),

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

  [PATCH_KB_CREDENTIALS]: state => ({
    ...state,
    isLoading: true,
    isUpdating: true,
    hasLoaded: false,
    hasFailed: false,
  }),

  [CONFIRM_PATCH_KB_CREDENTIALS]: state => ({
    ...state,
    hasUpdated: false,
  }),

  [PATCH_KB_CREDENTIALS_SUCCESS]: (state, action) => ({
    ...state,
    isLoading: false,
    isUpdating: false,
    hasLoaded: true,
    hasFailed: false,
    hasUpdated: true,
    items: state.items.map((credential) => {
      return credential.id === action.payload.id
        ? { // overwrite data that was sent with request, but keep unchanged data
          ...action.payload,
          attributes: {
            ...credential.attributes,
            ...action.payload.attributes,
          },
          meta: action.payload.meta,
        }
        : credential;
    }),
  }),

  [PATCH_KB_CREDENTIALS_FAILURE]: (state, action) => {
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
      hasDeleted: true,
      items: items.reduce((acc, item) => (item.id !== id ? [...acc, item] : acc), []),
    };
  },

  [CONFIRM_DELETE_KB_CREDENTIALS]: state => ({
    ...state,
    hasDeleted: false,
  }),

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
