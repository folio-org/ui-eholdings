import {
  GET_CURRENCIES_SUCCESS,
  GET_CURRENCIES_FAILURE,
} from '../actions';

import { formatErrors } from '../helpers';

const handlers = {
  [GET_CURRENCIES_SUCCESS]: (state, { payload }) => {
    const { data } = payload;

    return {
      ...state,
      isLoading: false,
      items: data,
    };
  },
  [GET_CURRENCIES_FAILURE]: (state, { payload }) => ({
    ...state,
    isLoading: false,
    errors: formatErrors(payload.errors),
  }),
};

const initialState = {
  isLoading: false,
  items: [],
  errors: [],
};

export default function currencies(state, action) {
  const currentState = state || initialState;

  return handlers[action.type]
    ? handlers[action.type](currentState, action)
    : currentState;
}
