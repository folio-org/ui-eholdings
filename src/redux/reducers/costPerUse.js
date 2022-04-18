import {
  GET_COST_PER_USE,
  GET_COST_PER_USE_SUCCESS,
  GET_COST_PER_USE_FAILURE,
  GET_COST_PER_USE_PACKAGE_TITLES,
  GET_COST_PER_USE_PACKAGE_TITLES_SUCCESS,
  GET_COST_PER_USE_PACKAGE_TITLES_FAILURE,
  CLEAR_COST_PER_USE_DATA,
} from '../actions';

import { formatErrors } from '../helpers';

const initialState = {
  data: {},
  isLoading: false,
  isLoaded: false,
  isFailed: false,
  isPackageTitlesLoading: false,
  isPackageTitlesLoaded: false,
  isPackageTitlesFailed: false,
  errors: [],
};

const handleError = (state, { payload }) => ({
  ...state,
  isLoading: false,
  isLoaded: false,
  isFailed: true,
  errors: formatErrors(payload.errors),
});

const handleSuccess = (state, { payload }) => ({
  ...state,
  isLoading: false,
  isLoaded: true,
  isFailed: false,
  data: {
    ...state.data,
    [payload.type]: payload,
  },
  errors: [],
});

const handlePendingRequest = (state) => ({
  ...state,
  isLoading: true,
  isLoaded: false,
  isFailed: false,
});

const handlers = {
  [GET_COST_PER_USE]: handlePendingRequest,
  [GET_COST_PER_USE_SUCCESS]: handleSuccess,
  [GET_COST_PER_USE_FAILURE]: handleError,
  [GET_COST_PER_USE_PACKAGE_TITLES]: (state) => ({
    ...state,
    isPackageTitlesLoading: true,
    isPackageTitlesLoaded: false,
    isPackageTitlesFailed: false,
  }),
  [GET_COST_PER_USE_PACKAGE_TITLES_SUCCESS]: (state, { payload }) => ({
    ...state,
    isPackageTitlesLoading: false,
    isPackageTitlesLoaded: true,
    isPackageTitlesFailed: false,
    data: {
      ...state.data,
      [payload.data.type]: payload.data,
    },
    errors: [],
  }),
  [GET_COST_PER_USE_PACKAGE_TITLES_FAILURE]: (state, { payload }) => ({
    ...state,
    isPackageTitlesLoading: false,
    isPackageTitlesLoaded: false,
    isPackageTitlesFailed: true,
    errors: formatErrors(payload.errors),
  }),
  [CLEAR_COST_PER_USE_DATA]: () => initialState,
};

export default function costPerUse(state, action) {
  const currentState = state || initialState;

  return handlers[action.type]
    ? handlers[action.type](currentState, action)
    : currentState;
}
