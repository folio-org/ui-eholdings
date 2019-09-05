import {
  GET_AGREEMENTS,
  GET_AGREEMENTS_SUCCESS,
  GET_AGREEMENTS_FAILURE,
  ATTACH_AGREEMENT_FAILURE,
  ADD_AGREEMENT,
} from '../actions';

import { formatErrors } from '../helpers';

const handlers = {
  [GET_AGREEMENTS]: (state, action) => {
    const {
      payload,
    } = action;

    return {
      ...state,
      isLoading: true,
      ...payload,
    };
  },
  [GET_AGREEMENTS_SUCCESS]: (state, action) => {
    const {
      payload,
    } = action;

    return {
      ...state,
      isLoading: false,
      items: [...payload.items],
    };
  },
  [GET_AGREEMENTS_FAILURE]: (state, action) => {
    const {
      payload: { errors },
    } = action;

    return {
      ...state,
      isLoading: false,
      errors: formatErrors(errors),
    };
  },
  [ATTACH_AGREEMENT_FAILURE]: (state, action) => {
    return {
      ...state,
      isLoading: false,
      errors: formatErrors(action.payload.errors),
    };
  },
  [ADD_AGREEMENT]: (state, action) => {
    const {
      payload: agreement,
    } = action;

    const {
      items,
    } = state;

    return items.find(({ id }) => id === agreement.id)
      ? state
      : {
        ...state,
        items: [
          ...items,
          agreement,
        ],
      };
  },
};

const initialState = {
  isLoading: false,
  items: [],
  errors: [],
};

export default function agreements(state, action) {
  const currentState = state || initialState;

  return handlers[action.type]
    ? handlers[action.type](currentState, action)
    : currentState;
}
