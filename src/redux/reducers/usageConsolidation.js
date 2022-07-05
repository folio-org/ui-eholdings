import {
  GET_USAGE_CONSOLIDATION_FAILURE,
  GET_USAGE_CONSOLIDATION_SUCCESS,
  GET_USAGE_CONSOLIDATION,
  GET_USAGE_CONSOLIDATION_KEY,
  GET_USAGE_CONSOLIDATION_KEY_FAILURE,
  GET_USAGE_CONSOLIDATION_KEY_SUCCESS,
  POST_USAGE_CONSOLIDATION_FAILURE,
  POST_USAGE_CONSOLIDATION_SUCCESS,
  PATCH_USAGE_CONSOLIDATION_FAILURE,
  PATCH_USAGE_CONSOLIDATION_SUCCESS,
  CLEAR_USAGE_CONSOLIDATION_ERRORS,
  CLEAR_USAGE_CONSOLIDATION,
} from '../actions';
import { formatErrors } from '../helpers';

const initialState = {
  isLoading: false,
  isLoaded: false,
  isFailed: false,
  isKeyLoading: false,
  isKeyLoaded: false,
  isKeyFailed: false,
  hasSaved: false,
  data: {},
  errors: [],
};

const handleError = (state, { payload }) => ({
  ...state,
  isLoading: false,
  isLoaded: false,
  isFailed: true,
  hasSaved: false,
  errors: formatErrors(payload.errors),
});

const handlers = {
  [GET_USAGE_CONSOLIDATION]: state => ({
    ...state,
    isLoading: true,
    isLoaded: false,
    isFailed: false,
    hasSaved: false,
    data: {},
    errors: [],
  }),
  [GET_USAGE_CONSOLIDATION_SUCCESS]: (state, { payload }) => {
    const { attributes } = payload;

    return {
      ...state,
      isLoading: false,
      isLoaded: true,
      isFailed: false,
      hasSaved: false,
      data: attributes,
    };
  },
  [GET_USAGE_CONSOLIDATION_FAILURE]: handleError,
  [GET_USAGE_CONSOLIDATION_KEY]: state => ({
    ...state,
    isKeyLoading: true,
    isKeyLoaded: false,
    isKeyFailed: false,
  }),
  [GET_USAGE_CONSOLIDATION_KEY_SUCCESS]: (state, { payload }) => ({
    ...state,
    isKeyLoading: false,
    isKeyLoaded: true,
    isKeyFailed: false,
    data: {
      ...state.data,
      ...payload.attributes,
    },
  }),
  [GET_USAGE_CONSOLIDATION_KEY_FAILURE]: (state, { payload }) => ({
    ...state,
    isKeyLoading: false,
    isKeyLoaded: false,
    isKeyFailed: true,
    errors: formatErrors(payload.errors),
  }),
  [POST_USAGE_CONSOLIDATION_FAILURE]: handleError,
  [PATCH_USAGE_CONSOLIDATION_FAILURE]: handleError,
  [POST_USAGE_CONSOLIDATION_SUCCESS]: (state, { payload }) => {
    return {
      ...state,
      data: payload,
      isLoading: false,
      isLoaded: true,
      isFailed: false,
      hasSaved: true,
    };
  },
  [PATCH_USAGE_CONSOLIDATION_SUCCESS]: (state, { payload }) => {
    return {
      ...state,
      data: {
        ...state.data,
        ...payload,
      },
      isLoading: false,
      isLoaded: true,
      isFailed: false,
      hasSaved: true,
    };
  },
  [CLEAR_USAGE_CONSOLIDATION_ERRORS]: state => ({
    ...state,
    errors: [],
  }),
  [CLEAR_USAGE_CONSOLIDATION]: () => initialState,
};

export default function usageConsolidation(state, action) {
  const currentState = state || initialState;

  return handlers[action.type]
    ? handlers[action.type](currentState, action)
    : currentState;
}
