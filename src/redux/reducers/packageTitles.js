import {
  GET_PACKAGE_TITLES,
  GET_PACKAGE_TITLES_SUCCESS,
  GET_PACKAGE_TITLES_FAILURE,
  CLEAR_PACKAGE_TITLES,
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
  [GET_PACKAGE_TITLES]: (state, { payload }) => ({
    ...state,
    page: payload.params.page,
    isLoading: true,
    hasLoaded: false,
    hasFailed: false,
    errors: [],
  }),
  [GET_PACKAGE_TITLES_SUCCESS]: (state, { payload }) => ({
    ...state,
    isLoading: false,
    hasLoaded: true,
    hasFailed: false,
    items: [...payload.data],
    totalResults: payload.totalResults,
  }),
  [GET_PACKAGE_TITLES_FAILURE]: (state, action) => ({
    ...state,
    isLoading: false,
    hasLoaded: false,
    hasFailed: true,
    errors: formatErrors(action.payload),
  }),
  [CLEAR_PACKAGE_TITLES]: (state) => ({
    ...state,
    items: [],
    totalResults: 0,
    page: 1,
  }),
};

export default function packageTitles(state, action) {
  const currentState = state || initialState;

  return handlers[action.type]
    ? handlers[action.type](currentState, action)
    : currentState;
}
