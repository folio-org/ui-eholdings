import {
  GET_PROVIDER_PACKAGES,
  GET_PROVIDER_PACKAGES_SUCCESS,
  GET_PROVIDER_PACKAGES_FAILURE,
  CLEAR_PROVIDER_PACKAGES,
} from '../actions';

import { formatErrors } from '../helpers';

const initialState = {
  isLoading: false,
  hasLoaded: false,
  hasFailed: false,
  items: [],
  errors: [],
  totalResults: 0,
  page: 1,
};

const handlers = {
  [GET_PROVIDER_PACKAGES]: (state, { payload }) => ({
    ...state,
    page: payload.params.page,
    isLoading: true,
    hasLoaded: false,
    hasFailed: false,
    errors: [],
  }),
  [GET_PROVIDER_PACKAGES_SUCCESS]: (state, { payload }) => ({
    ...state,
    isLoading: false,
    hasLoaded: true,
    hasFailed: false,
    items: [...payload.data],
    totalResults: payload.totalResults,
  }),
  [GET_PROVIDER_PACKAGES_FAILURE]: (state, action) => ({
    ...state,
    isLoading: false,
    hasLoaded: false,
    hasFailed: true,
    errors: formatErrors(action.payload),
  }),
  [CLEAR_PROVIDER_PACKAGES]: (state) => ({
    ...state,
    items: [],
    totalResults: 0,
    page: 1,
  }),
};

export default function providerPackages(state, action) {
  const currentState = state || initialState;

  return handlers[action.type]
    ? handlers[action.type](currentState, action)
    : currentState;
}
