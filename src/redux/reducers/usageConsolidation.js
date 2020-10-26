import {
  GET_USAGE_CONSOLIDATION_FAILURE,
  GET_USAGE_CONSOLIDATION_SUCCESS,
  GET_USAGE_CONSOLIDATION,
  POST_USAGE_CONSOLIDATION_FAILURE,
  POST_USAGE_CONSOLIDATION_SUCCESS,
  POST_USAGE_CONSOLIDATION,
  PATCH_USAGE_CONSOLIDATION_FAILURE,
  PATCH_USAGE_CONSOLIDATION_SUCCESS,
  PATCH_USAGE_CONSOLIDATION,
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
  }),
  [GET_USAGE_CONSOLIDATION_SUCCESS]: (state, { payload }) => {
    const { data } = payload;

    return {
      ...state,
      isLoading: false,
      data,
    };
  },
  [GET_USAGE_CONSOLIDATION_FAILURE]: handleError,
  [POST_USAGE_CONSOLIDATION_FAILURE]: handleError,
  [PATCH_USAGE_CONSOLIDATION_FAILURE]: handleError,
  [POST_USAGE_CONSOLIDATION_SUCCESS]: (state, { payload }) => {
    const { data } = payload;

    return {
      ...state,
      isLoading: false,
      data,
    };
  },
  [PATCH_USAGE_CONSOLIDATION_SUCCESS]: (state, { payload }) => {
    const { data } = payload;

    return {
      ...state,
      isLoading: false,
      data,
    };
  },
  [POST_USAGE_CONSOLIDATION]: state => ({
    ...state,
    isLoading: true,
  }),
  [PATCH_USAGE_CONSOLIDATION]: state => ({
    ...state,
    isLoading: true,
  }),
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
