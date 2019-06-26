import {
  GET_AGREEMENTS,
  GET_AGREEMENTS_SUCCESS,
  GET_AGREEMENTS_FAILURE,
  ADD_AGREEMENT,
} from '../actions';

const handlers = {
  [GET_AGREEMENTS]: (state, action) => {
    const {
      payload,
    } = action;

    return {
      ...state,
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
      payload,
    } = action;

    return {
      ...state,
      ...payload,
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
  error: null,
};

export default function agreements(state, action) {
  const currentState = state || initialState;

  if (handlers[action.type]) {
    return handlers[action.type](currentState, action);
  } else {
    return currentState;
  }
}
