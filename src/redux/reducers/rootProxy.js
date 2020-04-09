import {
  GET_ROOT_PROXY,
  GET_ROOT_PROXY_SUCCESS,
  GET_ROOT_PROXY_FAILURE,
  UPDATE_ROOT_PROXY,
  CONFIRM_UPDATE_ROOT_PROXY,
  UPDATE_ROOT_PROXY_SUCCESS,
  UPDATE_ROOT_PROXY_FAILURE,
} from '../actions';

import { formatErrors } from '../helpers';

const handlers = {
  [GET_ROOT_PROXY]: (state) => {
    return {
      ...state,
      isLoading: true,
    };
  },
  [GET_ROOT_PROXY_SUCCESS]: (state, action) => {
    return {
      ...state,
      isLoading: false,
      isFailed: false,
      data: action.payload.data,
    };
  },
  [GET_ROOT_PROXY_FAILURE]: (state, action) => {
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
  [UPDATE_ROOT_PROXY]: (state) => {
    return {
      ...state,
      isLoading: true,
      isFailed: false,
    };
  },
  [UPDATE_ROOT_PROXY_FAILURE]: (state, action) => {
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
  [UPDATE_ROOT_PROXY_SUCCESS]: (state, action) => {
    return {
      ...state,
      isLoading: false,
      isUpdated: true,
      isFailed: false,
      data: action.payload,
    };
  },
  [CONFIRM_UPDATE_ROOT_PROXY]: (state) => {
    return {
      ...state,
      isUpdated: false,
    };
  },
};

const initialState = {
  isLoading: false,
  isFailed: false,
  data: {},
  errors: [],
  isUpdated: false,
};

export default function rootProxy(state, action) {
  const currentState = state || initialState;

  return handlers[action.type]
    ? handlers[action.type](currentState, action)
    : currentState;
}
