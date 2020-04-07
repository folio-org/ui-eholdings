import {
  GET_PROXY_TYPES,
  GET_PROXY_TYPES_SUCCESS,
  GET_PROXY_TYPES_FAILURE,
} from '../actions';

import { formatErrors } from '../helpers';

const handlers = {
  [GET_PROXY_TYPES]: (state) => {
    return {
      ...state,
      isLoading: true,
    };
  },
  [GET_PROXY_TYPES_SUCCESS]: (state, action) => {
    return {
      ...state,
      isLoading: false,
      isFailed: false,
      items: action.payload.data,
    };
  },
  [GET_PROXY_TYPES_FAILURE]: (state, action) => {
    const {
      payload: { errors },
    } = action;

    return {
      ...state,
      isLoading: false,
      isFailed: true,
      errors: formatErrors(errors),
    };
  },
};

const initialState = {
  isLoading: false,
  isFailed: false,
  items: [],
  errors: [],
};

export default function settingsProxyTypes(state, action) {
  const currentState = state || initialState;

  return handlers[action.type]
    ? handlers[action.type](currentState, action)
    : currentState;
}
