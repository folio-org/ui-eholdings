import {
  GET_CUSTOM_LABELS_SUCCESS,
  GET_CUSTOM_LABELS_FAILURE,
  GET_CUSTOM_LABELS,
} from '../actions';

import { formatErrors } from '../helpers';

const handlers = {
  [GET_CUSTOM_LABELS]: (state) => {
    return {
      ...state,
      isLoading: true,
    };
  },
  [GET_CUSTOM_LABELS_SUCCESS]: (state, action) => {
    return {
      ...state,
      isLoading: false,
      items: action.payload.customLabels,
    };
  },
  [GET_CUSTOM_LABELS_FAILURE]: (state, action) => {
    const {
      payload: { errors },
    } = action;

    return {
      ...state,
      isLoading: false,
      errors: formatErrors(errors),
    };
  },
};

const initialState = {
  isLoading: false,
  items: {},
  errors: [],
};

export default function customLabels(state, action) {
  const currentState = state || initialState;

  return handlers[action.type]
    ? handlers[action.type](currentState, action)
    : currentState;
}
