import {
  GET_PACKAGE_COST_PER_USE,
  GET_PACKAGE_COST_PER_USE_SUCCESS,
  GET_PACKAGE_COST_PER_USE_FAILURE,
  GET_TITLE_COST_PER_USE,
  GET_TITLE_COST_PER_USE_SUCCESS,
  GET_TITLE_COST_PER_USE_FAILURE,
} from '../actions';

import { formatErrors } from '../helpers';

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
  data: payload,
});

const handlePendingRequest = (state) => ({
  ...state,
  isLoading: true,
  isLoaded: false,
  isFailed: false,
});

const handlers = {
  [GET_PACKAGE_COST_PER_USE]: handlePendingRequest,
  [GET_PACKAGE_COST_PER_USE_SUCCESS]: handleSuccess,
  [GET_PACKAGE_COST_PER_USE_FAILURE]: handleError,
  [GET_TITLE_COST_PER_USE]: handlePendingRequest,
  [GET_TITLE_COST_PER_USE_SUCCESS]: handleSuccess,
  [GET_TITLE_COST_PER_USE_FAILURE]: handleError,
};

const initialState = {
  isLoading: false,
  isLoaded: false,
  isFailed: false,
  errors: [],
};

export default function costPerUse(state, action) {
  const currentState = state || initialState;

  return handlers[action.type]
    ? handlers[action.type](currentState, action)
    : currentState;
}
