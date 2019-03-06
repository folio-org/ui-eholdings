import {
  GET_AGREEMENTS,
  GET_AGREEMENTS_SUCCESS,
  GET_AGREEMENTS_FAILURE,
  ATTACH_AGREEMENT,
  ATTACH_AGREEMENT_SUCCESS,
  ATTACH_AGREEMENT_FAILURE,
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
    }
  },
  [GET_AGREEMENTS_SUCCESS]: (state, action) => {
    const {
      payload: {
        referenceId,
        agreements,
      },
    } = action;

    return {
      ...state,
      [referenceId]: { ...agreements },
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
  [ATTACH_AGREEMENT]: (state, action) => {
    return state;
  },
  [ATTACH_AGREEMENT_SUCCESS]: (state, action) => {
    return state;
  },
  [ATTACH_AGREEMENT_FAILURE]: (state, action) => {
    return state;
  },
};

export default function agreementsReducer(state = {}, action) {
  if (handlers[action.type]) {
    return handlers[action.type](state, action);
  } else {
    return state;
  }
}
