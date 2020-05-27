import {
  GET_USER_GROUPS,
  GET_USER_GROUPS_SUCCESS,
  GET_USER_GROUPS_FAILURE,
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
  [GET_USER_GROUPS]: state => ({
    ...state,
    isLoading: true,
    hasLoaded: false,
    hasFailed: false,
    errors: [],
  }),
  [GET_USER_GROUPS_SUCCESS]: (state, action) => ({
    ...state,
    isLoading: false,
    hasLoaded: true,
    hasFailed: false,
    items: action.payload,
  }),
  [GET_USER_GROUPS_FAILURE]: (state, action) => ({
    ...state,
    isLoading: false,
    hasLoaded: false,
    hasFailed: true,
    errors: formatErrors(action.payload),
  }),
};
export default function userGroups(state, action) {
  const currentState = state || initialState;

  return handlers[action.type]
    ? handlers[action.type](currentState, action)
    : currentState;
}
