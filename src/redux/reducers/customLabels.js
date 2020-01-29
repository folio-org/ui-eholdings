import {
  GET_CUSTOM_LABELS_SUCCESS,
  GET_CUSTOM_LABELS_FAILURE,
  GET_CUSTOM_LABELS,
  UPDATE_CUSTOM_LABELS,
  UPDATE_CUSTOM_LABELS_FAILURE,
  UPDATE_CUSTOM_LABELS_SUCCESS,
  CONFIRM_UPDATE_CUSTOM_LABELS,
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
  [UPDATE_CUSTOM_LABELS_FAILURE]: (state, action) => {
    const {
      payload: { errors },
    } = action;

    return {
      ...state,
      isLoading: false,
      errors: formatErrors(errors),
    };
  },
  [UPDATE_CUSTOM_LABELS_SUCCESS]: (state) => {
    return {
      ...state,
      isUpdated: true,
    };
  },
  [UPDATE_CUSTOM_LABELS]: (state, action) => {
    const { items } = state;
    const {
      payload: customLabel,
    } = action;

    return {
      ...state,
      items: {
        ...items,
        data: customLabel,
      },
    };
  },
  [CONFIRM_UPDATE_CUSTOM_LABELS]: (state) => {
    return {
      ...state,
      isUpdated: false,
    };
  },
};

const initialState = {
  isLoading: false,
  items: {},
  errors: [],
  isUpdated: false,
};

export default function customLabels(state, action) {
  const currentState = state || initialState;

  return handlers[action.type]
    ? handlers[action.type](currentState, action)
    : currentState;
}
