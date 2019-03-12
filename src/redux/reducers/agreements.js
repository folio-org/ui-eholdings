import {
  GET_AGREEMENTS,
  GET_AGREEMENTS_SUCCESS,
  GET_AGREEMENTS_FAILURE,
} from '../actions';

const handlers = {
  [GET_AGREEMENTS]: (state, action) => {
    const {
      payload: {
        referenceId,
        isLoading,
      },
    } = action;

    return {
      ...state,
      [referenceId]: {
        ...state[referenceId],
        isLoading,
      },
    };
  },
  [GET_AGREEMENTS_SUCCESS]: (state, action) => {
    const {
      payload: {
        referenceId,
        isLoading,
        agreements: agreementsData,
      },
    } = action;

    return {
      ...state,
      [referenceId]: { ...agreementsData, isLoading },
    };
  },
  [GET_AGREEMENTS_FAILURE]: (state, action) => {
    const {
      payload: {
        referenceId,
        isLoading,
        error,
      },
    } = action;

    return {
      ...state,
      [referenceId]: {
        ...state[referenceId],
        isLoading,
        error,
      }
    };
  },
};

export default function agreements(state, action) {
  const currentState = state || {};

  if (handlers[action.type]) {
    return handlers[action.type](currentState, action);
  } else {
    return currentState;
  }
}
