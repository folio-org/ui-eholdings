import {
  GET_ACCESS_TYPES_SUCCESS,
  GET_ACCESS_TYPES_FAILURE,
  GET_ACCESS_TYPES,
  ADD_ACCESS_TYPE,
  ATTACH_ACCESS_TYPE_FAILURE,
  DELETE_ACCESS_TYPE,
  DELETE_ACCESS_TYPE_SUCCESS,
  DELETE_ACCESS_TYPE_FAILURE,
  UPDATE_ACCESS_TYPE,
  UPDATE_ACCESS_TYPE_SUCCESS,
  UPDATE_ACCESS_TYPE_FAILURE,
  CONFIRM_DELETE_ACCESS_TYPE,
} from '../actions';
import { formatErrors } from '../helpers';

const handlers = {
  [GET_ACCESS_TYPES]: state => ({
    ...state,
    isLoading: true,
  }),

  [GET_ACCESS_TYPES_SUCCESS]: (state, action) => ({
    ...state,
    isLoading: false,
    items: action.payload.accessTypes,
  }),

  [GET_ACCESS_TYPES_FAILURE]: (state, action) => {
    const { payload: { errors } } = action;

    return {
      ...state,
      isLoading: false,
      errors: formatErrors(errors),
    };
  },

  [ATTACH_ACCESS_TYPE_FAILURE]: (state, action) => {
    const { payload: { errors } } = action;

    return {
      ...state,
      isLoading: false,
      errors: formatErrors(errors),
    };
  },

  [ADD_ACCESS_TYPE]: (state, action) => {
    const { payload: accessType } = action;
    const { items: { data } } = state;

    return data.find(({ id }) => id === accessType.id)
      ? state
      : {
        ...state,
        items: {
          ...state.items,
          data: [...data, accessType],
        },
      };
  },

  [DELETE_ACCESS_TYPE]: state => ({
    ...state,
    isLoading: true,
  }),

  [DELETE_ACCESS_TYPE_SUCCESS]: (state, action) => {
    const { payload: { id } } = action;
    const { items: { data } } = state;

    return {
      ...state,
      isLoading: false,
      isDeleted: true,
      items: {
        ...state.items,
        data: data.reduce((acc, item) => (item.id !== id ? [...acc, item] : acc), []),
      },
    };
  },

  [DELETE_ACCESS_TYPE_FAILURE]: (state, action) => {
    const { payload: { errors } } = action;

    return {
      ...state,
      isLoading: false,
      isDeleted: false,
      errors: formatErrors(errors),
    };
  },

  [CONFIRM_DELETE_ACCESS_TYPE]: state => ({
    ...state,
    isDeleted: false,
  }),

  [UPDATE_ACCESS_TYPE]: state => ({
    ...state,
    isLoading: true,
  }),

  [UPDATE_ACCESS_TYPE_SUCCESS]: (state, action) => {
    const { payload } = action;
    const { items: { data } } = state;

    return {
      ...state,
      isLoading: false,
      items: {
        ...state.items,
        data: data.reduce((acc, item) => (payload.id !== item.id ? [...acc, item] : [...acc, payload]), []),
      }
    };
  },

  [UPDATE_ACCESS_TYPE_FAILURE]: (state, action) => {
    const { payload: { errors } } = action;

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
  isDeleted: false,
};

export default function accessTypes(state, action) {
  const currentState = state || initialState;

  return handlers[action.type]
    ? handlers[action.type](currentState, action)
    : currentState;
}
