import {
  GET_USAGE_CONSOLIDATION_FAILURE,
  GET_USAGE_CONSOLIDATION_SUCCESS,
  GET_USAGE_CONSOLIDATION,
  POST_USAGE_CONSOLIDATION_FAILURE,
  POST_USAGE_CONSOLIDATION_SUCCESS,
  PATCH_USAGE_CONSOLIDATION_FAILURE,
  PATCH_USAGE_CONSOLIDATION_SUCCESS,
  CLEAR_USAGE_CONSOLIDATION_ERRORS,
} from '../actions';
import { formatErrors } from '../helpers';

const handleError = (state, { payload }) => ({
  ...state,
  isLoading: false,
  errors: formatErrors(payload.errors),
});

const handlers = {
  [GET_USAGE_CONSOLIDATION]: state => ({
    ...state,
    isLoading: true,
    data: {},
    errors: [],
  }),
  [GET_USAGE_CONSOLIDATION_SUCCESS]: (state, { payload }) => {
    const { attributes } = payload;

    return {
      ...state,
      isLoading: false,
      data: attributes,
    };
  },
  [GET_USAGE_CONSOLIDATION_FAILURE]: handleError,
  [POST_USAGE_CONSOLIDATION_FAILURE]: handleError,
  [PATCH_USAGE_CONSOLIDATION_FAILURE]: handleError,
  [POST_USAGE_CONSOLIDATION_SUCCESS]: (state, { payload }) => {
    return {
      ...state,
      data: payload,
      isLoading: false,
    };
  },
  [PATCH_USAGE_CONSOLIDATION_SUCCESS]: (state, { payload }) => {
    return {
      ...state,
      data: payload,
      isLoading: false,
    };
  },
  [CLEAR_USAGE_CONSOLIDATION_ERRORS]: state => ({
    ...state,
    errors: [],
  }),
};

const initialState = {
  isLoading: false,
  data: {},
  errors: [],
};

export default function usageConsolidation(state, action) {
  const currentState = state || initialState;

  return handlers[action.type]
    ? handlers[action.type](currentState, action)
    : currentState;
}
