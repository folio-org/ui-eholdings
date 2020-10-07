import {
  GET_AGREEMENTS,
  GET_AGREEMENTS_SUCCESS,
  GET_AGREEMENTS_FAILURE,
  ATTACH_AGREEMENT_FAILURE,
  ADD_AGREEMENT,
  UNASSIGN_AGREEMENT,
  GET_AGREEMENT_LINES_FAILURE,
  DELETE_AGREEMENT_LINES_FAILURE,
  DELETE_AGREEMENT_LINES_SUCCESS,
  CONFIRM_UNASSIGN_AGREEMENT,
} from '../actions';

import { formatErrors } from '../helpers';

const handleError = (state, { payload }) => ({
  ...state,
  isLoading: false,
  isUnassigned: false,
  errors: formatErrors(payload.errors),
});

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
  [GET_AGREEMENTS_FAILURE]: handleError,
  [ATTACH_AGREEMENT_FAILURE]: handleError,
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
  [UNASSIGN_AGREEMENT]: (state, action) => {
    const { payload: { id } } = action;
    const { items } = state;

    const unassignedAgreement = items.find(item => item.id === id) || {};

    return {
      ...state,
      isLoading: true,
      unassignedAgreement,
    };
  },
  [GET_AGREEMENT_LINES_FAILURE]: handleError,
  [DELETE_AGREEMENT_LINES_FAILURE]: handleError,
  [DELETE_AGREEMENT_LINES_SUCCESS]: state => {
    const {
      items,
      unassignedAgreement,
    } = state;

    return {
      ...state,
      items: items.filter(item => item.id !== unassignedAgreement.id),
      unassignedAgreement: {},
      isLoading: false,
      isUnassigned: true,
    };
  },
  [CONFIRM_UNASSIGN_AGREEMENT]: state => {
    return {
      ...state,
      isUnassigned: false,
    };
  },
};

const initialState = {
  isLoading: false,
  items: [],
  errors: [],
  unassignedAgreement: {},
  isUnassigned: false,
};

export default function agreements(state, action) {
  const currentState = state || initialState;

  return handlers[action.type]
    ? handlers[action.type](currentState, action)
    : currentState;
}
